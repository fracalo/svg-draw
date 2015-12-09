'use strict';

/* jasmine specs for filters go here */

describe('filter', function() {
	
	beforeEach(module('svgFiddle'));

	var $filter;


	beforeEach(inject(function(_$filter_){
		$filter= _$filter_;
	}));

	describe('attrsToMarkup',function(){

		it('converts dVal attrsToMarkup',function(){
			var f = $filter('attrsToMarkup');
			expect(f('m22 22')).toEqual('<path d="m22 22" ></path>')
		})
	});

	describe('dValToArray',function(){
		it('converts dvalue into array of points', function(){
			var f = $filter('dValToArray');
			expect(f('M33 33').length).toBe( 1 );
			expect(f('M33 33')[0].type).toBe('M' );
			expect(f('M33 33')[0].list[0]).toEqual( [33,33] );
			 // expect(f('M0 0,33 33 L44 11.2')).toBe( [ [[0,0], [33,33]], [[44,11]] ] );
		})

	});

	// describe('arrayToSVG',function(){
	// 	it('converts an array to SVG dValue',function(){
	// 		expect( $filter('arrayToSVG')([[32,45],[1,56]]) ).toEqual('M32 45 L1 56Z') 
	// 	})
	// });

	describe('arrayToDVal', function(){
		it('converts an array to dValue',function(){
			var f= $filter('arrayToDVal');
			var test=[
				{ list:[ [41,42] ] },
				{ list:[ [11,12],[13,14],[15,16] ] }
				];
				test[0].type='M';
				test[1].type='C';
			expect( f(test) ).toEqual('M41 42 C11 12,13 14,15 16')
		});

	 })


});
