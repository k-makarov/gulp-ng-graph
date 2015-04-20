(function () {
    'use strict';

    angular.module('admin', ['ngRoute', 'routes', 'interceptors', 'ngDialog'])
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            $httpProvider.interceptors.push('interceptors');

            $routeProvider
                    .when('/', {
                        templateUrl: GlobalContext.getTemplateUrl('Admin/Templates/admin.html'),
                        controller: 'adminController',
                    });
        }
        ]);
})();