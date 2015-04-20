(function () {
    'use strict';

    angular.module('dictionaries.main').controller('dictionaries.editor.controller', ['$scope', 'dictionaryItem', '$dictionariesFactory', 'modal.builder',
        function ($scope, dictionaryItem, $dictionariesFactory, modalBuilder) {
            $scope.dictionaryItem = dictionaryItem;

            $scope.onSaveButtonClick = function() {
                $dictionariesFactory.save(dictionaryItem.instance, dictionaryItem.type, $scope.dictionaryItem.data).then(function() {
                    location = '#/' + dictionaryItem.instance + '/' + ((dictionaryItem.type || dictionaryItem.type === 0) ? dictionaryItem.typeDescriptor : '');
                }, function(errorResponse) {
                    return new modalBuilder.Error({
                        Message: errorResponse.data
                    });
                });
            };
        }
    ]);

})();
