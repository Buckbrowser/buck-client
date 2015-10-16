buckbrowser.controller('NavbarCtrl', function($scope, $rootScope, $modal, $route, $window) {
	$scope.$route = $route;
	$scope.isCollapsed = true;

	$scope.openLogin = function(){
		var modalInstance = $modal.open({
			templateUrl: 'templates/loginform.html',
			controller: 'LoginCtrl',
			size: 'lg',
			backdrop: true
		});
	};

	$scope.openRegister = function(){
		var modalInstance = $modal.open({
			templateUrl: 'templates/registerform.html',
			controller: 'RegisterCtrl',
			size: 'lg',
			backdrop: true
		});
	};

	$scope.logout = function(){
		localStorage.clear();
		$rootScope.loggedIn = false;
		$window.location.href = "/";
	};
});