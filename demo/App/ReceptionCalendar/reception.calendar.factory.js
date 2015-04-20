(function() {
    'use strict';

    var factory = function ($http, routesService) {
        
        var getEvents = function(filter) {
            return $http.get(routesService.create('Activity', 'GetAll').url, { params: filter });
        };

        var deleteEvent = function(id) {
            return $http.post(routesService.create('Activity', 'Delete').url, { Id: id });
        };

        var updateEvent = function(event) {
            return $http.post(routesService.create('Activity', 'Update').url, event);
        };
        
        return {
            getEvents: getEvents,
            deleteEvent: deleteEvent,
            updateEvent: updateEvent,
        };
    };
    
    factory.$inject = ['$http', 'RoutesService'];

    angular.module('reception.calendar').factory('reception.calendar.factory', factory);
})();