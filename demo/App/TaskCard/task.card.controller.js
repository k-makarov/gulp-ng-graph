(function() {
    'use strict';

    angular.module('task.card').controller('task.card.controller', [
        '$scope', '$timeout', 'constants', 'task.card.factory', 'dictionaries.factory', '$q', '$location', 'RoutesService', 'tags.helpers',
        function ($scope, $timeout, constants, taskCardFactory, dictionariesFactory, $q, $location, routesService, tagsHelpers) {

            angular.extend($scope, routesService);

            $scope.statuses = constants.TASK_STATUSES;
            
            $scope.getTaskResponsibles = function (term, done) {
                if (!term || !term.trim()) {
                    done($scope.TaskResponsibles);
                }

                var result = _.filter($scope.TaskResponsibles, function(responsible) {
                    return responsible.Title.toLowerCase().indexOf(term.toLowerCase()) != -1;
                });

                done(result);
            };

            $scope.getResponsibleId = function (responsible) {
                return responsible.Id;
            };

            $scope.getResponsibleTitle= function (responsible) {
                return responsible.Title;
            };

            var taskId = angular.element('#task-id').val();

            var initialize = function() {
                $scope.loading = true;
                var taskPromise = taskCardFactory.get(taskId || 0);
                taskPromise.then(function(response) {
                    $scope.task = response.data;
                    if (!$scope.task.Id) {
                        $scope.task.edited = true;
                        $scope.task.isNew = true;
                    }
                    $scope.task.baseDocumentFiles = [];
                    if ($scope.task.BaseDocumentId) {
                        $scope.task.baseDocumentFiles.push({
                            Id: $scope.task.BaseDocumentId,
                            Title: $scope.task.BaseDocument
                        });
                    }
                    $q.all({
                        taskTypesPromise: dictionariesFactory.get('TaskTypes'),
                        responsiblesPromise: dictionariesFactory.get('Responsibles'),
                        taskKindsPromise: dictionariesFactory.get('TaskKinds'),
                        taskStatusesPromise: dictionariesFactory.get('TaskStatuses'),
                        taskCategoriesPromise: dictionariesFactory.get('TaskCategories'),
                        responsiblesAccessPromise: dictionariesFactory.get('ResponsiblesAccess'),
                        auhtorsPromise: dictionariesFactory.get('Authors'),
                        curatorsPromise: dictionariesFactory.get('Curators'),
                        departmentsPromise: dictionariesFactory.get('Departments'),
                        directorsPromise: dictionariesFactory.get('DepartmentDirectors'),
                    }).then(function(responses) {
                        $scope.TaskTypes = responses.taskTypesPromise.data;
                        $scope.TaskResponsibles = responses.responsiblesPromise.data;
                        $scope.TaskKinds = responses.taskKindsPromise.data;
                        $scope.TaskStatuses = responses.taskStatusesPromise.data;
                        $scope.TaskCategories = responses.taskCategoriesPromise.data;
                        $scope.TaskResponsiblesAccess = responses.responsiblesAccessPromise.data;
                        $scope.TaskAuthors = responses.auhtorsPromise.data;
                        $scope.Departments = responses.departmentsPromise.data;
                        $scope.TaskCurators = responses.curatorsPromise.data;
                        $scope.Directors = responses.directorsPromise.data;
                        $scope.loading = false;
                    });
                });
            };
            initialize();

            $scope.onDepartmentChange = function (department) {
                if (!department || !department.Id) {
                    return;
                }
                $scope.task.Director = _.find($scope.Directors, function(director) {
                    return director.DepartmentId === department.Id;
                });
            };

            $scope.handlePaste = function (event) {
                $timeout(function () {
                    var editorDiv = $(event.target).find('div.ta-bind');
                    if (editorDiv.length != 0) {
                        var text = editorDiv.html();
                        text = tagsHelpers.replaceAllTags(text, 'b', 'strong');
                        text = tagsHelpers.removeAllTags(text, ['<p>', '</p>', '</strong>', '<strong>', '<br/>', '<br />']);
                        editorDiv.html(text);
                    }
                }, 100);
            };
            
        }
    ]);

})();
