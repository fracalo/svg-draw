(function(){
	angular
		.module('draw.path')
		.service('drawPathAttr', drawPathAttr);



	function drawPathAttr(){

		var obj={

				attributes:{
					fill :'rgba(222,0,222,0.5)',
					stroke :'green',
					//['stroke-width']:5
					
				},

				setAttr : function(swapObj){
					obj.attributes = swapObj;
				},
				getAttr : function() {
			    	return obj.attributes;
			  	}
			};
			obj.attributes['stroke-width']=5;
		return obj;

		}

})();