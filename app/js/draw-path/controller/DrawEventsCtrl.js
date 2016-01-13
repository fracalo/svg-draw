(function(){

  'use strict';

/* Controllers */
angular
  .module('draw.path')
  .controller('DrawEventsCtrl',DrawEventsCtrl)

  DrawEventsCtrl.$inject = ['$scope', '$element' , '$attrs','$rootScope','drawService']; 

 function DrawEventsCtrl($scope, $element, $attrs, $rootScope, drawService){
        var tollerance = 20;
        var down =Object.create(null);

        var artboard = drawService;
        
        $element.on('mousedown',mousedown);

        function mousedown(e){
          artboard.mousedown(e);
          $scope.$digest();
          
          down.x = e.clientX;
          down.y = e.clientY;
        $element.on('mousemove',mousemove);
        $element.on('mouseup',mouseup);
        }

        function mousemove(e){
          if( Math.sqrt( Math.pow(e.clientX-down.x , 2) + Math.pow(e.clientY-down.y , 2) ) > tollerance){
              artboard.mousemove(e);
              $scope.$digest();
          }else{
              artboard.mousemove.back(e);
              $scope.$digest();
          }
        }

        function mouseup(e){
          if( Math.sqrt( Math.pow(e.clientX-down.x , 2) + Math.pow(e.clientY-down.y , 2) ) <= tollerance){
             artboard.mouseupLine(e);
         }

        $scope.$digest();
        $element.off('mousemove',mousemove);
        $element.off('mouseup',mouseup);
        
        }
        $rootScope.$on('pointMove', function (e, msg) {
          artboard.points[ msg[1] ].list[ msg[2] ]= msg[0];
          $scope.$digest();

        });

}
})();
