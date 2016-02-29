// disassemble factory
(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawDisassemble',drawDisassemble);

	function drawDisassemble(){
		var service = {
			circle  : circle,
			ellipse : ellipse,
			line    : line,
			path    : path,
			polygon : polygon,
			polyline: polyline,
			rect    : rect,
		};
		return service;

		function circle(o){
			var cx = lengthVal('cx',o);
			var cy = lengthVal('cy',o);
			var r  = lengthVal('r',o);

			var center   = (cx && cy)?
			{ hashSvg: o.hashSvg, x: cx ,  y:cy}:
			null;
			var radPoint = (r && center )?
			{ hashSvg: o.hashSvg, x:sum(cx,r)  , y: cy}:
			null;

			return {
				hashSvg   : o.hashSvg,
				pointRappr: [center, radPoint]
			};
		}

		function ellipse(o){
			var cx = lengthVal('cx',o);
			var cy = lengthVal('cy',o);
			var rx = lengthVal('rx',o);
			var ry = lengthVal('ry',o);

			var center    = (cx && cy)?
			{ hashSvg: o.hashSvg, x: cx ,  y: cy}:
			null;
			var radPointX = (rx && center )?
			{ hashSvg: o.hashSvg, x:sum( cx, rx)  , y: cy}:
			null;
			var radPointY = ( ry && center )?
			{ hashSvg: o.hashSvg, x: cx,  y:sum( cy, ry) }:
			null;

			return {
				hashSvg    : o.hashSvg,
				pointRappr: [center, radPointX, radPointY]
			};
		}
		function line(o){
			var x1 = lengthVal('x1',o);
			var x2 = lengthVal('x2',o);
			var y1 = lengthVal('y1',o);
			var y2 = lengthVal('y2',o);

			var x = (x1  &&  y1)?
			{ hashSvg: o.hashSvg, x: x1 , y: y1 }:
			null ;
			var y = (x2  &&  y2)?
			{ hashSvg: o.hashSvg, x: x2 , y: y2 }:
			null ;

			return {
				hashSvg   : o.hashSvg,
				pointRappr: [ x, y ]
			};
		}
		function rect(o){
			var x = lengthVal('x',o);
			var y = lengthVal('y',o);
			var width = lengthVal('width',o);
			var height = lengthVal('height',o);

			var start = (x  &&  y)?
			{ hashSvg: o.hashSvg, x:x , y:y }:
			null ;
			var end = (start && width  &&  height)?
			{ hashSvg: o.hashSvg, x:sum( x, width) , y:sum( y, height) }:
			null ;

			return {
				hashSvg   : o.hashSvg,
				pointRappr: [ start, end ]
			};
		}
		function path(o){
			// since we need to know both absolute point values and
			// specific point type (relative) we'll work on both arrays simultaneously
			// (in order to get V H type points we'll also use normalized array)
 			var normalized = o.item.domObj.getPathData({normalize:true});
 			var abs= o.item.domObj.getPathData({absolutize:true}); 
			var pointsAbs= o.item.domObj.getPathData().reduce((acc, x, i) =>{
				var relativePat = /[a-z]/;
				var relative = !!(x.type.match(relativePat));
				if(x.type === 'h' || x.type === 'H' || x.type === 'v' || x.type === 'V'){
					var oneAxis = (x.type === 'h' || x.type === 'H')? 'horizontal' : 'vertical';
					acc.push({
						hashSvg: o.hashSvg, 
						x: normalized[i].values[0],
						y: normalized[i].values[1],
						pathPointType: 'vertex',
						relative:  true,
						normalized:true,
						oneAxis: oneAxis,
						specialPathCom:x.type
					});
					return acc;	
				}
				if(x.type === 'z' || x.type === 'Z')
					return acc;
				if(o.optional[i].type === 'a' || o.optional[i].type === 'A'){
					acc.push({
						hashSvg: o.hashSvg, 
						x: abs[i].values[abs[i].values.length - 2],
						y: abs[i].values[abs[i].values.length - 1],
						pathPointType: 'vertex',
						relative:relative
					});
					return acc;
				}
				while (abs[i].values.length > 0){
					var res = {
						hashSvg: o.hashSvg,
						x: abs[i].values[0],
						y: abs[i].values[1],
						relative:relative
						
					};
					if(abs[i].values.length === 2){
						res.pathPointType = 'vertex';
					}else{
						res.pathPointType = 'controlPoint';
					}
					acc.push(res);
					abs[i].values.splice(0,2);
				}

				return acc;
			},[]);
			return {
				hashSvg   : o.hashSvg,
				pointRappr: pointsAbs 
			};

		}
		function polygon(o){
			var rawPoints = o.optional;
			var points = [];

			while ( rawPoints && rawPoints.length > 0){
					points.push({
						hashSvg: o.hashSvg, 
						x: Number(rawPoints[0]),
						y: Number(rawPoints[1])
					});
					rawPoints.shift();
					rawPoints.shift();
			}

			return {
				hashSvg   : o.hashSvg,
				pointRappr: points
			};
		}
		function polyline(o){
			return polygon(o);
		}
		

		function sum(a,b){
			return +a + +b;
		}
		function lengthVal(attr,obj){
			return ( obj.item.attrsLength  &&  obj.item.attrsLength[attr] )?
			obj.item.attrsLength[attr].baseVal.value:
			obj.item.attributes[attr];

		}
	}

})();