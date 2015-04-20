(function () {
    'use strict';

    angular.module('tasks.list')
        .controller('tasksListFilterLeftController', ['$scope', '$rootScope', 'RoutesService', function ($scope, $rootScope, routesService) {

            var TASK_CATEGORY_INPUT = 1;
            var TASK_CATEGORY_OUTPUT = 2;
            var TASK_CATEGORY_OTHER = 3;
            var TASK_TYPE_PRESIDENT = 1;
            var TASK_TYPE_CHAIRMAN = 2;
            var TASK_KIND_PROTOCOL = 1;
            var TASK_KIND_NOT_PROTOCOL = 2;
            var TASK_KIND_WORK = 3;

            $scope.taskCategories = [{
                title: 'Поручения Ю.П.Трутневу',
                filter: {
                    CategoryId: TASK_CATEGORY_INPUT
                }
            }, {
                title: 'Президент Российской Федерации',
                filter: {
                    CategoryId: TASK_CATEGORY_INPUT,
                    TaskTypeId: TASK_TYPE_PRESIDENT
                },
                subLevel: true
            }, {
                title: 'Председатель Правительства Российской Федерации',
                filter: {
                    CategoryId: TASK_CATEGORY_INPUT,
                    TaskTypeId: TASK_TYPE_CHAIRMAN
                },
                subLevel: true
            }, {
                title: 'Поручения Ю.П.Трутнева',
                filter: {
                    CategoryId: TASK_CATEGORY_OUTPUT
                }
            }, {
                title: 'Прочие поручения',
                filter: {
                    CategoryId: TASK_CATEGORY_OTHER
                }
            }];

            $scope.taskKinds = [{
                title: 'Протокольные',
                filter: {
                    TaskKindIds: TASK_KIND_PROTOCOL
                }
            }, {
                title: 'Резолюции',
                filter: {
                    TaskKindIds: TASK_KIND_NOT_PROTOCOL
                }
            }, {
                title: 'Рабочие',
                filter: {
                    TaskKindIds: TASK_KIND_WORK
                }
            }];

            $scope.selected = {
                taskKind: []
            };
            var filters = {};

            var apply = function () {
                $scope.$broadcast('tasksListFilter.apply',
                    'left',
                    angular.extend({}, filters.taskCategory, filters.taskKind));
            };

            var applyWithReload = function (taskCategory, taskKind) {
                var params = {};
                if (taskCategory) {
                    params.taskCategoryId = taskCategory.filter.CategoryId;
                    params.taskTypeId = taskCategory.filter.TaskTypeId;
                }
                if (taskKind) {
                    params.taskKindId = taskKind.filter.TaskKindIds;
                }
                location.href = routesService.createMvc('Task', 'FromReception').url + '?' + $.param(params);
            };

            $rootScope.$on('tasksFilterLeft:reset', function (e, data) {
                restoreFilters(data);
            });

            var restoreFilters = function (data) {
                var taskKindIds = data.TaskKindIds || null;
                _.each(taskKindIds, function (taskKindId) {
                    $scope.selected.taskKind.push(_.find($scope.taskKinds, function (kind) {
                        return kind.filter.TaskKindIds === taskKindId;
                    }));
                });

                var categoryId = data.CategoryId || null;
                var typeId = data.TaskTypeId || null;
                $scope.selected.taskCategory = typeId ? _.find($scope.taskCategories, function (category) {
                    return category.filter.CategoryId === categoryId && category.filter.TaskTypeId === typeId;
                }) : _.find($scope.taskCategories, function (category) {
                    return category.filter.CategoryId === categoryId;
                });
            };

            $scope.setSelectedTaskCategory = function (taskCategory) {
                if ($scope.selected.taskCategory != taskCategory) {
                    $scope.selected.taskCategory = taskCategory;
                    filters.taskCategory = taskCategory.filter;
                } else {
                    $scope.selected.taskCategory = null;
                    filters.taskCategory = null;
                }
                if ($scope.reload) {
                    applyWithReload(taskCategory, null);
                } else {
                    apply();
                }
            };

            $scope.setSelectedTaskKind = function (taskKind) {
                var selectedTaskKinds = $scope.selected.taskKind;
                var index = selectedTaskKinds.indexOf(taskKind);
                if (index == -1) {
                    selectedTaskKinds.push(taskKind);
                } else {
                    selectedTaskKinds.splice(index, 1);
                }
                if (selectedTaskKinds.length === 0) {
                    filters.taskKind = null;
                } else {
                    filters.taskKind = {};
                    filters.taskKind.TaskKindIds = $.map(selectedTaskKinds, function (item) {
                        return item.filter.TaskKindIds;
                    });
                }
                if ($scope.reload) {
                    applyWithReload(null, taskKind);
                } else {
                    apply();
                }
            };
        }])
        .directive("tasksListFilterLeft", function () {
            return {
                restrict: "A",
                replace: true,
                controller: 'tasksListFilterLeftController',
                link: function($scope, $element, $attrs) {
                    $scope.reload = $attrs.reload || false;
                },
                templateUrl: GlobalContext.getTemplateUrl('TasksList/Templates/tasks-list-filter-left.html')
            };
        });
})();
