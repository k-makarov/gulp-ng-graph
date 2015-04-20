'use strict';

angular.module('call.notifications.widget', [])
    .controller('callNotificationsWidgetController', ['$scope', function ($scope) {
        // todo
    }])
    .directive('callNotificationsWidget', function () {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                params: '='
            },
            controller: 'callNotificationsWidgetController',
            templateUrl: GlobalContext.getTemplateUrl('CallNotifications/Templates/call-notifications-widget-template.html')
        };
    });