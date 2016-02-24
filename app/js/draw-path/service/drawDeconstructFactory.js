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