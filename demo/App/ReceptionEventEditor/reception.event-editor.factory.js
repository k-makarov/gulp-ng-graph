(function(angular) {
    'use strict';

    var factory = function ($http, routesService) {

        var getEvent = function(id) {
            return $http.get(routesService.create('Activity', 'Get', { id: id }).url);
        };
        
        var deleteEvent = function (id) {
            return $http.post(routesService.create('Activity', 'Delete').url, { Id: id });
        };

        var updateEvent = function (event) {
            return $http.post(routesService.create('Activity', 'Update').url, event);
        };

        var createEvent = function(event) {
            return $http.post(routesService.create('Activity', 'Create').url, event);
        };

        var saveEvent = function (event) {
            return event && event.Id ? updateEvent(event) : createEvent(event);
        };
        
        return {
            getEvent: getEvent,
            deleteEvent: deleteEvent,
            updateEvent: updateEvent,
            createEvent: createEvent,
            saveEvent: saveEvent,
        };
    };

    factory.$inject = ['$http', 'RoutesService'];

    angular.module('reception.event-editor').factory('reception.event-editor.factory', factory);

})(angular);