(function () {
    'use strict';

    angular.module('analytics', ['ngRoute', 'routes', 'highcharts-ng', 'interceptors'])
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            $httpProvider.interceptors.push('interceptors');

            $routeProvider
                    .when('/', {
                        templateUrl: GlobalContext.getTemplateUrl('Analytics/Templates/analytics.html'),
                        controller: 'analyticsController',
                        controllerAs: 'analytics'
                    });
        }]);
})();