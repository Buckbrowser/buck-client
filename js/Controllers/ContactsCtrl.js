buckbrowser.controller('ContactsCtrl', function($scope, $rootScope, $http, CompanyService, CountryService, ErrorService, ContactService) {
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
			ContactService.read(id).then(function(contact) {
				$scope.thisContact = contact;
				$scope.thisContact.id = id;
				$scope.allContacts = false;
				$scope.updateClick = true;
			},function(errors) {
				if (errors) $scope.alerts = $scope.alerts.concat(errors);
			});
		}
	};

	$scope.updateContact = function() {
		ContactService.update($scope.thisContact).then(function() {
			var this_contact = angular.copy($scope.thisContact);
			CompanyService.update_contact(this_contact);
			CompanyService.get_all_contacts().then(function(contacts) {
				$scope.contacts = contacts;
			},function(errors) {
				if (errors) $scope.alerts = $scope.alerts.concat(errors);
			});
			$scope.thisContact = {};
			$scope.alerts.push({type: 'success', msg: this_contact.company+' updated successfully'});
		},function(errors) {
			if (errors) $scope.alerts = $scope.alerts.concat(errors);
		});
	};

	$scope.createNewContact = function(form) {
		ContactService.create($scope.newContact).then(function() {
			var new_contact = angular.copy($scope.newContact);
			new_contact.id = data.result.id;
			CompanyService.add_contact(new_contact);
			$scope.contacts.push(new_contact);
			$scope.newContact = {};
			$scope.alerts.push({type: 'success', msg: 'Contact created successfully'});
			form.$setPristine();
		},function(errors) {
			if (errors) $scope.alerts = $scope.alerts.concat(errors);
		});
	};

	$scope.deleteContact = function(contact) {
		var check = confirm("Are you sure you want to delete this contact?");
		if (check)
		{
			ContactService.del(contact).then(function() {
				CompanyService.delete_contact(contact);
				CompanyService.get_all_contacts().then(function(contacts) {
					$scope.contacts = contacts;
				},function(errors) {
					if (errors) $scope.alert.push(errors);
				});
				$scope.alerts.push({type: 'success', msg: 'Contact deleted succesfully'});
			},function(errors) {
				if (errors) $scope.alerts = $scope.alerts.concat(errors);
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

	$scope.IBANError = function(value) {
		return value.$dirty && typeof value.$modelValue === 'undefined';
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

});