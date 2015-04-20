(function($) {
    angular.module('reception.info').factory('reception.info.factory', ['$http', 'RoutesService', function($http, routesService) {

        var getAll = function(kind) {
            return $http.get(routesService.create('Reception', 'GetAll', { kind: kind }).url);
        };

        var create = function(title, kind) {
            return $http.post(routesService.create('Reception', 'Create').url, { Title: title, Kind: kind });
        };

        var remove = function(id, kind) {
            return $http.post(routesService.create('Reception', 'Delete').url, { Id: id, Kind: kind });
        };

        var update = function(id, kind, title) {
            return $http.post(routesService.create('Reception', 'Update').url, { Id: id, Kind: kind, Title: title });
        };

        var print = function(model) {
            return routesService.create('Reception', 'Print').url + '/?' + $.param(model);
        };

        return {
            getAll: getAll,
            create: create,
            remove: remove,
            update: update,
            print: print,
        };
    }]);
})(jQuery);