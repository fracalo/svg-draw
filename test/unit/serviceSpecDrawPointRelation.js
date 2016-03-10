"use strict";

describe('drawPointRelation',function(){
		var  drawPointRelation, drawData,
			 loc, rem, loc2;
		beforeEach(function(){
			module('draw.path');

			inject(function(_drawData_ , _drawPointRelation_ ){
				 drawData = _drawData_;
				drawPointRelation = _drawPointRelation_;
			});

			//narrow the test on path point relation - drawData.changeNode.pointer.nodeName	
			drawData.changeNode.pointer = { nodeName:'path' }

		});
			describe('simple path nodes relation' , function(){
				beforeEach(function(){
					rem = {
						elemHash: 0,
						index:0,
						pathPointType: "vertex",
						point:{x:  60 ,	y:  141 },
						start:{x: '59', y: '140'},
					};

					loc = {
						elemHash: 0,
						index:1,
						pathPointType: "vertex",
						point:{x:  80 ,	y:  240 },
						relative:{
							index:0
						}
					};
					
					
				});
				it('on org move it should move loc point',function(){
					var res = drawPointRelation.relate(loc, rem);
					expect(res[0]).toBe(81);
					expect(res[1]).toBe(241);
				});
			

			});
			
			describe('absolute command relation with special commands such as H' , function(){
				beforeEach(function(){
					rem = {
						elemHash: 0,
						index:0,
						pathPointType: "vertex",
						point:{x:  60 ,	y:  141 },
						start:{x: '59', y: '140'},
					};

					loc = {
						elemHash: 0,
						index:1,
						pathPointType: "vertex",
						point:{x:  85 ,	y:  140 },
						relative:{
							index:0
						},
						specialPathCom:"H"
					};
					
					
				});
				it('on org move it should move loc point only on vertical axis',function(){
					var res = drawPointRelation.relate(loc, rem);
					expect(res[0]).toBe(85);
					expect(res[1]).toBe(141);
				});
			

			});

			describe('nodes relation with remote move from H command influencing v command' , function(){
				beforeEach(function(){
					rem = {
						elemHash: 0,
						index:1,
						pathPointType: "vertex",
						point:{x:  60 ,	y:  140 },
						start:{x: '59', y: '140'},
						relative:{
							index:0,
							direction:"ver",
							dirIndex:1
						},
					};

					loc = {
						elemHash: 0,
						index:2,
						pathPointType: "vertex",
						point:{x:  59 ,	y:  240 },
						relative:{
							index:0,
							direction:"ver",
							dirIndex:1
						},
						specialPathCom:"v"
					};
					
					
				});
				it('on org move it should move loc point only on vertical axis',function(){
					var res = drawPointRelation.relate(loc, rem);
					expect(res[0]).toBe(60);
					expect(res[1]).toBe(240);
				});

				

			});
			
			describe('nodes relation with remote move from abs command to v command with H command in between' , function(){
				beforeEach(function(){
					rem = {
						elemHash: 0,
						index:1,
						pathPointType: "vertex",
						point:{x:  60 ,	y:  140 },
						start:{x: '59', y: '140'},
						relative:{
							index:0,
							direction:"ver",
							dirIndex:1
						},
					};

					loc = {
						elemHash: 0,
						index:2,
						pathPointType: "vertex",
						point:{x:  59 ,	y:  240 },
						relative:{
							index:0,
							direction:"ver",
							dirIndex:1
						},
						specialPathCom:"v"
					};

					loc2 = {
						elemHash: 0,
						index:2,
						pathPointType: "vertex",
						point:{x:  159 ,	y:  240 },
						relative:{
							index:0,
							direction:"ver",
							dirIndex:1
						},
						specialPathCom:"H"
					};
					
					
				});
				it('on org move it should move loc point only on vertical axis',function(){
					var res = drawPointRelation.relate(loc, rem);
					expect(res[0]).toBe(60);
					expect(res[1]).toBe(240);
				});				
				it('the last point "H" shouldn\'t move',function(){
					var res = drawPointRelation.relate(loc2, rem);
					expect(res[0]).toBe(159);
					expect(res[1]).toBe(240);
				});
			});
			


	



});