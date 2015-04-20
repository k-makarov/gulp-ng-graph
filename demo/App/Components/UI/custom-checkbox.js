'use strict';

angular.module('custom.checkbox', [])
    .directive('customCheckbox', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function ($scope, $el, $attrs, ngModel) {
                var CHECKBOX_CLASS = 'iradio_square-blue';
                var RADIO_CLASS = CHECKBOX_CLASS;

                var radioButtonValue = $attrs['value'];

                $el.iCheck({
                    checkboxClass: CHECKBOX_CLASS,
                    radioClass: RADIO_CLASS
                }).on('ifChanged', function (event) {
                    var elementType = $attrs['type'];
                    if (elementType == 'checkbox') {
                        $scope.$apply(function () {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    } else if (elementType == 'radio') {
                        $scope.$apply(function () {
                            return ngModel.$setViewValue(radioButtonValue);
                        });
                    }
                });

                $scope.$watch($attrs['ngModel'], function () {
                    $el.iCheck('update');
                });
            }
        };
    });
