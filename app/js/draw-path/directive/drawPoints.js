//directive for drawing points inside the drawPath directive

(function(){

  angular
    .module('draw.path')
    .directive('drawPoints',drawPoints)
      
      function drawPoints(){
        return {
          restrict:'EA',
          controller:'drawPointsCtrl',
          scope:{},
          template:
          '<g ng-repeat="segment in points track by $index" >'+
          '   <g ng-repeat="p in segment.list track by $index" >'+
          '      <draw-single-point point="p" ></draw-single-point>'+
          '   </g>'+
          '</g>',
          };
      };


})();