// (function(){

//   'use strict';

// /* Filters */
// angular.module('draw.path')
// /*transform in an array like type (used for creating vector array*/ 
// .filter('toVectorArray',function(){
//   return function(ar){
//     if (ar.length === 0) return;
//     return ar.reduce(function(ac,x,i,ar){
//           if( x.type =='C' || x.type =='Q'){
//             ac.push({
//               type:'M',
//               list: [ ar[i-1].list[ ar[i-1].list.length - 1 ] ]
//               });
//             ac.push({
//               type:'L',
//               list: [ x.list[0] ]
//               });
//             ac.push({
//               type:'M',
//               list: [ x.list[ x.list.length - 1 ] ]
//               });
//             ac.push({
//               type:'L',
//               list: [ x.list[ x.list.length - 2 ] ]
//               });
//             }
//             return ac;
//         },[]);
//       };
// })

// /*from obj of path points and controlPoints to dval*/
// //sample point output  point=[type:'C', [22,33],[34,42],[66,88] ];
// .filter('arrayToDVal',function(){ 
//   return function(ar){
//       if (!ar)
//       return '';
//     var res = ar.reduce(function(ac,x,i,ar){
//           ac += x.type;
//           var tr = x.list.map(e => e.join(' '));
          
//           ac += tr.join(',') + ' ';
//           return ac;
//         },'');
//     return res.trim(); 
//     };
// })

// /*from (attrs) dval to explicit markup*/
// .filter('attrsToMarkup',function(){ 
//   return function(obj){
//     var str = '';

//     for (var k in obj){
//       str+= k + '="' + obj[k] + '" ';
//     }
//     return '<path '+str +' />';
//   };
  
// })

// .filter('markupToAttrs',function(){ 
//   return function(str){
//       var pattern= /d\s*=\s*"\s*(.*?)\s*"/;
//       var res = str.match(pattern);
//     return res[1];
//     };
// })

// .filter('dValToArray', function(){
//   return function(str){
//     if(!str || str === '')
//     return [];
  
//         var pat= /([A-Z][\d+|\s|,|\b]*)[^\A-Z]?/gi;

//         var res = [];
//         str.replace(pat,function(a){
//         var p={
//             list:[]
//          };
//          p.type = a.slice(0,1);
         
//          var points= a.slice(1).trim().split(/\s*,\s*/);
//          points.forEach(function(x){
//                 p.list.push( x.split(' ').map( item =>Number(item) ) );
//          });
         
//           res.push(p);
//         });
//       return res;
//   };
// })

// .filter('PromiseDValToArray', function(){
//   return function(str){
//     if(!str || str === '')
//     throw new Error('dValue isn\'t present');
  
//         var pat= /([A-Z][\d+|\s|,|\b]*)[^\A-Z]?/gi;

//         var res = [];
//         str.replace(pat,function(a){
//         var p={
//             list:[]
//          };
//          p.type = a.slice(0,1);
         
//          var points= a.slice(1).trim().split(/\s*,\s*/);
//          points.forEach(function(x){
//                 p.list.push( x.split(' ').map( item =>Number(item) ) );
//          });
         
//           res.push(p);
//         });
//       return res;
//   };
// })

// .filter('parsePointArray',function(){
//   // 
//   return function(ar){
//   var pat= /([^(M|L|C|Q|Z|S|A|H|V)])/;
//     ar.forEach( x => {
//       x.type = x.type.replace(pat, t =>{
//         if(x.list.length == 1 )
//         {return t='L';}

//         if(x-list.length == 2)
//         {return t='Q';}

//         if(x.list.length == 3)
//         {return t= 'C';}
//       });

//       x.list.forEach( a => {
//             if(a.length<2)
//             a[1]=a[0];

//             if(a.length>2)
//             a.splice(2,a.length);
//         })
//     });
//     return ar;
//   };
// })

// .filter('testParsePointArray',function(){
//   // 
//   return function(ar){
//   var pat= /([^(M|L|C|Q|Z|S|A|H|V)])/;
//     ar.forEach( (x,i) => {
//       x.type = x.type.replace(pat, t =>{
        
//       throw new Error('error on point # ' + i)

      
//       });

//       x.list.forEach( a => {
//             if(a.length<2)
//       throw new Error('error on point # ' + i+' (not enogh values)')

//             if(a.length>2)
//       throw new Error('error on point # ' + i+' (too many values)')

//         })
//     });
//     return ar;
//   };
// })

// .filter('parseMarkup',function(){
//   return function(str){
//     var obj = Object.create(null);
//     var pat = /([a-zA-Z\-]+)\s*=\s*"\s*(.*?)\s*"/g;

//     str.replace(pat,function(match, k, v){
//        obj[k]=v;
//     });
//     return obj;
//   };
// })

// .filter('parsePath',function($q){
//   return function(str){
  


//         var attrOp = ['fill','stroke','stroke-width','stroke-dasharray','stroke-linecap','d'];
//         var obj = Object.create(null);
//         var pat = /([a-zA-Z\-]+)\s*=\s*"\s*(.*?)\s*"/g;
//     return $q(function(resolve, reject){
//         str.replace(pat,function(match, k, v,offset){
      
//             //while parsing the string we can check attributes and values
//             if(attrOp.every( attr => attr !== k))
//             { reject(k +' isn\'t a supported attribute name '+ offset); }
//             obj[k]=v;
//         });

//         resolve(obj)
//     });


// //     var attrOp = ['fill','stroke','stroke-width','stroke-dasharray','stroke-linecap','d'];
// //     var obj = Object.create(null);
// //     var pat = /([a-zA-Z\-]+)\s*=\s*"\s*(.*?)\s*"/g;

// //     str.replace(pat,function(match, k, v){
      
// //       //while parsing the string we can check attributes and values
// //       if(attrOp.every( attr => attr !== k))
// //       { throw new Error(k +' is not a supported attribute name'); }

// // /*      if(k == 'd'){
// //       }*/

// //       obj[k]=v;
// //     });
// //     return obj;


//   }
// })
// /* modify's pathArray(dValue) when changing point type*/
// .filter('normalizePointType',function(){
//    function createP(bef , aft, n){
      
//       var res = [];
      
//       var dividers =
//         (n==2)?
//         [1.667, 2.5]:
//         [ 2 ];

//       dividers.forEach(i =>{
//         var p = [];
//         p[0] = (bef[0] + aft[0])/i |0;
//         p[1] = (bef[1] + aft[1])/i |0;
//         res.push(p);
//       });
//       return res;
//    }
//   return function(arr){
//     var before, after, p;
//     arr.forEach( function(x,i,arr){
//          if ((x.type === 'M' || x.type === 'L') && x.list.length !== 1){
//             x.list = x.list.splice(-1 , 1 );
//           }

//          if (x.type === 'Q' && x.list.length != 2){
//               if ( ! (arr[i-1]) ){
//                 x.type = 'M';
//                 return;
//               }

//               if(x.list.length<2){
//                    before = arr[i-1].list[ arr[i-1].list.length  - 1 ];
//                    after = x.list[0];
//                    p = createP(before,after);
                  
//                   x.list.unshift( p[0] );
//               }else{
//                   x.list = x.list.splice(-2 , 2 );
//               }

//           }

//           if (x.type === 'C' && x.list.length !== 3){
//               if ( ! (arr[i-1]) ){
//                 x.type = 'M';
//                 return;
//               }
//               //it seems er're adding some points to list
//                 before = arr[i-1].list[ arr[i-1].list.length  - 1 ];
//                 after = x.list[0];
 
//               if (x.list.length === 2){
//                    p = createP(before,after);
//                   x.list.unshift( p[0] );
//               }
//               if (x.list.length === 1){
//                    p = createP(before,after,2);
//                   x.list = p.concat(x.list);
                  
//               }
//           }
//         });
//         return arr;
//       };
// })

// })();