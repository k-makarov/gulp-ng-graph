(function() {
    'use strict';

    angular.module('task.card').directive('docsUploader', [function() {
        return {
            templateUrl: GlobalContext.getTemplateUrl('TaskCard/Templates/docs-uploader-template.html'),
            restrict: 'E',
            replace: false,
            scope: {
                files: '=',
                single: '=',
                edited: '=',
                fileRequired: '=',
            },
            controller: ['$scope', 'modal.builder', 'RoutesService', function($scope, modalBuilder, routesService) {

                angular.extend($scope, routesService);

                var selectFile = function(file) {
                    if ($scope.single) {
                        $scope.files = [file];
                    } else {
                        $scope.files = $scope.files || [];
                        $scope.files.push(file);
                    }
                };

                $scope.onShowDocumentRepositoryClick = function() {
                    var dialog = new modalBuilder.Dialog({
                        template: GlobalContext.getTemplateUrl('TaskCard/Templates/docs-search-modal-template.html'),
                        className: 'ngdialog-theme-default docs-search-modal',
                        controller: ['$scope', function($scope) {
                            $scope.Autocomplete = {
                                url: routesService.create('File', 'Find').url + '?name=',
                                searchfields: 'Title',
                                titlefield: 'InternalName',
                                minlength: '0',
                                placeholder: 'Введите название документа',
                                id: 'document-search-input',
                                inputclass: 'document-search-input',
                                pause: 400,
                            };
                            $scope.$on('angucomplete:not-find', function() {
                                if (!angular.element('#' + $scope.Autocomplete.id + '_value').val()) {
                                    $scope.uploadBtnEnabled = false;
                                    return;
                                }
                                $scope.uploadBtnEnabled = true;
                            });
                            $scope.$on('angucomplete:find', function() {
                                $scope.uploadBtnEnabled = false;
                            });
                            $scope.fileUploadOptions = {
                                change: function(file) {
                                    $scope.loading = true;
                                    var internalName = angular.element('#' + $scope.Autocomplete.id + '_value').val();
                                    // .url + '/' - это нужно для аплоада файла с точкой в имени
                                    file.$upload(routesService.create('File', 'Upload', {
                                        name: internalName
                                    }).url + '/', {}).then(function(response) {
                                        response.data = response.data || response.response;
                                        $scope.loading = false;
                                        var responseFile = {
                                            Id: response.data.Id,
                                            Title: response.data.InternalName
                                        };
                                        selectFile(responseFile);
                                        $scope.closeThisDialog();
                                    });
                                },
                            };
                            $scope.$watch(function() {
                                return angular.element('#' + $scope.Autocomplete.id + '_value').val();
                            }, function(value) {
                                if (!value) {
                                    $scope.uploadBtnEnabled = false;
                                }
                            });
                        }],
                        scope: $scope,
                    });
                    dialog.closePromise.then(function(data) {
                        if (!data || !data.value || !data.value.originalObject) {
                            return;
                        }
                        var selectedFile = {
                            Id: data.value.originalObject.Id,
                            Title: data.value.originalObject.InternalName
                        };
                        selectFile(selectedFile);
                    });
                };

                $scope.remove = function(removedFile) {
                    $scope.files = _.filter($scope.files, function(file) {
                        return file.Id !== removedFile.Id;
                    });
                };
            }],
        };
    }]);

})();
