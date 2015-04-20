(function () {
    angular.module('tasks.list')
        .service('TaskCategoriesService', ['$http', 'RoutesService', function ($http, routesService) {

            var controller = 'TaskCategory';

            var get = function (action, filter) {
                return $http.get(routesService.create(controller, action).url, { params: filter });
            };

            this.getStatuses = function (filter) {
                return get('GetStatuses', filter);
            };

            this.getResponsibles = function (filter) {
                return get('GetResponsibles', filter);
            };

            this.getAuthors = function (filter) {
                return get('GetAuthors', filter);
            };

            this.getDepartments = function (filter) {
                return get('GetDepartments', filter);
            };

            this.getKinds = function (filter) {
                return get('GetKinds', filter);
            };

            this.getBaseDocuments = function (filter) {
                return get('GetBaseDocuments', filter);
            };
        }]);
})();