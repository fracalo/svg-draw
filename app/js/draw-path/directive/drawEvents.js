// directive for dealing events on artboard (while drawing)

(function(){
  'use strict';
  	angular
    	.module('draw.path')
    	.directive('drawEvents',drawEvents);
      
     	function drawEvents(){
              return{
                restrict:'A',
                controller: 'DrawEventsCtrl',
              };
      	}


})();