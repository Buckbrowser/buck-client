buckbrowser.controller('ContactsCtrl', function($scope, $rootScope, $http) {
	$scope.contacts = [{company: 'Rien', id: 36}];
	$scope.editClick = false;

	$scope.edit = function(id) {
		$http.jsonrpc(api, 'Contact.read', {token: localStorage.buckbrowserToken, id: id})
		.success(function(data, status, headers, config){
			if (data.result.error)
			{
				console.log(data);
				alert('Error, logged in console');
			}
			else
			{
				$scope.thisContact = data.result.contact;
				$scope.editClick = true;
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};
});