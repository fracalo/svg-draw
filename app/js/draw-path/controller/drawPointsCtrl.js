(function(){
  'use strict';


//directive module
angular
    .module('draw.path')
    .controller('DrawPointsCtrl', DrawPointsCtrl);
    
    DrawPointsCtrl.$inject = ['$scope','drawService'];
    
    function DrawPointsCtrl($scope, drawService){
         var watchPoints = function(){
          return drawService.points;

         };
        $scope.$watch(watchPoints, function(){
          this.points = drawService.points;
          console.log(this.points)
        });
    }
})();