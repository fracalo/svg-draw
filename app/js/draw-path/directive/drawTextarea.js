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
            "<textarea name='code' ng-model='inside.code' ></textarea>",
            controllerAs:'inside',
            controller:drawTextareaCtrl
        }
    }

    function drawTextareaCtrl($scope, $timeout,$rootScope,drawData){

        var wait, lastValid, mousemoving;
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
                    if(mousemoving)
                    return;

                    $scope.code = n;
                }  , 900);
        });

        $rootScope.$on('pointMove',function(_,m){
            inside.code = drawData.getStr();
            $scope.$digest();
            mousemoving = true;
            if(m.mouseup)
            mousemoving = false;

        });
    };

})();