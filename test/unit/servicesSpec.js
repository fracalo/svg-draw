'use strict';


describe('service', function() {
	var drawService;

	var e ={    //event simulation
			pageX: 100,
			pageY: 200,
			target :{
				offsetLeft: 10,
				offsetTop:  10,
				getBoundingClientRect:getBoundingClient
			},
			
	};
	var e2 ={    //event simulation 2
			pageX: 100,
			pageY: 300,
			target :{
				offsetLeft: 10,
				offsetTop:  10,
				getBoundingClientRect:getBoundingClient,
			},

	};
	function getBoundingClient(){
		return {
			left:10,
			top:10
		};
	}

	beforeEach(function(){
		module('draw.path');

		inject(function(_drawService_){
			drawService = _drawService_;
		});


	});


	it('should have a method named "mousedown"',function() {
		expect(angular.isFunction(drawService.mousedown)).toBeTruthy
	});



	it('should populate the array with one item for every click',function(){

		expect(drawService.points.length).toBe(0);

		//need to sadisfy condition for FF support otherwise karma complaints for
		//boundClientRect = undefined
		e.target.offsetLeft = undefined;

		//adding a point an releasing in same point will add just one point;
		drawService.mousedown(e);
		drawService.mouseupLine(e);


		expect(drawService.points.length).toBe(1);

		expect(drawService.points[0]).toEqual(
		{type:'M',list:[[90,190]] }
		);
		//expect(drawService.points).toContain([90,190]);

	});
it('should populate the array with an Fragment "L" on second mouseup an mousedown are distant (from the second point)',function(){

		expect(drawService.points.length).toBe(0);

		//need to sadisfy condition for FF support otherwise karma complaints for
		//boundClientRect = undefined
		e.target.offsetLeft = undefined;

		//adding a point an releasing in same point will add just one point;
		drawService.mousedown(e);
		drawService.mouseupLine(e);

		//second point like click(nodrag) ['type') is "L"
		drawService.mousedown(e2);
		drawService.mouseupLine(e2);
		
		expect(drawService.points[1].type).toEqual('L');



		

	});
it('should populate the array with an Fragment "Q" when mouseup an mousedown(if no drag occurs)',function(){

		expect(drawService.points.length).toBe(0);

		//need to sadisfy condition for FF support otherwise karma complaints for
		//boundClientRect = undefined
		e.target.offsetLeft = undefined;

		//adding a point an releasing in same point will add just one point;
		drawService.mousedown(e);
		drawService.mouseupLine(e);

		// second point - dragging creates a fragment "Q"
		drawService.mousedown(e2);
		drawService.mousemove(e);
		expect(drawService.points[1].type).toEqual('Q')

	});


	it('should set points array through setter setPoints(a)',function(){
		var testArray={type:'C', list:[ [22,33],[34,42],[66,88] ] };
		drawService.setPoints(testArray);
		expect(drawService.points).toEqual(testArray);


	})

	describe('drawService.rawPoints()',function(){

		it('should return an array of objects rappreseting rawPoints',function(){
			var test = [
			{type:'M', list:[ [0,1] ] },
			{type:'C', list:[ [22,33],[34,42],[66,88] ] }
			]
			expect(drawService.rawPoints(test)).toEqual(
				[	{x:0,y:1},
					{x:22,y:33},
					{x:34,y:42},
					{x:66,y:88}		]
				);

		})
	})
	
});

describe('service exception',function(){
	var exception;
		beforeEach(function(){
		module('draw.path');

		inject(function(_exception_){
			exception = _exception_;
		});
	});

	it('should add errors to a private list',function(){
		var err = 'you got hacked';

		exception.setError(err);

		expect(exception.getError()).toEqual(err)
	})



});


describe('drawData',function(){
	var drawData, node;
		beforeEach(function(){
		module('draw.path');

		inject(function(_drawData_){
			drawData = _drawData_;

		});

		drawData.node =  [
							{
							 nodeName :'g',
							 hashSvg: 0,
							 attributes: {},
							 childNodes:[
										 {
										 nodeName :'circle',
										 hashSvg: 1,
										 attributes: {
													cx   :11,
											        cy   :12,
											         r    :3
										 			},
										 childNodes:[]
										}
							 ]
							},
							{
							 nodeName :'ellipse',
							 hashSvg: 2,
							 attributes: {
							 	cx   :21,
						        cy   :22,
					         	rx    :3,
					     		ry    :3
					     		},
							 childNodes:[]
							},
						];
	});

	it('flatNodelist should make a flat list which points to correct object',function(){
		var res=drawData.flatNodeList();
		expect(res.length).toBe(3);

		res[1].attributes.test = 'just checking';

		expect(drawData.node[0].childNodes[0].attributes.test).toBe('just checking')


		
	})



})
describe('drawValidation',function(){
	var drawValidation, drawData,scope ;
		beforeEach(function(){
			module('draw.path');

			inject(function(_drawValidation_,_drawData_){
				drawValidation = _drawValidation_;
				drawData = _drawData_;
			});

			drawValidation.list =[
	            {error:'first'},
	            {error:'second'},
			];
		});

	it('should remove through deleteError mthod ',function(){
		drawValidation.deleteError(0);
		expect(drawValidation.list.length).toBe(1),
		expect(drawValidation.list[0].error).toBe('second')
	});

	it('should check the drawData.node for errors',function(){
		drawData.node =  [
									{
									 nodeName :'g',
									 hashSvg: 0,
									 attributes: {},
									 childNodes:[
												 {
												 nodeName :'circle',
												 hashSvg: 1,
												 attributes: {
															cx   :11,
													        cy   :12,
													         /*r    :3*/
													        fill : 'red',
													        strike:'blue'
												 			},
												 childNodes:[]
												}
									 ]
									},
									{
									 nodeName :'ellipse',
									 hashSvg: 2,
									 attributes: {
									 	cx   :21,
								        cy   :22,
							         	/*rx    :3*/
							     		/*ry    :3*/
							     		},
									 childNodes:[]
									},

								];
		drawValidation.checkExc();
		expect(drawValidation.list.basic.length).toBe(3);
		expect(drawValidation.list.presentational.length).toBe(1);
		expect(drawValidation.list.presentational[0]).toEqual(
		{
	        issue:'strike',
	        type:' not presentational attribute',
	        hashEl: 1
	    });
	

	})





});

describe('drawDeconstructFactory',function(){
	var drawDeconstruct;

	var pipedArgForElement = [
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
						// {
						// 	propertyCheck: 'cx',
						// 	item:{
						// 		nodeName: 'circle',
						// 		hashSvg: 1,
						// 		attributes: {
						// 			cx   :44,
						// 			cy   :55,
						// 			r    :9
						// 		},
						// 		childNodes: []
						// 	}
						// },

					];

	beforeEach(function(){
		module('draw.path');

		inject(function(_drawDeconstruct_){
			drawDeconstruct = _drawDeconstruct_;
		});
	});

	it(' method parseBasic ',function(){
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
								childNodes: []
							}
						},];
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
	it(' should find wrong d values (checks each command )',function(){
		pipedArgForElement = [
						{
							propertyCheck: 'd',
							item:{
								nodeName: 'path',
								hashSvg: 1,
								attributes: {
									d:'M500 88 a 30 50 0 1 1 162.55 162.45 ,c    50  ,0 -5.0 100     , -1.100 ,100 50,0 50 ,   100 100,100z'
								},
								childNodes: []
							}
						},];
			var res = drawDeconstruct.parseBasic(pipedArgForElement);
		 	expect(res[0].valid).toBe(true)
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

// drawDisassemble is a utility for the drawDeconstruct service;
// svg-elements basic attributes(the ones that influence dimension and position)
// are transformed into an array of points stored in drawDeconstruct.structure
describe('drawDisassemble',function(){
	var drawDisassemble;
	beforeEach(function(){
		module('draw.path');

		inject(function(_drawDisassemble_){
			drawDisassemble =_drawDisassemble_;
		});
	});

		describe( 'circle method',function(){
			var pipedObj;
			beforeEach(function(){
						pipedObj = {
							hashSvg:55,
							item:{
								attributes:{
									cx:22,
									cy:33,
									r:4
								}
							}
						};
			});

			it('should parse it to..',function(){
				var res = drawDisassemble.circle(pipedObj);
				expect(res.hashSvg).toBe(55);
				expect(res.pointRappr).toEqual(
					[
						{x:22,y:33,hashSvg:55},
						{x:26,y:33,hashSvg:55},
					]
				);
			})
		});
		//polygon |point value -- 
		describe( 'polygon method',function(){
			var pipedObj , res ;
			beforeEach(function(){
						pipedObj = {
							hashSvg:2,
							item:{
								attributes:{
									points:'11 11 22 22 33 11'
								}
							},
							optional:['11', '11', '22', '22', '33', '11']
						};
			});

			it('should parse it to..',function(){
				res = drawDisassemble.polygon(pipedObj);
				expect(res.hashSvg).toBe(2);
				expect(res.pointRappr).toEqual(
					[
						{hashSvg:2,x:11,y:11},
						{hashSvg:2,x:22,y:22},
						{hashSvg:2,x:33,y:11},
					]
				);
			})
		});

	
});
