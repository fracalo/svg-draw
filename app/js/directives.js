'use strict';


//directive module
var svgFiddleDirectives = angular.module('svgFiddleDirectives',[]);

//directive for focusing data for each point
//interface for data in the controller 'DrawCtrl'
svgFiddleDirectives.directive('drawPointsList',function(){

    return{
      restrict:'E',
      controller: 'DrawCtrl',
      controllerAs:'drw',
      scope:{
        pointsArray:'=',
        pointsType:'@'
      },
      template:
      '<table>'+
      '<tr ng-repeat="point in pointsArray track by $index">'+
      	'<td><p>{{$index}}:</p></td>'+
      	'<td><fieldset>'+
      		'<label for="typeP">PT</label>'+
      		'<select name="typeP" '+
      		'ng-options="option for option in {{pointsType}}"'+
      		'ng-model="point.type"></select>'+
      	'</fieldset></td>'+
      	'<td ng-repeat="p in point.list"><fieldset>'+
      		'<label for="x">X<sup>{{$index}}</sup></label>'+
      		'<input name="x" ng-model="p[0]">'+
      		'</fieldset>'+
      		'<fieldset>'+
      		'<label for="y">Y<sup>{{$index}}</sup></label>'+
			'<input name="y" ng-model="p[1]">'+
      	'</fieldset></td>'+
 
      '</tr>'+
      '</table>',

      link:function(scope){console.log(scope)},
     }
});


// directive for dealing events on artboard
svgFiddleDirectives.directive('drawEvents',function(){
    return{
      restrict:'A',
      controller: 'DrawEventsCtrl',

      
      
    };
  });



// directive for vectors

//directive for path template
svgFiddleDirectives.directive('drawPath',function(){

   return {
      restrict:'A',
      controller:'DrawCtrl',
      controllerAs:'drw',
      scope:{
        attr:'=attributes'
      },
      template: '<path></path>',
      link: function(scope, el, attrs, ngModel){
      	var path = el.find('path')[0];
      	
      	//dinamically include all attributes in the attr {}
      	function updateAttr (){
      		
      		//reset attributes
  		    while(path.attributes.length > 0)
  		 	path.removeAttribute( path.attributes[0].name );

      		//repopulate atributes
      		for ( var a in scope.attr){
      	     	path.setAttribute(a , scope.attr[a] )
      		};
      	};

      	scope.watchAttr = function (){
      		return scope.attr
      	};

      	scope.$watchCollection( scope.watchAttr, updateAttr	);

  

      }
    }
});

//directive for drawing points inside the drawPath directive
svgFiddleDirectives.directive('drawPoints',function(){
    return {
      restrict:'EA',
      controller:'drawPointsCtrl',
      scope:{
        points:'='
      },
      //controller:function($scope,$element,$attrs){},
      template:'<g ng-repeat="segment in points track by $index" >\
      <g ng-repeat="p in segment.list track by $index" >\
      <draw-single-point point="p" ></draw-single-point>\
      </g>\
      </g>',
      link: function(scope, el, attrs, ctrl){},
    }
})
.controller('drawPointsCtrl', function($scope, drawService){
     $scope.points= drawService.points
});


svgFiddleDirectives.directive('drawSinglePoint',function($document,$rootScope){
  return {
    restrict:'AE',
    replace:true,
      // controller: 'DrawCtrl',
      // controllerAs:'drw',
    // type:'svg',
    scope:{
      point:'=',
    },
    require: '?^drawPath',
    template:'<circle \
    ng-mousedown="$event.stopPropagation()" ng-attr-cx={{point[0]}} ng-attr-cy="{{ point[1] }}"\
    r="3" fill="black">',
  
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
     	 })

       //distinguish type of point ( if vector ) by color 
       scope.isLast = function(){
        return scope.$parent.$last
       }
        scope.$watch(scope.isLast,function(){
          (!scope.$parent.$last)?
          el.css({ fill:'blue'}):
          el.css({ fill:'black'});
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

         
      };
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
        
       
      };

    }
  }
});


//directive for code in textarea
svgFiddleDirectives.directive('drawTextarea',function(){

   return {
      restrict:'AE',
      replace: false,
      scope: {
        code:'='
      },
      template:  "<label name='code'>SVG-Code </label>\
      <textarea name='code' ng-model='code' ></textarea>",
      }

});


/*svgFiddleDirectives.directive('drawCodeValid', function($filter){
	return{
		restrict:'A',																																												
		require:'ngModel',
		link: function(scope, element, attrs, ngModel) {
	      	/*if (!ngModel)
	      		return;
	      	scope.checkAttributes = function(){
	      		return scope.drw.attr
	      	}*/

	  //    scope.$watch( scope.checkAttributes , function(){
			// console.log(scope.drw.attr);
			// console.log(ngModel);
			// // ngModel.($filter('attrsToMarkup')(ngModel.$modelValue))

			// 	// console.log(v);
				
			// 	// return $filter('attrsToMarkup')(ngModel.$modelValue);
	  //  //   	 });
	  //    },true);

	   
	      	// ngModel.$parsers.unshift(function(x) {
	      	// 	return $filter('MarkupToAttrs')(x)
	      	// })
	  // 	}

	  // }
//})


