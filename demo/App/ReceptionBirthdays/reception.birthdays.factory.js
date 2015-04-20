(function () {
    angular.module('reception.birthdays').factory('reception.birthdays.factory', ['$http', 'RoutesService', function ($http, routesService) {

        var getAll = function (kind) {
            return $http.get(routesService.create('Participants', 'GetBirthdays').url);
        };

        return {
            getAll: getAll
        };
    }]);
})()