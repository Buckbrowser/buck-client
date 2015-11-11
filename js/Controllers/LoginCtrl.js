buckbrowser.controller('LoginCtrl', function($scope, $rootScope, $http, $modalInstance, $location, ErrorService, UserService, CompanyService) {
	$scope.alerts = [];

	$scope.login = {};
	$scope.authenticate = function() {
		$http.jsonrpc(api, 'User.authenticate', $scope.login)
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length>0)
			{
				$scope.alerts = errors;
			}
			else
			{
				if (data.result.company == -1)
				{
					CompanyService.set_company(null);
				}
				localStorage.buckbrowserToken = data.result.token;
				$rootScope.loggedIn = true;
				$modalInstance.close('Logged in');
				$location.path('/account');
			}
		}).error(function(data, status, headers, config){
			$scope.alerts.push({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'})
		});
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
});