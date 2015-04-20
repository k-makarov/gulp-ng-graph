(function () {
    'use strict';

    angular.module('tasks.calendar')
        .service('TasksCalendarService', ['$http', 'RoutesService', function ($http, routesService) {

            this.get = function (year, month) {
                var url = routesService.create(
                    'Task',
                    'GetTasksAmountForCalendar',
                    { year: year, month: month + 1 }).url;
                return $http.get(url);
            };
        }]);
})();