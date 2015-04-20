/**
 * Стилизует радиобатон (см. страницу приемная)
 * @author k.makarov
 **/
(function (angular, $) {
    'use strict';

    var CHECKED_RADIO_CLASS = 'checked';

    function radioDirectiveFactory() {
        var directive = {
            restrict: 'A',
            priority: 0,
            link: function ($scope, $element, $attrs) {
                $element.hide();
                var $customRadio = $('<span class="er_rb">');
                if ($attrs.radio) {
                    $customRadio.addClass($attrs.radio);
                }
                $element.after($customRadio);
                $customRadio.click(function () {
                    $($element).click().click().click();
                });
                $scope.$watch(function() {
                    return $element.is(':checked');
                }, function (value) {
;                    $customRadio.toggleClass(CHECKED_RADIO_CLASS, value);
                });
            },
        };
        return directive;
    }

    radioDirectiveFactory.$inject = [];

    angular.module('radio', []).directive('radio', radioDirectiveFactory);

})(angular, jQuery);