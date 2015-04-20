(function(angular, moment) {
    'use strict';

    var controller = function ($scope, $rootScope, factory, constants, mapper) {
        var self = this;
        this.activityTypes = _.toArray(constants.ACTIVITY_TYPES);

        var setTodayDate = function() {
            if (self.event.IsToday) {
                self.event.Date = moment().format('DD.MM.YYYY');
            }
        };

        this.validateForm = function() {
            var form = self.form,
                event = self.event,
                start = event.StartTime ? parseInt(event.StartTime.substr(0, 2)) : 0,
                end = event.EndTime ? parseInt(event.EndTime.substr(0, 2)) : 0;
            form.$valid = true;
            form.invalidDates = false;
;           if (!event.StartTime && event.EndTime) {
                form.StartTime.$setValidity('', false);
                form.invalidDates = true;
            }
            if (!event.EndTime && event.StartTime) {
                form.EndTime.$setValidity('', false);
                form.invalidDates = true;
            }
            if (start > end && event.EndTime) {
                form.StartTime.$setValidity('', false);
                form.invalidDates = true;
            }
            return form.$valid;
        };
        
        this.clear = function () {
            self.event = {
                IsToday: true,
            };
            setTodayDate();
        };
        this.clear();

        this.save = function () {
            if (!self.validateForm()) {
                return false;
            }
            var activity = mapper.toActivity(self.event);
            var promise = factory.saveEvent(activity);
            promise.then(function() {
                self.clear();
                setTodayDate();
            }, function() {
                alert('Произошла ошибка во время сохранения события');
            });
        };

        $scope.$watch(function() {
            return self.event.IsToday;
        }, setTodayDate);

        $rootScope.$on('calendar:event:selected', function (e, calendarEvent) {
            self.event = mapper.fromCalendarEvent(calendarEvent);
            setTodayDate();
        });
    };

    controller.$inject = ['$scope', '$rootScope', 'reception.event-editor.factory', 'constants', 'reception.event-editor.mapper'];

    angular.module('reception.event-editor').controller('reception.event-editor.controller', controller);
})(angular, moment);