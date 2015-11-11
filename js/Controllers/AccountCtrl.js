buckbrowser.controller('AccountCtrl', function($scope, $http, ErrorService, UserService, CountryService, CompanyService) {
	$scope.alerts = [];

	$scope.user = {};
	$scope.userUpdate = {};
	UserService.get().then(function(user) {
		$scope.user = user;
		$scope.userUpdate = angular.copy(user);
	},function(errors) {
		if (errors) $scope.alerts = $scope.alerts.concat(errors);
	});
	$scope.countries = {};
	CountryService.get_all().then(function(countries) {
		$scope.countries=countries;
	},function(errors) {
		if (errors) $scope.alerts = $scope.alerts.concat(errors);
	});

	$scope.companies = [];
	UserService.get_all_companies().then(function(companies) {
		$scope.companies = companies;
	},function(errors) {
		if (errors) $scope.alerts = $scope.alerts.concat(errors);
	});

	$scope.updateInfo = function() {
		UserService.update($scope.userUpdate).then(function() {
			$scope.user = angular.copy($scope.userUpdate);
			$scope.alerts.push({type: 'success', msg: 'Info updated succesfully'});
		},function(errors) {
			if (errors) $scope.alerts = $scope.alerts.concat(errors);
		});
	};

	$scope.switchToCompany = function(company_id) {
		UserService.switch_to_company(company_id).then(function(a) {
			$scope.alerts.push({type: 'success', msg: 'Logged in to other company'});
		},function(errors) {
			if (errors) $scope.alerts = $scope.alerts.concat(errors);
		});
	};

	$scope.delete = function() {
		UserService.del().then(function() {
			$scope.alerts.push = {type: 'success', msg: 'You will recieve an email about deleting your account shortly.'};
		},function(errors) {
			if (errors) $scope.alerts = $scope.alerts.concat(errors);
		});
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
});