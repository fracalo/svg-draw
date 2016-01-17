//this is the factory that stores the data in a serialized object
//it uses the data mapped while compiling in the directive drawSvg
//??? relying on other services it parses the code
//into a different object depending on the svg type
// exampleList = [
// 	{node :'circle',
// 	 cx   :44,
// 	 cy   :55,
// 	 r    :3		},
// 	{node :'path',
// 	 d    :'M11 11',
// 	stroke: '#000'	}
// ]


(function(){
	angular
		.module('draw.path')
		.factory('drawDataFactory', drawDataFactory);

	drawDataFactory.$inject = ['$filter'];

	function drawDataFactory($filter){
		obj = {
			storage:[],
			getCompiledNode:getCompiledNode,

		};
		return obj;

		function getCompiledNode(a){
			//the dom rappresentation is good we just need to map what we want
			//maybe there are some JQlite methods for this..
			function mapNode(node){
				var res ={
					nodeName : node.nodeName,
					attributes:node.attributes,
					childNodes:node.childNodes
				};
				if (node.childNodes.length > 0)
					res.childNodes = [].slice.call(node.childNodes).map(function(x){
						return mapNode(x);
					});
				return res; 
			}
			if(a)
			return [].slice.call(a).map(function(n){
				return mapNode(n);
			});

		}

		function parseNode(n){
			var parsed ;
			/*strip newlines*/
			n =n.replace(/\n|\r/g, "");
			/*parse*/
			var nodePat = /<\s*([a-zA-Z]+)(.+)\s*(>\s*<\s*\1)\/\s*>/; 
			n.replace(nodePat)

		}

	}
})();