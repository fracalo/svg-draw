// (function(){

//   'use strict';

// /* Filters */
// angular.module('draw.path')
// /*transform in an array like type (used for creating vector array*/ 
// .filter('toVectorArray',function(){
//   return function(ar){
//     if (ar.length === 0) return;
//     return ar.reduce(function(ac,x,i,ar){
//           if( x.type =='C' || x.type =='Q'){
//             ac.push({
//               type:'M',
//               list: [ ar[i-1].list[ ar[i-1].list.length - 1 ] ]
//               });
//             ac.push({
//               type:'L',
//               list: [ x.list[0] ]
//               });
//             ac.push({
//               type:'M',
//               list: [ x.list[ x.list.length - 1 ] ]
//               });
//             ac.push({
//               type:'L',
//               list: [ x.list[ x.list.length - 2 ] ]
//               });
//             }
//             return ac;
//         },[]);
//       };
// })

// /*from obj of path points and controlPoints to dval*/
// //sample point output  point=[type:'C', [22,33],[34,42],[66,88] ];
// .filter('arrayToDVal',function(){ 
//   return function(ar){
//       if (!ar)
//       return '';
//     var res = ar.reduce(function(ac,x,i,ar){
//           ac += x.type;
//           var tr = x.list.map(e => e.join(' '));
          
//           ac += tr.join(',') + ' ';
//           return ac;
//         },'');
//     return res.trim(); 
//     };
// })

// /*from (attrs) dval to explicit markup*/
// .filter('attrsToMarkup',function(){ 
//   return function(obj){
//     var str = '';

//     for (var k in obj){
//       str+= k + '="' + obj[k] + '" ';
//     }
//     return '<path '+str +' />';
//   };
  
// })

// .filter('markupToAttrs',function(){ 
//   return function(str){
//       var pattern= /d\s*=\s*"\s*(.*?)\s*"/;
//       var res = str.match(pattern);
//     return res[1];
//     };
// })

// .filter('dValToArray', function(){
//   return function(str){
//     if(!str || str === '')
//     return [];
  
//         var pat= /([A-Z][\d+|\s|,|\b]*)[^\A-Z]?/gi;

//         var res = [];
//         str.replace(pat,function(a){
//         var p={
//             list:[]
//          };
//          p.type = a.slice(0,1);
         
//          var points= a.slice(1).trim().split(/\s*,\s*/);
//          points.forEach(function(x){
//                 p.list.push( x.split(' ').map( item =>Number(item) ) );
//          });
         
//           res.push(p);
//         });
//       return res;
//   };
// })

// .filter('PromiseDValToArray', function(){
//   return function(str){
//     if(!str || str === '')
//     throw new Error('dValue isn\'t present');
  
//         var pat= /([A-Z][\d+|\s|,|\b]*)[^\A-Z]?/gi;

//         var res = [];
//         str.replace(pat,function(a){
//         var p={
//             list:[]
//          };
//          p.type = a.slice(0,1);
         
//          var points= a.slice(1).trim().split(/\s*,\s*/);
//          points.forEach(function(x){
//                 p.list.push( x.split(' ').map( item =>Number(item) ) );
//          });
         
//           res.push(p);
//         });
//       return res;
//   };
// })

// .filter('parsePointArray',function(){
//   // 
//   return function(ar){
//   var pat= /([^(M|L|C|Q|Z|S|A|H|V)])/;
//     ar.forEach( x => {
//       x.type = x.type.replace(pat, t =>{
//         if(x.list.length == 1 )
//         {return t='L';}

//         if(x-list.length == 2)
//         {return t='Q';}

//         if(x.list.length == 3)
//         {return t= 'C';}
//       });

//       x.list.forEach( a => {
//             if(a.length<2)
//             a[1]=a[0];

//             if(a.length>2)
//             a.splice(2,a.length);
//         })
//     });
//     return ar;
//   };
// })

// .filter('testParsePointArray',function(){
//   // 
//   return function(ar){
//   var pat= /([^(M|L|C|Q|Z|S|A|H|V)])/;
//     ar.forEach( (x,i) => {
//       x.type = x.type.replace(pat, t =>{
        
//       throw new Error('error on point # ' + i)

      
//       });

//       x.list.forEach( a => {
//             if(a.length<2)
//       throw new Error('error on point # ' + i+' (not enogh values)')

//             if(a.length>2)
//       throw new Error('error on point # ' + i+' (too many values)')

//         })
//     });
//     return ar;
//   };
// })

// .filter('parseMarkup',function(){
//   return function(str){
//     var obj = Object.create(null);
//     var pat = /([a-zA-Z\-]+)\s*=\s*"\s*(.*?)\s*"/g;

//     str.replace(pat,function(match, k, v){
//        obj[k]=v;
//     });
//     return obj;
//   };
// })

// .filter('parsePath',function($q){
//   return function(str){
  


//         var attrOp = ['fill','stroke','stroke-width','stroke-dasharray','stroke-linecap','d'];
//         var obj = Object.create(null);
//         var pat = /([a-zA-Z\-]+)\s*=\s*"\s*(.*?)\s*"/g;
//     return $q(function(resolve, reject){
//         str.replace(pat,function(match, k, v,offset){
      
//             //while parsing the string we can check attributes and values
//             if(attrOp.every( attr => attr !== k))
//             { reject(k +' isn\'t a supported attribute name '+ offset); }
//             obj[k]=v;
//         });

//         resolve(obj)
//     });


// //     var attrOp = ['fill','stroke','stroke-width','stroke-dasharray','stroke-linecap','d'];
// //     var obj = Object.create(null);
// //     var pat = /([a-zA-Z\-]+)\s*=\s*"\s*(.*?)\s*"/g;

// //     str.replace(pat,function(match, k, v){
      
// //       //while parsing the string we can check attributes and values
// //       if(attrOp.every( attr => attr !== k))
// //       { throw new Error(k +' is not a supported attribute name'); }

// // /*      if(k == 'd'){
// //       }*/

// //       obj[k]=v;
// //     });
// //     return obj;


//   }
// })
// /* modify's pathArray(dValue) when changing point type*/
// .filter('normalizePointType',function(){
//    function createP(bef , aft, n){
      
//       var res = [];
      
//       var dividers =
//         (n==2)?
//         [1.667, 2.5]:
//         [ 2 ];

//       dividers.forEach(i =>{
//         var p = [];
//         p[0] = (bef[0] + aft[0])/i |0;
//         p[1] = (bef[1] + aft[1])/i |0;
//         res.push(p);
//       });
//       return res;
//    }
//   return function(arr){
//     var before, after, p;
//     arr.forEach( function(x,i,arr){
//          if ((x.type === 'M' || x.type === 'L') && x.list.length !== 1){
//             x.list = x.list.splice(-1 , 1 );
//           }

//          if (x.type === 'Q' && x.list.length != 2){
//               if ( ! (arr[i-1]) ){
//                 x.type = 'M';
//                 return;
//               }

//               if(x.list.length<2){
//                    before = arr[i-1].list[ arr[i-1].list.length  - 1 ];
//                    after = x.list[0];
//                    p = createP(before,after);
                  
//                   x.list.unshift( p[0] );
//               }else{
//                   x.list = x.list.splice(-2 , 2 );
//               }

//           }

//           if (x.type === 'C' && x.list.length !== 3){
//               if ( ! (arr[i-1]) ){
//                 x.type = 'M';
//                 return;
//               }
//               //it seems er're adding some points to list
//                 before = arr[i-1].list[ arr[i-1].list.length  - 1 ];
//                 after = x.list[0];
 
//               if (x.list.length === 2){
//                    p = createP(before,after);
//                   x.list.unshift( p[0] );
//               }
//               if (x.list.length === 1){
//                    p = createP(before,after,2);
//                   x.list = p.concat(x.list);
                  
//               }
//           }
//         });
//         return arr;
//       };
// })

// })();
// (function(){

//   'use strict';

// /* Controllers */
// angular
//   .module('draw.path')
//   .controller('DrawCtrl',DrawCtrl)

//   DrawCtrl.$inject = ['$scope', '$filter' , '$timeout','drawService', 'drawPathAttr', 'drawVectorAttr']
  
//   function DrawCtrl($scope, $filter, $timeout, drawService, drawPathAttr, drawVectorAttr) {
//     var tmpAttr, tmpArr;
//     var drw = this;
//    };
   
// })();

// (function(){

//   'use strict';

// /* Controllers */
// angular
//   .module('draw.path')
//   .controller('DrawEventsCtrl',DrawEventsCtrl)

//   DrawEventsCtrl.$inject = ['$scope', '$element' , '$attrs','$rootScope','drawService']; 

//  function DrawEventsCtrl($scope, $element, $attrs, $rootScope, drawService){
//         var tollerance = 20;
//         var down =Object.create(null);

//         var artboard = drawService;
        
//         $element.on('mousedown',mousedown);

//         function mousedown(e){
//           artboard.mousedown(e);
//           $scope.$digest();
          
//           down.x = e.clientX;
//           down.y = e.clientY;
//         $element.on('mousemove',mousemove);
//         $element.on('mouseup',mouseup);
//         }

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
//          }

//         $scope.$digest();
//         $element.off('mousemove',mousemove);
//         $element.off('mouseup',mouseup);
        
//         }
//         $rootScope.$on('pointMove', function (e, msg) {
//           artboard.points[ msg[1] ].list[ msg[2] ]= msg[0];
//           $scope.$digest();

//         });

// }
// })();

// controller for drawPath 

// +function(){
// 	'use strict';
// 	angular
// 		.module('draw.path')
// 		.controller('drawPathCtrl', drawPathCtrl)

// 		function drawPathCtrl($scope, drawPathAttr){

//             var path = $element.find('path')[0];

//             var checkAttr = function(){
//                 return drawPathAttr.attributes;
//             };

//            //dinamically include all attributes in the attr {}
//             function updateAttr(){

//               $scope.attr = drawPathAttr.attributes;

//               //reset attributes
//               while(path.attributes.length > 0)
//               path.removeAttribute( path.attributes[0].name );

            
//                   //repopulate atributes
//                   for ( var a in $scope.attr){
//                         path.setAttribute(a , $scope.attr[a] );
//                   }

//             }

//             $scope.$watchCollection( checkAttr , updateAttr );

//          };

// }();
/*(function(){
  'use strict';


//directive module
angular
    .module('draw.path')
    .controller('drawPointsCtrl', drawPointsCtrl);
    
    drawPointsCtrl.$inject = ['$scope','drawService'];
    
    function drawPointsCtrl($scope, drawService){
         var watchPoints = function(){
          return drawService.points;
         };
         $scope.$watch(watchPoints, function(){
          $scope.points = drawService.points;
         });
    }
})();*/
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
// directive that dialogs with user showing exceptions on attributes names
// or common value types
// that are being stored in the drawValidation
(function(){
	'use strict';
	angular
		.module('draw.path')
		.directive('drawExcept' , drawExcept);

	drawExcept.$inject = ['drawValidation','drawData'];

	function drawExcept(drawValidation,drawData){
		return {
			restrict:'EA',
			template:
			"<div ng-repeat='i in exc.list'>"+
			"	<p>error:{{i.issue}}</p>"+
			"	<span class='glyphicon glyphicon-remove' ng-click='exc.deleteError($index)'></span>"+
			"</div>",
			controllerAs:'exc',
			controller: function($scope,drawValidation,drawData){
				var self = this;
				this.list = drawValidation.list;
				
				$scope.$watch(watchNode,function(){
					
					//\\ this is responsible  also for starting the creation of Gui-points etc. //\\
					drawValidation.checkExc();
					self.list = drawValidation.list.specific;
				});
				
				function watchNode(){
					return drawData.node;
				}
				
				this.deleteError = drawValidation.deleteError;
			}
		};
	}
})();


//directive for code in textarea

// (function(){

//   angular
//     .module('draw.path')
//     .directive('drawPath',drawPath)
      
//       function drawPath(){
//             return {
//           restrict:'A',
//           controller:function($scope, $element, drawPathAttr){

//             var path = $element.find('path')[0];

//             var checkAttr = function(){
//                 return drawPathAttr.attributes;
//             };

//            //dinamically include all attributes in the attr {}
//             function updateAttr(){

//               $scope.attr = drawPathAttr.attributes;

//               //reset attributes
//               while(path.attributes.length > 0)
//               path.removeAttribute( path.attributes[0].name );

            
//                   //repopulate atributes
//                   for ( var a in $scope.attr){
//                         path.setAttribute(a , $scope.attr[a] );
//                   }

//             }

//             $scope.$watchCollection( checkAttr , updateAttr );

//           },
//           scope:{},
//           template: '<path />',
//               }; 
//       };


// })();
//directive for code in textarea

(function(){

  angular
    .module('draw.path')
    .directive('drawPointsList',drawPointsList)
      
      function drawPointsList(){
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
      };


})();
//directive for drawing points inside the drawPath directive

(function(){
'use strict';
  angular
    .module('draw.path')
    .directive('drawPoints',drawPoints)
      
      function drawPoints(){
        return {
          restrict:'A',
          scope:{
            points:'='
          },
          template:
          '<g ng-repeat="el in points track by $index" >'+
          '   <g ng-repeat="p in el track by $index" draw-single-point point="p">'+
          '</g>',
          // template:
          // '<g ng-repeat="segment in dpc.points track by $index" >'+
          // '   <g ng-repeat="p in segment.list track by $index" >'+
          // '      <draw-single-point point="p" ></draw-single-point>'+
          // '   </g>'+
          // '</g>',
          
          // link:function(scope,el){
          //   console.log(scope,el)
          //   scope.$watch('dpc.points',function(n){
          //     console.log(n);
          //   },true)
          // },

          // controller:'DrawPointsCtrl',
          // controllerAs:'dpc',
          // controller:function($scope, drawDisassemble){
          //   $scope.points = drawDisassemble.structure;

          //   var  watchStructure = function(){
          //     return drawDisassemble.structure;
          //   }

          //   $scope.$watch( watchStructure() ,
          //     function(n){
          //       $scope.points = n ;
          //       console.log(42)
          //     },true);




          // }

          };
      };


})();
//directive for drawing single point inside the drawPath directive
(function () {
    'use strict';
    angular
        .module('draw.path')
        .directive('drawSinglePoint', drawSinglePoint);
    drawSinglePoint.$inject = ['$document', '$rootScope','drawDeconstruct', 'drawPointRelation'];

    function drawSinglePoint($document, $rootScope, drawDeconstruct ,drawPointRelation) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                point: '='
            },
            template: ' <circle ' +
                'ng-mousedown="$event.stopPropagation()" ' +
                'ng-attr-cx="{{point.x}}" ng-attr-cy="{{point.y}}" ' +
                'r="3" fill="{{point.color}}" index={{$index}} />',
            link: function (scope, el, attr) {
                // scope.point.color = (scope.point.color) ? scope.point.color : 'blue';
                var startX, startY;
                var sketchEl = $document;
                var grannyIndex = scope.point.hashSvg; //scope.$parent.$parent.$index;//will use hashsvg for tracking element
                var parentIndex = scope.$parent.$index;
                //change pointer when onover
                el.on('mouseover', function (ev) {
                    el.css({
                        cursor: 'crosshair'
                    });
                });
                //where keeping track of this event in DrawCtr
                el.on('mousedown', function (ev) {
                    ev.preventDefault();
                    el.css({
                        stroke: 'red',
                        cursor: 'crosshair'
                    });
 
                    startX = ev.pageX - el.attr('cx');
                    startY = ev.pageY - el.attr('cy');

                    
                    sketchEl.on('mousemove', mousemove);
                    sketchEl.on('mouseup', mouseup);
                });

                var org,relRes;
                $rootScope.$on('pointMove',function(_,a){
                   org = { 
                        point   :{x:Number(el.attr('cx')), y:Number(el.attr('cy'))},
                        elemHash:   grannyIndex,
                        index   :   parentIndex
                    };
                    if(scope.point.pathPointType)
                    org.pathPointType = scope.point.pathPointType;
                    if(scope.point.relative)
                    org.relative = scope.point.relative;

                    relRes = drawPointRelation.relate(org,a);
                    
                    if( relRes ){
                        if( scope.point.specialPathCom ==='V' ){
                            el.attr('cx', relRes[0])
                        } else if ( scope.point.specialPathCom ==='H' ){
                            el.attr('cy', relRes[1])
                        } else {
                            el.attr('cx', relRes[0]) , el.attr('cy', relRes[1]) ;
                        }
                    }
                });

                var res, moveX, moveY,startPoint;
                function mousemove(ev) {
                    ev.stopPropagation();
                    moveX = ev.pageX - startX;
                    moveY = ev.pageY - startY;

                    startPoint = { x: el.attr('cx') , y: el.attr('cy') } ;
                   if(scope.point.oneAxis && scope.point.oneAxis === 'horizontal'){
                        el.attr('cx', moveX);
                    }else if(scope.point.oneAxis && scope.point.oneAxis === 'vertical'){
                        el.attr('cy', moveY);
                    }else{
                        el.attr('cx', moveX);
                        el.attr('cy', moveY);
                    }
                   res = { 
                        point   :{x:Number(el.attr('cx')), y:Number(el.attr('cy'))},
                        elemHash:   grannyIndex,
                        index   :   parentIndex,
                        start   :   startPoint,
                    };

                    if(scope.point.pathPointType)
                    res.pathPointType = scope.point.pathPointType;

                    if(scope.point.relative)
                    res.relative = scope.point.relative;

                    $rootScope.$emit("pointMove", res );//this event is for -> drawSvg
                    drawDeconstruct.movement(res);      //this is for the service directly 

                }
                function mouseup(ev) {
                    ev.stopPropagation();
                    scope.point.x = startPoint.x = el.attr('cx');
                    scope.point.y = startPoint.y = el.attr('cy');
                    
                    res = { 
                        point   :{x:Number(el.attr('cx')), y:Number(el.attr('cy'))},
                        elemHash:   grannyIndex,
                        index   :   parentIndex,
                        start   :   startPoint,
                        mouseup :   true
                    };

                    $rootScope.$emit("pointMove", res );
                    drawDeconstruct.movement(res);

                    sketchEl.off('mousemove', mousemove);
                    sketchEl.off('mouseup', mouseup);
                    el.css({
                        stroke: 'none',
                        cursor: 'auto'
                    });
                }
            }
        };
    }
})();

//directive for code in textarea

(function(){
 'use strict';
  angular
    .module('draw.path')
    .directive('drawSvg',drawSvg);

    drawSvg.$inject =['$compile', 'drawData','$rootScope'];
      
      function drawSvg($compile, drawData, $rootScope){
        return function(scope, element, attrs) {
          scope.$watch(
            function() {
               // watch  'code' expression for changes
              return scope.$eval(attrs.drawSvg);
            },
            function(value) {
              element.html(value);
              var inner = element.contents();
              $compile(inner);/*(scope)*/
              /* we don't need scope as it's just reactiong to external changes*/
            
            /*the setNode method sets data in drawData,
              we store the node that's been compiled by angular*/
             drawData.setNode(inner,value) ;
             /**********this starts some woggieboggie*********/ 
            });
          
         $rootScope.$on("pointMove",function(n, msg){
          drawData.changeNode(msg)
         })
        
          
        };
      }

})();
//directive for code in textarea

(function(){
'use strict';
  angular
    .module('draw.path')
    .directive('drawTextarea',drawTextarea);

    drawTextarea.$inject = ['drawData'];

    function drawTextarea(){

        return {
            restrict:'AE',
            replace: false,
            scope: {
                code:'='
            },
            template:
            "<label name='code'>SVG-Code </label>"+
            "<textarea name='code' ng-model='inside.code' ></textarea>",
            controllerAs:'inside',
            controller:function($scope, $timeout,$rootScope,drawData){

                var wait, lastValid;
                var inside = this;
                this.code = $scope.code;
                $scope.$watch('code',function(n,o){
                    inside.code = n;
                })

                $scope.$watch(
                    'inside.code',
                    function(n,o){
                          
                        //cancel $timeout if exists
                        if(wait){
                          $timeout.cancel(wait);
                          wait = null;
                        }
                        //crate a lastValid code before starting to type
                        if(!lastValid){
                          lastValid = o;
                        }


                        // add a timeout for waiting typing
                        wait = $timeout( function(){
                            $scope.code = n;
                        }  , 900);
                    }
                );

                $rootScope.$on('pointMove',function(){
                    inside.code = drawData.getStr();
                    $scope.$digest()
                })
            }
        };
    }

})();

     // controller:function(
          //   $scope, $filter, $timeout, drawPathAttr, drawVectorAttr, drawService,codeInput,exception){
       
          /*watch changes in drawPoints factory(mouse events or other inputs)*/
        //   function watchPoints(){
        //     return drawService.points
        //   }

        //   // watch point type changes
        //   $scope.$watch(watchPoints, function(){
        //         /*update path and vector based on drawService.points */
        //         drawPathAttr.attributes.d = drawService.dValue();
        //         drawVectorAttr.attributes.d = drawService.vectorDValue();

        //         /*update code based on drawPathAttr.attributes*/
        //         $scope.code = drawService.code(drawPathAttr.attributes);
        // },true);

        



        // var wait, lastValid;
        

        

        // $scope.$watch('code',function(n,o){
              
        //     //cancel $timeout if exists
        //     if(wait){
        //       $timeout.cancel(wait);
        //       wait = null;
        //     }
        //     //crate a lastValid code before starting to type
        //     if(!lastValid){
        //       lastValid = o;
        //     };


        //     // add a timeout for waiting typing
        //     wait = $timeout( function(){ checkAndUpdate(n) } , 800);
        
        // });
            
        //   function checkAndUpdate(input){
      
        //     var attrPairs =
        //     //this is converting attributes and checking keys
        //       codeInput.parseAttr(input)
        //         .then(function(res){
        //           return res;
        //         });

        //       //once the key/attr is returned this checks for errors
        //       //only interested in the rejection of this promise
        //       //doesn't deserve a prompt, user can live with this
        //       attrPairs
        //         .then(codeInput.checkKeys)
        //         .then(null, function(e){
        //           console.log(e, ' from hell');
        //           exception.setError(e)
        //         })



        //         //.then(null,function(e){console.log(e)});

        //       //check and set dValue 
        //       var dValueCheck = 
        //       attrPairs
        //         .then(
        //               codeInput.checkDvalArrify,
        //               function(e){
        //                 console.log(e);
        //                 exception.setError(e);
        //               }
        //               )
        //         .then(
        //       //codeInput.checkDvalArrify, is returning the array ready to be updated
        //               function(res){
        //                   drawService.setPoints(res);
        //               },
        //               function(e){  console.log(e);
        //                       if(confirm(e+ "\n do you want to revert to last valid value?") )
        //                         {
        //                         //for recovering force update right away and reset $scope.code
        //                          checkAndUpdate(lastValid)
        //                          $scope.code = lastValid;
        //                         }
        //                 }
        //               )
        //         .finally(
        //               function(){
        //                          //set lastValid to null so it can be reset
        //                           lastValid = null;
                              
        //                         }
        //               );

        //           //once d-value is checked update all attributes in drawPathAttr
        //            dValueCheck.then(
        //                attrPairs.then(
        //                     function(res){
        //                       drawPathAttr.setAttr(res);

        //                     }));
        //       };
            
        //   },
//directive for code in textarea

(function(){

  angular
    .module('draw.path')
    .directive('drawVector',drawVector)
function drawVector(){
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
          template: '<path />',
        }; 
};


})();
// (function(){
// 	angular
// 		.module('draw.path')
// 		.service('codeInput', codeInput);

// 	codeInput.$inject = ['$q'];


// 	function codeInput($q){
// 	return {
// 		parseAttr:function(str){ 
// 			var obj = Object.create(null);
//         	var pat = /([a-zA-Z\-]+)\s*=\s*"\s*(.*?)\s*"/g;
//     		return $q(function(resolve, reject){
//         		str.replace(pat,function(match, k, v,offset){
      
//             	obj[k]=v;
//         		});

//         	resolve(obj);
//         	});
// 		},
// 			//also need to add errorcallback on Promise:
// 			//-wrong node wraps -etc,,

// 		checkKeys: function(res){
// 			 var attrOp = ['fill','stroke','stroke-width','stroke-dasharray','stroke-linecap','d'];
// 			 var keys = Object.keys(res);
// 			 var filteredArray = keys.filter(k => {
// 			 			 return (attrOp.every( attr => attr !== k));
// 			 });
// 			 return $q(function(resolve, reject){
// 			 	if( filteredArray.length > 0){
// 			 	 return reject(filteredArray +' isn\'t a supported attribute name ');
// 			 	}
// 			 	//this is not a fatal errot so always fullfill it
// 			 	 // console.log(res)
// 			 	 // return resolve(res);
			 	
			 	
// 			 });
// 		},



// 		checkDvalArrify : function(code){
// 			var d = code.d;
// 			var list = dValToList(d);
// 			var pat= /([^(M|L|C|Q|Z|S|A|H|V)])/;
// 			return $q (function(resolve,reject){
// 				list.forEach ( (x,i) => {
// 					x.type.replace( pat, t => {
// 						reject('error on point # ' +i+' - ' +t+ ': wrong point type')
// 					});

// 					x.list.forEach( a => {
//             			if(a.length<2)
//                  		reject('error on point # ' + i+' (not enough values)')

//            				if(a.length>2)
//       					reject('error on point # ' + i+' (too many values)')
//         			})
// 				});
// 			//resolve the d value ready to be set in next fullfillment
// 				resolve(list);
// 			});
// 		}

// 	};

// 		function dValToList(str){
// 	    if(!str || str === '')
// 	    return [];
	  
// 	        var pat= /([A-Z][\d+|\s|,|\b]*)[^\A-Z]?/gi;

// 	        var res = [];
// 	        str.replace(pat,function(a){
// 	        var p={
// 	            list:[]
// 	         };
// 	         p.type = a.slice(0,1);
	         
// 	         var points= a.slice(1).trim().split(/\s*,\s*/);
// 	         points.forEach(function(x){
// 	                p.list.push( x.split(' ').map( item =>Number(item) ) );
// 	         });
	         
// 	          res.push(p);
// 	        });
// 	      return res;
// 	  	};


// };

// })();
// drawAssemble is used to update SVG and update the GUI value every time a certain attribute is modified.
// utility of drawData
// Process:
// 
// drawData.changeNode calls for an updated (this is binded to mousemove).  
// through a pointer on the DOMobject we modify it changing the SVGLegth attributes (also SVGPointsList and PathDataPointList).
// if there any related points effected we adjust these in drawDeconstruct.structure, but
// in GUI the actula point position is changed by the drawSinglePoint directive (with drawPointRelation).
// we return the updated value to drawData preparing the argument for drawData.stringUpdate()



(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawAssemble', drawAssemble);
	
	drawAssemble.$inject = ['drawDeconstruct' , 'drawStrCode'];

	function drawAssemble( drawDeconstruct, drawStrCode ) {
		// add methods on proto
		if(SVGLength.prototype && !SVGLength.prototype.updateConvertSVGLen)
		SVGLength.prototype.updateConvertSVGLen = function(v){
			this.oldVal = this.unitType;
			//TODO transform value and update after
			this.newValueSpecifiedUnits(1, v);
			this.convertToSpecifiedUnits(this.oldVal);
		};

		return {
			path:path,
			polygon:polygon,
			polyline:polygon,
			rect:rect,
			circle:circle,
			ellipse:ellipse,
			line:line,
			resetPathDiff: resetPathDiff,

		};
		function resetPathDiff(){
			path.xDiff = null;
			path.yDiff = null;
		}
		function path(p,obj){

			path.pointByI = obj.pathDataPointList[p.index];

			path.xDiff = path.xDiff ? path.xDiff :
			obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI * 2 ] -
			obj.pathDataAbsolutize[ path.pointByI.comI ].values[ path.pointByI.subI * 2 ];
			path.yDiff = path.yDiff ? path.yDiff :
			obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI * 2 + 1] -
			obj.pathDataAbsolutize[ path.pointByI.comI ].values[ path.pointByI.subI * 2 + 1];

			if( path.pointByI.command ==='v' || path.pointByI.command ==='V' ){
				//we need to use Xdiff in this case because it rappresents the first (and only) value
				obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI   ] = path.pointByI.y = p.point.y + path.xDiff;
				obj.attributes.d = drawStrCode.preUpdateD( obj , path.pointByI , [ [path.pointByI.subI  , path.pointByI.y] ]);

			}else if( path.pointByI.command ==='h' || path.pointByI.command ==='H' ){
				obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI   ] = path.pointByI.x = p.point.x + path.xDiff;
				obj.attributes.d = drawStrCode.preUpdateD( obj , path.pointByI , [ [path.pointByI.subI  , path.pointByI.x] ]);
			}else{
				obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI * 2 ]     = path.pointByI.x = p.point.x + path.xDiff;
				obj.pathData[ path.pointByI.comI ].values[ path.pointByI.subI * 2 + 1 ] = path.pointByI.y = p.point.y + path.yDiff;
				obj.attributes.d = drawStrCode.preUpdateD( obj , path.pointByI ,
					[ [path.pointByI.subI * 2 , path.pointByI.x] , [path.pointByI.subI * 2 + 1, path.pointByI.y] ]) ;

			}

			obj.domObj.setPathData(obj.pathData);

			return [ obj.hashSvg , ['d', obj.attributes.d] ];
		}



		function polygon(p,obj){

			obj.pointList.points[p.index].x = p.point.x;
			obj.pointList.points[p.index].y = p.point.y;

			obj.attributes.points = 
			drawStrCode.preUpdatePoints( obj , p.index ,[ ['x',p.point.x] , ['y',p.point.y] ]) ;
			
			return [ obj.hashSvg , ['points', obj.attributes.points] ];
		}


		function rect(p, obj){
			var attrObj = obj.attributes;
			var oldX, oldY ;

			rect.start = function(p, attrObj){
				oldX = obj.attrsLength.x.baseVal.value;
				oldY = obj.attrsLength.y.baseVal.value;

				obj.attrsLength.x.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.y.baseVal.updateConvertSVGLen(p.point.y);

				// update attributes obj
				attrObj.x = obj.attrsLength.x.baseVal.valueAsString;
				attrObj.y = obj.attrsLength.y.baseVal.valueAsString;

				//adjust end point
				drawDeconstruct.structure[obj.hashSvg][1].x += p.point.x - oldX;
				drawDeconstruct.structure[obj.hashSvg][1].y += p.point.y - oldY;

				return [ obj.hashSvg , ['x',attrObj.x] , ['y',attrObj.y] ];
			};
			rect.end   = function(p, attrObj){
				attrObj.width  = p.point.x - attrObj.x;
				attrObj.height = p.point.y - attrObj.y;

				obj.attrsLength.width.baseVal.updateConvertSVGLen(
					p.point.x - obj.attrsLength.x.baseVal.value
				);
				obj.attrsLength.height.baseVal.updateConvertSVGLen(
					p.point.y - obj.attrsLength.y.baseVal.value
				);

				attrObj.width  = obj.attrsLength.width.baseVal.valueAsString;
				attrObj.height = obj.attrsLength.height.baseVal.valueAsString;

				return [ obj.hashSvg , ['width',attrObj.width] , ['height',attrObj.height] ];
			};

			if(p.index === 0)
			return rect.start(p,attrObj);

			return rect.end(p,attrObj);
		}


		function circle(p, obj){
			var attrObj = obj.attributes;
			var oldCx, oldCy ;

			circle.center = function(p, attrObj){
				oldCx = obj.attrsLength.cx.baseVal.value;
				oldCy = obj.attrsLength.cy.baseVal.value;
				
				// convert it to old orig 
				obj.attrsLength.cx.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.cy.baseVal.updateConvertSVGLen(p.point.y);

				// update attributes obj 
				attrObj.cx = obj.attrsLength.cx.baseVal.valueAsString;
				attrObj.cy = obj.attrsLength.cy.baseVal.valueAsString;

				//adjust radius point
				drawDeconstruct.structure[obj.hashSvg][1].x += p.point.x - oldCx;
				drawDeconstruct.structure[obj.hashSvg][1].y += p.point.y - oldCy;

				return [ obj.hashSvg , ['cx',attrObj.cx] , ['cy',attrObj.cy] ];

			};

			circle.rad = function(p, attrObj){
				obj.attrsLength.r.baseVal.updateConvertSVGLen( 
					pytha(
					[obj.attrsLength.cx.baseVal.value, obj.attrsLength.cy.baseVal.value],
					[p.point.x, p.point.y]
					)
				);
				attrObj.r = obj.attrsLength.r.baseVal.valueAsString;
				return [ obj.hashSvg , ['r',attrObj.r] ];


			};

			// check if it's the point responsible for center[0](cx and cy) or rad[1]
			// and use corresponding function property
			if (p.index === 0)
			return circle.center(p,attrObj);
			
			return circle.rad(p,attrObj);
		}

		function ellipse(p, obj){
			var attrObj = obj.attributes;
			var oldCx, oldCy ;

			ellipse.center = function(p, attrObj){
				oldCx = obj.attrsLength.cx.baseVal.value;
				oldCy = obj.attrsLength.cy.baseVal.value;

				obj.attrsLength.cx.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.cy.baseVal.updateConvertSVGLen(p.point.y);

				attrObj.cx = obj.attrsLength.cx.baseVal.valueAsString;
				attrObj.cy = obj.attrsLength.cy.baseVal.valueAsString;


				//adjust both radius point
				drawDeconstruct.structure[obj.hashSvg][1].x += p.point.x - oldCx;
				drawDeconstruct.structure[obj.hashSvg][1].y += p.point.y - oldCy;
				drawDeconstruct.structure[obj.hashSvg][2].x += p.point.x - oldCx;
				drawDeconstruct.structure[obj.hashSvg][2].y += p.point.y - oldCy;

				return [ obj.hashSvg , ['cx',attrObj.cx] , ['cy',attrObj.cy] ];
			};

			ellipse.radX = function(p, attrObj){
				obj.attrsLength.rx.baseVal.updateConvertSVGLen(
					pytha(
					[obj.attrsLength.cx.baseVal.value, obj.attrsLength.cy.baseVal.value],
					[p.point.x, p.point.y] )
				);
				attrObj.rx = obj.attrsLength.rx.baseVal.valueAsString;
				return [ obj.hashSvg , ['rx',attrObj.rx] ];
			};

			ellipse.radY = function(p, attrObj){
				obj.attrsLength.ry.baseVal.updateConvertSVGLen(
					pytha(
					[obj.attrsLength.cx.baseVal.value, obj.attrsLength.cy.baseVal.value],
					[p.point.x, p.point.y] )
				);
				attrObj.ry = obj.attrsLength.ry.baseVal.valueAsString;
				return [ obj.hashSvg , ['ry',attrObj.ry] ];
			};

			if (p.index === 0)
			return ellipse.center(p,attrObj);
			
			if (p.index === 1)
			return ellipse.radX(p,attrObj);

			return ellipse.radY(p,attrObj);
		}
		function line(p, obj){
			var attrObj = obj.attributes;

			line.x = function(p, attrObj){
				obj.attrsLength.x1.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.y1.baseVal.updateConvertSVGLen(p.point.y);
				attrObj.x1 = obj.attrsLength.x1.baseVal.valueAsString;
				attrObj.y1 = obj.attrsLength.y1.baseVal.valueAsString;

				return [ obj.hashSvg , ['x1',attrObj.x1] , ['y1',attrObj.y1] ];
			};
			line.y = function(p, attrObj){
				obj.attrsLength.x2.baseVal.updateConvertSVGLen(p.point.x);
				obj.attrsLength.y2.baseVal.updateConvertSVGLen(p.point.y); 
				attrObj.x2 = obj.attrsLength.x2.baseVal.valueAsString;
				attrObj.y2 = obj.attrsLength.y2.baseVal.valueAsString;

				return [ obj.hashSvg , ['x2',attrObj.x2] , ['y2',attrObj.y2] ];
			};
			if (p.index === 0)
			return line.x(p,attrObj);
			
			return line.y(p,attrObj);
		}

		function pytha(c,r){
			return Math.sqrt( Math.pow(c[0]-r[0],2) + Math.pow(c[1]-r[1],2) ) | 0 ;
		}
		function absInt(x) { //https://jsperf.com/math-abs-vs-bitwise/7
            return (x ^ (x >> 31)) - (x >> 31);
      	}
	}

})();


(function(){
	'use strict';
	angular
		.module('draw.path')
		.factory('drawAttributes',drawAttributes);


	function drawAttributes(){
		return {
			basic:basic(),
			present:presentational(),
			lenVal : lenVal(),
		};
	}
	function lenVal() {
		return ['r' ,'cy' ,'cx','rx','ry','x1','x2','y1','y2','width','height'];
	}
	function basic(){
		return{
			circle:[
				{ prop:'r'} ,
				{ prop:'cy'} ,
				{ prop:'cx'}
			],
			ellipse:[
				{ prop:'rx'} ,
				{ prop:'ry'} ,
				{ prop:'cy'} ,
				{ prop:'cx'}
			],
			line:[
				{ prop:'x1'} ,
				{ prop:'x2'} ,
				{ prop:'y1'} ,
				{ prop:'y2'}
			],
			path:[
				{prop:'d'}
				],
			polygon:[
				{prop:'points'}
			],
			polyline:[
				{prop:'points'}
			],
			rect:[
				{prop:'x'},
				{prop:'y'},
				{prop:'width'},
				{prop:'height'},
				{prop:'rx', renderOpt:true},
				{prop:'ry', renderOpt:true},
			],
		};
	}
	function presentational(){
		return[
			'alignment-baseline',
			'baseline-shift',
			'clip',
			'clip-path',
			'clip-rule',
			'color',
			'color-interpolation',
			'color-interpolation-filters',
			'color-profile',
			'color-rendering',
			'cursor',
			'direction',
			'display',
			'dominant-baseline',
			'enable-background',
			'fill',
			'fill-opacity',
			'fill-rule',
			'filter',
			'flood-color',
			'flood-opacity',
			'font-family',
			'font-size',
			'font-size-adjust',
			'font-stretch',
			'font-style',
			'font-variant',
			'font-weight',
			'glyph-orientation-horizontal',
			'glyph-orientation-vertical',
			'image-rendering',
			'kerning',
			'letter-spacing',
			'lighting-color',
			'marker-end',
			'marker-mid',
			'marker-start',
			'mask',
			'opacity',
			'overflow',
			'pointer-events',
			'shape-rendering',
			'stop-color',
			'stop-opacity',
			'stroke',
			'stroke-dasharray',
			'stroke-dashoffset',
			'stroke-linecap',
			'stroke-linejoin',
			'stroke-miterlimit',
			'stroke-opacity',
			'stroke-width',
			'text-anchor',
			'text-decoration',
			'text-rendering',
			'unicode-bidi',
			'visibility',
			'word-spacing',
			'writing-mode'
		]
	}

})();
// drawDCommands is a utility of drawDeconstruct to specifically check path's dValue
// it parses each command checking for certain types of errors
// in the response it stores  
//			return{
//				bool: false,
//				descr:'',
//				dStructure:'' //this will help creating a pointRappresentation
//			};

(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawDCommands',drawDCommands);

	function drawDCommands(){
		
		return {
			run: run,
		};

		function run(x){
			run.alienChar = /([^\d .,mlhvzcsqta-])/gi ;
			x = x.toString();
			var alienChar = x.match(run.alienChar);
			if(alienChar)
			/***** first exit ****/
				return{   
					bool: false,
					descr:'invalid point value char.: ' + alienChar.join(' | ')
				};

			
			run.patt = /([a-z]) *((-?\d+(\.\d+)?( *, *| *))+)z?/gi;
			var captureData=[]; // additional information for next exit
			var stringAnalisis = (function(){
				var count= 0;
				return x.replace(run.patt,function(m,a,b){
					// storing some precious data that's beibg checked as it's piped in
					captureData.push( dCommCheck(count,a,b) );

					count++;
					return '' ;
				});
			})();
			//if the string hasn't been completly matched we return
			if( stringAnalisis !== '' )
			/***** second exit ****/
				return {
					bool : false,
					descr: 'problems with char.: '+ stringAnalisis.split('') +' in your \'d\' value'
				};


			if ( ! captureData.every(( x , i ) => {
				return captureData.lastI = i ,
						x.bool === true;
			}) )
			/***** third exit ****/
				return {
					bool : false,
					descr: 'with command: '+ captureData[captureData.lastI].type +' | wrong args ('+ captureData[captureData.lastI].val+')'
				};

			
			/*** finally if we got here it should be true ***/
				return {
					bool : true,
					valueOpt : captureData
				};
		}

		// this methods check that each d_val command has the correct args ( number ..) .
		// it returns:
		//	 	bool  : boolean,
		//	 	index : counter,
		//	 	type  : 'm|l|C...',
		//	 	args  : [  ]
		function dCommCheck(count,type,val){
				dCommCheck.specs={
					m : [ 2 ],		l : [ 2 ],
			 		h : [ 1 ], 		v : [ 1 ],
					s : [ 4 ],		q : [ 4 ],		t : [ 2 ],
					c : [ 6  ,  'poly' ],			a : [ 7  , 'arc' ] 
				};
				var typeLow = type.toLowerCase();
				
				return dCommCheck.args  = [count,type,val].concat(dCommCheck.specs[typeLow]),
				countArgs.apply(null,dCommCheck.args);
		}

		function countArgs(count,type,val,num,opt){
				countArgs.patt = /-?\d+(\.\d+)?/g;
				countArgs.args = val.match(countArgs.patt );
				countArgs.bool = (!opt) ?
					num === countArgs.args.length :
				(opt === 'poly') ?
					countArgs.args.length % num === 0:
				
				//if we get here it's going to be an arc
					(			countArgs.args.length === num      &&
					(countArgs.args[3] === '0' || countArgs.args[3] === '1') &&
					(countArgs.args[4] === '0' || countArgs.args[4] === '1')    ) ;
				
				return {
					bool  : countArgs.bool,
				 	index : count,
				 	type  : type,
				 	args  : countArgs.args,
				 	val   : val
				};
		}

	}


})();
// this is the factory that stores the data in a serialized object
// it uses the data mapped while compiling in the directive drawSvg
// into a different object depending on the svg type
// exampleList = [
// 	{
//	 nodeName :'circle',
// 	 hashSvg: 0,
// 	 attributes: {
//			cx   :44,
// 	        cy   :55,
// 	         r    :3
//	 },
//	 childNodes:[
// 				{
// 				 nodeName :'circle',
// 				 hashSvg: 1,
// 				 attributes: {
// 							cx   :11,
// 					        cy   :12,
// 					        r    :3
// 					        fill : 'red',
// 					        stroke:'blue'
// 				 			},
// 				 childNodes:[]
// 				},
// 				]
// ]
// relying on other services it check the attributes for basic types
// <circle>, <ellipse>, <image>, <line>, <path>, <polygon>, <polyline>, <rect>, <text>, <use>



(function(){
	"use strict";

	angular
		.module('draw.path')
		.factory('drawData', drawData);

	drawData.$inject = ['$timeout' , 'drawAssemble','drawRegexCons','drawStrCode'];


	function drawData($timeout , drawAssemble, drawRegexCons, drawStrCode){
		

		var obj = {
			node:[],
			string:'',
			setNode:setNode,
			flatNodeList:flatNodeList,
			getStr:getStr,
			changeNode:changeNode,
		};
		return obj;

		function getStr(){
			return obj.string;
		}

		function changeNode(msg){
			// this should return the new string value an update node [] (sideEff)

			// if it's needed we need to get a new-reference to elem we're modifying
			if( !changeNode.pointer)
			changeNode.pointer = pointTo(msg.elemHash);

			var res = drawAssemble[changeNode.pointer.nodeName]( msg , changeNode.pointer);

			// with return  from draw assemble we update string
			var changing = $timeout( 20 )
				 .then(function(){
				 	obj.string = drawStrCode.update( pointTo.o[res[0]], obj.string, res.splice(1));			

				 },function(e){	console.log(e) });
			

			// if mouseup we should clean up pointer and stop
			if(msg.mouseup){
				$timeout.cancel(changing);
				setTimeout(function(){ 
					changeNode.pointer = null ;
					drawAssemble.resetPathDiff();
				},0);
			}

		}



		function setNode(a,str){
			obj.node = serializeNode(a,str);
			obj.string = str;
		}

		function serializeNode(a,str){
			//the dom rappresentation is good we just need to map what we want
			//maybe there are some JQlite methods for this..
			var hashSvg = 0;
			if(a.length === 0)
			return [];

			return [].slice.call(a).map(function(n){
				return mapNode(n);
			});

			function mapNode(node){
			// this procedure creates a structure which is utilized by
			// .pointTo() to create a flatnode Reference table (.pointTo.o property) and
			// by drawStrCode.update to track length of string when values in string change
			// since the structure changes we need to initialize these properties
			drawStrCode.initStrOffset();
			pointTo.o = undefined;

				function mappedAttributes(nA){
					// this regex strips out wrong attributes compiled by angular
					// when dealing with 'd'
					// but it probably will fail in some situations
					/* /(^=|^\"|^\'|^[a-zA-Z][0-9]|[0-9])/;*/
					var patt = /(^=|^\"|^\'|^[0-9]|^class$)/;
					if(nA)
					return [].slice.call(nA).reduce( ( acc , x )=> {
						 if( !patt.test(x.name))
						 acc[x.name] = x.value;
						 return acc;
					},{});
				}

				var attrs= mappedAttributes(node.attributes) || [];

				// attrsStringRef is a reference on the char-string-index in str
				var attrsStringRef = Object.keys(attrs).reduce(function(acc, x) {

					var pat = drawRegexCons.attrsStrLen(node.nodeName , x, attrs[x]);
					var strI = {};
					  str.replace(pat, function(m, m2, startI) {
					    strI.end = startI + m.length;
					    strI.start = strI.end - m2.length;
					  });
					  	var commandPat = /([a-zA-Z])[ .,0-9-]+/g ,
							patNum = /-?\d+(\.\d+)?/g ;
						if(x === 'points'){
							// example 			points:{
							// 							0:{
							//								x:{start:13, end:15},
							// 								y:{start:17, end:20}
							//  						}
							// 					}
							
							var counter = 0 , XorY = true;
							attrs[x].replace( patNum, function(m, _ ,start){

								if (XorY){
									strI[ counter ] = {};
									strI[ counter ].x = {};
									strI[ counter ].x.start = start ;
									strI[ counter ].x.end = start + m.length ;
									return  XorY = ! XorY;
								}

								strI[ counter ].y = {};
								strI[ counter ].y.start = start ;
								strI[ counter ].y.end = start + m.length ;
								return counter++ , XorY = ! XorY ;
							});
						}
						if(x === 'd'){
							var comCount = 0 , valCount; 
							attrs[x].replace( commandPat, function(m, com, start){
								strI[ comCount ] = {
									start : start,
									end	  : start + m.length
								};
								valCount = 0;
								m.replace( patNum , function(ma, _ , s){
									strI[ comCount ][ valCount++ ] = {
										start: start + s,
										end  : start + s + ma.length
									};
								});
								comCount ++;

							});
						}
					acc[x] = strI;
					return acc;
				}, {} );

				// check svgAnimatedLength for conversion values
				var attrsLength = {};
				var pointList ={};
				for( var x in attrs){
					if (node[x] instanceof SVGAnimatedLength )
					attrsLength[x] = node[x];

					if (node[x] instanceof SVGPointList )
					pointList[x] = node[x]; 
				}

				var res ={
					nodeName   		: node.nodeName,
					attributes 		: attrs,
					childNodes 		: node.childNodes,
					hashSvg    	  	: hashSvg++,
					attrsStringRef	: attrsStringRef,
				};
				if(node.nodeName === 'path')
				// since we're using a shim for abstracting specific d getPathData()
				// we'll pass the whole dom nodeName
				res.domObj = a[0];  

				if(Object.keys(attrsLength).length > 0)
				res.attrsLength = attrsLength;

				if(Object.keys(pointList).length > 0)
				res.pointList = pointList;

				if (node.childNodes.length > 0)
					res.childNodes = [].slice.call(node.childNodes).map(function(x){
						return mapNode(x);
					});
				return res; 
			}
		}
		
	//pointTo - flatNodeList - pathDataPointList are utility of changeNode()
		function pathDataPointList(domO){
			return domO.getPathData().reduce((ac,x,i)=>{
				var subI=0;
				while (x.values.length > 0){
					ac.push({
						x :x.values[0],
						y :x.values[1],
						comI : i,
						command:x.type,
						subI: subI++
					});
				x.values.splice(0,2);
				}
				return ac;
			}, []);
		}
		function pointTo(h){
			pointTo.o = pointTo.o || flatNodeList();

			if(pointTo.o[h].nodeName === 'path'){
				pointTo.o[h].pathDataPointList = pathDataPointList(pointTo.o[h].domObj);
				pointTo.o[h].pathData = pointTo.o[h].domObj.getPathData();
				pointTo.o[h].pathDataNormalized = pointTo.o[h].domObj.getPathData({normalize:true});
				pointTo.o[h].pathDataAbsolutize = pointTo.o[h].domObj.getPathData({absolutize:true});
			}
			return pointTo.o[h];
		}
		function flatNodeList(){
			return obj.node.reduce( (acc,x) => {
				acc.push(x);
				if(x.childNodes.length > 0)
				x.childNodes.reduce( (ac,cn) =>{
					acc.push(cn);
					return ac;
				}, acc);
				return acc;
			}, [])
			.sort( (a,b) => {return a.hashSvg - b.hashSvg; } );
		}

		

	}
})();


//drawDeconstruct service
(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawDeconstruct',drawDeconstruct);

	drawDeconstruct.$inject = ['drawDisassemble','drawDCommands'];

	function drawDeconstruct(drawDisassemble, drawDCommands){

		var deconstructData = {
			structure:[],
			parseBasic:parseBasic,
			movement:movement
		};
		return deconstructData;

		function movement(obj){
			deconstructData.structure[obj.elemHash][obj.index].x = obj.point.x;
			deconstructData.structure[obj.elemHash][obj.index].y = obj.point.y;
		}
		function parseBasic(a){
			    // a is being piped from drawValidation and is an array of {objects
			    // one for each propertyCheck..
			       /*      a:type = 
                  [
                     {
                     propertyCheck:cx,
                     item:{}
                     },
                     {
                     propertyCheck:cy,
                     item:{}
                     },
                  ]
           			 returns [{basicValueEr},[destructuredData]]
                  */


			if(!a){
			// this is a shorcut to update GUI point array in case no node is set
			deconstructData.structure =[];
			return; 
			 }
        	
			

	          // res is piped back to drawValidation.checkItem with a boolean value 
	          // indicating that the property-value is valid   
	        var res = a.map( (x,i,arr) => {

	                //depending on the the x.propertyCheck we need to validate specifically (validity function )
	                var test = validity( x.propertyCheck , x.item.attributes[x.propertyCheck] );


	                
	                /** since destructioring data to check dValue pairs is quite expensive
	                we will preserve destructured value and  add an optional field so to pass parsed data directly to 
	                stucture node if test passes**/
	       			// respose from validity will  have one optional property: dValueOpt
	       			// bool: false,
				    // descr:'string',
				    // dValueOpt:[]  // d_value data


					/*****************************\
					 if test passes create an argument to pass to
					 structureNode and fire it off !!
					\*****************************/
		            if(test.bool){
		                var rawData = {
		                	hashSvg  : x.item.hashSvg,
		                	nodeName : x.item.nodeName,
		                	basicAttr: x.propertyCheck,
		                	item     : x.item
		                };
		                rawData.optional = (test.valueOpt) ?
		                test.valueOpt : null ;
		                structureNode(rawData);
		            }
		            /**********************************/


	                var response = {
	                	property : x.propertyCheck,
	                	valid    : test.bool, //boolean
	                	reason   : test.descr,//if it's false justify
	                	hashSvg  : x.item.hashSvg
	                };
	                return response;
	         }); 

	        return res;
		}

		function structureNode(rd){
			// @ex. return {hashSvg: number, pointRappr:[] }
			var response = drawDisassemble[rd.nodeName](rd);
			deconstructData.structure[response.hashSvg] = response.pointRappr;
			
		}


		function validity(attr,value){
			validity.lenPatt = /^(cy|cx|r|rx|ry|x|x1|x2|y|y1|y2|height|width)+?$/;
			if( validity.lenPatt.test(attr) )
			return lengthValid(value);

			if( attr === 'd')
			//return dValid(value);
			return drawDCommands.run(value);

			if( attr === 'points')
			return pointsValid(value);
		}
		

		function pointsValid(x){
			pointsValid.alienChar = /([^\d ,.-])/g ;
			x = x.toString();
			var alienChar = x.match(pointsValid.alienChar);
			if(alienChar)
			return{
				bool: false,
				descr:'invalid point value char.: ' + alienChar.join(' | ')
			};
			//if no alienChar check  if the number values are even
			pointsValid.numbers = /((-?)\d+(\.\d+)?)/g;
			pointsValid.matchNumbers = x.match(pointsValid.numbers);
			var res = {};
			res.bool = (pointsValid.matchNumbers && pointsValid.matchNumbers.length % 2 === 0) ?
			true : false ;
			res.descr = (!res.bool) ?
			'invalid number pairs' : null ;

			res.valueOpt = pointsValid.matchNumbers;	
			return res;
		}

		function lengthValid(x) {
			lengthValid.patt =  /^\d+(\.\d+)?(em|ex|px|in|cm|mm|pt|pc|%)?$/;

      		if (typeof x === 'string')
			x.trim();

			var res = {
				bool:lengthValid.patt.test(x),
			};

			res.descr = (res.bool === false) ?
			('invalid length: '+x) :
			null ;

			return res;
		}
 

	}
})();
// disassemble factory
(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawDisassemble',drawDisassemble);

	function drawDisassemble(){
		var service = {
			circle  : circle,
			ellipse : ellipse,
			line    : line,
			path    : path,
			polygon : polygon,
			polyline: polyline,
			rect    : rect,
		};
		return service;

		function circle(o){
			var cx = lengthVal('cx',o);
			var cy = lengthVal('cy',o);
			var r  = lengthVal('r',o);

			var center   = (cx && cy)?
			{ hashSvg: o.hashSvg, x: cx ,  y:cy}:
			null;
			var radPoint = (r && center )?
			{ hashSvg: o.hashSvg, x:sum(cx,r)  , y: cy}:
			null;

			return {
				hashSvg   : o.hashSvg,
				pointRappr: [center, radPoint]
			};
		}

		function ellipse(o){
			var cx = lengthVal('cx',o);
			var cy = lengthVal('cy',o);
			var rx = lengthVal('rx',o);
			var ry = lengthVal('ry',o);

			var center    = (cx && cy)?
			{ hashSvg: o.hashSvg, x: cx ,  y: cy}:
			null;
			var radPointX = (rx && center )?
			{ hashSvg: o.hashSvg, x:sum( cx, rx)  , y: cy}:
			null;
			var radPointY = ( ry && center )?
			{ hashSvg: o.hashSvg, x: cx,  y:sum( cy, ry) }:
			null;

			return {
				hashSvg    : o.hashSvg,
				pointRappr: [center, radPointX, radPointY]
			};
		}
		function line(o){
			var x1 = lengthVal('x1',o);
			var x2 = lengthVal('x2',o);
			var y1 = lengthVal('y1',o);
			var y2 = lengthVal('y2',o);

			var x = (x1  &&  y1)?
			{ hashSvg: o.hashSvg, x: x1 , y: y1 }:
			null ;
			var y = (x2  &&  y2)?
			{ hashSvg: o.hashSvg, x: x2 , y: y2 }:
			null ;

			return {
				hashSvg   : o.hashSvg,
				pointRappr: [ x, y ]
			};
		}
		function rect(o){
			var x = lengthVal('x',o);
			var y = lengthVal('y',o);
			var width = lengthVal('width',o);
			var height = lengthVal('height',o);

			var start = (x  &&  y)?
			{ hashSvg: o.hashSvg, x:x , y:y }:
			null ;
			var end = (start && width  &&  height)?
			{ hashSvg: o.hashSvg, x:sum( x, width) , y:sum( y, height) }:
			null ;

			return {
				hashSvg   : o.hashSvg,
				pointRappr: [ start, end ]
			};
		}
		function path(o){
			// since we need to know both absolute point values and
			// specific point type (relative) we'll work on both arrays simultaneously
			// (in order to get V H type points we'll also use normalized array)
 			var normalized = o.item.domObj.getPathData({normalize:true});
 			var abs= o.item.domObj.getPathData({absolutize:true}); 
			var pointsAbs= o.item.domObj.getPathData().reduce((acc, x, i) =>{
				var relativePat = /[a-z]/;
				var relative = !!(o.optional[i].type.match(relativePat));
				if(x.type === 'h' || x.type === 'H' || x.type === 'v' || x.type === 'V'){
					var oneAxis = (x.type === 'h' || x.type === 'H')? 'horizontal' : 'vertical';
					acc.push({
						hashSvg: o.hashSvg, 
						x: normalized[i].values[0],
						y: normalized[i].values[1],
						pathPointType: 'vertex',
						relative:  true,
						normalized:true,
						oneAxis: oneAxis,
						specialPathCom:x.type
					});
					return acc;	
				}
				if(x.type === 'z' || x.type === 'Z')
					return acc;
				if(o.optional[i].type === 'a' || o.optional[i].type === 'A'){
					acc.push({
						hashSvg: o.hashSvg, 
						x: abs[i].values[abs[i].values.length - 2],
						y: abs[i].values[abs[i].values.length - 1],
						pathPointType: 'vertex',
						relative:relative
					});
					return acc;
				}
				while (abs[i].values.length > 0){
					var res = {
						hashSvg: o.hashSvg,
						x: abs[i].values[0],
						y: abs[i].values[1],
						relative:relative
						
					};
					if(abs[i].values.length === 2){
						res.pathPointType = 'vertex';
					}else{
						res.pathPointType = 'controlPoint';
					}
					acc.push(res);
					abs[i].values.splice(0,2);
				}
				return acc;
			},[]);

			return {
				hashSvg   : o.hashSvg,
				pointRappr: pointsAbs 
			};

		}
		function polygon(o){
			var rawPoints = o.optional;
			var points = [];

			while ( rawPoints && rawPoints.length > 0){
					points.push({
						hashSvg: o.hashSvg, 
						x: Number(rawPoints[0]),
						y: Number(rawPoints[1])
					});
					rawPoints.shift();
					rawPoints.shift();
			}

			return {
				hashSvg   : o.hashSvg,
				pointRappr: points
			};
		}
		function polyline(o){
			return polygon(o);
		}
		

		function sum(a,b){
			return +a + +b;
		}
		function lengthVal(attr,obj){
			return ( obj.item.attrsLength  &&  obj.item.attrsLength[attr] )?
			obj.item.attrsLength[attr].baseVal.value:
			obj.item.attributes[attr];

		}
	}

})();
// (function(){
// 	angular
// 		.module('draw.path')
// 		.service('drawPathAttr', drawPathAttr);



// 	function drawPathAttr(){

// 		var obj={

// 				attributes:{
// 					fill :'rgba(222,0,222,0.5)',
// 					stroke :'green',
// 					//['stroke-width']:5
					
// 				},

// 				setAttr : function(swapObj){
// 					obj.attributes = swapObj;
// 				},
// 				getAttr : function() {
// 			    	return obj.attributes;
// 			  	}
// 			};
// 			obj.attributes['stroke-width']=5;
// 		return obj;

// 		}

// })();
// directive for checking point realtion during event pointMove
// and eventually react
(function(){
	'use strict';
	angular
		.module('draw.path')
		.factory('drawPointRelation',drawPointRelation);

		drawPointRelation.$inject = ['drawData'];

		function drawPointRelation (drawData){
			return{
				relate:relate,
			};

			function relate(loc,rem){
				//if it's not the same elem || it's the same point we stop
				if(  loc.elemHash !== rem.elemHash ||
					(loc.elemHash === rem.elemHash && loc.index === rem.index) )
				return;

				relate.circle = function(l,r){
					//only cause of a point influencing another point is if it's center
					if( r.index !== 0)
					return; 

					return [ 
						l.point.x + (r.point.x - r.start.x),
						l.point.y + (r.point.y - r.start.y)
					];
				};

				relate.ellipse = relate.circle;
				relate.rect = relate.circle;

				relate.path = function(l,r){
					if(r.pathPointType === 'controlPoint')
					return;
					if(r.index > l.index){
					return;}
					if(!l.relative)
					return;
				
					return [ 
						l.point.x + (r.point.x - r.start.x),
						l.point.y + (r.point.y - r.start.y)
					];
					
				}

				if(relate[drawData.changeNode.pointer.nodeName])
				return relate[drawData.changeNode.pointer.nodeName](loc,rem);
				
			}


		}
})();
(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawRegexCons',drawRegexCons);

	

	function drawRegexCons(){
		return{
			attrsStrLen:attrsStrLen
		};

		function attrsStrLen (nodeName, attr, val) {

			// this escapes some characters that need 
			var valescaper = /[(|)+*[\]]/g;
			val = val.toString();
			val = val.replace(valescaper,'\\$&');
			
			return new RegExp("< *" + nodeName + ".+?(?:" + attr + ").+?(" + val + ")");
		}
	}
	})();
// (function(){
// 	 'use strict';
// 	angular
// 		.module('draw.path')
// 		.factory('drawService', drawService);

// 	drawService.$inject = ['$filter'];
// /*service*/
// function drawService($filter){

//     var obj = {
// 	//sample point output  point={type:'C', list:[ {x:22,y:33,id:1},{x:32,y:453,id:2},{x:33,y:33,id:3} ] };
// 	points : [] ,
// 	rawPoints : rawPoints,
// 	setPoints : setPoints,
// 	getPoints : getPoints,
// 	dValue: dValue,

// 	vectorDValue : vectorDValue,
// 	code : code,
// 	 // options for point types
//  	curveOp:['M','L','Q','C'],

// 	/*obj.click captures click event and registers lastPoint and adds to points  array*/
// 	mousedown :  mousedown,
// 	mouseupLine :mouseupLine,
// 	mousemove : mousemove,
// 	mousemoveback : mousemoveback
// 	};
// 	return obj;
	

// 	function mousedown(e){
		  
// 			if(!e || e.target instanceof SVGCircleElement)
// 			return;

//             var point = {
//             	type:'',
//             	list :[]
//             };
//             point.list[0]=[];

//             //polyfill for FF
//             if(!e.target.offsetLeft)
//             var boundClientRect = e.target.getBoundingClientRect();

// 			//coercing int with bitwise for FF support
// 		    point.list[0][0]=e.pageX - e.target.offsetLeft || e.pageX - boundClientRect.left|0;
// 			point.list[0][1]=e.pageY - e.target.offsetTop  || e.pageY - boundClientRect.top |0;

// 			// we temporarly set type to 'M' for rendering point
// 			point.type='M';

// 			//inserts point
// 			obj.points.push(point);
			
// 	}
// 	function mouseupLine(e){

// 		var pointLen = obj.points.length;
// 		var typeOfPoint = (pointLen <= 1)?'M':'L';
		    
// 		obj.points[pointLen - 1].type = typeOfPoint;
			
// 	};

// 	function mousemove(e){
// 			if (e.target instanceof SVGCircleElement )
// 			return;

// 		var pointLen = obj.points.length;

// 		var leftOffset =  e.target.offsetLeft,
// 			topOffset  =  e.target.offsetTop ;

// 		//polyfill for target.offsetLeft in FF
//             if(!e.target.offsetLeft || e.target.offsetLeft == undefined){
//          	var boundClientRect = e.target.getBoundingClientRect();
//         	leftOffset =  boundClientRect.left;
// 			topOffset  =  boundClientRect.top;
// 			}


// 		//if it's the first point just move around M point and return
// 		if (pointLen == 1)
// 		 return obj.points[0].list[0][0] = e.pageX - leftOffset |0,
// 		   		obj.points[0].list[0][1] = e.pageY - topOffset  |0;

// 			//if no vector exist create one andinsert it on index 1
// 			// and change type of point if needed
// 		if (obj.points[pointLen - 1].list.length < 2)
// 			obj.points[pointLen -1].list.unshift([]),
// 		    obj.points[pointLen - 1].type  = 'Q';
			
// 			//update position of vector																
// 			//coercing paseInt with bitwise
//      		obj.points[pointLen - 1].list[0][0] = e.pageX - leftOffset |0;
// 			obj.points[pointLen - 1].list[0][1] = e.pageY - topOffset  |0;
// 	};
// 	function mousemoveback(e){
// 			var pointLen = obj.points.length;

// 			if(obj.points[pointLen - 1].list.length < 2)
// 				return;


// 			obj.points[pointLen - 1].list.shift();
// 					    //change type of point
// 			var typeOfPoint = (pointLen <= 1)?'M':'L';
// 		    obj.points[pointLen - 1].type = typeOfPoint;

// 	}
// 	function getPoints(){
// 		return obj.points;
// 	}
// 	function setPoints(a){
// 		obj.points = a;
// 	}
// 	function rawPoints(points){
// 		return points.reduce((acc,x) =>{
// 			var i=0;
// 			while(i < x.list.length){
// 				acc.push({
// 					x:x.list[i][0],
// 					y:x.list[i][1]
// 				});
// 				i++;
// 			};
// 			return acc;
// 		},[]);
// 	}
// 	function dValue(){
// 		return $filter('arrayToDVal')(obj.points);
// 	}
// 	function vectorDValue(){
// 		var arr = $filter('toVectorArray')(obj.points);
// 		return $filter('arrayToDVal')(arr);

// 	}
// 	function code(attributes){
// 	 return $filter('attrsToMarkup')(attributes);
// 	}

// }

// })();
(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawStrCode',drawStrCode);

		function drawStrCode(){
		
		var offset = {};

		return {
				update:update,
				initStrOffset:initStrOffset,
				preUpdatePoints: preUpdatePoints,
				preUpdateD: preUpdateD,
			};

		function preUpdateD(ref, pointByI, xYpairs ){

			var dSubtracker = 'd'+ ref.hashSvg;

			if( ! offset[ dSubtracker ] )
			offset[ dSubtracker ] = {};

			return stringUpdate (
				ref.attrsStringRef.d[ pointByI.comI ],
				ref.attributes.d,
				xYpairs,
				offset[ dSubtracker ]
				);
		}
		function preUpdatePoints(ref, index, xYpairs ){

			var pointsSubtracker = 'points'+ ref.hashSvg;
			
			if( ! offset[ pointsSubtracker ] )
			offset[ pointsSubtracker ] = {};

			return stringUpdate (
				ref.attrsStringRef.points[index],
				ref.attributes.points,
				xYpairs,
				offset[ pointsSubtracker ]
				);

		}
		function update( ref , string, pairs ){
			// we could sort these while dispatching them..
			// but if they're not in order it will break string slicing.

			pairs = pairs.sort((a,b)=>{
				return ref.attrsStringRef[a[0]].start - ref.attrsStringRef[b[0]].start;
			});
			
			return stringUpdate (ref.attrsStringRef, string, pairs, offset);

		}
		// this method is used also in substitution of points
		function stringUpdate( reference , string, pairs, offsetTracker ){

			
			var  tmpShift = 0, temp = {},
			start , end , beginSlice , origEnd , origStart ,origBeginSlice ;
			

			return pairs.reduce(function(acc, x, i, pairs){
				
				x[1] = x[1].toString();

				origBeginSlice = (i === 0)? 0 :
				reference[ pairs[ i-1 ][0] ].end  ;
				beginSlice = valShift(origBeginSlice , offsetTracker ) ;
				
				origStart = reference[ x[0] ].start;
				start = valShift( origStart , offsetTracker );

				origEnd = reference[ x[0] ].end;
				end = valShift( origEnd , offsetTracker ) ;

				/*********************/
				acc +=  string.slice(  beginSlice , start  ) +  x[1];
					
				if( tmpShift !== 0){
				offsetManager( origStart  , start + tmpShift , temp );
				}

				var difference = x[1].length - ( end - start ) ; 
				if( difference !== 0 || tmpShift !== 0){
				offsetManager( origEnd , origEnd + (end - origEnd ) + difference + tmpShift , temp );
					tmpShift += difference;
				}

				//additional operation on last substitution
				if (i === pairs.length - 1){
					
					/*********************/
					acc += string.slice( end );

					//maintainence
				offsetMerge( offsetTracker , temp);
		
				}

				return acc;
			},'');

		}
		function valShift( val, offsetTracker){
			//loop over an obj as if it was an array .. 
			for (var i = val ; i > 0 ; i--){
				if (offsetTracker[i]  ){
					var diff = offsetTracker[ i ] - i ;
					val = val + diff;
					break;
				}
			}
			return val;
		}
		function offsetManager(index, modVal , offsetTracker){
			offsetTracker[ index ] =  modVal ;
		}
		function offsetMerge(d ,s ){
			for (var i in s){
				d[i] = s[i] ;
			}
		}
		function initStrOffset(){
			offset = {};
		}



		}


})();
(function() {
    'use strict';

    angular
        .module('draw.path')
        .factory('drawValidation', drawValidation);

    drawValidation.$inject = ['drawData','drawAttributes','drawDeconstruct'];

    function drawValidation(drawData,drawAttributes,drawDeconstruct) {

        var service = {
           list:[],
           deleteError: deleteError,
           checkExc :checkExc,
      
        };
        return service;

        function deleteError(i){
            service.list.splice(i,1);
        }
        function checkExc(){
            //reset list
            var checkList= {};
            checkList.basic=[];
            checkList.basicValues=[];
            checkList.presentational=[];


            drawData.node.forEach(x => checkItem(x) );

            if(drawData.node.length === 0){
            // this is a shorcut to update GUI point array in case no node is set
            drawDeconstruct.parseBasic();
            }
            
            service.list= checkList;

            function checkItem(item){
                /*do it recursivly on childNodes if any*/
                if (item.childNodes.length  >  0)
                item.childNodes.forEach((c) => checkItem(c) );

                /*********************************************/
                //check if basic per-element rendering properties are present
                var basicTestValues =  checkSpecific(item);

                var basicTest =  basicTestValues[0];
                checkList.basic = checkList.basic.concat(basicTest);
                
                // basic values that are present are sent to destructioring service
                // this will eventually comunicate any errors on values,
                // if there's no error the destructioring service uses the value
                // to populate the GUI with points / mouseevents (sends values to drawDeconstruct)
                var basicVals =  basicTestValues[1];
                var basicValueErr = drawDeconstruct.parseBasic(basicVals);   //\\ -- //\\
                checkList.basicValues = checkList.basicValues.concat(basicValueErr);
               
                /*********************************************/


                //copy the nodeitem, strip out the basic attributes,
                //check presentational
                var itemcopy = stripBasicAttr(item);
                
                var present = checkPresentationalAttr(itemcopy);
                checkList.presentational = checkList.presentational.concat(present);
            

            }
        }
        //utility of checkItem
        function stripBasicAttr(item){

               var copy = {
                attributes:{},
                hashSvg   :item.hashSvg,
                nodeName  :item.nodeName,
               };
                if ( drawAttributes.basic[item.nodeName] )
                Object.keys(item.attributes).forEach( i => {
                    var test = drawAttributes.basic[item.nodeName].some(x => x.prop == i);
                    if( !test )
                    copy.attributes[i]=item.attributes[i];
                });
                return copy;
        }
        //utility of checkItem
        function checkPresentationalAttr(item){
            return Object.keys(item.attributes).filter(x => {
                    return drawAttributes.present.every(a => {
                        return a !== x;
                    });
                })
                .map( (x) => {
                    return{
                        issue:x,
                        type:' not presentational attribute',
                        hashEl: item.hashSvg
                    };
                });
        }
        //utility of checkItem
        function checkSpecific(item){
            var res = [];
            //res[0] returns check on keys
            //res[1] returns check on values
            res[1]= [];
            res[0]= (drawAttributes.basic[item.nodeName] )?
                     drawAttributes.basic[item.nodeName].filter(r => {
                        
                        var result =  Object.keys(item.attributes)
                         .every((itemAttr , i , arr) => {
                            if(r.renderOpt)
                            return false;

                            return (itemAttr != r.prop);
                        });

                        if (!result)
                        {  res[1].push(r);  }

                        return result;
                    })
                    .map( (x) => {
                        return{
                            issue:x.prop,
                            type:'basic attribute missing',
                            hashEl: item.hashSvg
                        };
                    }):
                    [];
                //creating a map to pipe to next checkpoint
                //( that will check the basicAttr values )
                res[1] = res[1].map((x) =>{
                        return {
                            propertyCheck:x.prop,
                            item:item
                        };
                });
            return res;
        }
    }
})();

/*(function(){
	angular
		.module('draw.path')
		.service('drawVectorAttr', drawVectorAttr);

	drawVectorAttr.$inject = ['$filter'];


	function drawVectorAttr($filter){

		var obj={

				attributes:{
					fill :'none',
					stroke :'#666',
					
				},
				getAttr : function() {
			    	return obj.attributes;
			  	}
			};
			obj.attributes['stroke-dasharray']='4,5';

			


		return obj;

	}

})();*/
(function() {
    'use strict';
    angular
        .module('draw.path')
        .factory('exception', exception);

    /**/
    function exception() {
        exception.errors = [];

        var service = {
           setError: setError,
           getError: getError
            /*catcher: catcher,*/
        };
        return service;

        

        function setError(a){
            exception.errors.push(a);
        }
        function getError(a){
            var i= (a)?
            exception.errors.indexOf(a) :
            exception.errors.length-1;

            return exception.errors[i];
        }
        function repairError(a){


        }




    }
})();
//# sourceMappingURL=../maps/draw-path.js.map
