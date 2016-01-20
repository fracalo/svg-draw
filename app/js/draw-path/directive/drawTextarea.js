//directive for code in textarea

(function(){
'use strict';
  angular
    .module('draw.path')
    .directive('drawTextarea',drawTextarea);

    function drawTextarea(){

       return {
          restrict:'AE',
          replace: false,
          scope: {
            code:'='
          },
          template:
          "<label name='code'>SVG-Code </label>"+
          "<textarea name='code' ng-model='code' ></textarea>",
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
      };

    }
})();