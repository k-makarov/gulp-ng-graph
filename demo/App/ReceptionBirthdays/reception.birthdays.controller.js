(function (context) {
    'use strict';

    var controller = function ($scope, factory) {
        factory.getAll().then(function(response) {
            $scope.birthdays = response.data || response.data.Birthdays;
        });
    };

    controller.$inject = ['$scope', 'reception.birthdays.factory'];

    angular.module('reception.birthdays')
        .controller('receptionBirthdaysController', controller);

})(GlobalContext);