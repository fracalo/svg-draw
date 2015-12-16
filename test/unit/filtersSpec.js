'use strict';

/* jasmine specs for filters go here */

describe('filter', function() {
	
	beforeEach(module('svgFiddle'));

	var $filter;


	beforeEach(inject(function(_$filter_){
		$filter= _$filter_;
	}));

/*	describe('attrsToMarkup',function(){

		it('converts dVal attrsToMarkup',function(){
			var f = $filter('attrsToMarkup');
			expect(f('m22 22')).toEqual('<path d="m22 22" ></path>')
		})
	});*/

    describe('attrsToMarkup',function(){
    	it('converts all path attributes in correct markup',function(){
    		var data = {
				   d:'M301 134 L460 149',
				   fill :'rgba(222,0,222,0.5)',
				   stroke :'green'
						/*strokeWidth:5,*/
				   
				  };
   			var f = $filter('attrsToMarkup');
   			expect(f(data)).toEqual('<path d="M301 134 L460 149" '+
   			'fill="rgba(222,0,222,0.5)" stroke="green" ></path>');

    	})
    })

	describe('dValToArray',function(){
		it('converts dvalue into array of points', function(){
			var f = $filter('dValToArray');
			expect(f('M33 33').length).toBe( 1 );
			expect(f('M33 33')[0].type).toBe('M' );
			expect(f('M33 33')[0].list[0]).toEqual( [33,33] );
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

	 });

	describe('normalizePointType', function(){
		var f,test;

		beforeEach(function(){
			f= $filter('normalizePointType');
			test=[
				{
					type:'M',
					list:[ [41,42] ]
				},
				{
					type:'C',
					list:[ [11,12],[13,14],[15,16] ] 
				},
				{
					type:'L',
					list:[ [21,22] ] 
				}
				];

		});

		it('with point.type== L || M , it leaves just one item(the last) in point.list ',function(){

			test[1].type='L';

			expect( f(test)[1].list.length ).toBe(1);
			expect( f(test)[1].list[0][0] ).toEqual(15)
		});

		it('with point.type== Q, it leaves just two item in point.list ',function(){

			test[1].type='Q';

			expect( f(test)[1].list.length ).toBe(2);
			expect( f(test)[1].list[0] ).toEqual([13,14])
		});

		it('with point.type== Q, it will add a point if needed ',function(){

			test[2].type='Q';

			expect( f(test)[2].list.length ).toBe(2);
			expect( f(test)[2].list[0] ).toEqual([18,19])
		});
		it('with point.type== C, it can add 1 or 2 points if needed ',function(){

			test[2].type='C';

			expect( f(test)[2].list.length ).toBe(3);
		});


	 })


});
