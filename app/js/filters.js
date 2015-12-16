'use strict';

/* Filters */
var svgFiddleFilters=angular.module('svgFiddleFilters',[]);

/*from array of points to dval*/
/*svgFiddleFilters.filter('arrayToSVG',function(){ 
	return function(ar){
      if (ar.length == 0)
      return '';
     
      var res = ar.reduce(function(ac,x,i,arr){
        if (i == 0)
        x[0] = 'M';
      
        ac += x[0] + x[1].join(' ')+ ' ' ;

        return ac;
      },'');
    return res 
    }
});*/

/*from obj of path points and controlPoints to dval*/
//sample point output  point=[type:'C', [22,33],[34,42],[66,88] ];
svgFiddleFilters.filter('arrayToDVal',function(){ 
  return function(ar){
      if (ar.length == 0)
      return '';
    var res = ar.reduce(function(ac,x,i,ar){
          ac += x.type;
          var tr = x.list.map(e=> e.join(' '));
          
          ac += tr.join(',') + ' ';
          return ac;
        },'');
    return res.trim(); 
    }
});
/*from (attrs) dval to explicit markup*/
svgFiddleFilters.filter('attrsToMarkup',function(){ 
	return function(obj){
    var str = '';
    


    for (var k in obj){

      str+= k + '="' + obj[k] + '" ';
    };

    
		return '<path '+str + '></path>';
  }
  
});
svgFiddleFilters.filter('markupToAttrs',function(){ 
	return function(str){
      var pattern= /d\s*=\s*"\s*(.*?)\s*"/;
      var res = str.match(pattern);

		return res[1];
    }
});

svgFiddleFilters.filter('dValToArray', function(){
	return function(str){
    var pat= /([A-Z][\d+|\s|,|\b]*)[^\A-Z]?/gi;

    var res = [];
    str.replace(pat,function(a){
      var p={
        list:[]
      };
      p.type=a.slice(0,1);

     
      var points= a.slice(1).trim().split(/\s*,\s*/);
      
      points.forEach(function(x){
 
            p.list.push( x.split(' ').map( item =>Number(item) ) );
      });
      res.push(p)

    });
    return res;
	}
});

svgFiddleFilters.filter('parseMarkup',function(){
  return function(str){
    var obj = Object.create(null);
    var pat = /([a-zA-Z\-]+)\s*=\s*"\s*(.*?)\s*"/g;

    str.replace(pat,function(match, k, v){
 

      obj[k]=v
    })


    return obj
  } 
});

svgFiddleFilters.filter('')
