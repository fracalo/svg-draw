'use strict';

/* Services */

angular.module('draw.path')



/*service*/
.service('drawService', [ '$filter',  function($filter) {

	var obj= this;

	//sample point output  point={type:'C', list:[ [22,33],[34,42],[66,88] ] };
	this.points = [] ;

	this.setPoints = function(a){
		obj.points = a;
	};

	this.getPoints = function(){
		return obj.points;
	};
	this.dValue=function(){
		return $filter('arrayToDVal')(obj.points);

	};
	this.vectorDValue=function(){
		var arr = $filter('toVectorArray')(obj.points);
		return $filter('arrayToDVal')(arr);

	};
	this.code=function(attributes){
	 return $filter('attrsToMarkup')(attributes);
	};
	 // options fot point types
 	this.curveOp=['M','L','Q','C'];



	/*obj.click captures click event and registers lastPoint and adds to points  array*/
	this.mousedown =  function(e){
		  
			if(!e || e.target instanceof SVGCircleElement)
			return;

            var point = {
            	type:'',
            	list :[]
            };
            point.list[0]=[];

            //polyfill for FF
            if(!e.target.offsetLeft)
            var boundClientRect = e.target.getBoundingClientRect();

			//coercing int with bitwise for FF support
		    point.list[0][0]=e.pageX - e.target.offsetLeft || e.pageX - boundClientRect.left|0;
			point.list[0][1]=e.pageY - e.target.offsetTop  || e.pageY - boundClientRect.top |0;

			// we temporarly set type to 'M' for rendering point
			point.type='M';

			//inserts point
			obj.points.push(point);
			
	};
	this.mouseupLine = function(e){

		var pointLen = obj.points.length;
		var typeOfPoint = (pointLen <= 1)?'M':'L';
		    
		obj.points[pointLen - 1].type = typeOfPoint;
			
	};

	this.mousemove = function(e){
			if (e.target instanceof SVGCircleElement )
			return;

		var pointLen = obj.points.length;

		var leftOffset =  e.target.offsetLeft,
			topOffset  =  e.target.offsetTop ;

		//polyfill for target.offsetLeft in FF
            if(!e.target.offsetLeft || e.target.offsetLeft == undefined){
         	var boundClientRect = e.target.getBoundingClientRect();
        	leftOffset =  boundClientRect.left;
			topOffset  =  boundClientRect.top;
			}


		//if it's the first point just move around M point and return
		if (pointLen == 1)
		 return obj.points[0].list[0][0] = e.pageX - leftOffset |0,
		   		obj.points[0].list[0][1] = e.pageY - topOffset  |0;

			//if no vector exist create one andinsert it on index 1
			// and change type of point if needed
		if (obj.points[pointLen - 1].list.length < 2)
			obj.points[pointLen -1].list.unshift([]),
		    obj.points[pointLen - 1].type  = 'Q';
			
			//update position of vector																
			//coercing paseInt with bitwise
     		obj.points[pointLen - 1].list[0][0] = e.pageX - leftOffset |0;
			obj.points[pointLen - 1].list[0][1] = e.pageY - topOffset  |0;
	};
	this.mousemove.back = function(e){
			var pointLen = obj.points.length;

			if(obj.points[pointLen - 1].list.length < 2)
				return;


			obj.points[pointLen - 1].list.shift();
					    //change type of point
			var typeOfPoint = (pointLen <= 1)?'M':'L';
		    obj.points[pointLen - 1].type = typeOfPoint;

	};

}])

.factory('drawPathAttr' , function($filter){

var obj={

		attributes:{
			fill :'rgba(222,0,222,0.5)',
			stroke :'green',
			//['stroke-width']:5
			
		},

		setAttr : function(swapObj){
			return obj.attributes = swapObj;
		},
		getAttr : function() {
	    	return obj.attributes;
	  	}
	};
	obj.attributes['stroke-width']=5;
return obj;

})

.factory('drawVectorAttr' , function($filter){

var obj={

		attributes:{
			fill :'none',
			stroke :'#666',
			//['stroke-width']:5
			
		},
		getAttr : function() {
	    	return obj.attributes;
	  	}
	};
	obj.attributes['stroke-dasharray']='4,5';




return obj;

})
.factory('codeInput',function($q){
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
			 			return (attrOp.every( attr => attr !== k))
			 });
			 return $q(function(resolve, reject){
			 	if( filteredArray.length > 0)
			 	{ reject(filteredArray +' isn\'t a supported attribute name '); };

			 	resolve(res);
			 });
		},



		checkDvalArrify : function(code){
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


})
/* return function(ar){
  var pat= /([^(M|L|C|Q|Z|S|A|H|V)])/;
    ar.forEach( x => {
      x.type = x.type.replace(pat, t =>{
        if(x.list.length == 1 )
        {return t='L';}

        if(x-list.length == 2)
        {return t='Q';}

        if(x.list.length == 3)
        {return t= 'C';}
      });

      x.list.forEach( a => {
            if(a.length<2)
            a[1]=a[0];

            if(a.length>2)
            a.splice(2,a.length);
        })
    });
    return ar;
  };*/


// .filter('dValToArray', function(){
//   return function(str){
//     if(!str || str === '')
//     return [];
  
//         var pat= /([A-Z][\d+|\s|,|\b]*)[^\A-Z]?/gi;

//         var res = [];
//         str.replace(pat,function(a){
//         var p={
//             list:[]
//          };
//          p.type = a.slice(0,1);
         
//          var points= a.slice(1).trim().split(/\s*,\s*/);
//          points.forEach(function(x){
//                 p.list.push( x.split(' ').map( item =>Number(item) ) );
//          });
         
//           res.push(p);
//         });
//       return res;
//   };
// })

