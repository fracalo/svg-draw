// drawAssemble is used to update SVG and update the GUI value every time a certain attribute is modified.
// utility of drawData
// Process:
// 
// drawData.changeNode calls for an updated (this is binded to mousemove).  
// through a pointer on the DOMobject we modify it changing the SVGLegth attributes (also SVGPointsList and PathDataPointList).
// if there any related points effected we adjust these in drawDeconstruct.structure, but
// in GUI the actula point position is changed by the drawSinglePoint directive (with drawPointRelation).
// we return the updated value to drawData preparing the argument for drawData.stringUpdate()



(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawAssemble', drawAssemble);
	
	drawAssemble.$inject = ['drawDeconstruct' , 'drawStrCode'];

	function drawAssemble( drawDeconstruct, drawStrCode ) {
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
			resetPathDiff: resetPathDiff,

		};
		function resetPathDiff(){
			path.xDiff = null;
			path.yDiff = null;
		}
		function path(p,obj){
			path.pointByI = obj.pathDataPointList[p.index];

			path.xDiff = path.xDiff ? path.xDiff :
			obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI * 2 ] -
			obj.pathDataAbsolutize[ path.pointByI.comI ].values[ path.pointByI.subI * 2 ];
			path.yDiff = path.yDiff ? path.yDiff :
			obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI * 2 + 1] -
			obj.pathDataAbsolutize[ path.pointByI.comI ].values[ path.pointByI.subI * 2 + 1];


			obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI * 2 ]     = path.pointByI.x = p.point.x + path.xDiff;
			obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI * 2 + 1 ] = path.pointByI.y = p.point.y + path.yDiff;

			obj.domObj.setPathData(obj.pathData);
			obj.attributes.d = 
			drawStrCode.preUpdateD( obj , path.pointByI ,
				[ [path.pointByI.subI * 2 , path.pointByI.x] , [path.pointByI.subI * 2 + 1, path.pointByI.y] ]) ;


			return [ obj.hashSvg , ['d', obj.attributes.d] ];
		}



		function polygon(p,obj){

			obj.pointList.points[p.index].x = p.point.x;
			obj.pointList.points[p.index].y = p.point.y;

			obj.attributes.points = 
			drawStrCode.preUpdatePoints( obj , p.index ,[ ['x',p.point.x] , ['y',p.point.y] ]) ;
			
			return [ obj.hashSvg , ['points', obj.attributes.points] ];
		}


		function rect(p, obj){
			var attrObj = obj.attributes;
			var oldX, oldY ;

			rect.start = function(p, attrObj){
				oldX = obj.attrsLength.x.baseVal.value;
				oldY = obj.attrsLength.y.baseVal.value;

				obj.attrsLength.x.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.y.baseVal.updateConvertSVGLen(p.point.y);

				// update attributes obj
				attrObj.x = obj.attrsLength.x.baseVal.valueAsString;
				attrObj.y = obj.attrsLength.y.baseVal.valueAsString;

				//adjust end point
				drawDeconstruct.structure[obj.hashSvg][1].x += p.point.x - oldX;
				drawDeconstruct.structure[obj.hashSvg][1].y += p.point.y - oldY;

				return [ obj.hashSvg , ['x',attrObj.x] , ['y',attrObj.y] ];
			};
			rect.end   = function(p, attrObj){
				attrObj.width  = p.point.x - attrObj.x;
				attrObj.height = p.point.y - attrObj.y;

				obj.attrsLength.width.baseVal.updateConvertSVGLen(
					p.point.x - obj.attrsLength.x.baseVal.value
				);
				obj.attrsLength.height.baseVal.updateConvertSVGLen(
					p.point.y - obj.attrsLength.y.baseVal.value
				);

				attrObj.width  = obj.attrsLength.width.baseVal.valueAsString;
				attrObj.height = obj.attrsLength.height.baseVal.valueAsString;

				return [ obj.hashSvg , ['width',attrObj.width] , ['height',attrObj.height] ];
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
				
				// convert it to old orig 
				obj.attrsLength.cx.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.cy.baseVal.updateConvertSVGLen(p.point.y);

				// update attributes obj 
				attrObj.cx = obj.attrsLength.cx.baseVal.valueAsString;
				attrObj.cy = obj.attrsLength.cy.baseVal.valueAsString;

				//adjust radius point
				drawDeconstruct.structure[obj.hashSvg][1].x += p.point.x - oldCx;
				drawDeconstruct.structure[obj.hashSvg][1].y += p.point.y - oldCy;

				return [ obj.hashSvg , ['cx',attrObj.cx] , ['cy',attrObj.cy] ];

			};

			circle.rad = function(p, attrObj){
				obj.attrsLength.r.baseVal.updateConvertSVGLen( 
					pytha(
					[obj.attrsLength.cx.baseVal.value, obj.attrsLength.cy.baseVal.value],
					[p.point.x, p.point.y]
					)
				);
				attrObj.r = obj.attrsLength.r.baseVal.valueAsString;
				return [ obj.hashSvg , ['r',attrObj.r] ];


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

				obj.attrsLength.cx.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.cy.baseVal.updateConvertSVGLen(p.point.y);

				attrObj.cx = obj.attrsLength.cx.baseVal.valueAsString;
				attrObj.cy = obj.attrsLength.cy.baseVal.valueAsString;


				//adjust both radius point
				drawDeconstruct.structure[obj.hashSvg][1].x += p.point.x - oldCx;
				drawDeconstruct.structure[obj.hashSvg][1].y += p.point.y - oldCy;
				drawDeconstruct.structure[obj.hashSvg][2].x += p.point.x - oldCx;
				drawDeconstruct.structure[obj.hashSvg][2].y += p.point.y - oldCy;

				return [ obj.hashSvg , ['cx',attrObj.cx] , ['cy',attrObj.cy] ];
			};

			ellipse.radX = function(p, attrObj){
				obj.attrsLength.rx.baseVal.updateConvertSVGLen(
					pytha(
					[obj.attrsLength.cx.baseVal.value, obj.attrsLength.cy.baseVal.value],
					[p.point.x, p.point.y] )
				);
				attrObj.rx = obj.attrsLength.rx.baseVal.valueAsString;
				return [ obj.hashSvg , ['rx',attrObj.rx] ];
			};

			ellipse.radY = function(p, attrObj){
				obj.attrsLength.ry.baseVal.updateConvertSVGLen(
					pytha(
					[obj.attrsLength.cx.baseVal.value, obj.attrsLength.cy.baseVal.value],
					[p.point.x, p.point.y] )
				);
				attrObj.ry = obj.attrsLength.ry.baseVal.valueAsString;
				return [ obj.hashSvg , ['ry',attrObj.ry] ];
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
				obj.attrsLength.x1.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.y1.baseVal.updateConvertSVGLen(p.point.y);
				attrObj.x1 = obj.attrsLength.x1.baseVal.valueAsString;
				attrObj.y1 = obj.attrsLength.y1.baseVal.valueAsString;

				return [ obj.hashSvg , ['x1',attrObj.x1] , ['y1',attrObj.y1] ];
			};
			line.y = function(p, attrObj){
				obj.attrsLength.x2.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.y2.baseVal.updateConvertSVGLen(p.point.y); 
				attrObj.x2 = obj.attrsLength.x2.baseVal.valueAsString;
				attrObj.y2 = obj.attrsLength.y2.baseVal.valueAsString;

				return [ obj.hashSvg , ['x2',attrObj.x2] , ['y2',attrObj.y2] ];
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

