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

	drawData.$inject = ['drawAssemble'];


	function drawData(drawAssemble){
		

		var obj = {
			node:[],
			str:'',
			setNode:setNode,
			// serializeNode:serializeNode,
			changeNode:changeNode,
			flatNodeList:flatNodeList,
			getStr:getStr
		};
		return obj;

		function getStr(){
			return obj.str;
		}

		function changeNode(msg){
			// this should return the new string value an update node [] (sideEff)

			// if it's needed we need to get a new-reference to elem we're modifying
			if( !changeNode.pointer)
			changeNode.pointer = pointTo(msg.elemHash);
			
			drawAssemble[changeNode.pointer.nodeName]( msg , changeNode.pointer);
			
			// if mouseup we should clean up pointer and stop
			if(msg.mouseup){
				setTimeout(function(){ changeNode.pointer = null ;},0)
			}

			// now we should update the string
		}

		// util for changeNode it updates the str in the end of cycle
		function stringUpdate(){

		}
		function strSplice(str, start, end, sub) {
  			return str.slice(0, start) + (sub || '') + str.slice(end)
		}
		function setNode(a,str){
			obj.node = serializeNode(a,str);
			obj.str = str;
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

				// attrsStringRef is a reference on the char-string-index in  str
				var attrsStringRef = Object.keys(attrs).reduce(function(acc, x) {
//TODO  create a match for points and d
					  var pat = new RegExp("< *" + node.nodeName + ".+?" + x + " *= *[\'|\"]? *(-?\\d+(.\\d+)?[a-z]*)");
					  var strI = {};
					  str.replace(pat, function(m, m2, m3, startI) {
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
				// since we're using a shim for astracting specific d getPathData()
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
console.log(res)
console.log(str)
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
			var o = flatNodeList();

			if(o[h].nodeName === 'path'){
				o[h].pathDataPointList = pathDataPointList(o[h].domObj);
				o[h].pathData = o[h].domObj.getPathData();
			}

			return o[h];
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