//directive for code in textarea

(function(){

  angular
    .module('draw.path')
    .directive('drawVector',drawVector)
function drawVector(){
      return {
          restrict:'A',
          controller:function($scope, $element, drawVectorAttr){
            $scope.attr;

            var path = $element.find('path')[0];

            var checkAttr = function(){
                return drawVectorAttr.attributes;
            };

           //dinamically include all attributes in the attr {}
            function updateAttr(){

              $scope.attr = drawVectorAttr.attributes;

              //reset attributes
              while(path.attributes.length > 0)
            path.removeAttribute( path.attributes[0].name );

              //repopulate atributes
              for ( var a in $scope.attr){
                  path.setAttribute(a , $scope.attr[a] );
              }
            }

            $scope.$watchCollection( checkAttr , updateAttr );

          },
          scope:{},
          template: '<path />',
        }; 
};


})();