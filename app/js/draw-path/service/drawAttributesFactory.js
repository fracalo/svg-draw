(function(){
	'use strict';
	angular
		.module('draw.path')
		.factory('drawAttributes',drawAttributes);

	function drawAttributes(){
		return {
			circle:{
				spec:[
				{ prop:'r'} ,
				{ prop:'cy'} ,
				{ prop:'cx'}
				],
			},
			ellipse:{
				spec:[
				{ prop:'rx'} ,
				{ prop:'ry'} ,
				{ prop:'cy'} ,
				{ prop:'cx'}
				],
			},
			line:{
				spec:[
				{ prop:'x1'} ,
				{ prop:'x2'} ,
				{ prop:'y1'} ,
				{ prop:'y2'}
				],
			},
			path:{
				spec:[
				{prop:'d'}
				]
			},
			polygon:{
				spec:[
				{prop:'points'}
				]
			},
			polyline:{
				spec:[
				{prop:'points'}
				]
			},
			rect:{
				spec:[
				{prop:'x'},
				{prop:'y'},
				{prop:'width'},
				{prop:'height'},
				{prop:'rx', renderOpt:true},
				{prop:'ry', renderOpt:true},
				 ]
			}

		};
	}
})();