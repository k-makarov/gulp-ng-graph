(function() {
    'use strict';
    //добавляет на элемент класс .element-required-invalid, когда нет заполненных полей в указанной модели
    angular.module('element.required', [])
        .directive('elementRequired', function() {
            return {
                restrict: 'A',
                scope: {
                    //модель
                    'elementRequiredModel': '=',
                    //массив полей модели, которые required или пустая строка
                    'elementRequired': '=',
                    //required при условии
                    'elementRequiredWhen': '=',
                },
                link: function ($scope, $element) {
                    var REQUIRED_CLASS = 'element-required-invalid';

                    var isArray = function(value) {
                        return Object.prototype.toString.call(value) === '[object Array]';
                    };
                    
                    var validate = function (value) {
                        $element.removeClass(REQUIRED_CLASS);
                        if (!value || !$scope.elementRequiredWhen) {
                            $element.removeClass(REQUIRED_CLASS);
                            return;
                        }
                        if (isArray($scope.elementRequiredModel) && !$scope.elementRequiredModel.length) {
                            $element.addClass(REQUIRED_CLASS);
                            return;
                        }
                        _.each($scope.elementRequired, function (requireModelFieldName) {
                            if (!value[requireModelFieldName] || (isArray(value[requireModelFieldName]) && !value[requireModelFieldName].length)) {
                                $element.addClass(REQUIRED_CLASS);
                            }
                        });
                    };
                    
                    $scope.$watch(function() { return $scope.elementRequiredWhen; }, function(newValue, oldValue) {
                        if (newValue !== oldValue) {
                            validate($scope.elementRequiredModel);
                        }
                    });
                    
                    $scope.$watchCollection(function () {
                        return $scope.elementRequiredModel;
                    }, function (value) {
                        validate(value);
                    }, true);
                },
            };
        });
})();
