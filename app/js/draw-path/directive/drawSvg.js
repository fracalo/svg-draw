//directive for code in textarea

(function(){

  angular
    .module('draw.path')
    .directive('drawSvg',drawSvg);

    drawSvg.$inject =['$compile', 'drawDataFactory']
      
      function drawSvg($compile, drawDataFactory){
        return function(scope, element, attrs) {
          scope.$watch(
            function(scope) {
               // watch  'code' expression for changes
              return scope.$eval(attrs.drawSvg);
            },
            function(value) {
              element.html(value);
              var inner = element.contents()
              $compile(inner);/*(scope)*/
              /* we don't need scope as it's just reactiong to external changes*/
            
            /*will used the compiled element to map the objects*/
             console.log(inner)
            console.log(drawDataFactory.getCompiledNode(inner))              
            }
          );
        };
      }

})();