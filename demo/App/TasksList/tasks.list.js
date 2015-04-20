(function () {
    var configuration = ['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('interceptors');

        $routeProvider
            .when('/', {
                templateUrl: GlobalContext.getTemplateUrl('TasksList/Templates/tasks-list.html')
            });
    }];
    var run = function () {
    };
    angular.module('tasks.list', [
        'ngRoute',
        'chosen',
        'dictionaries.provider',
        'includeReplace',
        'pagination',
        'routes',
        'tables',
        'validator',
        'access',
        'interceptors',
        'ngStorage',
        'angucomplete',
        'ui.utils'
    ]).config(configuration).run([run]);
})();