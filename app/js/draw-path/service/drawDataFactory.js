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
			changeNode:changeNode,
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

			//deconstruct
			var [res1, ...res2] = drawAssemble[changeNode.pointer.nodeName]( msg , changeNode.pointer);

			// with return  from draw assemble we update string
			var changing = $timeout( 20 )
				 .then(function(){
				 	if(pointTo.o)
				 	obj.string = drawStrCode.update( pointTo.o[res1],
				 										obj.string,
				 										res2);			

				 },function(e){	console.log(e) });
			

			// if mouseup we should clean up pointer and stop
			if(msg.mouseup){
				$timeout.cancel(changing);
				setTimeout(function(){ 
					changeNode.pointer = null ;
					drawAssemble.resetPathDiff();
				},40);
			}

		}



		function setNode(a,str){
			obj.string = str;
			obj.node = serializeNode(a,str);

		}

		function serializeNode(a,str){
			//the dom rappresentation is good we just need to map what we want
			//maybe there are some JQlite methods for this..
			var hashSvg = 0;
			if(a.length === 0)
			return [];

			return [].slice.call(a).map(function(n,i){
				return mapNode(n,i);
			});

			function mapNode(node,index){
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

					var pat = drawRegexCons.attrsStrLen(node.nodeName , x, attrs[x]);
					var strI = {};
					  str.replace(pat, function(m, m2, startI) {
					    strI.end = startI + m.length;
					    strI.start = strI.end - m2.length;
					  });
					  	var commandPat = /([a-zA-Z])[ .,0-9-]+/g ,
							patNum = /-?\d+(\.\d+)?/g ;
						if(x === 'points'){
							// example 			points:{
							// 							0:{
							//								x:{start:13, end:15},
							// 								y:{start:17, end:20}
							//  						}
							// 					}
							
							var counter = 0 , XorY = true;
							attrs[x].replace( patNum, function(m, _ ,start){

								if (XorY){
									strI[ counter ] = {};
									strI[ counter ].x = {};
									strI[ counter ].x.start = start ;
									strI[ counter ].x.end = start + m.length ;
									return  XorY = ! XorY;
								}

								strI[ counter ].y = {};
								strI[ counter ].y.start = start ;
								strI[ counter ].y.end = start + m.length ;
								return counter++ , XorY = ! XorY ;
							});
						}
						if(x === 'd'){
							var comCount = 0 , valCount; 
							attrs[x].replace( commandPat, function(m, com, start){
								strI[ comCount ] = {
									start : start,
									end	  : start + m.length
								};
								valCount = 0;
								m.replace( patNum , function(ma, _ , s){
									strI[ comCount ][ valCount++ ] = {
										start: start + s,
										end  : start + s + ma.length
									};
								});
								comCount ++;

							});
						}
					acc[x] = strI;
					return acc;
				}, {} );

				// check svgAnimatedLength for conversion values
				var attrsLength = {};
				var pointList ={};
				for( var x in attrs){
					if (node[x] instanceof SVGAnimatedLength )
					attrsLength[x] = node[x];

					if (node[x] instanceof SVGPointList )
					pointList[x] = node[x]; 
				}

				var res ={
					nodeName   		: node.nodeName,
					attributes 		: attrs,
					childNodes 		: node.childNodes,
					hashSvg    	  	: hashSvg++,
					attrsStringRef	: attrsStringRef,
				};
				if(node.nodeName === 'path'){
				// since we're using a shim for abstracting specific d getPathData()
				// we'll pass the whole dom nodeName
				res.domObj = a[index];
				}
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
				pointTo.o[h].pathDataNormalized = pointTo.o[h].domObj.getPathData({normalize:true});
				pointTo.o[h].pathDataAbsolutize = pointTo.o[h].domObj.getPathData({absolutize:true});
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
			.sort( (a,b) => {return a.hashSvg - b.hashSvg; } );
		}

		

	}
})();

