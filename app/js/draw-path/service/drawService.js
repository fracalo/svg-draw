(function(){
	 'use strict';
	angular
		.module('draw.path')
		.factory('drawService', drawService);

	drawService.$inject = ['$filter'];
/*service*/
function drawService($filter){

    var obj = {
	//sample point output  point={type:'C', list:[ {x:22,y:33,id:1},{x:32,y:453,id:2},{x:33,y:33,id:3} ] };
	points : [] ,
	rawPoints : rawPoints,
	setPoints : setPoints,
	getPoints : getPoints,
	dValue: dValue,

	vectorDValue : vectorDValue,
	code : code,
	 // options for point types
 	curveOp:['M','L','Q','C'],

	/*obj.click captures click event and registers lastPoint and adds to points  array*/
	mousedown :  mousedown,
	mouseupLine :mouseupLine,
	mousemove : mousemove,
	mousemoveback : mousemoveback
	};
	return obj;
	

	function mousedown(e){
		  
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
			
	}
	function mouseupLine(e){

		var pointLen = obj.points.length;
		var typeOfPoint = (pointLen <= 1)?'M':'L';
		    
		obj.points[pointLen - 1].type = typeOfPoint;
			
	};

	function mousemove(e){
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
	function mousemoveback(e){
			var pointLen = obj.points.length;

			if(obj.points[pointLen - 1].list.length < 2)
				return;


			obj.points[pointLen - 1].list.shift();
					    //change type of point
			var typeOfPoint = (pointLen <= 1)?'M':'L';
		    obj.points[pointLen - 1].type = typeOfPoint;

	}
	function getPoints(){
		return obj.points;
	}
	function setPoints(a){
		obj.points = a;
	}
	function rawPoints(points){
		return points.reduce((acc,x) =>{
			var i=0;
			while(i < x.list.length){
				acc.push({
					x:x.list[i][0],
					y:x.list[i][1]
				});
				i++;
			};
			return acc;
		},[]);
	}
	function dValue(){
		return $filter('arrayToDVal')(obj.points);
	}
	function vectorDValue(){
		var arr = $filter('toVectorArray')(obj.points);
		return $filter('arrayToDVal')(arr);

	}
	function code(attributes){
	 return $filter('attrsToMarkup')(attributes);
	}

}

})();