(function(){

  'use strict';

/* Controllers */
angular
  .module('draw.path')
  .controller('DrawCtrl',DrawCtrl)

  DrawCtrl.$inject = ['$scope', '$filter' , '$timeout','drawService', 'drawPathAttr', 'drawVectorAttr']
  
  function DrawCtrl($scope, $filter, $timeout, drawService, drawPathAttr, drawVectorAttr) {
    var tmpAttr, tmpArr;
    var drw = this;
   };
   
})();
