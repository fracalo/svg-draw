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
			var points = o.optional.reduce((acc, x) => {
				if(x.type ==='a' || x.type ==='A'){
					acc.push({
						hashSvg: o.hashSvg, 
						x: x.args[x.args.length - 2],
						y: x.args[x.args.length - 1],
					});
					return acc;
				}
				//else
				while (x.args.length > 0){
					acc.push({
						hashSvg: o.hashSvg, 
						x: x.args[0],
						y: x.args[1]
					});
					x.args.shift();
					x.args.shift();
				}

				return acc;

			} , [] );

			return {
				hashSvg   : o.hashSvg,
				pointRappr: points
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