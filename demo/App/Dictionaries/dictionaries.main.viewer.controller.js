(function() {
    'use strict';

    angular.module('dictionaries.main').controller('dictionaries.viewer.controller', ['$scope', 'dictionary', '$dictionariesFactory', 'modal.builder',
        function($scope, dictionary, $dictionariesFactory, modalBuilder) {
            $scope.dictionary = dictionary;

            $scope.onRemoveDictionaryItemClick = function (removedItem) {
                return new modalBuilder.Confirm({
                     Title: 'Удалить запись?',
                     Message: '',
                     onConfirm: function() {
                         $dictionariesFactory.remove(dictionary.instance, dictionary.type, removedItem.Id)
                             .then(function() {
                                 dictionary.data = _.filter(dictionary.data, function(item) {
                                     return item.Id !== removedItem.Id;
                                 });
                             }, function() {
                                 return new modalBuilder.Warning({
                                     Message: 'Невозможно удалить значение, так как оно используется в поручениях.'
                                 });
                             });
                     },
                 });
            };

            $scope.getDictionaryUrlEnding = function () {
                return (dictionary.type || dictionary.type === 0) ? dictionary.typeDescriptor : '';
            };

            $scope.onAddButtonClick = function() {
                $dictionariesFactory.create(dictionary.instance, dictionary.type, {}).then(function(response) {
                    location = '#/' + dictionary.instance +
                        '/Edit/' + response.data + '/' + $scope.getDictionaryUrlEnding();
                });
            };

        }
    ]);

})();
