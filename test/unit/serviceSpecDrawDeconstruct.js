"use strict";

describe('drawDeconstructFactory',function(){
	var drawDeconstruct ,
		pipedArgForElement;

	beforeEach(function(){
		module('draw.path');

		inject(function(_drawDeconstruct_){
			drawDeconstruct = _drawDeconstruct_;
		});
	});


	it(' method parseBasic ',function(){

		pipedArgForElement = [
						{
							propertyCheck: 'cy',
							item:{
								nodeName: 'circle',
								hashSvg: 1,
								attributes: {
									cx   :44,
									cy   :55,
									r    :9
								},
								childNodes: []
							}
						},


					];
		drawDeconstruct.parseBasic(pipedArgForElement);
		expect(drawDeconstruct.structure[1][0]).toEqual( { hashSvg: 1, x : 44, y : 55 });
	});

	it(' should find wrong length values ',function(){
		pipedArgForElement = [
						{
							propertyCheck: 'cx',
							item:{
								nodeName: 'circle',
								hashSvg: 1,
								attributes: {
									cx   :'44e',
									cy   :55,
									r    :9
								},
								childNodes: []
							}
						},];
		 expect(drawDeconstruct.parseBasic(pipedArgForElement)[0]).toEqual(
		 	{
		 		property:'cx',
		 		valid   :false,
		 		reason  :'invalid length: 44e',
		 		hashSvg :1
		 	});
		
	});

	it(' should find wrong d values (alien charac.)',function(){
		pipedArgForElement = [
						{
							propertyCheck: 'd',
							item:{
								nodeName: 'path',
								hashSvg: 1,
								attributes: {
									d:'M0 0 C-12,22x'
								},
								childNodes: []
							}
						},];
		 expect(drawDeconstruct.parseBasic(pipedArgForElement)[0]).toEqual(
		 	{
		 		property:'d',
		 		valid   :false,
		 		reason  :'invalid point value char.: x',
		 		hashSvg :1
		 	});
		
	});

	it(' should find wrong d values (unmatched part of string)',function(){
		pipedArgForElement = [
						{
							propertyCheck: 'd',
							item:{
								nodeName: 'path',
								hashSvg: 1,
								attributes: {
									d:'M-11 0 C-12,22mh'
								},
								childNodes: [],
								}
							}
						];
		 expect(drawDeconstruct.parseBasic(pipedArgForElement)[0]).toEqual(
		 	{
		 		property:'d',
		 		valid   :false,
		 		reason  :'problems with char.: m,h in your \'d\' value',
		 		hashSvg :1
		 	});
		
	});
	it(' should find wrong d values (checks each command )',function(){
		pipedArgForElement = [
						{
							propertyCheck: 'd',
							item:{
								nodeName: 'path',
								hashSvg: 1,
								attributes: {
									d:'M-11 0 C-12,22'
								},
								childNodes: []
							}
						},];
		 expect(drawDeconstruct.parseBasic(pipedArgForElement)[0].valid).toBe(false)
		 expect(drawDeconstruct.parseBasic(pipedArgForElement)[0].hashSvg).toBe( 1 )
	});

	it(' should parse "points" ',function(){
		pipedArgForElement = [
						{
							propertyCheck: 'points',
							item:{
								nodeName: 'polygon',
								hashSvg: 1,
								attributes: {
									points:'30 50 0 1 1 162.55 162.45 50  ,0 -5.0 '
								},
								childNodes: []
							}
						},];
			var res = drawDeconstruct.parseBasic(pipedArgForElement);
		 	expect(res[0].valid).toBe(true)
		    expect(drawDeconstruct.structure[1][0]).toEqual( { hashSvg: 1, x : 30, y : 50 });
	});

});