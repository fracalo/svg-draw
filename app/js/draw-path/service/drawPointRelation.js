// directive for checking point realtion during event pointMove
// and eventually react
(function(){
	'use strict';
	angular
		.module('draw.path')
		.factory('drawPointRelation',drawPointRelation);

		drawPointRelation.$inject = ['drawData'];

		function drawPointRelation (drawData){
			return{
				relate:relate,
			};

			function relate(loc,rem){
				//if it's not the same elem || it's the same point we stop
				if(  loc.elemHash !== rem.elemHash ||
					(loc.elemHash === rem.elemHash && loc.index === rem.index) )
				return;

				relate.circle = function(l,r){
					//only cause of a point influencing another point is if it's center
					if( r.index !== 0)
					return; 

					return [ 
						l.point.x + (r.point.x - r.start.x),
						l.point.y + (r.point.y - r.start.y)
					];
				};

				relate.ellipse = relate.circle;
				relate.rect = relate.circle;

				relate.path = function(l,r){
					if(r.pathPointType === 'controlPoint')
					return;
					if(r.index > l.index){
					return;}
					if(!l.relative)
					return;
				
					return [ 
						l.point.x + (r.point.x - r.start.x),
						l.point.y + (r.point.y - r.start.y)
					];
					
				}

				if(relate[drawData.changeNode.pointer.nodeName])
				return relate[drawData.changeNode.pointer.nodeName](loc,rem);
				
			}


		}
})();