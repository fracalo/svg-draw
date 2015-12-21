'use strict';

/* jasmine specs for services go here */

describe('service', function() {
	var artboard;

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
		module('svgFiddle');

		inject(function(_artboard_){
			artboard = _artboard_;
		});


	});


	it('should have a method named "mousedown"',function() {
		expect(angular.isFunction(artboard.mousedown)).toBeTruthy
	});



	it('should populate the array with one item for every click',function(){

		expect(artboard.points.length).toBe(0);

		//need to sadisfy condition for FF support otherwise karma complaints for
		//boundClientRect = undefined
		e.target.offsetLeft = undefined;

		//adding a point an releasing in same point will add just one point;
		artboard.mousedown(e);
		artboard.mouseupLine(e);


		expect(artboard.points.length).toBe(1);

		expect(artboard.points[0]).toEqual(
		{type:'M',list:[[90,190]] }
		)
		//expect(artboard.points).toContain([90,190]);

	});
it('should populate the array with an Fragment "L" on second mouseup an mousedown are distant (from the second point)',function(){

		expect(artboard.points.length).toBe(0);

		//need to sadisfy condition for FF support otherwise karma complaints for
		//boundClientRect = undefined
		e.target.offsetLeft = undefined;

		//adding a point an releasing in same point will add just one point;
		artboard.mousedown(e);
		artboard.mouseupLine(e);

		//second point like click(nodrag) ['type') is "L"
		artboard.mousedown(e2);
		artboard.mouseupLine(e2);
		
		expect(artboard.points[1].type).toEqual('L')



		

	});
it('should populate the array with an Fragment "Q" when mouseup an mousedown(if no drag occurs)',function(){

		expect(artboard.points.length).toBe(0);

		//need to sadisfy condition for FF support otherwise karma complaints for
		//boundClientRect = undefined
		e.target.offsetLeft = undefined;

		//adding a point an releasing in same point will add just one point;
		artboard.mousedown(e);
		artboard.mouseupLine(e);

		// second point - dragging creates a fragment "Q"
		artboard.mousedown(e2);
		artboard.mousemove(e);
		expect(artboard.points[1].type).toEqual('Q')



		

	});


	it('should set points array through setter setPoints(a)',function(){
		var testArray={type:'C', list:[ [22,33],[34,42],[66,88] ] };
		artboard.setPoints(testArray);
		expect(artboard.points).toEqual(testArray);


	})

	describe('vectors method',function(){
			beforeEach(function(){		
				var test=[
				{
					type:'M',
					list:[ [41,42] ]
				},
				{
					type:'Q',
					list:[ [11,12],[13,14] ] 
				},
				{
					type:'L',
					list:[ [21,22] ] 
				},
				{
					type:'C',
					list:[ [11,12],[13,14],[15,16] ] 
				}
				];

				artboard.setPoints(test);
	

			});

			it('should get the vectors',function(){
				/*var res=[ arr[i-1].list[arr[i-1].list.length-1] , x.list[0] ],
						[ x.list[0] , x.list[1] ]*/
				expect(artboard.vectors()).toEqual( [
					 [ [41,42],[11,12] ] , [ [11,12],[13,14] ] ,   //first point vectors
				     [ [21,22],[11,12] ] , [ [13,14],[15,16] ]    //second point vector
				  ] )
			})
	})

});
