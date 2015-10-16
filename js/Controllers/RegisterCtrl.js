buckbrowser.controller('RegisterCtrl', function($scope, $rootScope, $http, $location, $modal, $modalInstance, ErrorService, UserService, CountryService) {
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
			alert('Error');
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
				// something with company service
				//$rootScope.company = $scope.company;
				//$rootScope.company.id = data.result.id;
				$scope.newCompany = false;
				$scope.success = true;
			}
		})
		.error(function(data, status, headers, config){
			alert('Error');
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