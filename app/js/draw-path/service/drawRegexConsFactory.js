(function(){
	'use strict';

	angular
		.module('draw.path')
		.factory('drawRegexCons',drawRegexCons);

	

	function drawRegexCons(){
		return{
			attrsStrLen:attrsStrLen
		};

		function attrsStrLen (nodeName, attr, val) {

			// this escapes some characters that need 
			var valescaper = /[(|)+*[\]]/g;
			val = val.toString();
			val = val.replace(valescaper,'\\$&');
			
			return new RegExp("< *" + nodeName + ".+?(?:" + attr + ").+?(" + val + ")");
		}
	}
	})();