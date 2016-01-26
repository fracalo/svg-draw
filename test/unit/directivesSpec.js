'use strict';

/* jasmine specs for directives go here */

describe('directives testing', function() {
	 var elem, scope, compiled;

	beforeEach(module('draw.path'));
      
      describe('draw-svg', function(){
          var newEl;

          beforeEach(inject(function($rootScope,$compile){
              scope = $rootScope;
              elem = angular.element('<g draw-svg="code"></g>');
              $compile(elem)(scope);
              scope.code ='<path fill="blue" stroke="navy" stroke-width="5" d="M201 152 Q288 84,425 76" ></path>'
              
              // compiled(scope)
              scope.$digest();

          }));
          it('should compile whatever string it finds as attrs',function(){
           
            newEl= elem.find('path')[0];
            expect(newEl.getAttribute('fill')).toBe('blue')
          });
      });


      describe('draw-single-point',function(){
        var circle;
          beforeEach(inject(function($rootScope,$compile){
              
              scope = $rootScope.$new();
              elem = angular.element('<g draw-single-point point="p"></g>');
              scope.p={
                x:110,
                y:11,
                color:'red'};
              compiled = $compile(elem);
              compiled(scope)
              scope.$digest();
            }));
            it('should replace with a svg circle elem with "r"=3', function(){
                    
              expect(elem[0].getAttribute('r')).toBe('3');
              expect(elem[0].getAttribute('cy')).toBe('11');
              expect(elem[0].getAttribute('fill')).toBe('red');
            });
      });

      describe('draw-except', function(){
        var drawValidation, pElem;
        beforeEach(inject(function($rootScope,$compile,_drawValidation_){
            scope = $rootScope.$new();
            drawValidation = _drawValidation_;
            drawValidation.list = {
              specific:[
                      {issue:'first'},
                      {issue:'second'},
                      ]
            };
            //better block call to checkExc
            spyOn(drawValidation, 'checkExc').andReturn(null);
            
            elem = angular.element('<draw-except></draw-except>');
            $compile(elem)(scope);
            scope.$digest();
        }));
        it('should find 2 errors  ',function(){
           expect(elem.find('p').length).toBe(2);
        })
      })


























      xdescribe('draw-point-list directive' , function(){
            beforeEach(inject(function($rootScope,$compile){

              scope = $rootScope.$new();
              element = $compile('<draw-point-list></draw-point-list>');

              }))


       });

      xdescribe('drawPath',function(){
        
        var path, drawPathAttr;

        beforeEach(
          inject(function($rootScope ,$compile , _drawPathAttr_){
            scope = $rootScope.$new();
            element = angular.element('<g draw-path></g>');
            var compiled = $compile(element);
            
            drawPathAttr = _drawPathAttr_;
            compiled(scope);
            scope.$digest();
            

                
        }));
        
        beforeEach(function($rootScope){


            path = element.find('path')[0];
          
           
        })

          it('inherits attributes drawPathAttr',function(){
           
            drawPathAttr.setAttr({fill:'red'});
            scope.$digest();
            expect(path.getAttribute().fill).toEqual('red');
            
          })

          it('attributes can dinamically be added and removed',function(){
            drawPathAttr.attributes['stroke-dasharray']='6,8';
            scope.$digest();

            expect(path.getAttribute('stroke-dasharray')).toEqual('6,8');

            delete drawPathAttr.attributes['stroke-dasharray'];
            scope.$digest();

            expect(path.getAttribute('stroke-dasharray')).toBe(null);

          });

          it('removes all attributes from the element not present in attr {}')


            

      });


});


