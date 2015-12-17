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
      template:
      '<table>'+
      '<tr ng-repeat="point in drw.artboard.points track by $index">'+
      	'<td><p>{{$index}}:</p></td>'+
      	'<td><fieldset>'+
      		'<label for="typeP">PT</label>'+
      		'<select name="typeP" '+
      		'ng-options="option for option in  drw.artboard.curveOp "'+
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

      link:function(scope){},
     }
});


// directive for dealing events on artboard 
  svgFiddleDirectives.directive('drawEvents',function(){
    return{
      restrict:'A',
      link: function(scope, el, attrs){
        var tollerance = 20;
        var down =Object.create(null);
        el.on('mousedown',mousedown);

        function mousedown(e){
          scope.drw.artboard.mousedown(e)
          scope.$digest();
          
          down.x = e.clientX;
          down.y = e.clientY;
        el.on('mousemove',mousemove);
        el.on('mouseup',mouseup);

        };

        function mousemove(e){
          
          if( Math.sqrt( Math.pow(e.clientX-down.x , 2) + Math.pow(e.clientY-down.y , 2) ) > tollerance){
         
              scope.drw.artboard.mousemove(e);
              scope.$digest();
          }else{
              scope.drw.artboard.mousemove.back(e);
              scope.$digest();
          }
        }

        
        function mouseup(e){
          if( Math.sqrt( Math.pow(e.clientX-down.x , 2) + Math.pow(e.clientY-down.y , 2) ) <= tollerance){
             scope.drw.artboard.mouseupLine(e);
             
          }/*else{ 
            scope.drw.artboard.mouseupCurve(e)
          };*/

        scope.$digest();
        el.off('mousemove',mousemove);
        el.off('mouseup',mouseup);
        
        }
      }
    }
  });


//directive for path template
  svgFiddleDirectives.directive('drawPath',function(){

   return {
      restrict:'AE',
      controller: 'DrawCtrl',
      controllerAs:'drw',
      template: '<path></path>',
      link: function(scope, el, attrs, ngModel){
      	var path = el.find('path')[0];
      	
      	//dinamically include all attributes in the attr {}
      	function updateAttr (){
      		
      		//reset attributes
  		    while(path.attributes.length > 0)
  		 	path.removeAttribute( path.attributes[0].name );

      		//repopulate atributes
      		for ( var a in scope.drw.attr){
      	     	path.setAttribute(a , scope.drw.attr[a] )
      		};
      	};

      	scope.watchAttr = function (){
      		return scope.drw.attr
      	};

      	scope.$watchCollection( scope.watchAttr, updateAttr	);

        scope.$on('pointMove', function (e, msg) {
          scope.drw.artboard.points[ msg[1] ].list[ msg[2] ]= msg[0];
          scope.$digest();
        });

      }
    }
});

//directive for drawing points inside the drawPath directive
svgFiddleDirectives.directive('drawPoints',function(){
    return {
      restrict:'EA',
      replace: true,
      scope:{
        points:'='
      },
      //controller:function($scope,$element,$attrs){},
      template:'<svg ng-repeat="point in points track by $index" >\
      <g ng-repeat="p in point.list track by $index" >\
      <draw-single-point point="p" ></draw-single-point>\
      </g>\
      </svg>',
      link: function(scope, el, attrs, ctrl){},
    }
});

svgFiddleDirectives.directive('drawSinglePoint',function($document){
  return {
    restrict:'AE',
    replace:true,
    // type:'svg',
    scope:{
      point:'=',
    },
    template:'<circle \
    ng-mousedown="$event.stopPropagation()" ng-attr-cx={{point[0]}} ng-attr-cy="{{ point[1] }}"\
    r="3" fill="black">',
  
    link:function(scope,el,attr){
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
    //drawPath.artboard.points[scope.$parent.$index]=[moveX,moveY];//rather pass this in the message
        scope.$emit("pointMove", [[ Number(el.attr('cx')) , Number(el.attr('cy')) ] , grannyIndex, parentIndex ]);

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
      controller: 'DrawCtrl',
      controllerAs:'drw',
      //scope: {},
      template:  "<label name='code'>SVG-Code </label>\
      <textarea name='code' ng-model='drw.code' ></textarea>",
     //draw-code-valid
      link: function(scope, element, attrs, ngModel) {
      	

       
      }
    }

});
svgFiddleDirectives.directive('drawCodeValid', function($filter){
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
	  	}

	  }
})

