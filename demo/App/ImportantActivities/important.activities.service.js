(function () {

    angular.module('important.activities')
        .service('ImportantActivitiesService', ['$http', 'RoutesService',
            function ($http, routesService) {

                this.get = function (filter) {
                    var url = routesService.create('Activity', 'GetAll').url;
                    return $http.get(url, { params: filter });
                };

            }]);
})();