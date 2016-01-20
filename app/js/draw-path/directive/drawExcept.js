// directive that dialogs with user showing exceptions on attributes names
// or common value types
// that are being stored in the drawExceptFactory
(function(){
	'use strict';
	angular
		.module('draw.path')
		.directive('drawExcept' , drawExcept);

	drawExcept.$inject = ['drawExceptFactory','drawDataFactory'];

	function drawExcept(drawExceptFactory,drawDataFactory){
		return {
			restrict:'EA',
			template:
			"<div ng-repeat='i in exc.list'>"+
			"	<p>error:{{i.issue}}</p>"+
			"	<span class='glyphicon glyphicon-remove' ng-click='exc.deleteError($index)'></span>"+
			"</div>",
			controllerAs:'exc',
			controller: function($scope,drawExceptFactory,drawDataFactory){
				var self = this;
				this.list = drawExceptFactory.list;
				
				$scope.$watch(exceptList,function(){
					
					drawExceptFactory.checkExc();
					self.list = drawExceptFactory.list;
					console.log(drawExceptFactory.list)
				});
				
				function exceptList(){
					return drawDataFactory.node;
				}
				
				this.deleteError = drawExceptFactory.deleteError;
			}
		};
	}
})();

