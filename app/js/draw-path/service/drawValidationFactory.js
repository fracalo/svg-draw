(function() {
    'use strict';

    angular
        .module('draw.path')
        .factory('drawValidationFactory', drawValidationFactory);

    drawValidationFactory.$inject = ['drawDataFactory','drawAttributes','drawDeconstruct'];

    function drawValidationFactory(drawDataFactory,drawAttributes,drawDeconstruct) {

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

            drawDataFactory.node.forEach(x => checkItem(x) );
            
            service.list= checkList;

           function checkItem(item){
                /*do it recursivly on childNodes if any*/
                if (item.childNodes.length  >  0)
                item.childNodes.forEach((c) => checkItem(c) );

                /*********************************************/
                //check if basic per-element rendering properties are present
                var basic =  checkSpecific(item)[0];
                checkList.basic = checkList.basic.concat(basic);
                
                //if they're present hand of values to destructioring service
                //this will eventually comunicate any errors
                //if there's no error the destructioring service uses the value
                //to populate the GUI with points / mouseevents
                
                var basicValues =  checkSpecific(item)[1];

                drawDeconstruct.parseBasic(basicValues)
               
                /*********************************************/
                //copy the nodeitem, strip out the basic attributes,
                //check presentational
                var itemcopy = stripBasicAttr(item);
                
                var present = checkPresentationalAttr(itemcopy);
                checkList.presentational = checkList.presentational.concat(present);
            

            }
        }

        function stripBasicAttr(item){
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
            var res = [];
            //res[0] returns check on keys
            //res[1] returns check on values
            res[1] = [];
            res[0]= (drawAttributes.basic[item.nodeName] )?
                    drawAttributes.basic[item.nodeName].filter(r => {
                        
                        
                        var result =  Object.keys(item.attributes)
                         .every((itemAttr , i , arr) => {
                            if(r.renderOpt)
                            return false;

                            return (itemAttr != r.prop);
                        });

                        if (!result)
                        {res[1].push(r)}

                    

                        return result;

                      
                    })
                    .map( (x) => {
                        return{
                            issue:x.prop,
                            type:'basic attribute missing',
                            hashEl: item.hashSvg
                        }
                    }):
                    [];
                //creating a map to pipe to next checkpoint( that will actually check the basicAttr  values )
                res[1] = res[1].map((x) =>{
                        return {
                            propertyCheck:x.prop,
                            item:item
                        }
                });
                
                
            return res

        };
    }
})();
