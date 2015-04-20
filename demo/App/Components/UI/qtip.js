/**
 * Обертка для хинтов с плагином qtip
 * @author k.makarov
 **/
(function (angular, $) {
    'use strict';

    var qtipDirective = function() {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                $element.qtip({
                    content: {
                        text: $attrs.qtipContent || function () {
                            return $('[qtip-target="' + $attrs.qtip + '"]');
                        },
                    },
                    position: {
                        target: 'mouse',
                        adjust: {
                            x: parseInt($attrs.qtipAdjustX) || null,
                        },
                    },

                });
                $scope.$on('qtip:hide', function() {
                    $('.qtip:visible').qtip('hide');
                });
                $scope.$on('qtip:destroy', function() {
                    $element.find('.qtip').remove();
                    $('[qtip-target="' + $attrs.qtip + '"]').remove();
                });
            },
        };
    };

    angular.module('qtip', []).directive('qtip', qtipDirective);
})(angular, $);