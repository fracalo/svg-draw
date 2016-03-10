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
                    //a reference is ok since we're not modifyng nothing
                    org.relative = scope.point.relative;

                    if(scope.point.specialPathCom)
                    org.specialPathCom = scope.point.specialPathCom;

                    relRes = drawPointRelation.relate(org,a);
                    
                    if( relRes )
                    el.attr('cx', relRes[0]) , el.attr('cy', relRes[1]) ;

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
