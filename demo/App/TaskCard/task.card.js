(function () {
    'use strict';

    angular.module('task.card',
        [
            'ngRoute',
            'chosen',
            'dictionaries.provider',
            'textAngular',
            'oi.file',
            'modal',
            'routes',
            'validator',
            'ui.sortable',
            'ui.select2.sortable',
            'element.required',
            'access',
            'interceptors',
            'ngStorage',
            'tags',
            'ui.utils'
        ])
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            $httpProvider.interceptors.push('interceptors');

            $routeProvider
                    .when('/main', {
                        templateUrl: GlobalContext.getTemplateUrl('TaskCard/Templates/task-card-main-template.html'),
                    })
                    .when('/documents', {
                        templateUrl: GlobalContext.getTemplateUrl('TaskCard/Templates/task-card-documents-template.html'),
                    })
                    .when('/roles', {
                        templateUrl: GlobalContext.getTemplateUrl('TaskCard/Templates/task-card-roles-template.html'),
                    })
                    .when('/relations', {
                        templateUrl: GlobalContext.getTemplateUrl('TaskCard/Templates/task-card-relations-template.html'),
                        controller: 'task.card.relations.controller',
                    })
                    .otherwise({
                        redirectTo: '/main'
                    });
        }
        ]);
})();