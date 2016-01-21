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
            checkList.basic=[];
            checkList.presentational=[];

            drawDataFactory.node.forEach(x => checkItem(x) );
            
            service.list= checkList;

           function checkItem(item){
                /*do it recursivly on childNodes if any*/
                if (item.childNodes.length  >  0)
                item.childNodes.forEach((c) => checkItem(c) );

                /*********************************************/
                //check if basic per-element rendering properties are present
                var basic =  checkSpecific(item);
                checkList.basic = checkList.basic.concat(basic);

                /*********************************************/
                //copy the nodeitem, strip out the basic attributes,
                //check presentational
                var itemcopy = stripBasic(item)
                
                var present = checkPresentationalAttr(itemcopy);
                checkList.presentational = checkList.presentational.concat(present);
            

            }
        }

        function stripBasic(item){
                for (var i in item.attributes){
                    if(drawAttributes.basic[item.nodeName].some(x => x.prop == i))
                    { delete item.attributes[i]; }
                };

                return item;
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
            var res = (drawAttributes.basic[item.nodeName] )?
                drawAttributes.basic[item.nodeName].filter(r => {
                    
                    return  Object.keys(item.attributes)
                     .every((itemAttr , i , arr) => {
                        if(r.renderOpt)
                        return false;

                        return itemAttr != r.prop ;
                    });

                  
                })
                .map( (x) => {
                    return{
                        issue:x.prop,
                        type:'basic attribute missing',
                        hashEl: item.hashSvg
                    }
                }):
                [];

            return res

        };
    }
})();
