(function () {
    'use strict';

    angular.module('tasks.list')
        .controller('tasksListFilterController', ['$scope', 'dictionaries.factory', 'RoutesService', '$rootScope', function ($scope, dictionariesFactory, routesService, $rootScope) {

            angular.extend($scope, routesService);

            $scope.filter = {};

            var isFormValid = function () {
                return $scope.taskFilterForm.$valid;
            };

            var throwEvent = function (eventName, isCalendarFilter) {
                if (isFormValid()) {
                    angular.forEach($scope.filter, function (item, key) {
                        var isArray = Object.prototype.toString.call(item) === '[object Array]';
                        var isEmpty = isArray ? item.length === 0 : !item;
                        if (isEmpty) {
                            delete $scope.filter[key];
                        }
                    });
                    $scope.$emit(eventName, 'main', $scope.filter, isCalendarFilter);
                    //updateFilterTitles();
                }
            };

            $scope.apply = function (isCalendarFilter) {
                throwEvent('tasksListFilter.apply', isCalendarFilter);
            };

            $scope.export = function () {
                throwEvent('tasksListFilter.export');
            };

            $scope.onCreateNewTaskClick = function (url) {
                location.href = url;
            };

            $scope.clear = function () {
                $scope.filter = {};
                //$scope.filterTitles = {};
                $scope.$broadcast('angucomplete:reset');
                $scope.apply();
            };

            dictionariesFactory.get('TaskStatuses').success(function (result) {
                $scope.taskStatusesDictionary = result;
            });

            dictionariesFactory.get('Responsibles').success(function (result) {
                $scope.responsiblesDictionary = result;
            });

            dictionariesFactory.get('Departments').success(function (result) {
                $scope.departmentsDictionary = result;
            });

            $scope.$on('tasksFilter.setCalendarFilter', function (event, calendarFilter) {
                angular.extend($scope.filter, calendarFilter);
                $scope.apply(true);
            });

            $scope.$on('tasksFilter.clear', function () {
                $scope.clear();
            });

            $rootScope.$on('tasksFilter:reset', function (e, data) {
                $scope.filter = data;
                if ($scope.filter.TaskNumber) {
                    $scope.$broadcast('angucomplete:set', $scope.filter.TaskNumber);
                }
                //updateFilterTitles();
            });

            var filtersMap = {
                TaskNumber: {
                    title: 'Номер',
                },
                TaskContent: {
                    title: 'Содержание',
                },
                ResponsibleId: {
                    title: 'Ответственный исполнитель',
                    getValue: function (value) {
                        return value ? _.findWhere($scope.responsiblesDictionary, {
                            Id: value
                        }).Title : null;
                    }
                },
                StatusIds: {
                    title: 'Состояние',
                    getValue: function (value) {
                        return _.chain($scope.taskStatusesDictionary).filter(function (taskStatus) {
                            return _.contains(value, taskStatus.Id);
                        }).pluck('Title').join(', ').value();
                    }
                },
                Responsibles: {
                    title: 'Исполнители',
                    getValue: function (value) {
                        return _.chain($scope.responsiblesDictionary).filter(function (responsible) {
                            return _.contains(value, responsible.Id);
                        }).pluck('Title').join(', ').value();
                    }
                },
                ExecutionLog: {
                    title: 'Отметка об исполнении',
                },
                DepartmentId: {
                    title: 'Департамент',
                    getValue: function (value) {
                        return value ? _.findWhere($scope.departmentsDictionary, {
                            Id: value
                        }).Title : null;
                    }
                }
            };

            /*var getFilterTitle = function (filterName, filterValue) {
                var result = null;
                var description = filtersMap[filterName];
                if (description) {
                    var value = description.getValue ? description.getValue(filterValue) : filterValue;
                    if (value) {
                        result = {
                            title: description.title,
                            value: value,
                        };
                    }
                }
                return result;
            };

            var getDateRangeFilterTitle = function (filter, fieldName, fieldTitle) {
                var valueFrom = filter[fieldName + 'From'];
                var valueTo = filter[fieldName + 'To'];
                if (valueFrom || valueTo) {
                    var values = [];
                    if (valueFrom) {
                        values.push('с ' + valueFrom);
                    }
                    if (valueTo) {
                        values.push('по ' + valueTo);
                    }
                    return {
                        title: fieldTitle,
                        value: values.join(' ')
                    };
                }
            };

            var getFilterTitles = function () {
                var filter = $scope.filter;
                var result = [];
                angular.forEach(filter, function (value, key) {
                    var filterTitle = getFilterTitle(key, value);
                    if (filterTitle) {
                        result.push(filterTitle);
                    }
                });
                var dateRangeFields = {
                    Deadline: 'Срок исполнения',
                    AssignmentDate: 'Дата поручения',
                    RemovedFromControlDate: 'Дата снятия с контроля'
                };
                angular.forEach(dateRangeFields, function (value, key) {
                    var filterTitle = getDateRangeFilterTitle(filter, key, value);
                    if (filterTitle) {
                        result.push(filterTitle);
                    }
                });
                return result;
            };

            var updateFilterTitles = function () {
                $scope.filterTitles = getFilterTitles();
            };*/

            $scope.$watch('selectedAngucompleteTask', function (value) {
                if (!value) {
                    return;
                }
                $scope.filter.TaskNumber = value.title;
            });

            $scope.$on('angucomplete:change', function (e, value) {
                $scope.filter.TaskNumber = value;
            });
        }])
        .directive("tasksListFilter", function () {
            return {
                restrict: "A",
                replace: true,
                scope: {
                    params: '=',
                },
                controller: 'tasksListFilterController',
                templateUrl: GlobalContext.getTemplateUrl('TasksList/Templates/tasks-list-filter.html')
            };
        });
})();
