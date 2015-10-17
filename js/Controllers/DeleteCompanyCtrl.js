buckbrowser.controller('DeleteCompanyCtrl', function($scope, $http, $routeParams, ErrorService, CompanyService) {
	$scope.alerts = [];

	$scope.delete = function() {
		$http.jsonrpc(api, 'Company.delete', {token: localStorage.buckbrowserToken, verification_code: $routeParams.verification_code})
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				CompanyService.update(null);
				$scope.alerts.push({type: 'success', msg: 'Your company has been deleted succesfully'});
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};
});