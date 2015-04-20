(function (angular, moment) {
    'use strict';

    moment.locale('ru');

    var weekController = function ($scope) {

        var getWeekDescription = function (momentObj) {
            if (!moment.isMoment(momentObj)) {
                throw new Error('momentObj must be a moment');
            }
            return {
                endMonth: momentObj.endOf('isoweek').format('MMMM'),
                startMonth: momentObj.startOf('isoweek').format('MMMM'),
                startDay: momentObj.startOf('isoweek').format('D'),
                endDay: momentObj.endOf('isoweek').format('D'),
                start: momentObj.startOf('isoweek').format('YYYY-MM-DDTHH:mm:ss'),
                end: momentObj.endOf('isoweek').format('YYYY-MM-DDTHH:mm:ss'),
                moment: momentObj,
            };
        };
        
        var initialize = function () {
            $scope.controller.events = [];
            $scope.controller.currentWeek = getWeekDescription(moment());
            $scope.controller.getEvents();
        };

        initialize();
        
        $scope.$on('week:next', function () {
            $scope.controller.currentWeek = getWeekDescription($scope.controller.currentWeek.moment.add(1, 'weeks'));
            $scope.controller.getEvents();
        });

        $scope.$on('week:previous', function () {
            $scope.controller.currentWeek = getWeekDescription($scope.controller.currentWeek.moment.subtract(1, 'weeks'));
            $scope.controller.getEvents();
        });
    };

    weekController.$inject = ['$scope'];

    angular.module('reception.calendar').controller('reception.calendar.week-controller', weekController);

})(angular, moment);