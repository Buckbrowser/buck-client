var buckbrowser = angular.module('main', ['ui.bootstrap', 'ngRoute', 'angular-json-rpc', 'validation.match', 'mm.iban']);

//var api = 'http://buckbrowser/server/buckbrowser.php'; // Rien home
//var api = 'http://buckbrowser.local/buckbrowser.php'; // Wybren virtual host
var api = 'http://buckserver.langstra.nl/buckbrowser.php'; // Wybren RasPi2

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
			requiresLogin: true,
			requiresCompany: true
		}
	})

	.when('/delete_company/:verification_code', {
		templateUrl: 'templates/delete_company.html',
		controller: 'DeleteCompanyCtrl',
		identifier: 'delete_company',
		access: {
			requiresLogin: true,
			requiresCompany: true
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

buckbrowser.run(function($rootScope, $http, $location, CompanyService) {
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
			if (next.access.requiresCompany)
			{
				CompanyService.get().then(function() {
				},function() {
					$location.path("/home");
				});
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
});