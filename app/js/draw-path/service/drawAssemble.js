// drawAssemble is used to update a new string every time a certain attribute is modified.
// utility of drawData
// Process:
// once drawDeconstruct.structure has changed we check what type of element we're dealing with (hash reference in drawData.node)
// drawData.node is updated  (will be useful with tools)  
// a newstring is created ready to be compiled by directive
// [[I suppose it would be more performant to target the property directly instead of re-compiling -- using setAttribute]]
(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawAssemble', drawAssemble);
	
	drawAssemble.$inject = ['drawDeconstruct'];

	function drawAssemble(drawDeconstruct) {
		// add methods on proto
		if(SVGLength.prototype && !SVGLength.prototype.updateConvertSVGLen)
		SVGLength.prototype.updateConvertSVGLen = function(v){
			this.oldVal = this.unitType;
			//TODO transform value and update after
			this.newValueSpecifiedUnits(1, v);
			this.convertToSpecifiedUnits(this.oldVal);
		};

		return {
			path:path,
			polygon:polygon,
			polyline:polygon,
			rect:rect,
			circle:circle,
			ellipse:ellipse,
			line:line,
		};
		function path(p,obj){

			path.pointByI = obj.pathDataPointList[p.index];
			
			obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI * 2 ]     =  p.point.x;
			obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI * 2 + 1 ] =  p.point.y;

			obj.domObj.setPathData(obj.pathData);
		}
		function polygon(p,obj){
 console.log(obj.attributes)
//TODO need to update obj.attributes.points  (the strnig)
			obj.pointList.points[p.index].x = p.point.x;
			obj.pointList.points[p.index].y = p.point.y;

		}


		function rect(p, obj){
			var attrObj = obj.attributes;
			var oldX, oldY ;

			rect.start = function(p, attrObj){
				oldX = obj.attrsLength.x.baseVal.value;
				oldY = obj.attrsLength.y.baseVal.value;

				attrObj.x = p.point.x;
				attrObj.y = p.point.y;

				obj.attrsLength.x.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.y.baseVal.updateConvertSVGLen(p.point.y);

				//adjust end point
				drawDeconstruct.structure[obj.hashSvg][1].x += p.point.x - oldX;
				drawDeconstruct.structure[obj.hashSvg][1].y += p.point.y - oldY;


			};
			rect.end   = function(p, attrObj){
				attrObj.width  = p.point.x - attrObj.x;
				attrObj.height = p.point.y - attrObj.y;

				obj.attrsLength.width.baseVal.updateConvertSVGLen(attrObj.width);
				obj.attrsLength.height.baseVal.updateConvertSVGLen(attrObj.height);
			};

			if(p.index === 0)
			return rect.start(p,attrObj);

			return rect.end(p,attrObj);
		}
		function circle(p, obj){
			var attrObj = obj.attributes;
			var oldCx, oldCy ;

			circle.center = function(p, attrObj){
				oldCx = obj.attrsLength.cx.baseVal.value;
				oldCy = obj.attrsLength.cy.baseVal.value;
				
				attrObj.cx = p.point.x;
				attrObj.cy = p.point.y;

				obj.attrsLength.cx.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.cy.baseVal.updateConvertSVGLen(p.point.y);

				//adjust radius point
				drawDeconstruct.structure[obj.hashSvg][1].x += p.point.x - oldCx;
				drawDeconstruct.structure[obj.hashSvg][1].y += p.point.y - oldCy;
			};

			circle.rad = function(p, attrObj){
				attrObj.r = pytha(
					[obj.attrsLength.cx.baseVal.value, obj.attrsLength.cy.baseVal.value],
					[p.point.x, p.point.y] );

				obj.attrsLength.r.baseVal.updateConvertSVGLen( attrObj.r );
			};

			// check if it's the point responsible for center[0](cx and cy) or rad[1]
			// and use corresponding function property
			if (p.index === 0)
			return circle.center(p,attrObj);
			
			return circle.rad(p,attrObj);
		}

		function ellipse(p, obj){
			var attrObj = obj.attributes;
			var oldCx, oldCy ;

			ellipse.center = function(p, attrObj){
				oldCx = obj.attrsLength.cx.baseVal.value;
				oldCy = obj.attrsLength.cy.baseVal.value;
				
				attrObj.cx = p.point.x;
				attrObj.cy = p.point.y;

				obj.attrsLength.cx.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.cy.baseVal.updateConvertSVGLen(p.point.y);

				//adjust both radius point
				drawDeconstruct.structure[obj.hashSvg][1].x += p.point.x - oldCx;
				drawDeconstruct.structure[obj.hashSvg][1].y += p.point.y - oldCy;
				drawDeconstruct.structure[obj.hashSvg][2].x += p.point.x - oldCx;
				drawDeconstruct.structure[obj.hashSvg][2].y += p.point.y - oldCy;
			};

			ellipse.radX = function(p, attrObj){
				attrObj.rx = pytha(
					[obj.attrsLength.cx.baseVal.value, obj.attrsLength.cy.baseVal.value],
					[p.point.x, p.point.y] );

				obj.attrsLength.rx.baseVal.updateConvertSVGLen( attrObj.rx );
			};

			ellipse.radY = function(p, attrObj){
				attrObj.ry = pytha(
					[obj.attrsLength.cx.baseVal.value, obj.attrsLength.cy.baseVal.value],
					[p.point.x, p.point.y] );

				obj.attrsLength.ry.baseVal.updateConvertSVGLen( attrObj.ry );
			};

			if (p.index === 0)
			return ellipse.center(p,attrObj);
			
			if (p.index === 1)
			return ellipse.radX(p,attrObj);

			return ellipse.radY(p,attrObj);
		}
		function line(p, obj){
			var attrObj = obj.attributes;

			line.x = function(p, attrObj){
				attrObj.x1 = p.point.x;
				attrObj.y1 = p.point.y;
				obj.attrsLength.x1.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.y1.baseVal.updateConvertSVGLen(p.point.y); 
			};
			line.y = function(p, attrObj){
				attrObj.x2 = p.point.x;
				attrObj.y2 = p.point.y;
				obj.attrsLength.x2.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.y2.baseVal.updateConvertSVGLen(p.point.y); 

			};
			if (p.index === 0)
			return line.x(p,attrObj);
			
			return line.y(p,attrObj);
		}

		function pytha(c,r){
			return Math.sqrt( Math.pow(c[0]-r[0],2) + Math.pow(c[1]-r[1],2) ) | 0 ;
		}
		function absInt(x) { //https://jsperf.com/math-abs-vs-bitwise/7
            return (x ^ (x >> 31)) - (x >> 31);
      	}
	}

})();


		// function updateConvertSVGLen(v,a,obj){
		// 	var val = obj[a].baseVal.unitType;
		// 	obj[a].baseVal.newValueSpecifiedUnits(1, v);
		// 	obj[a].baseVal.convertToSpecifiedUnits(val);
		// }