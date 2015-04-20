(function () {
    'use strict';

    angular.module('task.card').factory('task.card.factory', ['$http', 'RoutesService', function ($http, routesService) {

        var get = function (id) {
            return $http.get(routesService.create('Task', 'GetSingle', { id: id }).url);
        };

        var save = function (task) {
            return task.Id ? $http.put(routesService.create('Task', 'Update').url, task) : $http.post(routesService.create('Task', 'Create').url, task);
        };

        var setDeleted = function (id, deleted) {
            return $http.post(routesService.create('Task', 'SetDeleted', { id: id }).url, deleted);
        };

        return {
            get: get,
            save: save,
            setDeleted: setDeleted
        };
    }]);

})();
