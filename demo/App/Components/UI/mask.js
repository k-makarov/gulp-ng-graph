/**
* Обертка для плагина jquery.mask. Не используйте ui-mask, так как в ie есть баг с автофокусом https://github.com/angular-ui/ui-utils/issues/317
* @author k.makarov
**/
(function (angular) {
    'use strict';
    
    var maskDirectiveFactory = function() {
        var directive = {
            rectrict: 'A',
            link: function ($scope, $element, $attrs) {
                var maskOptions = {};
                if ($attrs.maskOptions) {
                    maskOptions = JSON.parse($attrs.maskOptions);
                }
                $element.mask($attrs.mask || '', maskOptions);
            },
        };
        return directive;
    };

    maskDirectiveFactory.$inject = [];

    angular.module('mask', []).directive('mask', maskDirectiveFactory);
})(angular);