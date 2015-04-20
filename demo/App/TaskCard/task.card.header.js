(function() {
    'use strict';

    angular.module('task.card').directive('header', [function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                task: '=',
                statuses: '=',
            },
            templateUrl: GlobalContext.getTemplateUrl('TaskCard/Templates/task-card-header-template.html'),
            controller: ['$scope', '$location', function($scope, $location) {

                $scope.isActiveTab = function(tabUrl) {
                    if ($location.url() === tabUrl) {
                        return true;
                    }
                    return false;
                };

                $scope.getStatusType = function() {
                    if (!$scope.task || !$scope.task.Status) {
                        return {
                            'overdue': true,
                        };
                    }
                    return {
                        'overdue': !$scope.task.Status || $scope.taskInStatuses($scope.statuses.Failed.Code, $scope.statuses.Hot.Code),
                        'success': $scope.taskInStatuses($scope.statuses.Completed.Code),
                        'formal': $scope.taskInStatuses($scope.statuses.Formal.Code),
                        'process': $scope.taskInStatuses($scope.statuses.InProcess.Code),
                        'hot': $scope.taskInStatuses($scope.statuses.Hot.Code)
                    };
                };

                $scope.getStatusGlyphIcon = function() {
                    if (!$scope.task || !$scope.task.Status) {
                        return {
                            'overdue': true,
                        };
                    }
                    return {
                        'glyphicon glyphicon-time': !$scope.task.Status || $scope.taskInStatuses($scope.statuses.InProcess.Code),
                        'glyphicon glyphicon-ok': $scope.taskInStatuses($scope.statuses.Completed.Code, $scope.statuses.Formal.Code),
                        'glyphicon glyphicon-minus-sign': $scope.taskInStatuses($scope.statuses.Failed.Code),
                        'glyphicon glyphicon-remove': $scope.taskInStatuses($scope.statuses.Hot.Code)
                    };
                };

                $scope.getDeadlineColor = function() {
                    if (!$scope.task || !$scope.task.Status) {
                        return;
                    }
                    return {
                        'green': $scope.taskInStatuses($scope.statuses.InProcess.Code),
                        'red': $scope.taskInStatuses($scope.statuses.Failed.Code, $scope.statuses.Hot.Code)
                    };
                };

                $scope.taskInStatuses = function() {
                    if (!arguments || !$scope.task || !$scope.task.Status) {
                        return false;
                    }
                    var result = false;
                    _.each(arguments, function(argument) {
                        if (argument === $scope.task.Status.Id) {
                            result = true;
                            return;
                        }
                    });
                    return result;
                };

            }],
        };
    }]);

})();
