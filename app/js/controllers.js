'use strict';

/* Controllers */

var svgFiddleControllers = angular.module('svgFiddleControllers', []);







svgFiddleControllers.controller('DrawCtrl',['$scope', '$filter' , '$timeout','drawService', 'toolsAttr', 'vectorAttr',
  function($scope, $filter, $timeout, drawService, toolsAttr, vectorAttr) {
    
  var drw = this;

  //reference to services 
  this.drawService = drawService;
  this.toolsAttr = toolsAttr;


  //svg customizable attributes,
  //the style property  refer to toolsAttr service
  //while dvalue is calculated with artboard.points array or with value of textArea
  this.attr={
   /* all attributes coming from services*/
  };

  //digest will trigger (no need to manual $watch toolsAttr)
  var styleAttributes = drw.toolsAttr.getAttr();
  for (var s in styleAttributes){
    drw.attr[s]= styleAttributes[s]
  };


 this.vectorAttr={
   /* all attributes coming from services*/
  };
  var vectorAttributes = vectorAttr.getAttr();
  for (var s in vectorAttributes){
    drw.vectorAttr[s]= vectorAttributes[s]
  };



 
   //watch point type changes
   $scope.$watch('drw.drawService.points', function(){
         	drw.attr.d =  drawService.dValue();
          drw.code = drawService.code(drw.attr);

          drw.vectorAttr.d = drawService.vectorDValue();
          
          //filter the output correcting pointType
          

	},true);

    // watching for events coming from textArea directive
    $scope.$watch('drw.code', function(n) {
            
            
          //update dValue according using filter
           drw.attr = (n)?$filter('parseMarkup')(n):'';
           toolsAttr.setAttr(drw.attr);
            
          //update points in artboard service
          if(drw.attr.d && drw.attr.d.length>0){
           var res = $filter('dValToArray')(drw.attr.d) ; 

           //normalize 
            res = $filter('normalizePointType')(res);
          
            drawService.setPoints(res);
          };
    });



 

}]);

svgFiddleControllers.controller('DrawEventsCtrl', function($scope, $element, $attrs, $transclude, $rootScope, drawService){
        var tollerance = 20;
        var down =Object.create(null);

        var artboard = drawService;
        
        $element.on('mousedown',mousedown);

        function mousedown(e){
          artboard.mousedown(e)
          $scope.$digest();
          
          down.x = e.clientX;
          down.y = e.clientY;
        $element.on('mousemove',mousemove);
        $element.on('mouseup',mouseup);

        };

        function mousemove(e){
          
          if( Math.sqrt( Math.pow(e.clientX-down.x , 2) + Math.pow(e.clientY-down.y , 2) ) > tollerance){
         
              artboard.mousemove(e);
              $scope.$digest();
          }else{
              artboard.mousemove.back(e);
              $scope.$digest();
          }
        }

        
        function mouseup(e){
          if( Math.sqrt( Math.pow(e.clientX-down.x , 2) + Math.pow(e.clientY-down.y , 2) ) <= tollerance){
             artboard.mouseupLine(e);
             
          }

        $scope.$digest();
        $element.off('mousemove',mousemove);
        $element.off('mouseup',mouseup);
        
        };
        $rootScope.$on('pointMove', function (e, msg) {
          artboard.points[ msg[1] ].list[ msg[2] ]= msg[0];
          $scope.$digest();

        });

      });

svgFiddleControllers.controller('MenuCtrl',function($scope){
  $scope.status={
    isopen:false
  }
})




/*svgFiddleControllers.controller('DrawTextareaCtrl',
function($scope, $element, $attrs, $transclude, $rootScope, artboard,toolsAttr){

 var textarea = this;

  this.attr={
   /* all attributes coming from services
  /*};

  //digest will trigger (no need to manual $watch toolsAttr)
  var styleAttributes = toolsAttr.getAttr();
  for (var s in styleAttributes){
    textarea.attr[s]= styleAttributes[s]
  };
  $scope.watchPoints =function(){
    return artboard.points
  };

  $scope.$watch($scope.watchPoints, function(n){
          textarea.attr.d= artboard.dValue();
          textarea.code = artboard.code(textarea.attr);
          
          console.log(n)
          //filter the output correcting pointType
          

  });

})*/
