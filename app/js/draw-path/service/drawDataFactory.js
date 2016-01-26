// this is the factory that stores the data in a serialized object
// it uses the data mapped while compiling in the directive drawSvg
// into a different object depending on the svg type
// exampleList = [
// 	{
//	 nodeName :'circle',
// 	 attributes: {
//			cx   :44,
// 	        cy   :55,
// 	         r    :3
//	 },
//	 childNodes:[]
// ]
// relying on other services it check the attributes for basic types
// <circle>, <ellipse>, <image>, <line>, <path>, <polygon>, <polyline>, <rect>, <text>, <use>



(function(){
	"use strict";

	angular
		.module('draw.path')
		.factory('drawDataFactory', drawDataFactory);


	function drawDataFactory(){
		var obj = {
			node:[],
			setNode:setNode,
			serializeNode:serializeNode,
		};
		return obj;

		function setNode(a){
			obj.node = serializeNode(a);
		}

		function serializeNode(a){
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
					// but it probably will fail in some situations 
					var patt = /(^=|^\"|^\'|^[a-zA-Z][0-9]|[0-9])/;
					if(nA)
					return [].slice.call(nA).reduce( ( acc , x )=> {
						 if( !patt.test(x.name))
						 acc[x.name] = x.value;
						 return acc;
					},{});
				}
				var attrs= mappedAttributes(node.attributes) || [];
				var res ={
					nodeName  : node.nodeName,
					attributes: attrs,
					childNodes:node.childNodes,
					hashSvg: hashSvg++,
				};
				if (node.childNodes.length > 0)
					res.childNodes = [].slice.call(node.childNodes).map(function(x){
						return mapNode(x);
					});
				return res; 
			}
		}
		

		

	}
})();

		/*function parseNode(n){
			var parsed ;
			n =n.replace(/\n|\r/g, "");
			
			var nodePat = /<\s*([a-zA-Z]+)(.+)\s*(>\s*<\s*\1)\/\s*>/; 
			n.replace(nodePat)

		}*/