buckbrowser.service('ContactService', function($http, $q, ErrorService) {
	return {
		'create': function(contact) {
			var deferred = $q.defer();
			var parameters = contact;
			parameters.token = localStorage.buckbrowserToken;
			$http.jsonrpc(api, 'Contact.create', parameters)
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
		'read': function(id) {
			var deferred = $q.defer();
			$http.jsonrpc(api, 'Contact.read', {token: localStorage.buckbrowserToken, id: id})
			.success(function(data, status, headers, config){
				var errors = ErrorService.handle(data.result);
				if (errors.length>0)
				{
					deferred.reject(errors);
				}
				else
				{
					deferred.resolve(data.result);
				}
			}).error(function(data, status, headers, config){
				deferred.reject({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'});
			});
			return deferred.promise;
		},
		'update': function(contact) {
			var deferred = $q.defer();
			var parameters = contact;
			parameters.token = localStorage.buckbrowserToken;
			$http.jsonrpc(api, 'Contact.update', parameters)
			.success(function(data, status, headers, config){
				var errors = ErrorService.handle(data.result);
				if (errors.length > 0)
				{
					deferred.reject(errors);
				}
				else
				{
					CompanyService.update_contact(this_contact);
					CompanyService.get_all_contacts().then(function(contacts) {	$scope.contacts = contacts;	});
					$scope.thisContact = {};
					$scope.alerts.push({type: 'success', msg: this_contact.company+' updated successfully'});
				}
			}).error(function(data, status, headers, config){
				deferred.reject({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'});
			});
			return deferred.promise;
		},
		'del': function(id) {
			var deferred = $q.defer();
			$http.jsonrpc(api, 'Contact.delete', {token: localStorage.buckbrowserToken, id: id})
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
		}
	}
});