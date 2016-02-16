"use strict";

describe('drawStrCode',function(){
		var drawStrCode, n, a;
		beforeEach(function(){
			module('draw.path');

			inject(function(_drawStrCode_){
				drawStrCode = _drawStrCode_;
			});	
		});

		describe(' .update() ', function(){
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
				it('should be able to deal with float rems ( issues )', function(){
					drawStrCode.initStrOffset();

					a= [['cy','12345'],['cx','123']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=12345 cx=123 r=3 fill='blue' />" );

					a= [['cy','99'],['cx','99']];
					expect( drawStrCode.update(n,str,a) )
					.toBe( str = "<circle cy=99 cx=99 r=3 fill='blue' />" );

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


				it('should adjust string if the subtitution in strSplice function changes length',function(){
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

				it('should be able to deal with float rems ( issues )', function(){
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
});