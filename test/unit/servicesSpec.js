'use strict';

/* jasmine specs for services go here */

describe('service', function() {
	var artboard;

	var e ={    //event simulation
			clientX: 100,
			clientY: 200,
			target :{
				offsetLeft: 10,
				offsetTop:  10
			}
	};
	var e2 ={    //event simulation 2
			clientX: 100,
			clientY: 300,
			target :{
				offsetLeft: 10,
				offsetTop:  10
			}
	};

	beforeEach(function(){
		module('svgFiddle');

		inject(function(_artboard_){
			artboard = _artboard_;
		})
	});

	it('should have a method named "mousedown"',function() {
		expect(angular.isFunction(artboard.mousedown)).toBeTruthy
	});



	it('should populate the array with one item for every click',function(){

		expect(artboard.points.length).toBe(0);

		//adding a point an releasing in same point will add just one point;
		artboard.mousedown(e);
		artboard.mouseupLine(e)


		expect(artboard.points.length).toBe(1);
		//expect(artboard.points).toContain([90,190]);

	});

	it('should set points array through setter setPoints(a)',function(){
		var testArray=[[11,12],[31,32],[44,42]];
		artboard.setPoints(testArray);
		expect(artboard.points).toEqual(testArray);


	})

});
