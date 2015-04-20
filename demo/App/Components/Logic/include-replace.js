//http://stackoverflow.com/questions/16496647/replace-ng-include-node-with-template
'use strict';

angular.module('includeReplace', [])
    .directive('includeReplace', function () {
        return {
            require: 'ngInclude',
            restrict: 'A',
            link: function (scope, el) {
                el.replaceWith(el.contents());
            }
        };
    });
