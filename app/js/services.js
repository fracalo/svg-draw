'use strict';

/* Services */

var svgFiddleServices = angular.module('svgFiddleServices',[]);


svgFiddleServices.factory('artboard', [ '$filter', function($filter) {

	var obj={};

	//sample point output  point={type:'C', list:[ [22,33],[34,42],[66,88] ] };
	obj.points = [] ;


	obj.vectors = function(){
		var vectors ;

		if(obj.points.length)
			vectors = obj.points.reduce(function(ac, x, i, arr){
				if (x.type === 'Q' || x.type === 'C'){
					ac.push(
						[ arr[i-1].list[arr[i-1].list.length-1] , x.list[0] ],
						[ x.list[ x.list.length -2 ] , x.list[ x.list.length -1 ] ]
						)
					};

					return ac;

			},[]);

		return vectors
	};
	obj.setPoints = function(a){
		obj.points = a;
	};

	/*obj.click captures click event and registers lastPoint and adds to points  array*/
	obj.mousedown =  function(e){
		  
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
	obj.mouseupLine = function(e){
		// if (e.target instanceof SVGCircleElement)
		// 	return;
		// e.stopPropagation();


			
			var pointLen = obj.points.length;
			var typeOfPoint = (pointLen <= 1)?'M':'L';

		    
		    obj.points[pointLen - 1].type = typeOfPoint;
			
	};

	obj.mousemove = function(e){
		
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
			
			//update position of vector																//coercing paseInt with bitwise
     		//coercing to int with bitwise
			obj.points[pointLen - 1].list[0][0] = e.pageX - leftOffset |0;
			obj.points[pointLen - 1].list[0][1] = e.pageY - topOffset  |0;
	};
	obj.mousemove.back = function(e){
			var pointLen = obj.points.length;

			if(obj.points[pointLen - 1].list.length < 2)
				return;


			obj.points[pointLen - 1].list.shift();
					    //change type of point
			var typeOfPoint = (pointLen <= 1)?'M':'L';
		    obj.points[pointLen - 1].type = typeOfPoint;

	};





	// obj.mouseupCurve = function(e){
	// 		 console.log('ser mouseupCURVE',e )

	// 		 var  pointLen = obj.points.length;
			
	// 		// var typeOfPoint = (pointLen <= 1)?'M':'Q';
			
	// 		if(pointLen <= 1)
	// 		return; 
	// 			moved this part on mousemove()		
	// 		// if(pointLen > 0){
	// 		var qPoint = [];
	// 		qPoint[0]=e.clientX - e.target.offsetLeft;
	// 		qPoint[1]=e.clientY - e.target.offsetTop;

	// 		//inserts point in the last point array
	// 		obj.points[pointLen - 1].unshift(qPoint);
			
	// 		//set correct point type
	// 		//obj.points[pointLen - 1].type = 'Q';
	// }

	obj.getPoints = function(){
		return obj.points
	};
	obj.dValue=function(){
		return $filter('arrayToDVal')(obj.points);

	};
	obj.vectorDValue=function(){
		var arr = $filter('toVectorArray')(obj.points)
		return $filter('arrayToDVal')(arr);

	};
	obj.code=function(attributes){
	 return $filter('attrsToMarkup')(attributes);
	};
	 // options fot point types
 	obj.curveOp=['M','L','Q','C']

	return obj;

 
}]);

svgFiddleServices.factory('toolsAttr' , function($filter){

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

});
svgFiddleServices.factory('vectorAttr' , function($filter){

var obj={

		attributes:{
			fill :'none',
			stroke :'#666',
			//['stroke-width']:5
			
		},

		/*setAttr : function(swapObj){
			return obj.attributes = swapObj;
		},*/
		getAttr : function() {
	    	return obj.attributes;
	  	}
	};
	obj.attributes['stroke-dasharray']='4,5';




return obj;

})

