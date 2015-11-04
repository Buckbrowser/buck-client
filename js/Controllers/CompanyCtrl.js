buckbrowser.controller('CompanyCtrl', function($scope, $http, CompanyService, CountryService, ErrorService) {
	$scope.alerts = [];

	$scope.company = {};
	$scope.companyUpdate = {};
	CompanyService.get().then(function(company) {
		$scope.company = company;
		$scope.companyUpdate = angular.copy($scope.company);
		if (company.id_country != null)
		{
			CountryService.get(company.id_country)
			.then(function(country) { $scope.company.country = country; })
			.then(function(errors) { $scope.alerts.push(errors) });
		}
	}).then(function(errors) { $scope.alerts.push(errors); });
	$scope.countries = {};
	CountryService.get_all().then(function(countries) {
		$scope.countries=countries;
	}).then(function(errors) { $scope.alerts.push(errors); });

	$scope.updateInfo = function() {
		var parameters = angular.copy($scope.companyUpdate);
		parameters.token = localStorage.buckbrowserToken;
		$http.jsonrpc(api, 'Company.update', parameters)
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				$scope.company = angular.copy($scope.companyUpdate);
				CompanyService.update($scope.company);
				CountryService.get($scope.companyUpdate.id_country)
				.then(function(country) { $scope.company.country = country; })
				.then(function(errors) { $scope.alerts.push(errors); });
				$scope.alerts.push({type: 'success', msg: 'Info updated succesfully'});
			}
		}).error(function(data, status, headers, config){
			$scope.alerts.push({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'});
		});
	};

	$scope.delete = function() {
		$http.jsonrpc(api, 'Company.delete', {token: localStorage.buckbrowserToken, url: delete_company_url})
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				$scope.alerts.push({type: 'info', msg: 'An email has been send to '+$scope.company.email+'. Please follow the instructions in that email to confirm deleting your account.'});
			}
		}).error(function(data, status, headers, config){
			$scope.alerts.push({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'});
		});
	};

	$scope.IBANError = function(value) {
		return value.$dirty && typeof value.$modelValue === 'undefined';
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
});