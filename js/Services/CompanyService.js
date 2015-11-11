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
						deferred.reject(errors);
					}
					else
					{
						this.company = data.result;
						deferred.resolve(this.company);
					}
				}).error(function(data, status, headers, config){
					deferred.reject({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'});
				});
			}
			return deferred.promise;
		},
		'update': function(company) {
			var deferred = $q.defer();
			var parameters = angular.copy(company);
			parameters.token = localStorage.buckbrowserToken;
			$http.jsonrpc(api, 'Company.update', parameters)
			.success(function(data, status, headers, config){
				var errors = ErrorService.handle(data.result);
				if (errors.length > 0)
				{
					deferred.reject(errors);
				}
				else
				{
					this.company = company;
					deferred.resolve();
				}
			}).error(function(data, status, headers, config){
				deferred.reject({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'});
			});
			return deferred.promise;
		},
		'del': function() {
			var deferred = $q.defer();
			$http.jsonrpc(api, 'Company.delete', {token: localStorage.buckbrowserToken, url: delete_company_url})
			.success(function(data, status, headers, config){
				var errors = ErrorService.handle(data.result);
				if (errors.length > 0)
				{
					deferred.reject(errors);
				}
				else
				{
					deferred.resolve();
				}
			}).error(function(data, status, headers, config){
				deferred.reject({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'});
			});
			return deferred.promise;
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
						deferred.reject(errors);
					}
					else
					{
						this.contacts = data.result;
						deferred.resolve(this.contacts);
					}
				}).error(function(data, status, headers, config){
					deferred.reject({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'});
				});
			}
			return deferred.promise;
		},
		'set_company': function(company) {
			this.company = company;
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