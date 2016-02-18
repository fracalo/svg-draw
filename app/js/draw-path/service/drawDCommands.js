// drawDCommands is a utility of drawDeconstruct to specifically check path's dValue
// it parses each command checking for certain types of errors
// in the response it stores  
//			return{
//				bool: false,
//				descr:'',
//				dStructure:'' //this will help creating a pointRappresentation
//			};

(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawDCommands',drawDCommands);

	function drawDCommands(){
		
		return {
			run: run,
		};

		function run(x){
			run.alienChar = /([^\d .,mlhvzcsqta-])/gi ;
			x = x.toString();
			var alienChar = x.match(run.alienChar);
			if(alienChar)
			/***** first exit ****/
				return{   
					bool: false,
					descr:'invalid point value char.: ' + alienChar.join(' | ')
				};

			
			run.patt = /([a-z]) *((-?\d+(\.\d+)?( *, *| *))+)z?/gi;
			var captureData=[]; // additional information for next exit
			var stringAnalisis = (function(){
				var count= 0;
				return x.replace(run.patt,function(m,a,b){
					// storing some precious data that's beibg checked as it's piped in
					captureData.push( dCommCheck(count,a,b) );

					count++;
					return '' ;
				});
			})();
			//if the string hasn't been completly matched we return
			if( stringAnalisis !== '' )
			/***** second exit ****/
				return {
					bool : false,
					descr: 'problems with char.: '+ stringAnalisis.split('') +' in your \'d\' value'
				};


			if ( ! captureData.every(( x , i ) => {
				return captureData.lastI = i ,
						x.bool === true;
			}) )
			/***** third exit ****/
				return {
					bool : false,
					descr: 'with command: '+ captureData[captureData.lastI].type +' | wrong args ('+ captureData[captureData.lastI].val+')'
				};

			
			/*** finally if we got here it should be true ***/
				return {
					bool : true,
					valueOpt : captureData
				};
		}

		// this methods check that each d_val command has the correct args ( number ..) .
		// it returns:
		//	 	bool  : boolean,
		//	 	index : counter,
		//	 	type  : 'm|l|C...',
		//	 	args  : [  ]
		function dCommCheck(count,type,val){
				dCommCheck.specs={
					m : [ 2 ],		l : [ 2 ],
			 		h : [ 1 ], 		v : [ 1 ],
					s : [ 4 ],		q : [ 4 ],		t : [ 2 ],
					c : [ 6  ,  'poly' ],			a : [ 7  , 'arc' ] 
				};
				var typeLow = type.toLowerCase();
				
				return dCommCheck.args  = [count,type,val].concat(dCommCheck.specs[typeLow]),
				countArgs.apply(null,dCommCheck.args);
		}

		function countArgs(count,type,val,num,opt){
				countArgs.patt = /-?\d+(\.\d+)?/g;
				countArgs.args = val.match(countArgs.patt );
				countArgs.bool = (!opt) ?
					num === countArgs.args.length :
				(opt === 'poly') ?
					countArgs.args.length % num === 0:
				
				//if we get here it's going to be an arc
					(			countArgs.args.length === num      &&
					(countArgs.args[3] === '0' || countArgs.args[3] === '1') &&
					(countArgs.args[4] === '0' || countArgs.args[4] === '1')    ) ;
				
				return {
					bool  : countArgs.bool,
				 	index : count,
				 	type  : type,
				 	args  : countArgs.args,
				 	val   : val
				};
		}

	}


})();