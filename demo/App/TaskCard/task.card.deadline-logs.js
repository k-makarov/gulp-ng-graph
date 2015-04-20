(function () {
    'use strict';

    angular.module('task.card').directive('deadlineLogs', [function () {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                task: '=',
            },
            templateUrl: GlobalContext.getTemplateUrl('TaskCard/Templates/deadline-logs-template.html'),
            link: function ($scope, $el) {
                $('body').click(function (e) {
                    if ($(e.target).hasClass('popup')
                        || $(e.target).hasClass('label_count_change')
                        || $(e.target).hasClass('fa-times')
                        || $(e.target).parents('.popup').length) {
                        return;
                    }
                    $scope.$apply(function () {
                        $scope.showDeadlinePopup = false;
                    });
                });
            },
            controller: ['$scope',
                function ($scope) {

                    $scope.onRemoveClick = function (removedLog) {
                        $scope.task.DeadlineLogs = _.filter($scope.task.DeadlineLogs, function (log) {
                            return log.Id !== removedLog.Id;
                        });
                    };

                    $scope.onSaveClick = function (log) {
                        if (this.disableSave) {
                            $scope.onCancelClick(log);
                            return;
                        }
                        delete log.oldValue;
                    };

                    $scope.onCancelClick = function (log) {
                        log.Id = log.oldValue.Id || null;
                        log.Title = log.oldValue.Title || null;
                        log.oldValue = null;
                    };

                    $scope.onEditClick = function (log) {
                        log.oldValue = _.clone(log);
                    };

                    $scope.isDeadlineChanged = function (task) {
                        if (!task) {
                            return false;
                        }
                        return task.oldValue && task.Deadline !== task.oldValue.Deadline;
                    };

                    $scope.onDeadlineLabelClick = function () {
                        $scope.showDeadlinePopup = true;
                    };

                    $scope.onCloseClick = function() {
                        $scope.showDeadlinePopup = false;
                    };
                }
            ],
        };
    }]);

})();
