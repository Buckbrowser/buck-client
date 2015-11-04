buckbrowser.service('UserService', function($http, ErrorService, $q) {
	return {
		'get': function() {
			var deferred = $q.defer();
			if (this.user)
			{
				deferred.resolve(this.user);
			}
			else
			{
				$http.jsonrpc(api, 'User.read', {token: localStorage.buckbrowserToken})
				.success(function(data, status, headers, config){
					var errors = ErrorService.handle(data.result);
					if (errors.length > 0)
					{
						console.log(errors);
						deferred.reject();
					}
					else
					{
						this.user = data.result;
						deferred.resolve(this.user);
					}
				}).error(function(data, status, headers, config){
					deferred.reject({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'});
				});
			}
			return deferred.promise;
		},
		'update': function(user) {
			this.user = user;
		},
		'getCompanies': function() {
			var deferred = $q.defer();
			if (this.companies)
			{
				deferred.resolve(this.companies);
			}
			else
			{
				$http.jsonrpc(api, 'User.get_all_companies', {token: localStorage.buckbrowserToken})
				.success(function(data, status, headers, config){
					var errors = ErrorService.handle(data.result);
					if (errors.length > 0)
					{
						console.log(errors);
						deferred.reject();
					}
					else
					{
						this.companies = data.result;
						deferred.resolve(this.companies);
					}
				}).error(function(data, status, headers, config){
					deferred.reject({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'});
				});
			}
		}
	}
});