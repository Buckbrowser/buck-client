buckbrowser.service('CompanyService', function($http, $q, ErrorService) {
	return {
		'contacts': [],
		'get': function() {
			var deferred = $q.defer();
			if (this.company)
			{
				deferred.resolve(this.company);
			}
			else
			{
				$http.jsonrpc(api, 'Company.read', {token: localStorage.buckbrowserToken})
				.success(function(data, status, headers, config){
					var errors = ErrorService.handle(data.result);
					if (errors.length > 0)
					{
						console.log('hoi');
						console.log(errors);
						deferred.reject();
					}
					else
					{
						this.company = data.result;
						deferred.resolve(this.company);
					}
				}).error(function(data, status, headers, config){
					alert('Error');
					deferred.reject();
				});
			}
			return deferred.promise;
		},
		'update': function(company) {
			this.company = company;
		},
		'get_all_contacts': function() {
			var deferred = $q.defer();
			if (this.contacts.length > 0)
			{
				deferred.resolve(this.contacts);
			}
			else
			{
				$http.jsonrpc(api, 'Company.get_all_contacts', {token: localStorage.buckbrowserToken})
				.success(function(data, status, headers, config){
					var errors = ErrorService.handle(data.result);
					if (errors.length>0)
					{
						console.log(errors);
						deferred.reject();
					}
					else
					{
						this.contacts = data.result;
						deferred.resolve(this.contacts);
					}
				}).error(function(data, status, headers, config){
					alert('Error');
					deferred.reject();
				});
			}
			return deferred.promise;
		},
		'add_contact': function(contact) {
			this.contacts.push(contact);
		},
		'update_contact': function(contact) {
			for (var i=0;i<contacts.length;i++)
			{
				if (contacts[i]['id'] == contact.id)
				{
					contacts[i]['company'] == contact.company;
					break;
				}
			}
		},
		'delete_contact': function(contact) {
			for (var i=0;i<contacts.length;i++)
			{
				if (contacts[i]['id'] == contact.id)
				{
					contacts.splice(i,1);
					break;
				}
			}
		}
	}
});