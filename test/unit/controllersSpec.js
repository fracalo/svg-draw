'use strict';



 xdescribe('DrawCtrl',function(){

  var $controller;
  var $scope;
  var artboardClick;
  var drawPathAttr;




  beforeEach(module('draw.path'));

    describe('DrawCtrl',function(){

      beforeEach(inject(function($rootScope , _$controller_){
        $scope = $rootScope.$new();

        drawPathAttr={
         attributes:{
            fill :'rgba(222,0,222,0.5)',
            stroke :'green',
            strokeWidth:5,
          },
          getAttr:function(){
            return drawPathAttr.attributes;
          },
          setAttr : function(swapObj){
            return drawPathAttr.attributes = swapObj;
           },
        };

        //spyOn(toolsAttr, 'getAttr').andReturn(toolsAttr.attr)

        $controller = _$controller_('DrawCtrl',{
          $scope: $scope, drawPathAttr: drawPathAttr
        });
      }));

      describe('attr.style coming from service',function(){





          it('should return attribute change styles depending on form input',function(){
              /*$controller.attr.stroke='green';
              $scope.$digest();*/
              expect($controller.attr.stroke)
              .toEqual('green');

/*              expect($controller.toolsAttr.getAttr())
              .toEqual({
              fill :'green',
              stroke :'green',
              strokeWidth:5,
              })*/
          });

      })
      

    });




 });

/* describe('ToolsCtrl', function(){
  var $controller, $scope, toolsAttr;

  beforeEach(module('svgFiddle'));

  describe('attributes',function(){
    beforeEach(inject(function($rootScope , _$controller_){
      $scope=  $rootScope.$new();
      
      toolsAttr = {
          getAttr:function(){}
      };
    
       spyOn(toolsAttr, 'getAttr').andReturn('red');

       $controller = _$controller_('ToolsCtrl',{
        $scope:$scope, toolsAttr:toolsAttr
      });
      
    }));

    it('should find attr ro come from mock toolsAttr service', function(){
      expect($controller.attr).toEqual('red');
    });
  });


 })*/