(function (location) {
    'use strict';

    angular.module('tasks.calendar', ['routes'])
        .controller('tasksCalendarController', ['$scope', 'constants', 'RoutesService', 'TasksCalendarService',
            function ($scope, constants, routesService, tasksCalendarService) {

                var getCalendarDays = function (currentYear, currentMonth, daysData) {
                    var FIRST_WEEKDAY = 1;
                    var todayMoment = moment().startOf('day');
                    var calendarDays = [[]];
                    var startOfMonth = moment([currentYear, currentMonth]);
                    var calendarDayMoment = moment(startOfMonth);
                    var limit = 7;
                    while (calendarDayMoment.day() != FIRST_WEEKDAY && limit > 0) {
                        calendarDayMoment.subtract(1, 'days');
                        limit--;
                    }
                    while (calendarDayMoment.month() == currentMonth
                        || calendarDayMoment.isBefore(startOfMonth)
                        || calendarDayMoment.day() != FIRST_WEEKDAY) {
                        var calendarMonth = calendarDayMoment.month()
                        var isMonthBefore = calendarMonth < currentMonth;
                        var isMonthAfter = calendarMonth > currentMonth;
                        var data = _.find(daysData, function (item, index) {
                            return calendarDayMoment.isSame(index);
                        });
                        calendarDays[calendarDays.length - 1].push({
                            date: moment(calendarDayMoment),
                            day: calendarDayMoment.date(),
                            isToday: calendarDayMoment.isSame(todayMoment),
                            isBeforeToday: calendarDayMoment.isBefore(todayMoment),
                            isAfterToday: calendarDayMoment.isAfter(todayMoment),
                            isOtherMonth: isMonthBefore || isMonthAfter,
                            data: data
                        });
                        calendarDayMoment.add(1, 'days');
                        if (calendarDayMoment.day() == FIRST_WEEKDAY) {
                            calendarDays.push([]);
                        }
                    }
                    return calendarDays;
                }

                var refreshCalendar = function () {
                    var currentYear = $scope.currentYear;
                    var currentMonth = $scope.currentMonth;
                    tasksCalendarService.get(currentYear, currentMonth).success(function (result) {
                        var daysData = {};
                        angular.forEach(result, function (item) {
                            daysData[item.Deadline] = item;
                        });
                        $scope.calendarDays = getCalendarDays(currentYear, currentMonth, daysData);
                    });
                }

                $scope.getCurrentMonthName = function () {
                    var monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
                    return monthNames[$scope.currentMonth];
                };

                var MIN_MONTH = 0;
                var MAX_MONTH = 11;

                $scope.previous = function () {
                    if (--$scope.currentMonth < MIN_MONTH) {
                        $scope.currentMonth = MAX_MONTH;
                        $scope.currentYear--;
                    }
                    refreshCalendar();
                }

                $scope.next = function () {
                    if (++$scope.currentMonth > MAX_MONTH) {
                        $scope.currentMonth = MIN_MONTH;
                        $scope.currentYear++;
                    }
                    refreshCalendar();
                }

                $scope.getDayClass = function (day) {
                    var result = [];
                    if (day) {
                        if (day.isToday) {
                            result.push('today');
                        } else if (day.isBeforeToday) {
                            result.push('before-today');
                        } else if (day.isAfterToday) {
                            result.push('after-today');
                        }
                        if (day.isOtherMonth) {
                            result.push('other-month');
                        }
                        if (day.data && day.data.TasksCount > 0) {
                            result.push('active');
                        }
                    }
                    return result;
                };

                $scope.onDayClick = function (calendarDay) {
                    if (calendarDay.data && calendarDay.data.TasksCount > 0) {
                        var formattedDate = calendarDay.date.format('DD.MM.YYYY');
                        var statusIds = [
                            constants.TASK_STATUSES.InProcess.Code,
                            constants.TASK_STATUSES.Failed.Code,
                            constants.TASK_STATUSES.Hot.Code
                        ];
                        if ($scope.params && $scope.params.throwEventOnClick) {
                            var filter = {
                                DeadlineFrom: formattedDate,
                                DeadlineTo: formattedDate,
                                StatusIds: statusIds
                            };
                            $scope.$root.$broadcast('tasksFilter.setCalendarFilter', filter);
                        } else {
                            var url = routesService.createMvc('Task', 'Index').url;
                            var params = '?deadlineFrom={0}&deadlineTo={1}&statusIds={2}'
                                .replace('{0}', formattedDate)
                                .replace('{1}', formattedDate)
                                .replace('{2}', statusIds.join());
                            url += params;
                            location.href = url;
                        }
                    }
                };

                var todayMoment = moment();
                $scope.currentYear = todayMoment.year();
                $scope.currentMonth = todayMoment.month();

                refreshCalendar();
            }])
        .directive('tasksCalendar', function () {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    params: '='
                },
                controller: 'tasksCalendarController',
                templateUrl: GlobalContext.getTemplateUrl('TasksCalendar/Templates/tasks-calendar.html')
            };
        });
})(window.location);