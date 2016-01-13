'use strict';

/* jasmine specs for directives go here */

describe('directives testing', function() {
	 var element, scope;

	beforeEach(module('draw.path'));

      describe('draw-single-point directive',function(){
              beforeEach(inject(function($rootScope,$compile){
                  
                  scope = $rootScope.$new();
                  element = ' <draw-single-point point="p" ></draw-single-point>';
                  scope.p=[110,11];
                  element = $compile(element)(scope);
                  
                  scope.$digest();
              }));

                   it('should replace with a svg circle elem with "r"=3', function(){
                    expect(element[0].getAttribute('r')).toBe('3');
                    expect(element[0].getAttribute('cy')).toBe('11');
                    expect(element[0].getAttribute('fill')).toBe('black');

                   });

                   it('should change color when vector', function(){
                    // scope.$parent.$last = false;
                    // scope.isLast();//watcher call
                    element[0].setAttribute('fill', 'blue');
                    
                    scope.$digest();
                    expect(element[0].getAttribute('fill')).toBe('blue');
                   });
      });


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

          xit('removes all attributes from the element not present in attr {}')


            

      });


});


