(function (window, $, angular) {
    'use strict';

    var clockDirective = (function () {
        return {
            restrict: 'A',
            link: function ($scope, $element) {
                var UPDATE_INTERVAL = 1000;

                moment.locale('ru', {
                    monthsShort: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
                    weekdays: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
                });
                moment.locale('ru');

                var update = function () {
                    var now = moment();

                    $element.find('.c-app-date').html(now.format('D MMM YYYY'));
                    $element.find('.c-app-date-weekday').html(now.format('dddd'));

                    var TIME_FORMAT = 'HH:mm:ss';

                    var timeStrings = [
                        now.utcOffset(3).format(TIME_FORMAT),
                        now.utcOffset(10).format(TIME_FORMAT)
                    ];

                    for (var i = 1; i <= timeStrings.length; i++) {
                        var timeString = timeStrings[i - 1];
                        $element.find('.c-app-time-' + i).html(timeString);
                    }
                };

                window.setInterval(function () {
                    update();
                }, UPDATE_INTERVAL);

                $(document).on('ready', function () {
                    update();
                });
            },
        };
    });

    angular
        .module('clock', [])
        .directive('clock', [clockDirective]);

})(window, jQuery, angular);
