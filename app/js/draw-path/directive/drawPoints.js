//directive for drawing points inside the drawPath directive

(function(){

  angular
    .module('draw.path')
    .directive('drawPoints',drawPoints)
      
      function drawPoints(){
        return {
          restrict:'EA',
          controller:'DrawPointsCtrl',
          controllerAs:'dpc',
          // scope:{
          //   points:'='
          // },
          template:
          '<g ng-repeat="segment in dpc.points track by $index" >'+
          '   <g ng-repeat="p in segment.list track by $index" >'+
          '      <draw-single-point point="p" ></draw-single-point>'+
          '   </g>'+
          '</g>',
          // template:
          // '<g ng-repeat="segment in dpc.points track by $index" >'+
          // '   <g ng-repeat="p in segment.list track by $index" >'+
          // '      <draw-single-point point="p" ></draw-single-point>'+
          // '   </g>'+
          // '</g>',
          link:function(scope,el){
            console.log(scope,el)
            scope.$watch('dpc.points',function(n){
              console.log(n);
            },true)
          }
          };
      };


})();