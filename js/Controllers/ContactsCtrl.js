buckbrowser.controller('ContactsCtrl', function($scope, $rootScope, $http, CompanyService, CountryService, ErrorService) {
	$scope.alerts = [];

	$scope.contacts = {};
	CompanyService.get_all_contacts().then(function(contacts) {	$scope.contacts = contacts;	});
	$scope.editClick = false;

	$scope.newContact = {};
	$scope.countries = {};
	CountryService.get_all().then(function(countries) {
		$scope.countries=countries;
	});

	$scope.edit = function(id) {
		$http.jsonrpc(api, 'Contact.read', {token: localStorage.buckbrowserToken, id: id})
		.success(function(data, status, headers, config){
			if (data.result.error)
			{
				console.log(data);
				alert('Error, logged in console');
			}
			else
			{
				$scope.thisContact = data.result.contact;
				$scope.editClick = true;
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.newContact = function() {
		var new_contact = angular.copy($scope.newContact);
		var parameters = angular.copy(new_contact);
		parameters.token = localStorage.buckbrowserToken;
		$http.jsonrpc(api, 'Contact.create', parameters)
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				CompanyService.add_contact(new_contact);
				$scope.contacts.push(new_contact);
				$scope.newContact = {};
				$scope.alerts.push({type: 'success', msg: 'Contact created successfully'});
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};


});