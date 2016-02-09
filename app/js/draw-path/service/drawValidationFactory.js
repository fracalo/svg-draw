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
                /*for (var i in item.attributes){
                    var test = drawAttributes.basic[item.nodeName].some(x => x.prop == i);
                    if(test)
                    { delete item.attributes[i]; }
                }
                return item;*/
               // var copy = JSON.parse(JSON.stringify(item));
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
