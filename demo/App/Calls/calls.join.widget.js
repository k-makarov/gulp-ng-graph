(function () {
    'use strict';

    angular.module('calls.join.widget', ['scrollButtons', 'routes'])

        .service('calls.join.widget.service', ['$http', 'RoutesService',
            function ($http, routesService) {

                this.get = function (from, to, statusId) {
                    var url = routesService.create('Calls', 'GetAll').url;
                    var params = {
                        params: {
                            from: from,
                            to: to,
                            status: statusId
                        }
                    };
                    return $http.get(url, params);
                };

            }])

        .controller('calls.join.widget.controller', ['$scope', 'calls.join.widget.service',
            function ($scope, service) {
                var STATUS_ID = 2;
                var now = new Date();
                var from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
                var to = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                service.get(from, to, STATUS_ID).success(function (result) {
                    $scope.calls = result;
                });
            }
        ]);
})();
