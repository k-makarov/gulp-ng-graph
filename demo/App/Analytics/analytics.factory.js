(function () {
    'use strict';

    angular.module('analytics').factory('analyticsFactory', ['$http', 'RoutesService', function ($http, routesService) {
        function getTasksCountByStatus() {
            return $http.get(routesService.create('Analytics', 'GetTasksCountByStatus').url);
        };

        function getTasksCountByStatusAndResponsible(showAll) {
            return $http.get(routesService.create('Analytics', 'GetTasksCountByStatusAndResponsible', { showAll: showAll }).url);
        };

        return {
            getTasksCountByStatus: getTasksCountByStatus,
            getTasksCountByStatusAndResponsible: getTasksCountByStatusAndResponsible,
        };
    }]);
})();