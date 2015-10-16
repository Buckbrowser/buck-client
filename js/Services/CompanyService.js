buckbrowser.service('CompanyService', function($http, $q, ErrorService) {
	return {
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
					if (errors.length>0)
					{
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
		}
	}
});