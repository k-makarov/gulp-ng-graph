$(function ($) {
    'use strict';
    angular.module('calls.list')
        .controller('callsActionPanelController', [
            '$scope', '$rootScope', function ($scope, $rootScope) {
                $scope.filters = [{ title: 'День', type: 'day' }, { title: 'Неделя', type: 'week' }, { title: 'Месяц', type: 'month' }];
                $scope.onFilterChange = function (filter, $event) {
                    var range = $($event.target).hasClass('selected') // ng-click срабатывает раньше чем делегированное событие (см. link)
                        ? {}
                        : createFilterDateRange(filter.type);
                    $rootScope.$broadcast('callsActionPanel:filter', range);
                };

                function createFilterDateRange(filterType) {
                    switch (filterType) {
                        case 'day':
                            return createDayRange();
                        case 'week':
                            return createWeekRange();
                        case 'month':
                            return createMonthRange();
                        default:
                            return {};
                    }
                }

                function createDayRange() {
                    return createDatesRange(getStartOfDay().toDate(), moment().toDate());
                }

                function createWeekRange() {
                    return createDatesRange(getStartOfDay().day(-7).toDate(), getStartOfDay().toDate());
                }

                function createMonthRange() {
                    return createDatesRange(getStartOfDay().day(-31).toDate(), getStartOfDay().toDate());
                }

                function createDatesRange(from, to) {
                    return { from: from, to: to };
                }

                function getStartOfDay() {
                    return moment().startOf('day');;
                }
            }
        ])
        .directive("callsActionPanel", function () {
            return {
                link: function ($scope, $el) {
                    $el.on('click', '.c-filter-btn', function () {
                        var $this = $(this);
                        $this.toggleClass('selected');
                        if ($this.hasClass('selected')) {
                            $this.siblings().removeClass('selected');
                        }
                    });
                },
                restrict: "A",
                replace: true,
                scope: { params: '=' },
                controller: 'callsActionPanelController',
                templateUrl: GlobalContext.getTemplateUrl('Calls/Templates/calls-action-panel.html')
            };
        });
}(jQuery));