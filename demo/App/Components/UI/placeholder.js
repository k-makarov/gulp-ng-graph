'use strict';

angular.module('jquery.placeholder', [])
    .directive('jqueryPlaceholder', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function ($scope, $el) {
                var fn = function() {
                    $el.placeholder({ customClass: 'custom-placeholder' });
                };
                
                var init = function() {
                    $scope.$apply(fn);
                };
                
                setTimeout(init, 500);
            }
        };
    });
