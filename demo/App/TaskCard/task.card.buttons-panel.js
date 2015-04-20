(function() {
    'use strict';

    angular.module('task.card').directive('buttonsPanel', function() {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: GlobalContext.getTemplateUrl('TaskCard/Templates/task-card-buttons-panel.html'),
            controller: ['$scope', 'RoutesService', 'task.card.factory', 'modal.builder', '$localStorage',
                function($scope, routesService, factory, modalBuilder, $localStorage) {
                    angular.extend($scope, routesService);
                    delete $localStorage.fromTaskCard;

                    $scope.onSaveTaskClick = function (form, withoutReload) {
                        $scope.task.isNew = false;
                        if (!form.$valid || $('.tab.element-required-invalid').length) {
                            new modalBuilder.Warning({
                                Message: 'Заполните все обязательные поля',
                            });
                            return false;
                        }
                        if ($scope.task.baseDocumentFiles && $scope.task.baseDocumentFiles.length) {
                            $scope.task.BaseDocumentId = $scope.task.baseDocumentFiles[0].Id;
                            $scope.task.BaseDocument = $scope.task.baseDocumentFiles[0].Title;
                        } else {
                            delete $scope.task.BaseDocumentId;
                            delete $scope.task.BaseDocument;
                        }
                        factory.save($scope.task).then(function(response) {
                            if (!withoutReload) {
                                location = routesService.createMvc('Task', 'Card', {
                                    id: response.data
                                }).url;
                            }
                        }, function() {
                            new modalBuilder.Warning({
                                Title: 'Ошибка',
                                Message: 'Во время сохранения произошла ошибка сервера',
                            });
                        });
                    };

                    $scope.setTaskHidden = function (hidden) {
                        factory.setDeleted($scope.task.Id, hidden).then(function (response) {
                            $scope.task.IsHidden = hidden;
                        }, function () {
                            new modalBuilder.Warning({
                                Title: 'Ошибка',
                                Message: 'Во время выполнения запроса произошла ошибка сервера',
                            });
                        });
                    };

                    $scope.onTaskCardBackClick = function(url) {
                        $localStorage.fromTaskCard = true;
                        $localStorage.taskId = $scope.task.Id;
                        setTimeout(function() {
                            location.href = url;
                        }, 100);
                    };

                    $scope.toggleEditedTaskMode = function () {
                        if (!$scope.task.edited) {
                            $scope.task.edited = true;
                            $scope.task.oldValue = $.extend(true, {}, $scope.task);
                        } else {
                            $scope.task = $scope.task.oldValue || $scope.task;
                            $scope.task.oldValue = null;
                            $scope.task.edited = false;
                        }
                    };
                }
            ],
        };
    });

})();
