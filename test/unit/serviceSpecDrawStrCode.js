"use strict";

ddescribe('drawStrCode',function(){
		var drawStrCode, n, a;
		beforeEach(function(){
			module('draw.path');

			inject(function(_drawStrCode_){
				drawStrCode = _drawStrCode_;
			});	
		});
		describe('.update on  path (after preupdating inside drawAssemble)',function(){

			var n, a, str, drawAssemble;
				
				beforeEach(function(){
				
				inject(function(_drawAssemble_){
					drawAssemble= _drawAssemble_;
				});
					str = '<path d="M70 10  v22 h22" />';

					n = {
						 nodeName :'path',
						 hashSvg: 0,
						 attributes: {
							        d	  : 'M70 10  v22 h22'
						 			},
						 childNodes:[],
						 attrsStringRef:{
									d    	: {
											start: 9,
											end: 24,
											0   : {
													0:{start: 1, end: 3},
													1:{start: 4, end: 6},
													start: 0,
													end: 8
												  },
											1	: {
													0:{start: 9, end: 11},
													start: 8,
													end: 12
												  },
											2	: {
													0:{start: 13, end: 15},
													start: 12,
													end: 15
												  }
											},
									
						 			},
						 domObj:{

						 }
					};

				});


				it('should do a preupdate before update' ,function(){

					var pointByI= {x: 1, comI: 1, command: "v", subI: 0};
					expect( drawStrCode.preUpdateD( n , pointByI ,	[ [pointByI.subI * 2 , pointByI.x]  ]) )
					.toBe(  n.attributes.d = 'M70 10  v1 h22');
					expect( drawStrCode.update(n,str,[ ['d',n.attributes.d] ] )  )
					.toBe( str = '<path d="M70 10  v1 h22" />') ;
					
					var pointByI= {x: 101111, y:3,  comI: 0, command: "M", subI: 0};
					expect( drawStrCode.preUpdateD( n , pointByI ,	[ [pointByI.subI * 2 , pointByI.x] ,  [pointByI.subI * 2 + 1 , pointByI.y]  ]) )
					.toBe(  n.attributes.d = 'M101111 3  v1 h22');
					expect( drawStrCode.update(n,str,[ ['d',n.attributes.d] ] )  )
					.toBe( str = '<path d="M101111 3  v1 h22" />') ;
/*
<path d="M70 10  v22 h22" />
M70 10  v22 h22

M101111 3  v1 h22
M101111 3  v1 h-333
*/
					var pointByI= {x: -333, comI: 2, command: "h", subI: 0};
					expect( drawStrCode.preUpdateD( n , pointByI ,	[ [pointByI.subI * 2 , pointByI.x]   ]) )
					.toBe(  n.attributes.d = 'M101111 3  v1 h-333');
					
					expect( drawStrCode.update(n,str,[ ['d',n.attributes.d] ] )  )
					.toBe( str = '<path d="M101111 3  v1 h-333" />') ;

					var pointByI= {x: -11, y:111,  comI: 0, command: "M", subI: 0};
					expect( drawStrCode.preUpdateD( n , pointByI ,	[ [pointByI.subI * 2 , pointByI.x] ,  [pointByI.subI * 2 + 1 , pointByI.y]  ]) )
					.toBe(  n.attributes.d = 'M-11 111  v1 h-333');
					expect( drawStrCode.update(n,str,[ ['d',n.attributes.d] ] )  )
					.toBe( str = '<path d="M-11 111  v1 h-333" />') ;
					
					var pointByI= {x: 6, y:6,  comI: 0, command: "M", subI: 0};
					expect( drawStrCode.preUpdateD( n , pointByI ,	[ [pointByI.subI * 2 , pointByI.x] ,  [pointByI.subI * 2 + 1 , pointByI.y]  ]) )
					.toBe(  n.attributes.d = 'M6 6  v1 h-333');
					expect( drawStrCode.update(n,str,[ ['d',n.attributes.d] ] )  )
					.toBe( str = '<path d="M6 6  v1 h-333" />') ;

				});

		})
		describe(' .update() for circles ', function(){
					var n, a, str;
				beforeEach(function(){
					str = "<circle cy=99 cx=99 r=3 fill='blue' />";
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
									cy   : {start: 11, end: 13},
									cx   : {start: 17, end: 19},
							        fill : {start: 30, end: 34},
							        r    : {start: 22, end: 23}
						 			},
					};
					a = [['cy','100']];


				});
				it(' should merge correctly', function(){
					drawStrCode.initStrOffset();

					a= [['cx','123']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=99 cx=123 r=3 fill='blue' />" );

					a= [['cy','123567']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=123567 cx=123 r=3 fill='blue' />" );
					
					a= [['fill','red']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=123567 cx=123 r=3 fill='red' />" );

				});
				
				it('circles should be able to deal with float rems ', function(){
					drawStrCode.initStrOffset();

					a= [['cy','12345'],['cx','123'],['r','3']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=12345 cx=123 r=3 fill='blue' />" );

					a= [['cy','99'],['cx','99']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=99 cx=99 r=3 fill='blue' />" );

					a= [['cy','1234567890'],['cx','1234567890'],['r','3']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=1234567890 cx=1234567890 r=3 fill='blue' />" );

					a= [['cy','12'],['cx','66']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=12 cx=66 r=3 fill='blue' />" );
					
					a= [['cy','12345'],['cx','123']];
					expect( drawStrCode.update(n,str,a) )
					.toBe(str = "<circle cy=12345 cx=123 r=3 fill='blue' />" );

					a= [['cy','12345'],['cx','123']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=12345 cx=123 r=3 fill='blue' />" );

					a= [['cy','1234567890'],['cx','1234567890'],['r','11']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=1234567890 cx=1234567890 r=11 fill='blue' />" );

					a= [['cy','12345'],['cx','123'],['r','11']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=12345 cx=123 r=11 fill='blue' />" );

					a= [['cy','1234567890'],['cx','99'],['r','3']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str =  "<circle cy=1234567890 cx=99 r=3 fill='blue' />" );
						
					a= [ ['cy','"3.1875em"'],['cx','99'] ];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str =  "<circle cy=\"3.1875em\" cx=99 r=3 fill='blue' />" );

					a= [ ['cy','"3.25em"'] , ['cx','98'] ,['r','4']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=\"3.25em\" cx=98 r=4 fill='blue' />" );

					a= [ ['cy','"3.25em"'] ];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=\"3.25em\" cx=98 r=4 fill='blue' />" );

					a= [ ['cy','"3.125em"'] ];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=\"3.125em\" cx=98 r=4 fill='blue' />" );

				});


				it('circle should adjust string if the subtitution changes length',function(){
					drawStrCode.initStrOffset();

					expect( drawStrCode.update(n,str,a) )
					.toEqual( str = "<circle cy=100 cx=99 r=3 fill='blue' />" );
					
					a = [['cx','77']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=100 cx=77 r=3 fill='blue' />" );
					
					a= [['cx','1776']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=100 cx=1776 r=3 fill='blue' />" );
					
					a= [['cx','555']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=100 cx=555 r=3 fill='blue' />" );
					
					a= [ ['r','4.25em'] , ['fill','red'] , ['cy',1]];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=1 cx=555 r=4.25em fill='red' />" );
					
				});

				it('should be able to deal with escaped char', function(){
					drawStrCode.initStrOffset();
					
					a= [['cy','"3.0625em"']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=\"3.0625em\" cx=99 r=3 fill='blue' />" );

					a= [ ['cy','"3.125em"'] ];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=\"3.125em\" cx=99 r=3 fill='blue' />" );

					a= [ ['cy','"3.1875em"'],['r','4'] ];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=\"3.1875em\" cx=99 r=4 fill='blue' />" );

					a= [ ['cy','"3.25em"'] ];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=\"3.25em\" cx=99 r=4 fill='blue' />" );

					a= [ ['cy','"3.25em"'] ];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=\"3.25em\" cx=99 r=4 fill='blue' />" );

					a= [ ['cy','"3.125em"'] ];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=\"3.125em\" cx=99 r=4 fill='blue' />" );

				});

		});		

		describe(' .update() for rect ', function(){
					var n, a, str;
				beforeEach(function(){
					str = "<rect x=9 y=9 height=123 width=246 fill='blue' />";
					n = {
						 nodeName :'rect',
						 hashSvg: 0,
						 attributes: {
									x  		  : 9,
							        y   	  : 9,
							        height    : 123,
							        width    : 246,
							        fill	  : 'blue'
						 			},
						 childNodes:[],
						 attrsStringRef:{
									x    	: {start: 8,  end: 9},
									y    	: {start: 12, end: 13},
									height  : {start: 21, end: 24},
									width   : {start: 31, end: 34},
							        fill 	: {start: 41, end: 45},
						 			},
					};
				});
				it('rect x-y update ', function(){
					drawStrCode.initStrOffset();

					a= [['y','12345'],['x','123']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<rect x=123 y=12345 height=123 width=246 fill='blue' />" );

					a= [['y','123456789'],['x','123']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<rect x=123 y=123456789 height=123 width=246 fill='blue' />" );

					a= [['y','1'],['x','1234567']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<rect x=1234567 y=1 height=123 width=246 fill='blue' />" );

					a= [['y','"2em"'],['x','8em'], ['fill','red']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<rect x=8em y=\"2em\" height=123 width=246 fill='red' />" );

					

				});


				xit('circle should adjust string if the subtitution changes length',function(){
					
				});

				xit('should be able to deal with escaped char', function(){

				});

		});
});