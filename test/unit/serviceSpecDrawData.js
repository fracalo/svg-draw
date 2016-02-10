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

		describe('strSplice() utility', function(){
				var n, a;
			beforeEach(function(){
				drawData.string = "<circle cy=99 cx=99 r=3 fill='blue' />";
				n = {
					 nodeName :'circle',
					 hashSvg: 0,
					 attributes: {
								cx   : 99,
						        cy   : 99,
						        r    : 3,
						        fill : 'blue'
					 			},
					 childNodes:[],
					 attrsStringRef:{
								cx   : {start: 17, end: 19},
						        cy   : {start: 11, end: 13},
						        fill : {start: 30, end: 34},
						        r    : {start: 22, end: 23}
					 			},
				};
				a = [0,['cy','100']];
				drawData.stringUpdate = function(res){
					var elObj= n/*pointTo.o[res[0]] mocked */;
					var vals = res.splice( 1 ) ;
					vals.forEach(x=>{
						// x : ['cx',33]
					drawData.string = drawData.strSplice(
										drawData.string,
										elObj.attrsStringRef[x[0]].start , 
										elObj.attrsStringRef[x[0]].end   ,
										x[1]
									);
					});
				}

			});

			it('should adjust string if the subtitution in strSplice function changes length',function(){

				drawData.stringUpdate(a);
				expect(drawData.string).toBe( "<circle cy=100 cx=99 r=3 fill='blue' />" )
				


				a= [0,['cx','77']];
				drawData.stringUpdate(a);
				expect(drawData.string).toBe( "<circle cy=100 cx=77 r=3 fill='blue' />" )
				
				a= [0,['cx','1776']];
				drawData.stringUpdate(a);
				expect(drawData.string).toBe( "<circle cy=100 cx=1776 r=3 fill='blue' />" )
				
				a= [0,['cx','555']];
				drawData.stringUpdate(a);
				expect(drawData.string).toBe( "<circle cy=100 cx=555 r=3 fill='blue' />" )
				
				a= [0, ['r','3em'] , ['fill','red'] , ['cy',1]];
				drawData.stringUpdate(a);
				expect(drawData.string).toBe( "<circle cy=1 cx=555 r=3em fill='red' />" )
				
			})

		})
	



});