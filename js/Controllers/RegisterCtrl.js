buckbrowser.controller('RegisterCtrl', function($scope, $rootScope, $http, $location, $modal, $modalInstance, ErrorService, UserService, CountryService) {
	$scope.alerts = [];

	$scope.user = {};

	$scope.register = true;
	$scope.newCompany = false;
	$scope.success = false;

	$scope.countries = {};
	CountryService.get_all().then(function(countries) { $scope.countries=countries; });

	$scope.registerUser = function() {
		$http.jsonrpc(api, 'User.create', $scope.user)
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length>0)
			{
				$scope.alerts = errors;
			}
			else
			{
				localStorage.buckbrowserToken = data.result.token;
				$rootScope.loggedIn = true;
				$scope.register = false;
				$scope.newCompany = true;
			}
		}).error(function(data, status, headers, config){
			$scope.alerts.push({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'})
		});
	};

	$scope.company = {};
	$scope.registerCompany = function() {
		var parameters = angular.copy($scope.company);
		parameters.token = localStorage.buckbrowserToken;
		$http.jsonrpc(api, 'Company.create', parameters)
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			console.log(errors);
			if (errors.length>0)
			{
				$scope.alerts = errors;
			}
			else
			{
				$scope.newCompany = false;
				$scope.success = true;
			}
		})
		.error(function(data, status, headers, config){
			$scope.alerts.push({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'})
		});
	};

	$scope.completeRegistration = function() {
		$modalInstance.close('Registration complete');
		$location.path('/account');
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
});