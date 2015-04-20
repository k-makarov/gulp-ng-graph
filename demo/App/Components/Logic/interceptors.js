(function () {
    'use strict';

    angular.module('interceptors', ['routes'])
		.factory('interceptors', ['$q', '$window', 'RoutesService', function ($q, $window, routesService) {
		    return {
		        'responseError': function (response) {
		            if (response.status === 401) {
		                $window.location.href = routesService.createMvc('Account', 'Login').url;
		                return $q.reject(response);
		            }
		            return $q.reject(response);
		        }
		    };
		}]);
})();