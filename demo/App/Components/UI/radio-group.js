/**
 * Панель с радиобатонами, которая позволяет снимать выбор с радиобатона
 * @author k.makarov
 **/
(function (angular, $) {
    'use strict';

    var radioGroupDirectiveFactory = function () {
        var radioGroupDirective = {
            restrict: 'EA',
            require: 'ngModel',
            link: function($scope, $element, $attrs, $ngModelController) {
                $($element.find('input[type="radio"]')).click(function ($event) {
                    var $radio = $($event.target);
                    if ($radio.data('waschecked') == true) {
                        $radio.prop('checked', false);
                        $radio.data('waschecked', false);
                        $ngModelController.$setViewValue(null);
                    } else {
                        $radio.data('waschecked', true);
                    }
                    $radio.siblings('input[type="radio"]').data('waschecked', false);
                });
            },
        };
        return radioGroupDirective;
    };

    radioGroupDirectiveFactory.$inject = [];

    angular.module('radio.group', []).directive('radioGroup', radioGroupDirectiveFactory);

})(angular, $);