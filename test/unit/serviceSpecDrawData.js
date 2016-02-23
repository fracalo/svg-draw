"use strict";

describe('drawData',function(){
	var drawData, node;
		beforeEach(function(){
		module('draw.path');

		inject(function(_drawData_){
			drawData = _drawData_;

		});

		drawData.node = [
							{
							 nodeName :'g',
							 hashSvg: 0,
							 attributes: {},
							 childNodes:[
										 {
										 nodeName :'circle',
										 hashSvg: 1,
										 attributes: {
													cx   : 11,
											        cy   : 12,
											        r    : 3,
											        fill : 'blue'
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
		expect(drawData.node[0].childNodes[0].attributes.test).toBe('just checking');
	});



		describe('setNode method',function(){
			var node;
			var str ="<g><circle cy=12 cx=11 r=3 fill='blue' /></g><ellipse cx=21 cy =22 rx =3 ry=3 /><path stroke=black d='M0 0 L111 111'  />";
			beforeEach(function(){
					node = [
							{
							 nodeName :'g',
							 hashSvg: 0,
							 attributes: {},
							 childNodes:[
										 {
										 nodeName :'circle',
										 hashSvg: 1,
										 attributes:[
													{name:'cx'  , value : 11	},
											        {name:'cy'  , value : 12	},
											        {name:'r'   , value : 3 	},
											        {name:'fill',value : 'blue'	}
										 			],
										 childNodes:[]
										}
							 ]
							},
							{
							 nodeName :'ellipse',
							 hashSvg: 2,
							 attributes: [
									 	{name:'cx'  , value : 21},
								        {name:'cy'  , value : 22},
								        {name:'rx'  , value : 3 },
								        {name:'ry'  , value : 3 },
									 	],
							 childNodes:[]
							},
							{
							 nodeName :'path',
							 hashSvg: 3,
							 attributes: [
									 	{name:'stroke'  , value : 'black'},
								        {name:'d'  , value : 'M0 0 L111 111'},
									 	],
							 childNodes:[]
							},

						];
			
				drawData.setNode(node,str);
			})
			it('should set a string',function(){
				expect(drawData.string).toBe(str)
			});
			it('should add a property to each elem with position of attribute ( attrsStringRef ) ', function(){
				
	//console.log(drawData.node[0].childNodes[0].attrsStringRef)
				expect(drawData.node[0].childNodes[0].attrsStringRef.cx.start).toBe(20)
				expect(drawData.node[0].childNodes[0].attrsStringRef.cx.end).toBe(22)
				expect(drawData.node[0].childNodes[0].attrsStringRef.fill.start).toBe(33)
				expect(drawData.node[0].childNodes[0].attrsStringRef.fill.end).toBe(37)
			});

		});

		describe('setNode method setting attribute str lenght for \'points\' ',function(){
			var node;
			var str ='<polygon points="100 200  200 100, 300 200 400 100" stroke="black" fill="none" stroke-width="5">';
			beforeEach(function(){
					node = [
							{
							 nodeName :'polygon',
							 hashSvg: 0,
							 attributes:[
										{name:'points'  	, value : "100 200  200 100, 300 200 400 100"	},
								        {name:'stroke'  	, value : "black"	},
								        {name:'fill'		, value : 'none'	},
								        {name:'stroke-width', value : '5'	}
							 			],
							 childNodes:[]
							}
						];
			
				drawData.setNode(node,str);
			})
			it(' should add subproperty to the attrsStringRef  each point (ex.:   0: {x: {start:22, end:33}, y: {start:22, end:33} },) ', function(){
				
				 expect(drawData.node[0].attrsStringRef.points[0].x.start).toBe(0)
				 expect(drawData.node[0].attrsStringRef.points[0].x.end).toBe(3)
				 expect(drawData.node[0].attrsStringRef.points[0].y.start).toBe(4)
				 expect(drawData.node[0].attrsStringRef.points[0].y.end).toBe(7)

 				 expect(drawData.node[0].attrsStringRef.points[1].x.start).toBe(9)

				
			});

		});

		describe('setNode method setting attribute str lenght for "d" ',function(){
			var node;
			var str ='<path d="M100.3  200 C200 100, 300 200 400 100" stroke="black" fill="none" stroke-width="5">';
			beforeEach(function(){
					node = [
							{
							 nodeName :'path',
							 hashSvg: 0,
							 attributes:[
										{name:'d'  			, value : "M100.3  200 C200 100, 300 200 400 100"	},
								        {name:'stroke'  	, value : "black"	},
								        {name:'fill'		, value : 'none'	},
								        {name:'stroke-width', value : '5'	}
							 			],
							 childNodes:[]
							}
						];
			
				drawData.setNode(node,str);
			})
			it(' should add subproperty to the attrsStringRef  each value in command', function(){
				
				  expect(drawData.node[0].attrsStringRef.d[0][0].start).toBe(1);
				  expect(drawData.node[0].attrsStringRef.d[0][0].end).toBe(6);
				 
				  expect(drawData.node[0].attrsStringRef.d[1][0].start).toBe(13);
				  expect(drawData.node[0].attrsStringRef.d[1][1].start).toBe(17);
				
			});
		});
		describe('setNode method setting attribute str lenght for "d" with negative ',function(){
			var node;
			var str ='<path d="M100.3  200 c-20 100, 300 200 400 100" stroke="black" fill="none" stroke-width="5">';
			beforeEach(function(){
					node = [
							{
							 nodeName :'path',
							 hashSvg: 0,
							 attributes:[
										{name:'d'  			, value : "M100.3  200 c-20 100, 300 200 400 100"	},
								        {name:'stroke'  	, value : "black"	},
								        {name:'fill'		, value : 'none'	},
								        {name:'stroke-width', value : '5'	}
							 			],
							 childNodes:[]
							}
						];
			
				drawData.setNode(node,str);
			})
			it(' should add subproperty to the attrsStringRef  each value in command', function(){
				
				  expect(drawData.node[0].attrsStringRef.d[0][0].start).toBe(1)
				  expect(drawData.node[0].attrsStringRef.d[0][0].end).toBe(6)
				 
				  expect(drawData.node[0].attrsStringRef.d[1][0].start).toBe(13);
				  expect(drawData.node[0].attrsStringRef.d[1][1].start).toBe(17);

				
			});

		});

		



});