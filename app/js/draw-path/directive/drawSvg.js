//directive for code in textarea

(function(){
 'use strict';
  angular
    .module('draw.path')
    .directive('drawSvg',drawSvg);

    drawSvg.$inject =['$compile', 'drawDataFactory'];
      
      function drawSvg($compile, drawDataFactory){
        return function(scope, element, attrs) {
          scope.$watch(
            function(scope) {
               // watch  'code' expression for changes
              return scope.$eval(attrs.drawSvg);
            },
            function(value) {
              element.html(value);
              var inner = element.contents();
              $compile(inner);/*(scope)*/
              /* we don't need scope as it's just reactiong to external changes*/
            
            /*the setNode method sets data in drawDataFactory,
              we store the node that's been compiled by angular*/
             drawDataFactory.setNode(inner) ;
             /**********this starts some woggieboggie*********/ 
            }
          );
        };
      }

})();