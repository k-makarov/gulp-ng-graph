'use strict';

angular.module('scrollButtons', [])
    .directive('scrollButtons', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function ($scope, $el, $attrs) {

                var MAX_SCROLL_DURATION = 1000;

                var params = $scope.$eval($attrs.scrollButtons);

                var currentId = params.id;

                var upButtonId = currentId + '-scroll-up';
                var downButtonId = currentId + '-scroll-down';

                $(document).ready(function () {
                    $el.wrap($('<div/>'))
                        .parent()
                        .css({
                            'height': params.height,
                            'overflow': 'hidden'
                        })
                        .before($('<div/>', {
                            id: upButtonId,
                            'class': params.classUp
                        }))
                        .after($('<div/>', {
                            id: downButtonId,
                            'class': params.classDown
                        }))
                    $el.scrollButtons({
                        up: '#' + upButtonId,
                        down: '#' + downButtonId,
                        maxDuration: MAX_SCROLL_DURATION
                    });
                });

                $el.on('DOMSubtreeModified', function () {
                    $el.scrollButtons('reload');
                });
            }
        };
    });
