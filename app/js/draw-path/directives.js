'use strict';


//directive module
angular.module('draw.path')


.directive('drawPointsList',function(){

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

       controller: function($scope,$element,$attrs,$filter,drawService){
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
      },
      controllerAs:'list',
 

     };
})



// directive for dealing events on artboard
.directive('drawEvents',function(){
    return{
      restrict:'A',
      controller: 'DrawEventsCtrl',
    };
 })

//directive for drawing points inside the drawPath directive
.directive('drawPoints',function(){
    return {
      restrict:'EA',
      controller:'drawPointsCtrl',
      scope:{},
      template:
      '<g ng-repeat="segment in points track by $index" >'+
      '   <g ng-repeat="p in segment.list track by $index" >'+
      '      <draw-single-point point="p" ></draw-single-point>'+
      '   </g>'+
      '</g>',
    };
})

.controller('drawPointsCtrl', function($scope, drawService){
     var watchPoints = function(){
      return drawService.points;
     };
     $scope.$watch(watchPoints, function(){
      $scope.points = drawService.points;
     });
})

.directive('drawSinglePoint',function($document,$rootScope){
  return {
    restrict:'AE',
    replace:true,
    scope:{
      point:'=',
    },
    template:'<circle '+
    'ng-mousedown="$event.stopPropagation()" ng-attr-cx={{point[0]}} ng-attr-cy="{{ point[1] }}" '+
    'r="3" fill="black">',
  
    link:function(scope,el,attr,drawPath){
     var startX, startY ;
     var sketchEl = $document;
     var grannyIndex = scope.$parent.$parent.$index;
     var parentIndex = scope.$parent.$index;
    
      //change pointer when onover
       el.on('mouseover',function(ev){
        el.css({
          cursor:'crosshair'
        });
       });

       //distinguish type of point ( if vector ) by color 
       scope.isLast = function(){
        return scope.$parent.$last;
       };
        scope.$watch(scope.isLast,function(){
          var fillColor = (!scope.$parent.$last)? 'blue' : 'black' ;

          el.css({ fill: fillColor });
          
          
       });
      
      
      //where keeping track of this event in DrawCtr
      el.on('mousedown', function(ev) {
              ev.preventDefault();
              el.css({
               stroke:'red',
               cursor:'crosshair'
              });
          
          startX = ev.pageX - el.attr('cx');
          startY = ev.pageY - el.attr('cy');

      // console.log(scope.$parent.$parent.$index )
      sketchEl.on('mousemove', mousemove);
      sketchEl.on('mouseup', mouseup);    
      });

      function mousemove(ev){
        ev.stopPropagation();
        var moveX =ev.pageX - startX;
        var moveY = ev.pageY - startY;
        el.attr('cx', moveX);
        el.attr('cy', moveY);
        //scope.point= [ moveX , moveY ];
    //drawPath.artboard.points[scope.$parent.$index]=[moveX,moveY];//rather pass this in the message
         //we're going to shoot the move coordinates in the air
         $rootScope.$emit("pointMove", [[ Number(el.attr('cx')) , Number(el.attr('cy')) ] , grannyIndex, parentIndex ]);
      }
       function mouseup(ev) {
        ev.stopPropagation();
        scope.point[0] = el.attr('cx');
        scope.point[1] = el.attr('cy');
        scope.$emit("pointMove", [[ Number(el.attr('cx')) , Number(el.attr('cy')) ] , grannyIndex, parentIndex ]);

        sketchEl.off('mousemove', mousemove);
        sketchEl.off('mouseup', mouseup);
         el.css({
               stroke: 'none',
               cursor:'auto'
          });
      }
    }
  };
})

//directive for code in textarea
.directive('drawTextarea',function(){

   return {
      restrict:'AE',
      replace: false,
      scope: {
        code:'='
      },
      template:
      "<label name='code'>SVG-Code </label>"+
      "<textarea name='code' ng-model='code' ></textarea>",
      controller:function($scope, $filter, $timeout, drawPathAttr, drawVectorAttr, drawService,codeInput){
   
        function watchPoints(){
        return drawService.points
    }

      // watch point type changes
      $scope.$watch(watchPoints, function(){
            /*update path and vector based on drawService.points */
            drawPathAttr.attributes.d = drawService.dValue();
            drawVectorAttr.attributes.d = drawService.vectorDValue();

            /*update code based on drawPathAttr.attributes*/
            $scope.code = drawService.code(drawPathAttr.attributes);
    },true);

     // update drawPathAttr should be done through parsers
    var wait, lastValid;
        $scope.$watch('code',function(n,o){
          


        //cancel $timeout if exists
        if(wait){
          $timeout.cancel(wait);
          wait = null;
        }
        if(!lastValid){
          lastValid = o;
          console.log(lastValid)
        }
        // add a timeout for waiting typing
        wait = $timeout(function(){
  
         
        /*****************************
        move all this in the service
        (create an ignorant textarea)
        *****************************/

        if ($scope.code.length ) { 

        var attrPairs = codeInput.parseAttr($scope.code)
            .then(codeInput.checkKeys)
            .catch(function(e){console.log(e)});

            //check and set dValue 
            attrPairs
            .then(
                  codeInput.checkDvalArrify,
                  function(e){console.log(e);}
                  )
            .then(
              //codeInput.checkDvalArrify, is returning the array ready to be updated
                  function(res){
                      drawService.setPoints(res);
                  },
                  function(e){  console.log(e);
                          if(confirm("error: " +e+ "\n do you want to revert to last valid value?") )
                            {
                              
                              $scope.code = lastValid;
                            }
                    }
                  )
            .finally(
                  function(){
                             //set lastValid to null so it can be reset 
                              lastValid = null;
                            }
                  );
              

            //update all attributes in drawPathAttr
             attrPairs
             .then(
                  function(res){
                    drawPathAttr.setAttr(res)

                  });

        } 

  
      },800);
    
        });
        /*function promiseCheck(d){
          return $q(function(resolve){
                resolve(d);
              
            });
        }*/

        
      },
 /*       require:'^form',
      link:function(scope,el,attr,ctrl){
      
      }*/
      
     
    };

})

.directive('drawPath', function($q){
      return {
          restrict:'A',
          controller:function($scope, $element, drawPathAttr){

            var path = $element.find('path')[0];

            var checkAttr = function(){
                return drawPathAttr.attributes;
            };

           //dinamically include all attributes in the attr {}
            function updateAttr(){

              $scope.attr = drawPathAttr.attributes;

              //reset attributes
              while(path.attributes.length > 0)
            path.removeAttribute( path.attributes[0].name );

            
                  //repopulate atributes
                  for ( var a in $scope.attr){
                      try{
                        path.setAttribute(a , $scope.attr[a] );
                      }catch(e){
                        console.log(e)
                      }
                  }

            }

            $scope.$watchCollection( checkAttr , updateAttr );

          },
          scope:{},
          template: '<path></path>',
        }; 
})

.directive('drawVector', function(){
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
          template: '<path></path>',
        }; 
});