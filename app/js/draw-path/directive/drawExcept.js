// directive that dialogs with user showing exceptions on attributes names
// or common value types
// that are being stored in the drawValidation
(function(){
	'use strict';
	angular
		.module('draw.path')
		.directive('drawExcept' , drawExcept);

	drawExcept.$inject = ['drawValidation','drawData'];

	function drawExcept(drawValidation,drawData){
		return {
			restrict:'EA',
			template:
			"<div ng-repeat='i in exc.list'>"+
			"	<p>error:{{i.issue}}</p>"+
			"	<span class='glyphicon glyphicon-remove' ng-click='exc.deleteError($index)'></span>"+
			"</div>",
			controllerAs:'exc',
			controller: function($scope,drawValidation,drawData){
				var self = this;
				this.list = drawValidation.list;
				
				$scope.$watch(watchNode,function(){
					
					//\\ this is responsible  also for starting the creation of Gui-points etc. //\\
					drawValidation.checkExc();
					self.list = drawValidation.list.specific;
				});
				
				function watchNode(){
					return drawData.node;
				}
				
				this.deleteError = drawValidation.deleteError;
			}
		};
	}
})();

