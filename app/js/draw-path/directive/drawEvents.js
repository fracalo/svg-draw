// directive for dealing events on artboard

(function(){

  angular
    .module('draw.path')
    .directive('drawEvents',drawEvents)
      
      function drawEvents(){
              return{
                restrict:'A',
                controller: 'DrawEventsCtrl',
              };
      };


})();