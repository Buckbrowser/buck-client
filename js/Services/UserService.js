buckbrowser.service('UserService', function($http, ErrorService, $q) {
	return {
		'multiComp': false,
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
					alert('Error');
					deferred.reject();
				});
			}
			return deferred.promise;
		},
		'update': function(user) {
			this.user = user;
		},
		'getCompanies': function() {
			if (this.companies)
			{
				return this.companies;
			}
			else
			{
				$http.jsonrpc(api, 'User.get_all_companies', {token: localStorage.buckbrowserToken})
				.success(function(data, status, headers, config){
					var errors = ErrorService.handle(data.result);
					if (errors.length > 0)
					{
						console.log(errors);
					}
					else
					{
						this.companies = data.result;
					}
				}).error(function(data, status, headers, config){
					alert('Error');
				});
			}

		}
	}
});