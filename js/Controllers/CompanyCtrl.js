buckbrowser.controller('CompanyCtrl', function($scope, $http, CompanyService, CountryService, ErrorService) {
	$scope.alerts = [];

	$scope.company = {};
	$scope.companyUpdate = {};
	CompanyService.get().then(function(company) {
		$scope.company = company;
		$scope.companyUpdate = angular.copy($scope.company);
		if (company.id_country != null)
		{
			CountryService.get(company.id_country).then(function(country) {
				$scope.company.country = country;
			},function(errors) {
				$scope.alerts.push(errors)
			});
		}
	},function(errors) {
		if (errors) $scope.alerts = $scope.alerts.concat(errors);
	});
	$scope.countries = {};
	CountryService.get_all().then(function(countries) {
		$scope.countries=countries;
	},function(errors) {
		if (errors) $scope.alerts = $scope.alerts.concat(errors);
	});

	$scope.updateInfo = function() {
		CompanyService.update($scope.companyUpdate).then(function() {
			$scope.company = angular.copy($scope.companyUpdate); // update company in this controller
			CountryService.get($scope.company.id_country).then(function(country) { // update the country (instead of country_id) in controller
				$scope.company.country = country;
			},function(errors) {
				if (errors) $scope.alerts = $scope.alerts.concat(errors);
			});
			$scope.alerts.push({type: 'success', msg: 'Info updated succesfully'});
		},function(errors) {
			if (errors) $scope.alerts = $scope.alerts.concat(errors);
		});
	};

	$scope.delete = function() {
		CompanyService.del().then(function() {
			$scope.alerts.push({type: 'info', msg: 'An email has been send to '+$scope.company.email+'. Please follow the instructions in that email to confirm deleting your account.'});
		},function(errors) {
			if (errors) $scope.alerts = $scope.alerts.concat(errors);
		});
	};

	$scope.IBANError = function(value) {
		return value.$dirty && typeof value.$modelValue === 'undefined';
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
});