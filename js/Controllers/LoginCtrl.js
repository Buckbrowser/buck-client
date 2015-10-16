buckbrowser.controller('LoginCtrl', function($scope, $rootScope, $http, $modalInstance, $location, ErrorService, UserService) {
	$scope.login = {};
	$scope.invalidLoginCredentials = false;
	$scope.authenticate = function() {
		$http.jsonrpc(api, 'User.authenticate', $scope.login)
		.success(function(data, status, headers, config){
			if (data.result.error)
			{
				if (data.result.error == 36003)
				{
					$scope.invalidLoginCredentials = true;
				}
				else
				{
					console.log(data);
					alert('Error: '+data.result.error);
				}
			}
			else
			{
				localStorage.buckbrowserToken = data.result.token;
				$rootScope.loggedIn = true;
				$modalInstance.close('Logged in');
				$location.path('/account');
			}
		}).error(function(data, status, headers, config){
			alert('Error');
			console.log(data, status, headers, config);
		});
	};
});