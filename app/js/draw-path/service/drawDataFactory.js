// this is the factory that stores the data in a serialized object
// it uses the data mapped while compiling in the directive drawSvg
// into a different object depending on the svg type
// exampleList = [
// 	{
//	 nodeName :'circle',
// 	 hashSvg: 0,
// 	 attributes: {
//			cx   :44,
// 	        cy   :55,
// 	         r    :3
//	 },
//	 childNodes:[
// 				{
// 				 nodeName :'circle',
// 				 hashSvg: 1,
// 				 attributes: {
// 							cx   :11,
// 					        cy   :12,
// 					        r    :3
// 					        fill : 'red',
// 					        stroke:'blue'
// 				 			},
// 				 childNodes:[]
// 				},
// 				]
// ]
// relying on other services it check the attributes for basic types
// <circle>, <ellipse>, <image>, <line>, <path>, <polygon>, <polyline>, <rect>, <text>, <use>



(function(){
	"use strict";

	angular
		.module('draw.path')
		.factory('drawData', drawData);

	drawData.$inject = ['$timeout' , 'drawAssemble','drawRegexCons','drawStrCode'];


	function drawData($timeout , drawAssemble, drawRegexCons, drawStrCode){
		

		var obj = {
			node:[],
			string:'',
			setNode:setNode,
			flatNodeList:flatNodeList,
			getStr:getStr,
			// serializeNode:serializeNode,
			changeNode:changeNode,
			stringUpdateflag:false,
			// strSplice:strSplice
		};
		return obj;

		function getStr(){
			return obj.string;
		}

		function changeNode(msg){
			// this should return the new string value an update node [] (sideEff)

			// if it's needed we need to get a new-reference to elem we're modifying
			if( !changeNode.pointer)
			changeNode.pointer = pointTo(msg.elemHash);
			
			var res = drawAssemble[changeNode.pointer.nodeName]( msg , changeNode.pointer);
			// with return  from draw assemble we update string
			// obj.string = drawStrCode.update( pointTo.o[res[0]], obj.string, res.splice(1))
			
			if( obj.stringUpdateflag === false){
				obj.stringUpdateflag = true;
				 $timeout( function(){ 
					obj.string = drawStrCode.update( pointTo.o[res[0]], obj.string, res.splice(1));			
					obj.stringUpdateflag = false;
				 }, 100 );

			}
			// 	obj.stringUpdateflag = true;
			// 	console.log('entered timeout')
			// 	$timeout( function(){ return strUpdater(res); }, 1500 );
			// }
			
			// function strUpdater(args){
			// 	obj.string = drawStrCode.update( pointTo.o[args[0]], obj.string, args.splice(1));			
			// 	obj.stringUpdateflag = false;
			// }

			// if mouseup we should clean up pointer and stop
			if(msg.mouseup){
				setTimeout(function(){ changeNode.pointer = null ;},0)
			}

			// now we should update the string
		}

		// util for changeNode it updates the str in the end of cycle
		// function stringUpdate(res){

		// 	var elObj= pointTo.o[res[0]];
		// 	var vals = res.splice( 1 ) ;
		// 	vals.forEach(x=>{
		// 		// x : ['cx',33]
		// 	obj.string = strSplice(
		// 						obj.string,
		// 						elObj.attrsStringRef[x[0]].start , 
		// 						elObj.attrsStringRef[x[0]].end   ,
		// 						x[1]
		// 					);
		// 	});
		// }

		// function strSplice(str, start, end, sub ) {
		// 	// while making simultaneous changes
		// 	// if the string changes length we should update all attrsStringRef properties ...
		// 	// without updating all attrsStringRef we could add a 
		// 	// strSplice.offset property that add or reduces attrsStringRef values accordingly
  // 			if( strSplice.offset === undefined){
	 //  			strSplice.offset = { ar: [ /*11 */ ],  /*11 : 1*/};
	 //  		}

		// 	//if needed update stringindexs
		// 	for (var i = 0 ; i < strSplice.offset.ar.length ; i++){
		// 		if (strSplice.offset.ar[i] <  start){
		// 			start += strSplice.offset[ strSplice.offset.ar[i] ];
		// 		}
		// 		if (strSplice.offset.ar[i] <= end){
		// 			end += strSplice.offset[ strSplice.offset.ar[i] ];
		// 		}
		// 	}

		// 	// keep track if there are variation on sub length 
		// 	if( sub.length !== (end - start) ){
		// 		strSplice.offset[end] =  (sub.length - (end - start)) + (strSplice.offset[end] || 0) ;
				
		// 		if(strSplice.offset[end] === 0){//we splice it out
		// 			strSplice.offset.ar.splice(  strSplice.offset.ar.indexOf(end) ,  1  )
		// 		}else if(strSplice.offset.ar.indexOf(end) < 0){//if it's not in array we push it in
		// 			strSplice.offset.ar.push(end);
		// 		}
		// 	} 
  // 			return str.slice(0, start) + (sub || '') + str.slice(end)
		// }

		function setNode(a,str){
			obj.node = serializeNode(a,str);
			obj.string = str;
		}

		function serializeNode(a,str){
			//the dom rappresentation is good we just need to map what we want
			//maybe there are some JQlite methods for this..
			var hashSvg = 0;
			if(a)
			return [].slice.call(a).map(function(n){
				return mapNode(n);
			});

			function mapNode(node){
			// this procedure creates a structure which is utilized by
			// .pointTo() to create a flatnode Reference table (.pointTo.o property) and
			// by drawStrCode.update to track length of string when values in string change
			// since the structure changes we need to initialize these properties
			drawStrCode.initStrOffset();
			pointTo.o = undefined;
				
				function mappedAttributes(nA){
					// this regex strips out wrong attributes compiled by angular
					// when dealing with 'd'
					// but it probably will fail in some situations
					/* /(^=|^\"|^\'|^[a-zA-Z][0-9]|[0-9])/;*/
					var patt = /(^=|^\"|^\'|^[0-9]|^class$)/;
					if(nA)
					return [].slice.call(nA).reduce( ( acc , x )=> {
						 if( !patt.test(x.name))
						 acc[x.name] = x.value;
						 return acc;
					},{});
				}

				var attrs= mappedAttributes(node.attributes) || [];

				// attrsStringRef is a reference on the char-string-index in str
				var attrsStringRef = Object.keys(attrs).reduce(function(acc, x) {
//TODO  create a match for points and d and other values...
					var pat = drawRegexCons.attrsStrLen(node.nodeName , x, attrs[x]);
					  var strI = {};
					  str.replace(pat, function(m, m2, startI) {

					    strI.end = startI + m.length;
					    strI.start = strI.end - m2.length;
					  });
					  acc[x] =  strI;
					  return acc;
				}, {} );

				// check svgAnimatedLength for conversion values
				var attrsLength = {};
				var pointList ={};
				for( let x in attrs){
					if (node[x] instanceof SVGAnimatedLength )
					attrsLength[x] = node[x];

					if (node[x] instanceof SVGPointList )
					pointList[x] = node[x]; 
				};

				var res ={
					nodeName   		: node.nodeName,
					attributes 		: attrs,
					childNodes 		: node.childNodes,
					hashSvg    	  	: hashSvg++,
					attrsStringRef	: attrsStringRef,
				};
				if(node.nodeName === 'path')
				// since we're using a shim for abstracting specific d getPathData()
				// we'll pass the whole dom nodeName
				res.domObj = a[0];  

				if(Object.keys(attrsLength).length > 0)
				res.attrsLength = attrsLength;

				if(Object.keys(pointList).length > 0)
				res.pointList = pointList;

				if (node.childNodes.length > 0)
					res.childNodes = [].slice.call(node.childNodes).map(function(x){
						return mapNode(x);
					});
				return res; 
			}
		}
		
	//pointTo - flatNodeList - pathDataPointList are utility of changeNode()
		function pathDataPointList(domO){
			return domO.getPathData().reduce((ac,x,i)=>{
				var subI=0;
				while (x.values.length > 0){
					ac.push({
						x :x.values[0],
						y :x.values[1],
						comI : i,
						command:x.type,
						subI: subI++
					});
				x.values.splice(0,2);
				}
				return ac;
			}, []);
		}
		function pointTo(h){
			pointTo.o = pointTo.o || flatNodeList();

			if(pointTo.o[h].nodeName === 'path'){
				pointTo.o[h].pathDataPointList = pathDataPointList(pointTo.o[h].domObj);
				pointTo.o[h].pathData = pointTo.o[h].domObj.getPathData();
			}
			return pointTo.o[h];
		}
		function flatNodeList(){
			return obj.node.reduce( (acc,x) => {
				acc.push(x);
				if(x.childNodes.length > 0)
				x.childNodes.reduce( (ac,cn) =>{
					acc.push(cn);
					return ac;
				}, acc);
				return acc;
			}, [])
			.sort( (a,b) => {return a.hashSvg - b.hashSvg});
		}

		

	}
})();

		/*function parseNode(n){
			var parsed ;
			n =n.replace(/\n|\r/g, "");
			
			var nodePat = /<\s*([a-zA-Z]+)(.+)\s*(>\s*<\s*\1)\/\s*>/; 
			n.replace(nodePat)

		}*/