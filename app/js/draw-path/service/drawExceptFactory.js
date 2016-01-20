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
            var checkList= [];

            drawDataFactory.node.forEach(x => {checkItem(x);} );
            
            service.list= checkList;
           
           function checkItem(item){
                var type = item.nodeName;
                /*if an element has specific attribute make a check*/
                var specific = (drawAttributes[type] && drawAttributes[type].spec)?
                drawAttributes[type].spec.filter(r => {
                     return Object.keys(item.attributes)
                     .every((itemAttr) => {
                        if(r.renderOpt)
                        return false;

                        return itemAttr != r.prop ;
                    });
                }) : [];

                /*do it recursivly on childNodes if any*/
                if (item.childNodes.length  >  0)
                item.childNodes.forEach((c) => {checkItem(c) ; });

                specific = specific.map( (x) => {
                    return{
                        issue:x.prop,
                        type:'specific',
                        hashEl: item.hashSvg
                    }
                });

               
                checkList = checkList.concat(specific);

            }
        }
    }
})();
