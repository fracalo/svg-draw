(function(){
  'use strict';


//directive module
angular
    .module('draw.path')
    .controller('drawPointsCtrl', drawPointsCtrl);
    
    drawPointsCtrl.$inject = ['$scope','drawService'];
    
    function drawPointsCtrl($scope, drawService){
         var watchPoints = function(){
          return drawService.points;
         };
         $scope.$watch(watchPoints, function(){
          $scope.points = drawService.points;
         });
    }
})();