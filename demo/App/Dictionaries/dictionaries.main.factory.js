(function () {
    'use strict';

    angular.module('dictionaries.main').factory('$dictionariesFactory', ['$http', 'RoutesService', function ($http, routesService) {

        var getAll = function(instance, type) {
            if (type != null) {
                return $http.get(routesService.create(instance, 'GetAll', { type: type }).url);
            }
            return $http.get(routesService.create(instance, 'GetAll').url);
        };
        
        var getSingle = function (instance, type, id) {
            if (type != null) {
                return $http.get(routesService.create(instance, 'GetSingle', { type: type, id: id }).url);
            }
            return $http.get(routesService.create(instance, 'GetSingle', { id: id }).url);
        };
        
        var remove = function (instance, type, id) {
            if (type != null) {
                return $http.delete(routesService.create(instance, 'Delete', { type: type, id: id }).url);
            }
            return $http.delete(routesService.create(instance, 'Delete', { id: id }).url);
        };
        
        var create = function(instance, type, model) {
            if (type != null) {
                return $http.post(routesService.create(instance, 'Create', { type: type }).url, model);
            }
            return $http.post(routesService.create(instance, 'Create').url, model);
        };

        var update = function(instance, type, model) {
            if (type != null) {
                return $http.put(routesService.create(instance, 'Update', { type: type }).url, model);
            }
            return $http.put(routesService.create(instance, 'Update').url, model);
        };

        var save = function (instance, type, model) {
            if (model.Id) {
                return update(instance, type, model);
            } else {
                return create(instance, type, model);
            }
        };
        
        return {
            getAll: getAll,
            getSingle: getSingle,
            create: create,
            update: update,
            save: save,
            remove: remove
        };
    }]);
})();