//directive for drawing points inside the drawPath directive

(function(){
'use strict';
  angular
    .module('draw.path')
    .directive('drawPoints',drawPoints)
      
      function drawPoints(){
        return {
          restrict:'A',
          scope:{
            points:'='
          },
          template:
          '<g ng-repeat="el in points track by $index" >'+
          '   <g ng-repeat="p in el track by $index" draw-single-point point="p">'+
          '</g>',
          // template:
          // '<g ng-repeat="segment in dpc.points track by $index" >'+
          // '   <g ng-repeat="p in segment.list track by $index" >'+
          // '      <draw-single-point point="p" ></draw-single-point>'+
          // '   </g>'+
          // '</g>',
          
          // link:function(scope,el){
          //   console.log(scope,el)
          //   scope.$watch('dpc.points',function(n){
          //     console.log(n);
          //   },true)
          // },

          // controller:'DrawPointsCtrl',
          // controllerAs:'dpc',
          // controller:function($scope, drawDisassemble){
          //   $scope.points = drawDisassemble.structure;

          //   var  watchStructure = function(){
          //     return drawDisassemble.structure;
          //   }

          //   $scope.$watch( watchStructure() ,
          //     function(n){
          //       $scope.points = n ;
          //       console.log(42)
          //     },true);




          // }

          };
      };


})();