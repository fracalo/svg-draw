(function() {
    'use strict';

    angular
        .module('draw.path')
        .factory('drawExceptFactory', drawExceptFactory);

    drawExceptFactory.$inject = ['drawDataFactory','drawAttributes'];

    function drawExceptFactory(drawDataFactory,drawAttributes) {

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
            checkList.specific=[];
            checkList.presentational=[];

            drawDataFactory.node.forEach(x => {checkItem(x);} );
            
            service.list= checkList;

           function checkItem(item){
                var specific =  checkSpecific(item);
               

                /*do it recursivly on childNodes if any*/
                if (item.childNodes.length  >  0)
                item.childNodes.forEach((c) => {checkItem(c) ; });

                checkList.specific = checkList.specific.concat(specific);


                

            }
        }

        function checkPresentationalAttr(item){
            return Object.keys(item.attributes).filter(x => {
                    return drawAttributes.present.every(a => {
                        return a !== x;
                    })
                })
                .map( (x) => {
                    return{
                        issue:x,
                        type:' not presentational attribute',
                        hashEl: item.hashSvg
                    }
                });
        }

        function checkSpecific(item){
            var arrayToPipe = [];
            var res = (drawAttributes.basic[item.nodeName] )?
                drawAttributes.basic[item.nodeName].filter(r => {
                    

                    var result =  Object.keys(item.attributes)
                     .every((itemAttr , i , arr) => {
                        if(r.renderOpt)
                        return false;

                        return itemAttr != r.prop ;
                    });

                    return result;
                })
                .map( (x) => {
                    return{
                        issue:x.prop,
                        type:'specific',
                        hashEl: item.hashSvg
                    }
                }):
                [];

            return res
        };
    }
})();
