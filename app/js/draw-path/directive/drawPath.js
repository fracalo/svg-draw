//directive for code in textarea

// (function(){

//   angular
//     .module('draw.path')
//     .directive('drawPath',drawPath)
      
//       function drawPath(){
//             return {
//           restrict:'A',
//           controller:function($scope, $element, drawPathAttr){

//             var path = $element.find('path')[0];

//             var checkAttr = function(){
//                 return drawPathAttr.attributes;
//             };

//            //dinamically include all attributes in the attr {}
//             function updateAttr(){

//               $scope.attr = drawPathAttr.attributes;

//               //reset attributes
//               while(path.attributes.length > 0)
//               path.removeAttribute( path.attributes[0].name );

            
//                   //repopulate atributes
//                   for ( var a in $scope.attr){
//                         path.setAttribute(a , $scope.attr[a] );
//                   }

//             }

//             $scope.$watchCollection( checkAttr , updateAttr );

//           },
//           scope:{},
//           template: '<path />',
//               }; 
//       };


// })();