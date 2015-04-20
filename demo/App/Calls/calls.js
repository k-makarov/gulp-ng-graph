(function () {
    var configuration = ['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('interceptors');

        $routeProvider
            .when('/', {
                templateUrl: GlobalContext.getTemplateUrl('Calls/Templates/calls-list.html')
            });
    }];
    var run = function () {
    };
    angular.module('calls.list', [
        'ngRoute',
        'chosen',
    //    'dictionaries.provider',
     //   'includeReplace',
        'pagination',
        'routes',
        'tables',
        'tasks.calendar',
        'validator',
        'access',
        'interceptors',
        'chat',
        'calls',
        'scrollButtons'
    ]).config(configuration).run([run]);
})();