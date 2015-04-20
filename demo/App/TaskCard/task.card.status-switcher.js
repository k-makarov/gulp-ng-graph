(function() {
    'use strict';

    angular.module('task.card').directive('taskStatusSwitcher', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                task: '=',
                edited: '=',
                isNew: '=',
                statuses: '=',
            },
            templateUrl: GlobalContext.getTemplateUrl('TaskCard/Templates/task-card-status-switcher-template.html'),
            controller: ['$scope',
                function ($scope) {
                    $scope.statusesArray = _.toArray($scope.statuses);
                    $scope.isStatusVisible = function(statusCode) {
                        if (!$scope.edited) {
                            return statusCode === $scope.task.Status.Id;
                        }
                        return true;
                    };
                    $scope.onStatusClick = function(statusCode) {
                        $scope.task.Status = $scope.task.Status || {};
                        $scope.task.Status.Id = statusCode;
                        $scope.task.Status.Title = _.find($scope.statuses, function (availableStatus) {
                            return availableStatus.Code === statusCode;
                        }).Title;
                    };
                }
            ],
        };
    });

})();
