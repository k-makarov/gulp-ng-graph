(function() {
    'use strict';

    angular.module('dictionaries.main', [
            'ngRoute',
            'interceptors',
            'routes',
            'modal',
            'ui.utils'
        ])
        .config(configuration());

    function configuration() {
        return ['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
            $httpProvider.interceptors.push('interceptors');
            $routeProvider
                .when('/', {
                    templateUrl: GlobalContext.getTemplateUrl('Dictionaries/Templates/dictionary-list-template.html'),
                })
                .when('/:instance/:type?', {
                    templateUrl: GlobalContext.getTemplateUrl('Dictionaries/Templates/dictionary-viewer-template.html'),
                    controller: 'dictionaries.viewer.controller',
                    resolve: {
                        dictionary: dictionaryResolver,
                    },
                })
                .when('/:instance/Edit/:id/:type?', {
                    templateUrl: GlobalContext.getTemplateUrl('Dictionaries/Templates/dictionary-editor-template.html'),
                    controller: 'dictionaries.editor.controller',
                    resolve: {
                        dictionaryItem: dictionaryItemResolver,
                    }
                })
                .otherwise({
                    redirectTo: '/'
                });
        }];
    }

    function dictionaryResolver($route, $dictionaryBuilder, $dictionariesFactory) {
        return $dictionariesFactory.getAll($route.current.params.instance, $dictionaryBuilder.DictionaryTypes[$route.current.params.type])
            .then(function(response) {
                var dictionary = new $dictionaryBuilder.Dictionary({
                    instance: $route.current.params.instance,
                    typeDescriptor: $route.current.params.type,
                    data: response.data.Data,
                    title: response.data.DictionaryName,
                });
                return dictionary;
            });
    }
    
    function dictionaryItemResolver($route, $dictionaryBuilder, $dictionariesFactory) {
        return $dictionariesFactory.getSingle($route.current.params.instance, $dictionaryBuilder.DictionaryTypes[$route.current.params.type], $route.current.params.id)
            .then(function (response) {
                var dictionaryItem = new $dictionaryBuilder.DictionaryItem({
                    instance: $route.current.params.instance,
                    typeDescriptor: $route.current.params.type,
                    data: response.data.Data,
                    title: response.data.DictionaryItemName,
                });
                return dictionaryItem;
            });
    }

})();
