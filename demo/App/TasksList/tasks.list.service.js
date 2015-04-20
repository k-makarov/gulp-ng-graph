(function (location) {
    angular.module('tasks.list')
        .service('TasksService', ['$http', 'RoutesService', function ($http, routesService) {

            var controller = 'Task';

            this.getTasks = function (filter, from, to, column, order) {
                filter.RowsFrom = from;
                filter.RowsTo = to;
                filter.OrderBy = column;
                filter.OrderDirection = order;
                return $http.get(routesService.create(controller, 'GetAll').url, { params: filter });
            };

            this.getSingleTask = function (id) {
                return $http.get(routesService.create(controller, 'GetSingle', { id: id }).url);
            };

            this.export = function (filter, column, order) {
                location.href = routesService.create(controller, 'Export').url + '?' + $.param(filter);
            };
        }]);
})(window.location);