buckbrowser.controller('ContactsCtrl', function($scope, $rootScope, $http, CompanyService, CountryService, ErrorService) {
	$scope.alerts = [];

	$scope.contacts = [];
	$scope.noContacts = true;
	$scope.allContacts = false;
	CompanyService.get_all_contacts().then(function(contacts) {
		$scope.contacts = contacts;
		if (contacts.length > 0)
		{
			$scope.noContacts = false;
			$scope.allContacts = true;
		}
	});
	$scope.updateClick = false;

	$scope.newContact = {};
	$scope.thisContact = {};

	$scope.countries = {};
	CountryService.get_all().then(function(countries) {
		$scope.countries=countries;
	});

	$scope.searchResults = [];

	$scope.showUpdate = function(id) {
		var already_read = false;
		for (var i=0;i<contacts.length;i++)
		{
			if (contacts[i]['id'] == id && contacts[i]['first_name'])
			{
				already_read = true;
				$scope.thisContact = contacts[i];
				$scope.allContacts = false;
				$scope.updateClick = true;
				break;
			}
		}
		if (!already_read)
		{
			$http.jsonrpc(api, 'Contact.read', {token: localStorage.buckbrowserToken, id: id})
			.success(function(data, status, headers, config){
				if (data.result.error)
				{
					console.log(data);
					alert('Error, logged in console');
				}
				else
				{
					$scope.thisContact = data.result;
					$scope.thisContact.id = id;
					$scope.allContacts = false;
					$scope.updateClick = true;
				}
			}).error(function(data, status, headers, config){
				alert('Error');
			});
		}
	};

	$scope.updateContact = function() {
		var this_contact = angular.copy($scope.thisContact);
		var parameters = angular.copy(this_contact);
		parameters.token = localStorage.buckbrowserToken;
		$http.jsonrpc(api, 'Contact.update', parameters)
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				CompanyService.update_contact(this_contact);
				CompanyService.get_all_contacts().then(function(contacts) {	$scope.contacts = contacts;	});
				$scope.thisContact = {};
				$scope.alerts.push({type: 'success', msg: this_contact.company+' updated successfully'});
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.createNewContact = function(form) {
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
				new_contact.id = data.result.id;
				CompanyService.add_contact(new_contact);
				$scope.contacts.push(new_contact);
				$scope.newContact = {};
				$scope.alerts.push({type: 'success', msg: 'Contact created successfully'});
				form.$setPristine();
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.deleteContact = function(contact) {
		var check = confirm("Are you sure you want to delete this contact?");
		if (check)
		{
			$http.jsonrpc(api, 'Contact.delete', {token: localStorage.buckbrowserToken, id: contact})
			.success(function(data, status, headers, config){
				var errors = ErrorService.handle(data.result);
				if (errors.length > 0)
				{
					$scope.alerts = errors;
				}
				else
				{
					CompanyService.delete_contact(contact);
					CompanyService.get_all_contacts().then(function(contacts) {	$scope.contacts = contacts;	});
					$scope.alerts.push({type: 'success', msg: 'Contact deleted succesfully'});
				}
			}).error(function(data, status, headers, config){
				alert('Error');
			});
		}
	};

	$scope.search = function(searchContact) {
		console.log(searchContact);
		if (!searchContact)
		{
			$scope.searchResults = {};
		}
		else
		{
			$scope.searchResults = angular.copy($scope.contacts).filter(function(value){
				return value.company.toLowerCase().indexOf(searchContact.toLowerCase()) > -1;
			});
			console.log($scope.searchResults);
		}
	};

	$scope.showAllContacts = function() {
		$scope.updateClick = false;
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

});