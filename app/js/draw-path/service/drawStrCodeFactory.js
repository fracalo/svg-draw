// factory for dinamically updating the string 

(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawStrCode',drawStrCode);

		function drawStrCode(){
		
		var offset = {};

		return {
				update:update,
				initStrOffset:initStrOffset,
				preUpdatePoints: preUpdatePoints,
				preUpdateD: preUpdateD,
			};

			function preUpdateD(ref, pointByI, xYpairs ){

				var dSubtracker = 'd'+ ref.hashSvg;

				if( ! offset[ dSubtracker ] )
				offset[ dSubtracker ] = {};

				return stringUpdate (
					ref.attrsStringRef.d[ pointByI.comI ],
					ref.attributes.d,
					xYpairs,
					offset[ dSubtracker ]
					);
			}
			function preUpdatePoints(ref, index, xYpairs ){

				var pointsSubtracker = 'points'+ ref.hashSvg;
				
				if( ! offset[ pointsSubtracker ] )
				offset[ pointsSubtracker ] = {};

				return stringUpdate (
					ref.attrsStringRef.points[index],
					ref.attributes.points,
					xYpairs,
					offset[ pointsSubtracker ]
					);
			}
			function update( ref , string, pairs ){
				// we could sort these while dispatching them..
				// but if they're not in order it will break string slicing.
				if(pairs.length > 1)
				pairs = pairs.sort((a,b)=>{
					return ref.attrsStringRef[a[0]].start - ref.attrsStringRef[b[0]].start;
				});
				
				return stringUpdate (ref.attrsStringRef, string, pairs, offset);
			}
			// this method is used also in substitution of points
			function stringUpdate( reference , string, pairs, offsetTracker ){
				var  tmpShift = 0, temp = {},
				start , end , beginSlice , origEnd , origStart ,origBeginSlice ;
				return pairs.reduce(function(acc, x, i, pairs){
					
					x[1] = x[1].toString();

					origBeginSlice = (i === 0)? 0 :
					reference[ pairs[ i-1 ][0] ].end  ;
					beginSlice = valShift(origBeginSlice , offsetTracker ) ;

					origStart = reference[ x[0] ].start;
					start = valShift( origStart , offsetTracker ) ;
					
					origEnd = reference[ x[0] ].end;
					end = valShift( origEnd , offsetTracker ) ;

					/*********************/
					acc +=  string.slice(  beginSlice , start  ) +  x[1];
					if( tmpShift !== 0){
					offsetManager( origStart  , start + tmpShift , temp );
					}

					var difference = x[1].length - ( end - start ) ; 
					if( difference !== 0 || tmpShift !== 0){
					offsetManager( origEnd , origEnd + (end - origEnd ) + difference + tmpShift , temp );
						tmpShift += difference;
					}

					//additional operation on last substitution
					if (i === pairs.length - 1){
			
						/*********************/
						acc += string.slice( end );

						//maintainence
						offsetMerge(  offsetTracker , temp );
					}

					return acc;
				},'');

			}
			function valShift( val, offsetTracker){
				//loop over an obj as if it was an array .. 
				for (var i = val ; i > 0 ; i--){
					if (offsetTracker[i]  ){
						var diff = offsetTracker[ i ] - i ;
						val = val + diff;
						break;
					}
				}
				return val;
			}
			function offsetManager(index, modVal , offsetTracker){
				offsetTracker[ index ] =  modVal ;
			}
			function offsetMerge( d ,s ){

					let ok = NumFromArr( Object.keys(s) );
					let okDest = NumFromArr( Object.keys(d) );
					let top = Math.max.apply( null , [0].concat(ok).concat(okDest)	);
					
					var tempDiff = 0;
					for( var i = 0 ; i <= top  ; i++){
						// this loops from 0 to max number 

						if ( s[ i ] ){
							tempDiff =  s[i] - ( d[ i ] || i )  ;

							d[ i ] = s[ i ] ;
						}
						else if ( d[ i ] )	{
	 						
							d[ i ] += tempDiff ;
						}
					}
			}
			//utility that returns only numbers from an array
			function NumFromArr(a){
				return a.reduce( (ac,x) => {
						if(!isNaN( Number(x) ))
						ac.push( Number(x) );
						
						return ac;
					},[]);

			}
			function initStrOffset(){
				offset = {};
			}



		}


})();