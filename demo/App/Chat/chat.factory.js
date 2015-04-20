(function() {
    angular.module('chat').factory('chat.factory', ['$http', 'RoutesService', function ($http, routesService) {
        
        var getAll = function() {
            return $http.get(routesService.create('Chat', 'GetAll').url);
        };
        
        var get = function(page) {
            return $http.get(routesService.create('Chat', 'GetMessages', { page: page }).url);
        };
        
        var send = function(message) {
            return $http.post(routesService.create('Chat', 'SendMessage').url, { Text: message });
        };

        var remove = function(ids) {
            return $http.post(routesService.create('Chat', 'DeleteMessages').url, ids);
        };
        
        return {
            getAll: getAll,
            get: get,
            send: send,
            remove: remove,
        };
    }]);
})()