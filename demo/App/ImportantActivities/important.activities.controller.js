'use strict';

(function (activitiesScheduler) {

    angular.module('important.activities')
        .controller('ImportantActivitiesController', ['$scope', 'ImportantActivitiesService',
            function ($scope, importantActivitiesService) {

                var updateList = function (from, to) {

                    var DATE_FORMAT = 'YYYY-MM-DD';

                    var from = from ? moment(from) : moment().startOf('month');
                    var to = to ? moment(to) : moment().endOf('month');

                    var filter = {
                        importantOnly: true,
                        from: from.format(DATE_FORMAT),
                        to: to.format(DATE_FORMAT)
                    };

                    importantActivitiesService.get(filter).success(function (result) {
                        $scope.importantActivities = result;
                    });
                };

                $scope.getClassByType = function (type) {
                    var colors = ['magenta', 'green', 'blue', 'purple', 'yellow', 'red'];
                    return 'date-type-' + colors[type];
                };

                if (activitiesScheduler) {
                    activitiesScheduler.attachEvent('dateRangeUpdated', function (from, to) {
                        updateList(from, to);
                    });
                } else {
                    updateList();
                }
            }]);
})(window.scheduler);