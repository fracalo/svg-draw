//directive for code in textarea

(function(){
 'use strict';
  angular
    .module('draw.path')
    .directive('drawSvg',drawSvg);

    drawSvg.$inject =['$compile', 'drawData','$rootScope'];
      
      function drawSvg($compile, drawData, $rootScope){
        return function(scope, element, attrs) {
          scope.$watch(
            function() {
               // watch  'code' expression for changes
              return scope.$eval(attrs.drawSvg);
            },
            function(value) {
              element.html(value);
              var inner = element.contents();
              $compile(inner);/*(scope)*/
              /* we don't need scope as it's just reactiong to external changes*/
            
            /*the setNode method sets data in drawData,
              we store the node that's been compiled by angular*/
             drawData.setNode(inner,value) ;
             /**********this starts some woggieboggie*********/ 
            });
          
         $rootScope.$on("pointMove",function(n, msg){
          drawData.changeNode(msg)
         })
        
          
        };
      }

})();