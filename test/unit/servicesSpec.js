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
		}
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



})
