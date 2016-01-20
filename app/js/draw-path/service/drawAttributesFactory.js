(function(){
	'use strict';
	angular
		.module('draw.path')
		.factory('drawAttributes',drawAttributes);




	function drawAttributes(){
		return {
			basic:basic(),
			present:presentational()
		};
	};

	function basic(){
		return{
			circle:[
				{ prop:'r'} ,
				{ prop:'cy'} ,
				{ prop:'cx'}
			],
			ellipse:[
				{ prop:'rx'} ,
				{ prop:'ry'} ,
				{ prop:'cy'} ,
				{ prop:'cx'}
			],
			line:[
				{ prop:'x1'} ,
				{ prop:'x2'} ,
				{ prop:'y1'} ,
				{ prop:'y2'}
			],
			path:[
				{prop:'d'}
				],
			polygon:[
				{prop:'points'}
			],
			polyline:[
				{prop:'points'}
			],
			rect:[
				{prop:'x'},
				{prop:'y'},
				{prop:'width'},
				{prop:'height'},
				{prop:'rx', renderOpt:true},
				{prop:'ry', renderOpt:true},
			],
		};
	}
	function presentational(){
		return[
			'alignment-baseline',
			'baseline-shift',
			'clip',
			'clip-path',
			'clip-rule',
			'color',
			'color-interpolation',
			'color-interpolation-filters',
			'color-profile',
			'color-rendering',
			'cursor',
			'direction',
			'display',
			'dominant-baseline',
			'enable-background',
			'fill',
			'fill-opacity',
			'fill-rule',
			'filter',
			'flood-color',
			'flood-opacity',
			'font-family',
			'font-size',
			'font-size-adjust',
			'font-stretch',
			'font-style',
			'font-variant',
			'font-weight',
			'glyph-orientation-horizontal',
			'glyph-orientation-vertical',
			'image-rendering',
			'kerning',
			'letter-spacing',
			'lighting-color',
			'marker-end',
			'marker-mid',
			'marker-start',
			'mask',
			'opacity',
			'overflow',
			'pointer-events',
			'shape-rendering',
			'stop-color',
			'stop-opacity',
			'stroke',
			'stroke-dasharray',
			'stroke-dashoffset',
			'stroke-linecap',
			'stroke-linejoin',
			'stroke-miterlimit',
			'stroke-opacity',
			'stroke-width',
			'text-anchor',
			'text-decoration',
			'text-rendering',
			'unicode-bidi',
			'visibility',
			'word-spacing',
			'writing-mode'
		]
	}

})();