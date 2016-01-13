(function(){
	angular
		.module('draw.path')
		.service('drawService', drawService);

	drawService.$inject = ['$filter'];
/*service*/
function drawService($filter){

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

}

})();