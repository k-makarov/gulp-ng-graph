(function (angular, moment) {
    'use strict';

    moment.locale('ru');

    var dayController = function ($scope) {

        var getDayDescription = function (momentObj) {
            if (!moment.isMoment(momentObj)) {
                throw new Error('momentObj must be a moment');
            }
            return {
                dayOfWeek: momentObj.format('dddd'),
                month: momentObj.format('MMMM'),
                day: momentObj.format('D'),
                dayMonth: momentObj.format('D MMMM'),
                isToday: momentObj.isSame(new Date(), 'day'),
                start: momentObj.startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                end: momentObj.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                moment: momentObj,
            };
        };
        
        var initialize = function () {
            $scope.controller.events = [];
            $scope.controller.currentDay = getDayDescription(moment());
            $scope.controller.getEvents();
        };

        initialize();

        this.isEventVisible = function (event) {
            if (!event) {
                return false;
            }
            var isVisible = ($scope.controller.isCompletedShowed && event.IsCompleted)
                || ($scope.controller.isEmptyShowed && event.isEmpty)
                || (!event.IsCompleted && !event.isEmpty);
            return isVisible;
        };

        this.eventsSort = function (event) {
            var sort = 0;
            if (!event.WithoutTime) {
                sort = parseInt(event.StartTimeLocalHour) + 1;
            }
            return sort;
        };

        $scope.$on('day:next', function() {
            $scope.controller.currentDay = getDayDescription($scope.controller.currentDay.moment.add(1, 'days'));
            $scope.controller.getEvents();
        });
        
        $scope.$on('day:previous', function () {
            $scope.controller.currentDay = getDayDescription($scope.controller.currentDay.moment.subtract(1, 'days'));
            $scope.controller.getEvents();
        });

    };

    dayController.$inject = ['$scope'];

    angular.module('reception.calendar').controller('reception.calendar.day-controller', dayController);
    
})(angular, moment);