(function () {
    'use strict';

    angular.module('dictionaries.main').controller('dictionaries.main.controller', ['$scope', function ($scope) {
        $scope.$on('$routeChangeStart', function () {
            $scope.loading = true;
        });
        $scope.$on('$routeChangeSuccess', function () {
            $scope.loading = false;
        });
    }]);
})();
