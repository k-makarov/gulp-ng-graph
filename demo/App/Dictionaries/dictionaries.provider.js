//предоставляет модели справочников в комбобоксы и тп
(function () {
    'use strict';

    angular.module('dictionaries.provider', ['routes', 'interceptors'])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('interceptors');
        }]);

    angular.module('dictionaries.provider').factory('dictionaries.factory', ['$http', 'RoutesService', function ($http, routesService) {
        var get = function (instance, arg) {
            var controller = 'Dictionaries';
            var action = 'Get' + instance;
            var instanceUrl = routesService.create(controller, action, arg).url;
            return $http.get(instanceUrl);
        };

        return {
            get: get,
        };
    }]);
})();