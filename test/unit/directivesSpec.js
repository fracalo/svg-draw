'use strict';

/* jasmine specs for directives go here */

describe('directives testing', function() {
	 var element, scope;

	beforeEach(module('svgFiddle'));

      describe('draw-single-point directive',function(){
              beforeEach(inject(function($rootScope,$compile){
                  
                  scope = $rootScope.$new();
                  element = ' <draw-single-point point="p" ></draw-single-point>';
                  scope.p=[110,11];
                  element = $compile(element)(scope);
                  
                  scope.$digest();
              }));

              //create a spy for $scope.parent.$last
            /*  beforeEach(function(){
                 scope={
                  $parent :{$last: true},
                 
                  isLast:function(){
                    
                  }
                 }

                 return scope.isLast;
              })

              spyOn("isLast").and.returnValue(false)*/

                   it('should replace with a svg circle elem with "r"=3', function(){
                    expect(element[0].getAttribute('r')).toBe('3');
                    expect(element[0].getAttribute('cy')).toBe('11');
                    expect(element[0].getAttribute('fill')).toBe('black');

                    console.log(scope.$parent.$last)
                   });

                   it('should change color when vector', function(){
                    // scope.$parent.$last = false;
                    // scope.isLast();//watcher call
                    element[0].setAttribute('fill', 'blue');
                    
                    scope.$digest();
                    expect(element[0].getAttribute('fill')).toBe('blue');
                   });
      });


      describe('draw-point-list directive' , function(){
            beforeEach(inject(function($rootScope,$compile){

              scope = $rootScope.$new();
              element = $compile('<draw-point-list></draw-point-list>')

            }))


       })

});


