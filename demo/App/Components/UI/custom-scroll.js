'use strict';

angular.module('customScroll', [])
    .directive('customScroll', function () {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                params: '=',
                scrollId: '@'
            },
            link: function ($scope, $el) {
                var defaults = {
                    axis: "y",
                    theme: "dark",
                    advanced: {
                        updateOnContentResize: true
                    },
                    mouseWheel: {
                        preventDefault: true,
                    },
                    scrollButtons: {
                        enable: false
                    },

                    scrollInertia: 50
                };

                $el.mCustomScrollbar($.extend(defaults, $scope.params || {}));

                $scope.$on('$destroy', function (event, id) {
                    if (isThisInstanceId(id)) {
                        $el.mCustomScrollbar('destroy');
                    }
                });

                $scope.$on('customScroll.scrollTo', function (event, id, position, options) {
                    if (isThisInstanceId(id)) {
                        $el.mCustomScrollbar('scrollTo', position, options);
                    }
                });

                var isThisInstanceId = function (id) {
                    return !$scope.id || $scope.id == id
                };
            }
        };
    });
