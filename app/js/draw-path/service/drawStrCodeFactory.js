(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawStrCode',drawStrCode);

		function drawStrCode(){
		
		var offset = {},
		    temp   = {};

		return {
				update:update,
				initStrOffset:initStrOffset,
				offsetMerge:offsetMerge,
			};


		function update( ref , string, pairs ){
		
			pairs = pairs.sort((a,b)=>{
				return ref.attrsStringRef[a[0]].start - ref.attrsStringRef[b[0]].start;
			});
			
			var  tmpShift = 0, 
			start , end , beginSlice , origEnd , origStart ,origBeginSlice ;
			

			return pairs.reduce(function(acc, x, i, pairs){
				
				x[1] = x[1].toString();

				origBeginSlice = (i === 0)? 0 :
				ref.attrsStringRef[ pairs[ i-1 ][0] ].end  ;
				beginSlice = valShift(origBeginSlice  ) ;
				
				origStart = ref.attrsStringRef[ x[0] ].start;
				start = valShift( origStart  );

				origEnd = ref.attrsStringRef[ x[0] ].end;
				end = valShift( origEnd  ) ;

				acc +=  string.slice(  beginSlice , start  ) +  x[1];
					
				if( tmpShift !== 0){
					offsetManager( origStart  , start + tmpShift );
				}

				var difference = x[1].length - ( end - start ) ; 
				if( difference !== 0 || tmpShift !== 0){
					offsetManager( origEnd  , origEnd + (end - origEnd )+ difference + tmpShift);
					tmpShift += difference;
				}

				//additional operation on last substitution
				if (i === pairs.length - 1){
					acc += string.slice( end );

					//maintainence
					offsetMerge(offset);
					resetTemp();
					tmpShift = 0;
				}

				return acc;
			},'');

		}
		function valShift(val){
			for (var i = val ; i > 0 ; i--){
				if (offset[i]  ){
					var diff = offset[ i ] - i ;
					val = val + diff;
					break;
				}
			}
			return val;

		}
		function offsetManager(index, modVal){
			temp[ index ] =  modVal ;
		}
		function offsetMerge(o){
			for (var i in temp){
					o[i] = temp[i] ;
			}
		}
		function resetTemp(){
			temp = {};
		}
		function initStrOffset(){
			offset = {};
		}



		}


})();