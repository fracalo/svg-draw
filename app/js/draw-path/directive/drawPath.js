//directive for code in textarea

(function(){

  angular
    .module('draw.path')
    .directive('drawPath',drawPath);

    drawPath.$inject =['$compile']
      
      function drawPath($compile){
        return function(scope, element, attrs) {
          scope.$watch(
            function(scope) {
               // watch  'code' expression for changes
              return scope.$eval(attrs.drawPath);
            },
            function(value) {
              
              element.html(value);

              $compile(element.contents());
            }
          );
        };
      }


})();