buckbrowser.service('CountryService', function($http, $q, ErrorService) {
	return {
		'get': function(id) {
			var deferred = $q.defer();
			$http.jsonrpc(api, 'Country.read', {id: id})
			.success(function(data, status, headers, config){
				var errors = ErrorService.handle(data.result);
				if (errors.length > 0)
				{
					console.log(errors);
					deferred.reject();
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
		'get_all': function() {
			var deferred = $q.defer();
			if (this.countries)
			{
				deferred.resolve(this.countries);
			}
			else
			{
				$http.jsonrpc(api, 'Country.get_all', [])
				.success(function(data, status, headers, config){
					var errors = ErrorService.handle(data.result);
					if (errors.length > 0)
					{
						console.log(errors);
						deferred.reject();
					}
					else
					{
						this.countries = [];
						for (var country in data.result)
						{
							this.countries.push(data.result[country]);
						}
						deferred.resolve(this.countries);
					}
				}).error(function(data, status, headers, config){
					deferred.reject({type: 'warning', msg: 'It appears you have no internet connection or our servers are offline.'});
				});
			}
			return deferred.promise;
		}
	}
});