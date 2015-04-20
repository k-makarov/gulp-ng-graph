angular.module('tasks.list')
    .controller('tasksGridController', ['$q', '$sce', '$scope', 'constants', 'dictionaries.factory', 'RoutesService', 'TasksService',
        function ($q, $sce, $scope, constants, dictionariesFactory, routesService, tasksService) {

            var TASKS_COUNT_ON_PAGE = 10;

            angular.extend($scope, routesService);

            $scope.taskStatusIndicator = constants.TASK_STATUS_CSS_CLASSES;

            var tasksFilter = {};

            $scope.loading = true;

            $scope.sorting = {};

            $scope.sortableTableHeaderParams = {
                columns: [
                    { title: '&nbsp;', cssClass: 'width-70 center' },
                    { title: 'Номер', cssClass: 'width-110', sortIndex: 0 },
                    { title: 'Наименование', sortIndex: 1 },
                    { title: 'Срок', cssClass: 'width-100', sortIndex: 2 },
                    { title: 'Исполнители', cssClass: 'width-150', sortIndex: 3 },
                    { title: 'Исполнение', sortIndex: 4 }
                ],
                orderDirectionAsc: $scope.params.orderDirectionAsc,
                orderDirectionDesc: $scope.params.orderDirectionDesc,
                sorting: $scope.sorting,
                enabled: false,
                callback: function () {
                    updateTasksOrder();
                }
            };

            $scope.isCategoryVisible = function (category) {
                return !findNotExpandedParent(category);
            };

            $scope.isCategoryExpanded = function (category) {
                return category.isExpanded && $scope.isCategoryVisible(category);
            };

            var findNotExpandedParent = function (category) {
                var result = false;
                var categoryParent = category.parent;
                if (categoryParent) {
                    result = !categoryParent.isExpanded ? true : findNotExpandedParent(categoryParent);
                }
                return result;
            };

            var attachSubCategories = function (category, subCategories) {
                angular.forEach(subCategories, function (item) {
                    item.parent = category;
                    item.level = category.level + 1;
                });
                category.subCategories = subCategories;
            };

            var attachDescriptors = function (categories) {
                angular.forEach(categories, function (item) {
                    item.descriptor = $scope.params.view.categoryDescriptors[item.level];
                });
            };

            var getCategoryFilter = function (category) {
                var categoryFilter = angular.copy(tasksFilter);
                var hierarchyCategory = category;
                while (hierarchyCategory) {
                    var hierarchyCategoryDescriptor = $scope.params.view.categoryDescriptors[hierarchyCategory.level];
                    angular.forEach(hierarchyCategoryDescriptor.initialFilter, function (value, key) {
                        categoryFilter[key] = value;
                    });
                    angular.forEach(hierarchyCategoryDescriptor.filter, function (value, key) {
                        categoryFilter[key] = hierarchyCategory[value];
                    });
                    hierarchyCategory = hierarchyCategory.parent;
                }
                return categoryFilter;
            };

            $scope.toggleCategory = function (category) {
                var result = null;
                if (category.isExpanded) {
                    category.isExpanded = false;
                } else {
                    var categoryFilter = getCategoryFilter(category);
                    var subCategoryDescriptor = $scope.params.view.categoryDescriptors[category.level + 1];
                    if (subCategoryDescriptor) {
                        result = $q(function (resolve) {
                            subCategoryDescriptor.getList(categoryFilter).then(function (result) {
                                attachSubCategories(category, result);
                                attachDescriptors(result);
                                category.isExpanded = true;
                                resolve({ subCategories: result });
                            });
                        });
                    } else {
                        category.isExpanded = true;
                        var pagesCount = Math.ceil(category.TasksAmount / TASKS_COUNT_ON_PAGE);
                        category.showPagination = pagesCount > 1;
                        category.paginationParams = {
                            pagesCount: pagesCount,
                            countOnPage: TASKS_COUNT_ON_PAGE,
                            pageChangeCallback: function () {
                                category.loadTasks();
                            }
                        };
                        category.loadTasks = function () {
                            category.loading = true;
                            var from = category.paginationParams.from;
                            var to = category.paginationParams.to;
                            return $q(function (resolve) {
                                tasksService.getTasks(categoryFilter, from, to, $scope.sorting.column, $scope.sorting.direction)
                                    .success(function (result) {
                                        processTasks(result);
                                        category.tasks = result;
                                        category.loading = false;
                                        resolve(result);
                                    });
                            });
                        };
                        result = $q(function (resolve) {
                            category.loadTasks().then(function (tasks) {
                                resolve({ tasks: tasks });
                            });
                        });
                    }
                }
                return result;
            };

            var processTasks = function (tasks) {
                angular.forEach(tasks, function (task) {
                    task.DeadlineDates = task.DeadlineLog || [];
                    if (!_.contains(task.DeadlineDates, task.Deadline)) {
                        task.DeadlineDates.push(task.Deadline);
                    }

                    var responsibles = [];
                    var mainResponsible = task.MainResponsible;
                    if (mainResponsible) {
                        responsibles.push(mainResponsible);
                    }
                    if (task.ResponsiblesList) {
                        angular.forEach(task.ResponsiblesList, function (item) {
                            if (item != mainResponsible) {
                                responsibles.push(item);
                            }
                        });
                    }
                    task.Responsibles = responsibles;

                    task.ExecutionLog = $sce.trustAsHtml(task.ExecutionLog);
                });
            };

            //var stripTags = function (str) {
            //    return str.replace(/<\/?[^>]+>/gi, '');
            //};

            var updateTasksList = function (expandSelected, expandAll) {
                var categoryFilter = angular.copy(tasksFilter);
                angular.forEach($scope.params.view.categoryDescriptors[0].initialFilter, function (value, key) {
                    categoryFilter[key] = value;
                });
                return $q(function (resolve) {
                    $scope.params.view.categoryDescriptors[0].getList(categoryFilter).then(function (result) {
                        angular.forEach(result, function (item) {
                            item.level = 0;
                        });
                        attachDescriptors(result);
                        $scope.categories = result;
                        var expanded = false;
                        if (expandSelected) {
                            var selectedCategories = $scope.params.selectedCategories;
                            if (selectedCategories && selectedCategories.length !== 0) {
                                expandSelectedCategories(selectedCategories);
                                expanded = true;
                            }
                        }
                        if (!expanded && (expandAll || $scope.params.expandAllCategories)) {
                            expandAllCategories();
                        }
                        resolve();
                    });
                });
            };

            var initialize = function () {
                if ($scope.params.initialFilter) {
                    tasksFilter = $scope.params.initialFilter;
                    delete $scope.params.initialFilter;
                }
                resetSorting();
                updateTasksList(true, false).then(function () {
                    $scope.loading = false;
                });
            };

            $scope.$on('tasksList.update', function (event, filter, fromCalendar) {
                tasksFilter = filter;
                resetSorting();
                updateTasksList(false, fromCalendar);
            });

            $scope.$on('tasksList.export', function () {
                tasksService.export(tasksFilter, $scope.sorting.column, $scope.sorting.direction);
            });

            $scope.$on('tasksList.changeView', function (event, data) {
                $scope.params.view = data;
                resetSorting();
                updateTasksList(false, false);
            });

            var _updateTasksOrder = function (categories) {
                angular.forEach(categories, function (item) {
                    if ($scope.isCategoryExpanded(item)) {
                        if (item.subCategories) {
                            _updateTasksOrder(item.subCategories);
                        } else if (item.tasks) {
                            item.loadTasks();
                        }
                    }
                });
            };

            var updateTasksOrder = function (categories) {
                _updateTasksOrder($scope.categories);
            };

            var _expandAllCategories = function (categories) {
                angular.forEach(categories, function (category) {
                    var promise = $scope.toggleCategory(category);
                    if (promise) {
                        promise.then(function (response) {
                            if (response.subCategories) {
                                _expandAllCategories(response.subCategories);
                            }
                        });
                    }
                });
            };

            var expandAllCategories = function () {
                _expandAllCategories($scope.categories);
            };

            var _expandSelectedCategories = function (categories, selectedCategories) {
                angular.forEach(categories, function (category) {
                    if (_.some(selectedCategories, function (selectedCategory) {
                        return $scope.params.view.categoryDescriptors[category.level].type == selectedCategory.type
                            && category[selectedCategory.idField] == selectedCategory.id;
                    })) {
                        var promise = $scope.toggleCategory(category);
                        if (promise) {
                            promise.then(function (response) {
                                if (response.subCategories) {
                                    _expandSelectedCategories(response.subCategories, selectedCategories);
                                } else if (response.tasks) {
                                    var scrollToTaskId = $scope.params.scrollToTaskId;
                                    if (scrollToTaskId) {
                                        var SCROLL_TIMEOUT = 100;
                                        var SCROLL_INERTIA = 1000;
                                        var scrollOptions = {
                                            scrollInertia: SCROLL_INERTIA
                                        };
                                        setTimeout(function () {
                                            $scope.$broadcast(
                                                'customScroll.scrollTo',
                                                'tasks-grid',
                                                '#task-row-' + scrollToTaskId,
                                                scrollOptions);
                                        }, SCROLL_TIMEOUT);
                                    }
                                }
                            });
                        }
                    }
                });
            };

            var expandSelectedCategories = function (selectedCategories) {
                _expandSelectedCategories($scope.categories, selectedCategories);
            };

            var resetSorting = function () {
                var manualSortingEnabled = tasksFilter.CategoryId >= 0;
                if (!manualSortingEnabled || manualSortingEnabled != $scope.sortableTableHeaderParams.enabled) {
                    var newSorting = manualSortingEnabled
                        ? $scope.params.manualSorting
                        : $scope.params.view.sorting || $scope.params.defaultSorting;
                    angular.extend($scope.sorting, newSorting);
                    $scope.sortableTableHeaderParams.enabled = manualSortingEnabled;
                }
            };

            if (!$scope.params.delay) {
                initialize();
            } else {
                $scope.$on('tasksList.initialize', function (event) {
                    initialize();
                });
            }
        }])
    .directive("tasksGrid", function () {
        return {
            restrict: "A",
            replace: true,
            scope: {
                params: '=',
                isFilterExtended: '=',
            },
            controller: 'tasksGridController',
            templateUrl: GlobalContext.getTemplateUrl('TasksList/Templates/tasks-list-grid.html')
        };
    });