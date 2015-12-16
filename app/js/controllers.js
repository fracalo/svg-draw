'use strict';

/* Controllers */

var svgFiddleControllers = angular.module('svgFiddleControllers', []);



svgFiddleControllers.controller('HomeCtrl',	[
	function(){ 

	   	var dr = this;

		dr.glyphTrans = false;
		dr.change= function (){
		  	return dr.glyphTrans = !dr.glyphTrans;
		};

		//for ng include
		dr.template={
			header:'partials/header-template.html',
			sketch:'partials/sketch-template.html',
			code  :'partials/code-template.html'
		};
		
	
}]);



svgFiddleControllers.controller('DrawCtrl',['$scope', '$filter' , '$timeout','artboard', 'toolsAttr',  function($scope, $filter, $timeout, artboard, toolsAttr) {
    
  var drw = this;

  //reference to services 
  this.artboard = artboard;
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
 

 // this watch for click/mouse events coming from service
   $scope.$watch('drw.artboard.lastPointType()', function(){
         	drw.attr.d= artboard.dValue();
          drw.code = artboard.code(drw.attr);

	});
   //this watch for point movements might blend with watch above
   $scope.$watch('drw.artboard.points', function(){
         	drw.attr.d= artboard.dValue();
          drw.code = artboard.code(drw.attr);

	},true);

    // watching for events coming from textArea directive
    $scope.$watch('drw.code', function(n) {
            
            
          //update dValue according using filter
           drw.attr = (n)?$filter('parseMarkup')(n):'';
           toolsAttr.setAttr(drw.attr);
            
          //update points in artboard service
          if(drw.attr.d && drw.attr.d.length>0){
           var res = $filter('dValToArray')(drw.attr.d) ; 
          
            artboard.setPoints(res);
          };
    });


 

}]);
