(function(angular, moment) {
    'use strict';

    moment.locale('ru', {
        months: [
            "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля",
            "Августа", "Сентября", "Октября", "Ноября", "Декабря"
        ]
    });

    var controller = function($scope, $rootScope, factory, constants, eventProcessor) {

        this.modes = {
            'Day': 0,
            'Week': 1,
        };

        this.activityTypes = constants.ACTIVITY_TYPES;

        this.currentMode = this.modes.Day;

        this.constructFilter = function(filter) {
            return {
                pageSize: filter.pageSize || 100,
                from: filter.from || moment().startOf('day').format(),
                to: filter.to || moment().endOf('day').format(),
                importantOnly: filter.importantOnly || false,
                isIncludeNullType: true,
            };
        };

        this.getEvents = function(withoutLoading) {
            this.loading = !withoutLoading;
            var filter = {};
            if (this.currentMode === this.modes.Day) {
                filter = this.constructFilter({
                    from: this.currentDay.start,
                    to: this.currentDay.end,
                });
            } else {
                filter = this.constructFilter({
                    from: this.currentWeek.start,
                    to: this.currentWeek.end,
                });
            }
            var promise = factory.getEvents(filter);
            promise.then(function (response) {
                $scope.$broadcast('qtip:destroy');
                var oldEvents = withoutLoading ? this.events : null;
                this.events = eventProcessor.processEvents(response.data, this.activityTypes, this.currentMode, this.modes, this.currentWeek, oldEvents);
                this.loading = false;
            }.bind(this));
        };

        this.onPreviousClick = function() {
            if (this.currentMode === this.modes.Day) {
                $scope.$broadcast('day:previous');
            } else {
                $scope.$broadcast('week:previous');
            }
        };

        this.onNextClick = function() {
            if (this.currentMode === this.modes.Day) {
                $scope.$broadcast('day:next');
            } else {
                $scope.$broadcast('week:next');
            }
        };

        this.deleteEvent = function(event) {
            if (confirm('Вы действительно хотите отменить мероприятие?')) {
                factory.deleteEvent(event.Id);
            }
        };

        this.changeIsCompleted = function(event) {
            if (!event) {
                return;
            }
            event.IsCompleted = !event.IsCompleted;
            factory.updateEvent(event);
            $scope.$broadcast('qtip:hide');
        };

        this.getEventTypeColor = function(event) {
            if (!event) {
                return '';
            }
            var type = this.activityTypes[event.ActivityType];
            return type ? type.Color : '';
        };

        this.selectEvent = function (event) {
            $rootScope.$broadcast('calendar:event:selected', event);
        };
        

        $scope.$watch(function() {
            return this.currentMode;
        }.bind(this), function() {
            $scope.$broadcast('qtip:destroy');
        });

        //код появился из-за чудесных qtip, которые странно перерисовываются
        $scope.$watch(function () {
            return this.isCompletedShowed;
        }.bind(this), function (value) {
            if (value) {
                this.getEvents(true);
            }
        }.bind(this));

        $rootScope.$on('reception-calendar:get:current', function () {
            var current = this.currentMode === this.modes.Day ? this.currentDay : this.currentWeek;
            $rootScope.$broadcast('reception-calendar:current', current);
        }.bind(this));
        
        $(window).on('receptionCalendarChanged', function() {
            this.getEvents(true);
        }.bind(this));
    };

    controller.$inject = ['$scope', '$rootScope', 'reception.calendar.factory', 'constants', 'reception.calendar.event-processor'];

    angular.module('reception.calendar').controller('reception.calendar.controller', controller);
})(angular, moment);
