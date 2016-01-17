(function(){
'use strict';

/* Controllers */

 angular.module('svgFiddleControllers', [])


.controller('RootCtrl',function($scope){
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
   console.log($scope.code)
  };

  $scope.testArr=[
  {x:11,y:22,color:'red'},
  {x:21,y:22,color:'red'},
  {x:31,y:22,color:'red'},
  {x:41,y:22,}
  ]

});


})();

