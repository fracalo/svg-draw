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
			"<div ng-repeat='i in exc.list track by $index'>"+
			"	<p>"+
			"		<span class='glyphicon glyphicon-remove' ng-click='exc.deleteError(i.$$hashKey)'></span>"+
			"		<span class='glyphicon glyphicon-retweet' ng-click='exc.deleteError(i.$$hashKey)'></span>"+
			"		error with <strong>{{i.property}}</strong> ( {{i.reason}} )"+
			"    </p>"+
			"</div>",
			controllerAs:'exc',
			controller: function($scope,drawValidation,drawData){
				var self = this;
				this.list = drawValidation.flatList;
				
			
				function watchNode(){
					return drawData.node;
				}
				let watchList = ()=>{
					return drawValidation.list
				}
				$scope.$watch(watchNode,function(){
					//\\ this is responsible  also for starting the creation of Gui-points etc. //\\
					drawValidation.checkExc();
				});	
				$scope.$watch(watchList, function(n){
					self.list = drawValidation.getErrors();
				},true);
				
				this.deleteError = drawValidation.deleteError;
			}
		};
	}
})();

