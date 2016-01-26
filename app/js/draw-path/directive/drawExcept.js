// directive that dialogs with user showing exceptions on attributes names
// or common value types
// that are being stored in the drawValidation
(function(){
	'use strict';
	angular
		.module('draw.path')
		.directive('drawExcept' , drawExcept);

	drawExcept.$inject = ['drawValidation','drawDataFactory'];

	function drawExcept(drawValidation,drawDataFactory){
		return {
			restrict:'EA',
			template:
			"<div ng-repeat='i in exc.list'>"+
			"	<p>error:{{i.issue}}</p>"+
			"	<span class='glyphicon glyphicon-remove' ng-click='exc.deleteError($index)'></span>"+
			"</div>",
			controllerAs:'exc',
			controller: function($scope,drawValidation,drawDataFactory){
				var self = this;
				this.list = drawValidation.list;
				
				$scope.$watch(exceptList,function(){
					
					drawValidation.checkExc();
					self.list = drawValidation.list.specific;
				});
				
				function exceptList(){
					return drawDataFactory.node;
				}
				
				this.deleteError = drawValidation.deleteError;
			}
		};
	}
})();

