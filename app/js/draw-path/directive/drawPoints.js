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
          // link:function(scope,el){
          //   let watchpoints =()=>{return scope.points};
            
          //   scope.$watch(watchpoints,function(n){
          //     console.log(n);
          //   },true)
          // },


          };
      };


})();