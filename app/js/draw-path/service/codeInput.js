(function(){
	angular
		.module('draw.path')
		.service('codeInput', codeInput);

	codeInput.$inject = ['$q'];


	function codeInput($q){
	return {
		parseAttr:function(str){ 
			var obj = Object.create(null);
        	var pat = /([a-zA-Z\-]+)\s*=\s*"\s*(.*?)\s*"/g;
    		return $q(function(resolve, reject){
        		str.replace(pat,function(match, k, v,offset){
      
            	obj[k]=v;
        		});

        	resolve(obj);
        	});
		},
			//also need to add errorcallback on Promise:
			//-wrong node wraps -etc,,

		checkKeys: function(res){
			 var attrOp = ['fill','stroke','stroke-width','stroke-dasharray','stroke-linecap','d'];
			 var keys = Object.keys(res);
			 var filteredArray = keys.filter(k => {
			 			 return (attrOp.every( attr => attr !== k));
			 });
			 return $q(function(resolve, reject){
			 	if( filteredArray.length > 0){
			 	 return reject(filteredArray +' isn\'t a supported attribute name ');
			 	}
			 	//this is not a fatal errot so always fullfill it
			 	 // console.log(res)
			 	 // return resolve(res);
			 	
			 	
			 });
		},



		checkDvalArrify : function(code){
			console.log(code)
			var d = code.d;
			var list = dValToList(d);
			var pat= /([^(M|L|C|Q|Z|S|A|H|V)])/;
			return $q (function(resolve,reject){
				list.forEach ( (x,i) => {
					x.type.replace( pat, t => {
						reject('error on point # ' +i+' - ' +t+ ': wrong point type')
					});

					x.list.forEach( a => {
            			if(a.length<2)
                 		reject('error on point # ' + i+' (not enough values)')

           				if(a.length>2)
      					reject('error on point # ' + i+' (too many values)')
        			})
				});
			//resolve the d value ready to be set in next fullfillment
				resolve(list);
			});
		}

	};

		function dValToList(str){
	    if(!str || str === '')
	    return [];
	  
	        var pat= /([A-Z][\d+|\s|,|\b]*)[^\A-Z]?/gi;

	        var res = [];
	        str.replace(pat,function(a){
	        var p={
	            list:[]
	         };
	         p.type = a.slice(0,1);
	         
	         var points= a.slice(1).trim().split(/\s*,\s*/);
	         points.forEach(function(x){
	                p.list.push( x.split(' ').map( item =>Number(item) ) );
	         });
	         
	          res.push(p);
	        });
	      return res;
	  	};


};

})();