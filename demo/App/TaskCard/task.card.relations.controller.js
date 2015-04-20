(function () {
    'use strict';

    angular.module('task.card').controller('task.card.relations.controller', [
        '$scope', 'constants', 'RoutesService', 'modal.builder',
        function ($scope, constants, routesService, modalBuilder) {

            $scope.getForLinkedTaskStatus = function (linkedTask) {
                return constants.TASK_STATUS_CSS_CLASSES[linkedTask.Status.Id];
            };

            $scope.onRemoveLinkedTaskClick = function (removedLinkedTask) {
                $scope.task.LinkedTasks = _.filter($scope.task.LinkedTasks, function (linkedTask) {
                    return linkedTask.Id !== removedLinkedTask.Id;
                });
            };

            $scope.onBindWithTaskClick = function () {
                var dialog = new modalBuilder.AutocompleteModal({
                    Title: 'Поиск поручений',
                    Autocomplete: {
                        url: routesService.create('Task', 'Find').url + '?searchKey=',
                        searchfields: 'TaskNumber',
                        titlefield: 'TaskNumber,TaskContent',
                        minlength: '1',
                        placeholder: 'Введите номер поручения или его содержание',
                        id: 'task-search-input',
                        inputclass: 'document-search-input',
                        pause: 400,
                    },
                });
                dialog.closePromise.then(function (data) {
                    if (!data || !data.value || !data.value.originalObject) {
                        return;
                    }
                    var linkedTask = data.value.originalObject;
                    $scope.task.LinkedTasks = $scope.task.LinkedTasks || [];
                    $scope.task.LinkedTasks.push(linkedTask);
                });
            };
        }
    ]);

})();
