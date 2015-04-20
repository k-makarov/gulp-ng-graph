(function () {

    angular.module('tasks.list')
        .controller('TasksController', ['$q', '$scope', '$timeout', '$localStorage', 'constants', 'dictionaries.factory', 'TaskCategoriesService', 'TasksService',
            function ($q, $scope, $timeout, $localStorage, constants, dictionariesFactory, taskCategoriesService, tasksService) {

                var ORDER_DIRECTION_ASC = 0;
                var ORDER_DIRECTION_DESC = 1;

                var FILTER_EVENT_TIMEOUT = 1000;

                var gridInitializationDelay = false;

                var filters = {};

                var getMergedFilter = function () {
                    return angular.extend({}, filters.main, filters.left);
                };

                $scope.$on('tasksListFilter.apply', function (event, filterType, filter, isCalendarFilter) {
                    filters[filterType] = angular.copy(filter);
                    $scope.$broadcast('tasksList.update', getMergedFilter(), isCalendarFilter);
                    $localStorage.tasksFilter = JSON.stringify(filters.main);
                    $localStorage.tasksFilterLeft = JSON.stringify(filters.left);
                });

                $scope.$on('tasksListFilter.export', function () {
                    $scope.$broadcast('tasksList.export');
                });

                var getGetListFunction = function (name) {
                    return function (filter) {
                        return $q(function (resolve) {
                            taskCategoriesService[name](filter)
                                .success(function (result) {
                                    resolve(result);
                                });
                        });
                    };
                };

                var getStatuses = function (filter) {
                    return $q(function (resolve) {
                        taskCategoriesService.getStatuses(filter)
                            .success(function (result) {
                                var categories = [];
                                var categoryTemplates = [{
                                    Id: constants.TASK_STATUSES.Failed.Code,
                                    Title: 'Просроченные поручения'
                                }, {
                                    Id: constants.TASK_STATUSES.InProcess.Code,
                                    Title: 'Поручения в работе'
                                }, {
                                    Id: constants.TASK_STATUSES.Hot.Code,
                                    Title: 'Горящие поручения'
                                }, {
                                    Id: constants.TASK_STATUSES.Completed.Code,
                                    Title: 'Выполненные поручения'
                                }, {
                                    Id: constants.TASK_STATUSES.Formal.Code,
                                    Title: 'Поручения, выполненные формально'
                                }];
                                angular.forEach(categoryTemplates, function (item, index) {
                                    var resultCategory = _.find(result, function (found) {
                                        return found.Id == item.Id;
                                    });
                                    if (resultCategory && resultCategory.TasksAmount) {
                                        item.TasksAmount = resultCategory.TasksAmount;
                                        categories.push(item);
                                    }
                                });
                                resolve(categories);
                            });
                    });
                };

                var getCommonCategory = function (type, id) {
                    return {
                        type: type,
                        idField: 'Id',
                        id: id
                    };
                };

                var categoryDescriptors = {
                    byStatus: {
                        getList: getStatuses,
                        filter: { StatusId: 'Id' },
                        type: 'status'
                    },
                    byStatusDeleted: {
                        getList: getStatuses,
                        initialFilter: { IsDeleted: true },
                        filter: { StatusId: 'Id' },
                        type: 'status-deleted'
                    },
                    byResponsible: {
                        getList: getGetListFunction('getResponsibles'),
                        filter: { ResponsibleId: 'Id' },
                        type: 'responsible'
                    },
                    byAuthor: {
                        getList: getGetListFunction('getAuthors'),
                        filter: { TaskAuthorId: 'Id' },
                        type: 'author'
                    },
                    byDepartment: {
                        getList: getGetListFunction('getDepartments'),
                        filter: { DepartmentId: 'Id' },
                        type: 'department'
                    },
                    byKind: {
                        getList: getGetListFunction('getKinds'),
                        filter: { TaskKindId: 'Id' },
                        type: 'kind'
                    },
                    byBaseDocument: {
                        getList: getGetListFunction('getBaseDocuments'),
                        filter: { BaseDocumentId: 'Id' },
                        type: 'base-document'
                    }
                };

                $scope.views = [
                    {
                        title: 'По статусам',
                        categoryDescriptors: [
                            angular.extend({ uppercase: true }, categoryDescriptors.byStatus),
                            angular.extend({ checkbox: true }, categoryDescriptors.byResponsible)]
                    },
                    {
                        title: 'По исполнителям',
                        categoryDescriptors: [
                            angular.extend({}, categoryDescriptors.byResponsible),
                            angular.extend({}, categoryDescriptors.byStatus)]
                    }
                ];

                $scope.currentView = $scope.views[0];

                $scope.$watch('currentView', function (newValue, oldValue) {
                    if (newValue && newValue !== oldValue) {
                        $scope.$broadcast('tasksList.changeView', $scope.currentView);
                    }
                });

                var selectedCategories = [];

                angular.forEach(['status', 'responsible'], function (categoryType) {
                    var id = angular.element('#url-show-' + categoryType + '-id').val();
                    if (id) {
                        selectedCategories.push(getCommonCategory(categoryType, id));
                    }
                });

                var selectedTaskId = null;

                var restoreFilters = function () {
                    if ($localStorage.fromTaskCard) {
                        gridInitializationDelay = true;

                        var storedTasksFilter = $localStorage.tasksFilter;
                        if (storedTasksFilter) {
                            filters.main = JSON.parse(storedTasksFilter);
                            $timeout(function () {
                                $scope.$emit('tasksFilter:reset', filters.main);
                            }, FILTER_EVENT_TIMEOUT);
                        }

                        var storedTasksFilterLeft = $localStorage.tasksFilterLeft;
                        if (storedTasksFilterLeft) {
                            filters.left = JSON.parse(storedTasksFilterLeft);
                            $timeout(function () {
                                $scope.$emit('tasksFilterLeft:reset', filters.left);
                            }, FILTER_EVENT_TIMEOUT);
                        }

                        var selectedTaskPromise = $q(function (resolve) {
                            selectedTaskId = $localStorage.taskId;
                            tasksService.getSingleTask(selectedTaskId).success(function (selectedTask) {
                                if (selectedTask) {
                                    var taskCategories = [];
                                    var status = selectedTask.Status;
                                    if (status) {
                                        taskCategories.push(getCommonCategory('status', status.Id));
                                    }
                                    var responsible = selectedTask.MainResponsible;
                                    if (responsible) {
                                        taskCategories.push(getCommonCategory('responsible', responsible.Id));
                                    }
                                    $scope.gridParams.selectedCategories = taskCategories;
                                }
                                resolve();
                            });
                        });

                        $q.all([selectedTaskPromise]).then(function () {
                            $scope.gridParams.delay = false;
                            $scope.gridParams.initialFilter = getMergedFilter();
                            $scope.$broadcast('tasksList.initialize');
                        });
                    }
                    delete $localStorage.fromTaskCard;
                    delete $localStorage.taskId;
                    delete $localStorage.tasksFilter;
                    delete $localStorage.tasksFilterLeft;
                };

                restoreFilters();

                var urlDeadlineFrom = angular.element('#url-deadline-from').val();
                var urlDeadlineTo = angular.element('#url-deadline-to').val();
                var urlStatusIds = angular.element('#url-status-ids').val();
                var urlFilter = null;
                if (urlDeadlineFrom || urlDeadlineTo || urlStatusIds) {
                    urlFilter = {
                        DeadlineFrom: urlDeadlineFrom || null,
                        DeadlineTo: urlDeadlineTo || null,
                        StatusIds: urlStatusIds
                            ? _.map(urlStatusIds.split(','), function (item) { return parseInt(item); })
                            : null
                    };
                    $timeout(function () {
                        $scope.$emit('tasksFilter:reset', urlFilter);
                    }, FILTER_EVENT_TIMEOUT);
                }
                // левые фильтры
                var urlTaskCategoryId = angular.element('#url-task-category-id').val();
                var urlTaskTypeId = angular.element('#url-task-type-id').val();
                var urlTaskKindId = angular.element('#url-task-kind-id').val();
                var urlLeftFilter = null;
                if (urlTaskCategoryId || urlTaskTypeId || urlTaskKindId) {
                    urlLeftFilter = {
                        CategoryId: urlTaskCategoryId ? parseInt(urlTaskCategoryId) : null,
                        TaskTypeId: urlTaskTypeId ? parseInt(urlTaskTypeId) : null,
                        TaskKindIds: urlTaskKindId ? [parseInt(urlTaskKindId)] : null,
                    };
                    $timeout(function () {
                        $scope.$emit('tasksFilterLeft:reset', urlLeftFilter);
                    }, FILTER_EVENT_TIMEOUT);
                }

                $scope.clearFilter = function () {
                    $scope.$broadcast('tasksFilter.clear');
                };

                $scope.isFilterEmpty = function () {
                    var result = true;
                    if (filters.main) {
                        result = _.every(filters.main, function (item) {
                            return !item;
                        });
                    }
                    return result;
                };

                $scope.gridParams = {
                    view: $scope.currentView,
                    orderDirectionAsc: ORDER_DIRECTION_ASC,
                    orderDirectionDesc: ORDER_DIRECTION_DESC,
                    manualSorting: {
                        column: 0,
                        direction: ORDER_DIRECTION_ASC
                    },
                    defaultSorting: {
                        column: 2,
                        direction: ORDER_DIRECTION_DESC
                    },
                    selectedCategories: selectedCategories,
                    initialFilter: urlFilter || urlLeftFilter,
                    expandAllCategories: !!urlFilter,
                    scrollToTaskId: selectedTaskId,
                    delay: gridInitializationDelay
                };
            }]);
})();