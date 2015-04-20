(function () {
    'use strict';

    angular.module('admin').factory('adminFactory', ['$http', 'RoutesService', function ($http, routesService) {
        function getAllUsers() {
            return $http.get(routesService.create('Admin', 'GetAllUsers').url);
        };

        function registerUser(user) {
            return $http.post(routesService.create('Admin', 'Register').url, user);
        };

        function editUser(user) {
            return $http.put(routesService.create('Admin', 'Edit').url, user);
        };

        function deleteUser(login) {
            return $http.delete(routesService.create('Admin', 'Delete').url, { params: { login: login } });
        };

        function getAllRoles() {
            return $http.get(routesService.create('Admin', 'GetAllRoles').url);
        };

        return {
            getAllUsers: getAllUsers,
            registerUser: registerUser,
            editUser: editUser,
            deleteUser: deleteUser,
            getAllRoles: getAllRoles,
        };
    }]);
})();