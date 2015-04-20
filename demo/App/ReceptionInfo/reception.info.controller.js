(function (context, window) {
    'use strict';

    var controller = function ($scope, factory) {
        var kindCollectionMap = {
            'Waiting': 'waitings',
            'Call': 'calls',
            'Connection': 'connections',
            'Appointment': 'appointments',
            'Misc': 'miscs'
        };

        $scope.receptionsMetadata = new Array();
        $scope.receptionsMetadata.push({
            'Title': 'Ожидают в приемной',
            'collection': null,
            'newModelName': 'newWaiting',
            'kind': 'Waiting',
            'createPlaceholder': 'Добавить ожидающего (ENTER)'
        });
        $scope.receptionsMetadata.push({
            'Title': 'Входящие звонки',
            'collection': null,
            'newModelName': 'newCall',
            'kind': 'Call',
            'createPlaceholder': 'Новый звонок (ENTER)'
        });
        $scope.receptionsMetadata.push({
            'Title': 'Соединить',
            'collection': null,
            'newModelName': 'newConnection',
            'kind': 'Connection',
            'createPlaceholder': 'Создать запрос (ENTER)'
        });
        $scope.receptionsMetadata.push({
            'Title': 'На прием',
            'collection': null,
            'newModelName': 'newAppointment',
            'kind': 'Appointment',
            'createPlaceholder': 'Записать на прием (ENTER)'
        });
        $scope.receptionsMetadata.push({
            'Title': 'Разное',
            'collection': null,
            'newModelName': 'newMisc',
            'kind': 'Misc',
            'createPlaceholder': 'Добавить разное (ENTER)'
        });
        var getReceptions = function (kind, modelName) {
            factory.getAll(kind).then(function(response) {
                $scope[modelName] = response.data;
                for (var i in $scope.receptionsMetadata) {
                    if ($scope.receptionsMetadata[i].kind === kind) {
                        $scope.receptionsMetadata[i].collection = $scope[modelName];
                        return;
                    }
                }
            });
        };
        $.each(kindCollectionMap, function (kind, collection) {
            getReceptions(kind, collection);
        });

        var initialize = function () {
            $(window).on('receptionsChanged', function (e, signal) {
                var fn = function () {
                    getReceptions(signal.kind, kindCollectionMap[signal.kind]);
                };
                $scope.$apply(fn);
            });
        };
        initialize();

        $scope.createReception = function ($event, metadata) {
            var target = $($event.target);
            if ($event.which != 13) {
                return;
            }
            if (!target.val()) {
                return;
            }
            var title = target.val().trim();
            if (!title) {
                return;
            }
            factory.create(title, metadata.kind).then(function () {
                $scope[metadata.newModelName] = null;
                target.val('');
            });
        };

        $scope.deleteReception = function (item, kind) {
            if (!confirm('Удалить запись "' + item.AllContent + '"?')) {
                return;
            }
            factory.remove(item.Id, kind).then(function () {});
        };

        $scope.updateReception = function (kind, item) {
            if (!item.AllContent) {
                return;
            }
            factory.update(item.Id, item.Kind, item.AllContent).then(function () {});
        };

        $scope.showReceptionEditor = function ($event, item) {
            item.isEdited = true;
            var editorFocusTimeout = 100;
            var editor = $('#reception-editor-' + item.Id);
            setTimeout(function () {
                console.log(editor);
                editor.focus();
            }, editorFocusTimeout);
        };
    };

    controller.$inject = ['$scope', 'reception.info.factory'];

    angular.module('reception.info')
        .controller('receptionInfoController', controller);

})(GlobalContext, window);