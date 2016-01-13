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