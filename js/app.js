var buckbrowser = angular.module('main', ['ui.bootstrap', 'ngRoute', 'angular-json-rpc', 'validation.match']);

//var api = 'http://buckbrowser/server/buckbrowser.php'; // Rien home
//var api = 'http://buckbrowser.local/buckbrowser.php'; // Wybren virtual host
var api = 'http://buckserver.langstra.nl/buckbrowser.php'; // Wybren RasPi2
//var api = 'http://5.61.248.107/~buck/server/buckbrowser.php'; // Hosting Rien

buckbrowser.config(function($routeProvider) {
	// Routing
	$routeProvider

	// Functionality pages
	.when('/home', {
		templateUrl: 'templates/home.html',
		controller: 'HomeCtrl',
		identifier: 'home'
	})

	.when('/account', {
		templateUrl: 'templates/account.html',
		controller: 'AccountCtrl',
		identifier: 'account',
		access: {
			requiresLogin: true
		}
	})

	.when('/company', {
		templateUrl: 'templates/company.html',
		controller: 'CompanyCtrl',
		identifier: 'company',
		access: {
			requiresLogin: true,
			requiresCompany: true
		}
	})

	.when('/contacts', {
		templateUrl: 'templates/contacts.html',
		controller: 'ContactsCtrl',
		identifier: 'contacts',
		access: {
			requiresLogin: true
		}
	})

	// Static pages
	.when('/contact', {
		templateUrl: 'templates/contact.html',
		controller: 'ContactCtrl',
		identifier: 'contact'
	})

	.otherwise({
		redirectTo: '/home'
	});
});

buckbrowser.run(function($rootScope, $http, $location) {
	if (localStorage.buckbrowserToken)
	{
		$rootScope.loggedIn = true;
	}
	else
	{
		$rootScope.loggedIn = false;
	}

	$rootScope.$on("$routeChangeStart", function(event, next) {
		if (next.access !== undefined)
		{
			if (next.access.requiresLogin && !$rootScope.loggedIn)
			{
				$location.path("/home");
			}
		}
	});
});

// Improve email validation
buckbrowser.directive('overwriteEmail', function() {
  var EMAIL_REGEXP = /^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/i;


  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
});buckbrowser.controller('AccountCtrl', function($scope, $http, ErrorService, UserService, CountryService, CompanyService) {
	$scope.alerts = [];

	$scope.user = {};
	$scope.userUpdate = {};
	UserService.get().then(function(user) {
		$scope.user = user;
		$scope.userUpdate = angular.copy(user);
	});
	$scope.countries = {};
	CountryService.get_all().then(function(countries) {
		$scope.countries=countries;
	});

	$scope.companies = [];
	$http.jsonrpc(api, 'User.get_all_companies', {token: localStorage.buckbrowserToken})
	.success(function(data, status, headers, config){
		var errors = ErrorService.handle(data.result);
		if (errors.length > 0)
		{
			$scope.alerts = errors;
		}
		else
		{
			console.log(data.result);
			for (var comp in data.result)
			{
				$scope.companies.push(data.result[comp]);
			}
			console.log($scope.companies);
		}
	}).error(function(data, status, headers, config){
		alert('Error');
	});

	$scope.updateInfo = function() {
		var parameters = angular.copy($scope.userUpdate);
		parameters.token = localStorage.buckbrowserToken;
		$http.jsonrpc(api, 'User.update', parameters)
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				$scope.user = angular.copy($scope.userUpdate);
				UserService.update($scope.user);
				$scope.alerts.push({type: 'success', msg: 'Info updated succesfully'});
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.switchToCompany = function(company_id) {
		$http.jsonrpc(api, 'User.switch_company', {token: localStorage.buckbrowserToken, company_id: company_id})
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				localStorage.buckbrowserToken = data.result.token;
				CompanyService.update();
				$scope.alerts.push({type: 'success', msg: 'Logged in to other company'});
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.delete = function() {
		$http.jsonrpc(api, 'User.delete', {token: localStorage.buckbrowserToken})
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				$scope.alerts.push = {type: 'success', msg: 'You will recieve an email about deleting your account shortly.'};
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
});buckbrowser.controller('CompanyCtrl', function($scope, $http, CompanyService, CountryService, ErrorService) {
	$scope.alerts = [];

	$scope.company = {};
	CompanyService.get().then(function(company) {
		$scope.company = company;
		$scope.companyUpdate = angular.copy($scope.company);
		if (company.id_country != null)
		{
			CountryService.get(company.id_country).then(function(country) { $scope.company.country = country; });
		}
	});
	$scope.countries = {};
	CountryService.get_all().then(function(countries) {
		$scope.countries=countries;
	});

	$scope.updateInfo = function() {
		var parameters = angular.copy($scope.companyUpdate);
		parameters.token = localStorage.buckbrowserToken;
		$http.jsonrpc(api, 'Company.update', parameters)
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length > 0)
			{
				$scope.alerts = errors;
			}
			else
			{
				$scope.company = angular.copy($scope.companyUpdate);
				CompanyService.update($scope.company);
				CountryService.get($scope.companyUpdate.id_country).then(function(country) { $scope.company.country = country; });
				$scope.alerts.push({type: 'success', msg: 'Info updated succesfully'});
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
});buckbrowser.controller('ContactCtrl', function($scope) {});buckbrowser.controller('ContactsCtrl', function($scope, $rootScope, $http) {
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
});buckbrowser.controller('HomeCtrl', function($scope) {});buckbrowser.controller('LoginCtrl', function($scope, $rootScope, $http, $modalInstance, $location, ErrorService, UserService) {
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
});buckbrowser.controller('NavbarCtrl', function($scope, $rootScope, $modal, $route, $window) {
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
});buckbrowser.controller('RegisterCtrl', function($scope, $rootScope, $http, $location, $modal, $modalInstance, ErrorService, UserService, CountryService) {
	$scope.user = {};

	$scope.register = true;
	$scope.newCompany = false;
	$scope.success = false;

	$scope.countries = {};
	CountryService.get_all().then(function(countries) { $scope.countries=countries; });

	$scope.registerUser = function() {
		$http.jsonrpc(api, 'User.create', $scope.user)
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			if (errors.length>0)
			{
				$scope.alerts = errors;
			}
			else
			{
				localStorage.buckbrowserToken = data.result.token;
				$rootScope.loggedIn = true;
				$scope.register = false;
				$scope.newCompany = true;
			}
		}).error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.company = {};
	$scope.registerCompany = function() {
		var parameters = angular.copy($scope.company);
		parameters.token = localStorage.buckbrowserToken;
		$http.jsonrpc(api, 'Company.create', parameters)
		.success(function(data, status, headers, config){
			var errors = ErrorService.handle(data.result);
			console.log(errors);
			if (errors.length>0)
			{
				$scope.alerts = errors;
			}
			else
			{
				// something with company service
				//$rootScope.company = $scope.company;
				//$rootScope.company.id = data.result.id;
				$scope.newCompany = false;
				$scope.success = true;
			}
		})
		.error(function(data, status, headers, config){
			alert('Error');
		});
	};

	$scope.completeRegistration = function() {
		$modalInstance.close('Registration complete');
		$location.path('/account');
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
});buckbrowser.service('CompanyService', function($http, $q, ErrorService) {
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
});buckbrowser.service('CountryService', function($http, $q, ErrorService) {
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
				alert('Error');
				deferred.reject();
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
					alert('Error');
					deferred.reject();
				});
			}
			return deferred.promise;
		}
	}
});buckbrowser.service('ErrorService', function() {
	return {
		'handle': function(result) {
			var errors = [];
			if (result.error)
			{
				switch(result.error) {
					case 35964:
						errors.push({type: 'warning', msg: 'Method invocation faulted'});
						break;
					case 36000:
						errors.push({type: 'warning', msg: 'You are not logged in'});
						break;
					case 36001:
						errors.push({type: 'warning', msg: 'You do not have the needed permissions'});
						break;
					case 36002:
						errors.push({type: 'warning', msg: 'Something unexplainable went wrong'});
						break;
					case 36003:
						errors.push({type: 'warning', msg: 'Wrong login credentials'});
						break;
					case 36004:
						errors.push({type: 'warning', msg: 'Identifier unknown'});
						break;
					case 36005:
						errors.push({type: 'warning', msg: 'Wrong parameters'});
						break;
					default:
						errors.push({type: 'warning', msg: 'Something unexplainable went wrong: '+result.error});
						break;
				}
			}
			if (result.create_error) {
				if (result.create_error.already_exists)
				{
					var exists = result.create_error.already_exists;
					var msg = "";
					for(i=0;i<exists.length;i++)
					{
						msg += exists[i]+", ";
					}
					errors.push({type: 'warning', msg: 'The following fields already exist and have to be unique: '+msg.substr(0,msg.length-2)});
				}
				if (result.create_error.empty_fields)
				{
					var empty = result.create_error.empty_fields;
					var msg = "";
					for(i=0;i<empty.length;i++)
					{
						msg += empty[i]+", ";
					}
					errors.push({type: 'warning', msg: 'The following fields are required: '+msg.substr(0,msg.length-1)});
				}
				if (result.create_error.incorrect_fields)
				{
					var incorrect = result.create_error.incorrect_fields;
					var msg = "";
					for(i=0;i<incorrect.length;i++)
					{
						msg += incorrect[i]+", ";
					}
					errors.push({type: 'warning', msg: 'The following fields are incorrect: '+msg.substr(0,msg.length-1)});
				}
			}
			if (result.update_error) {
				var incorrect = result.update_error.incorrect_fields;
				var msg = "";
				for(i=0;i<incorrect.length;i++)
				{
					msg += incorrect[i]+", ";
				}
				errors.push({type: 'warning', msg: 'The following fields are incorrect: '+msg.substr(0,msg.length-1)});
			}
			return errors;
		}
	}
});buckbrowser.service('UserService', function($http, ErrorService, $q) {
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
});buckbrowser.filter('nullDisplay', function() {
	return function(input) {
		if (input == null || input == "")
		{
			return "None";
		}
		else
		{
			return input;
		}
	};
});