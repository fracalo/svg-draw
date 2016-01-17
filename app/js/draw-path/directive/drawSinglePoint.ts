//directive for drawing single point inside the drawPath directive

interface Point {
    x: string;
    y: string;
}

(function(){

  angular
    .module('draw.path')
    .directive('drawSinglePoint', drawSinglePoint);


  drawSinglePoint.$inject = ['$document', '$rootScope'];

  function drawSinglePoint($document, $rootScope) {
  return {
    restrict:'A',
    replace:true,
    scope:{
      point:'=',
    },
    template:' <circle '+
    'ng-mousedown="$event.stopPropagation()" '+
    'ng-attr-cx="{{point.x}}" ng-attr-cy="{{point.y}}" '+
    'r="3" fill="{{point.color}}" index={{$index}} />'
  
    link:function(scope,el,attr,drawPath){
     scope.point.color = (scope.point.color) ? scope.point.color :'blue'

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
        scope.point.x = el.attr('cx');
        scope.point.y = el.attr('cy');
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
}


})();