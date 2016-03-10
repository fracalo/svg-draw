//directive for code in textarea

(function(){
  'use strict';
  angular
  
    .module('draw.path')
    .directive('drawPointsList',drawPointsList)
      
      function drawPointsList(){
          return{
                restrict:'E',
                scope:{},
                template:
                '<table >'+
                '<tr  ng-repeat="point in list.pointsArray track by $index">'+
                  '<td><p>{{$index}}:</p></td>'+
                  '<td><fieldset>'+
                  ' <label for="typeP">PT</label>'+
                  ' <select name="typeP" '+
                  ' ng-options="option for option in {{list.pointsType}}"'+
                  ' ng-model="point.type" ></select>'+
                  '</fieldset></td>'+
                  '<td ng-repeat="p in point.list"><fieldset>'+
                  ' <label for="x">X<sup>{{$index}}</sup></label>'+
                  ' <input name="x" ng-model="p[0]">'+
                  ' </fieldset>'+
                  ' <fieldset>'+
                  ' <label for="y">Y<sup>{{$index}}</sup></label>'+
              ' <input name="y" ng-model="p[1]">'+
                  '</fieldset></td>'+
                '</tr>'+
                '</table>',

                 /*controller: function($scope,$element,$attrs,$filter,drawService){
                  var self = this;
                  this.pointsType = drawService.curveOp;
                  this.pointsArray=[];

                  $scope.$watch(
                    function(){
                      return drawService.points;
                    },
                    function(){
                      self.pointsArray = drawService.points;
                    }
                  );
                  $scope.$watchCollection(          
                    function(){
                      return self.pointsArray.map(function(x){
                        return x.type;
                      });
                    },
                    function(){
                      //normalize in case of point change
                    self.pointsArray = $filter('normalizePointType')(self.pointsArray);
                      // update-create a reference back to drawService.points
                      drawService.points = self.pointsArray;
                    }
                  );
                },*/
                controllerAs:'list',
              }; 
      };


})();