// directive that dialogs with user showing exceptions on attributes names
// or common value types
// that are being stored in the drawValidation
(function(){
	'use strict';
	angular
		.module('draw.path')
		.directive('drawExcept' ,drawExcept);

	drawExcept.$inject = ['drawValidation','drawData'];

	function drawExcept(drawValidation,drawData){
		return {
			restrict:'EA',
			template:
			"<div ng-repeat='i in exc.list'>"+
			"	<p>"+
			"		error with <strong>{{i.property}}</strong> ( {{i.reason}} )"+
			"		<span class='glyphicon glyphicon-remove' ng-click='exc.deleteError(i.$$hashKey)'></span>"+
			"    </p>"+
			"</div>",
			controllerAs:'exc',
			controller: function($scope,drawValidation,drawData){
				var self = this;
				this.list = drawValidation.flatList;
				
				$scope.$watch(watchNode,function(){
					//\\ this is responsible  also for starting the creation of Gui-points etc. //\\
					drawValidation.checkExc();
					// self.list = drawValidation.list;
				});				
				function watchNode(){
					return drawData.node;
				}
				let watchList = ()=>{
					return drawValidation.list
				}
				$scope.$watch(watchList, function(n){
					self.list = drawValidation.getErrors();
					console.log(self.list)
				},true);
				
				this.deleteError = drawValidation.deleteError;
			}
		};
	}
})();

