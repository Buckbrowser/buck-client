buckbrowser.controller('AccountCtrl', function($scope, $http, ErrorService, UserService, CountryService, CompanyService) {
	$scope.alerts = [];

	$scope.user = {};
	$scope.userUpdate = {};
	UserService.get().then(function(user) {
		$scope.user = user;
		$scope.userUpdate = angular.copy(user);
	});
	$scope.countries = {};
	CountryService.get_all().then(function(countries) {
		$scope.countries=countries;
	});

	$scope.companies = [];
	$http.jsonrpc(api, 'User.get_all_companies', {token: localStorage.buckbrowserToken})
	.success(function(data, status, headers, config){
		var errors = ErrorService.handle(data.result);
		if (errors.length > 0)
		{
			$scope.alerts = errors;
		}
		else
		{
			console.log(data.result);
			for (var comp in data.result)
			{
				$scope.companies.push(data.result[comp]);
			}
			console.log($scope.companies);
		}
	}).error(function(data, status, headers, config){
		alert('Error');
	});

	$scope.updateInfo = function() {
		var parameters = angular.copy($scope.userUpdate);
		parameters.token = localStorage.buckbrowserToken;
		$http.jsonrpc(api, 'User.update', parameters)
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				$scope.user = angular.copy($scope.userUpdate);
				UserService.update($scope.user);
				$scope.alerts.push({type: 'success', msg: 'Info updated succesfully'});
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.switchToCompany = function(company_id) {
		$http.jsonrpc(api, 'User.switch_company', {token: localStorage.buckbrowserToken, company_id: company_id})
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				localStorage.buckbrowserToken = data.result.token;
				CompanyService.update();
				$scope.alerts.push({type: 'success', msg: 'Logged in to other company'});
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.delete = function() {
		$http.jsonrpc(api, 'User.delete', {token: localStorage.buckbrowserToken})
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				$scope.alerts.push = {type: 'success', msg: 'You will recieve an email about deleting your account shortly.'};
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
});