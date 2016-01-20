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
		)
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
		
		expect(drawService.points[1].type).toEqual('L')



		

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

describe('drawDataFactory',function(){
	var drawDataFactory;
		beforeEach(function(){
		module('draw.path');

		inject(function(_drawDataFactory_){
			drawDataFactory = _drawDataFactory_;
		});
	});

	it('should ',function(){
		
	})



})
describe('drawExceptFactory',function(){
	var drawExceptFactory, drawDataFactory,scope ;
		beforeEach(function(){
			module('draw.path');

			inject(function(_drawExceptFactory_,_drawDataFactory_,$rootScope){
				drawExceptFactory = _drawExceptFactory_;
				drawDataFactory = _drawDataFactory_;
				scope = $rootScope
			});

			drawExceptFactory.list =[
	            {error:'first'},
	            {error:'second'},
			];
			scope.$digest();
		});

	it('should remove through deleteError mthod ',function(){
		drawExceptFactory.deleteError(0);
		expect(drawExceptFactory.list.length).toBe(1),
		expect(drawExceptFactory.list[0].error).toBe('second')
	});

	it('should check the drawDataFactory.node for errors',function(){
		drawDataFactory.node =  [
									{
									 nodeName :'g',
									 hashSvg: 0,
									 attributes: {},
									 childNodes:[
												 {
												 nodeName :'circle',
												 hashSvg: 1,
												 attributes: {
															cx   :44,
													        cy   :55,
													         /*r    :3*/
												 			},
												 childNodes:[]
												}
									 ]
									},
									{
									 nodeName :'ellipse',
									 hashSvg: 2,
									 attributes: {
									 	cx   :44,
								        cy   :55,
							         	/*rx    :3*/
							     		/*ry    :3*/
							     		},
									 childNodes:[]
									},

								];
	drawExceptFactory.checkExc();
	expect(drawExceptFactory.list.length).toBe(3);
	

	})





})
