/**
 * Стилизует чекбокс (см. страницу приемная)
 * @author k.makarov
 **/
(function (angular, $) {
    'use strict';

    var CHECKED_CB_CLASS = 'checked';

    function checkboxDirectiveFactory() {
        var directive = {
            restrict: 'A',
            priority: 0,
            link: function ($scope, $element, $attrs) {
                $element.hide();
                var $customCb = $('<span class="hl_chb">');
                if ($attrs.checkbox) {
                    $customCb.addClass($attrs.checkbox);
                }
                $element.after($customCb);
                $customCb.click(function () {
                    $($element).click().click();
                });
                $scope.$watch(function () {
                    return $element.is(':checked');
                }, function (value) {
                    $customCb.toggleClass(CHECKED_CB_CLASS, value);
                });
                $scope.$watch(function() {
                    return $element.prop('disabled');
                }, function(value) {
                    var fieldset = $($element.closest('fieldset'));
                    fieldset.prop('disabled', value);
                });
            },
        };
        return directive;
    }

    checkboxDirectiveFactory.$inject = [];

    angular.module('checkbox', []).directive('checkbox', checkboxDirectiveFactory);

})(angular, jQuery);