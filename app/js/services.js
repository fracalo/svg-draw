'use strict';

/* Services */

var svgFiddleServices = angular.module('svgFiddleServices',[]);


svgFiddleServices.factory('artboard', [ '$filter', function($filter) {

	var obj={};
	obj.points = [] ;

	obj.lastPointType=function(){
		// console.log(obj.points[obj.points.length - 1]);
		return (obj.points.length)?
		     obj.points[obj.points.length - 1].type:
		     0;
	};
	obj.setPoints= function(a){
		obj.points=a;
	};

	/*obj.click captures click event and registers lastPoint and adds to points  array*/
	obj.mousedown =  function(e){
		  
			if(!e || e.target instanceof SVGCircleElement)
			return;
//sample point output  point=[type:'C', [22,33],[34,42],[66,88] ];
            var point = [];
            point[0]=[];
		    point[0][0]=e.pageX - e.target.offsetLeft;
			point[0][1]=e.pageY - e.target.offsetTop;
			 
			// we temporarly set type to 'M' for rendering point
			point.type='M';

			//inserts point
			obj.points.push(point);
			
			console.log(obj.points)
			
	};
	obj.mouseupLine = function(e){
		// if (e.target instanceof SVGCircleElement)
		// 	return;
		// e.stopPropagation();
		    console.log(e)	

			
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

		//if it's the first point just move around M point and return
		if (pointLen == 1)
	return obj.points[0][0][0] = e.pageX - leftOffset,
		   obj.points[0][0][1] = e.pageY - topOffset;

			

			//if no vector exist create one andinsert it on index 1
			// and change type of point if needed
			if (obj.points[pointLen - 1].length < 2)
				obj.points[pointLen -1].unshift([]),
			    obj.points[pointLen - 1].type  = 'Q';
				
			
			//update position of vector
			obj.points[pointLen - 1][0][0] = e.pageX - leftOffset;
			obj.points[pointLen - 1][0][1] = e.pageY - topOffset;
			
	};
	obj.mousemove.back = function(e){
			var pointLen = obj.points.length;

			if(obj.points[pointLen - 1].length < 2)
				return;


			obj.points[pointLen - 1].shift();
					    //change type of point
			var typeOfPoint = (pointLen <= 1)?'M':'L';
		    obj.points[pointLen - 1].type = typeOfPoint;
		    console.log( obj.points[pointLen - 1] )

	};

	obj.mouseupCurve = function(e){
			 console.log('ser mouseupline',e )

			 var  pointLen = obj.points.length;
			
			// var typeOfPoint = (pointLen <= 1)?'M':'Q';
			
			if(pointLen <= 1)
			return; 
			/*	moved this part on mousemove()		
			// if(pointLen > 0){
			var qPoint = [];
			qPoint[0]=e.clientX - e.target.offsetLeft;
			qPoint[1]=e.clientY - e.target.offsetTop;

			//inserts point in the last point array
			obj.points[pointLen - 1].unshift(qPoint);
			*/
			//set correct point type
			//obj.points[pointLen - 1].type = 'Q';
		


	}
	obj.getPoints = function(){
		return obj.points
	};
	obj.dValue=function(){
		return $filter('arrayToDVal')(obj.points);

	};
	obj.code=function(){
	 return $filter('attrsToMarkup')($filter('arrayToDVal')(obj.points));
	};

	return obj;

 
}]);

svgFiddleServices.factory('toolsAttr' , function(){

var obj={

		attributes:{
			fill :'rgba(222,0,222,0.5)',
			stroke :'green',
			strokeWidth:5,
		},

		setAttr : function(swapObj){
			return obj.attributes = swapObj;
		},
		getAttr : function() {
	    	return obj.attributes;
	  	}
	};

return obj;

})

