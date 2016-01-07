'use strict';

/* Controllers */

 var svgFiddleControllers = angular.module('svgFiddleControllers', []);


svgFiddleControllers.controller('RootCtrl',function($scope){
  $scope.status={
    isopen:false
  };

  $scope.samples=[
    {name:'empty',code:'<path  d=""></path>'},
    {name:'fish',code:'<path fill="blue" stroke="navy" stroke-width="5" d="M201 152 Q288 84,425 76 Q427 55,417 34 C467 31,475 60,497 73 Q563 75,617 109 Q579 150,505 149 L493 177 L489 150 C353 150,280 76,197 81" ></path>'},
    {name:'love',code:'<path stroke="red" fill="none" stroke-width="11" stroke-dasharray="4,3" d="M264 201 C293 133,392 83,331 47 Q294 52,268 92 Q251 34,219 37 Q175 60,203 124 Z" ></path>'},
    {name:'dog',code:'<path fill="rgba(222,0,222,0.5)" stroke="pink" stroke-width="5" d="M220 90 L589 92 Q428 189,335 31" ></path>'}
     
  ];

  $scope.change= function(a){
   $scope.code = a;
  };
});




// svgFiddleControllers.controller('DrawCtrl',['$scope', '$filter' , '$timeout','drawService', 'toolsAttr', 'vectorAttr',
//   function($scope, $filter, $timeout, drawService, toolsAttr, vectorAttr) {
    
//   var drw = this;

//   //reference to services 
//   this.drawService = drawService;
//   this.toolsAttr = toolsAttr;

//   //svg customizable attributes,
//   //the style property  refer to toolsAttr service
//   //while dvalue is calculated with artboard.points array or with value of textArea
//   this.attr={
//    /* all attributes coming from services*/
//   };

//   //digest will trigger (no need to manual $watch toolsAttr)
//   var styleAttributes = drw.toolsAttr.getAttr();
//   for (var s in styleAttributes){
//     drw.attr[s]= styleAttributes[s]
//   };


//  this.vectorAttr={
//    /* all attributes coming from services*/
//   };
//   var vectorAttributes = vectorAttr.getAttr();
//   for (var s in vectorAttributes){
//     drw.vectorAttr[s]= vectorAttributes[s]
//   };



 
//    //watch point type changes
//    $scope.$watch('drw.drawService.points', function(){
//          	drw.attr.d =  drawService.dValue();
//           drw.code = drawService.code(drw.attr);

//           drw.vectorAttr.d = drawService.vectorDValue();
          
//           //filter the output correcting pointType
          

// 	},true);

//     // watching for events coming from textArea directive
//     $scope.$watch('drw.code', function(n) {
            
            
//           //update dValue according using filter
//            drw.attr = (n)?$filter('parseMarkup')(n):'';
//            toolsAttr.setAttr(drw.attr);
            
//           //update points in artboard service
//           if(drw.attr.d && drw.attr.d.length>0){
//            var res = $filter('dValToArray')(drw.attr.d) ; 

//            //normalize 
//             res = $filter('normalizePointType')(res);
          
//             drawService.setPoints(res);
//           };
//     });



 

// }]);

// svgFiddleControllers.controller('DrawEventsCtrl', function($scope, $element, $attrs, $transclude, $rootScope, drawService){
//         var tollerance = 20;
//         var down =Object.create(null);

//         var artboard = drawService;
        
//         $element.on('mousedown',mousedown);

//         function mousedown(e){
//           artboard.mousedown(e)
//           $scope.$digest();
          
//           down.x = e.clientX;
//           down.y = e.clientY;
//         $element.on('mousemove',mousemove);
//         $element.on('mouseup',mouseup);

//         };

//         function mousemove(e){
          
//           if( Math.sqrt( Math.pow(e.clientX-down.x , 2) + Math.pow(e.clientY-down.y , 2) ) > tollerance){
         
//               artboard.mousemove(e);
//               $scope.$digest();
//           }else{
//               artboard.mousemove.back(e);
//               $scope.$digest();
//           }
//         }

        
//         function mouseup(e){
//           if( Math.sqrt( Math.pow(e.clientX-down.x , 2) + Math.pow(e.clientY-down.y , 2) ) <= tollerance){
//              artboard.mouseupLine(e);
             
//           }

//         $scope.$digest();
//         $element.off('mousemove',mousemove);
//         $element.off('mouseup',mouseup);
        
//         };
//         $rootScope.$on('pointMove', function (e, msg) {
//           artboard.points[ msg[1] ].list[ msg[2] ]= msg[0];
//           $scope.$digest();

//         });

//       });






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
