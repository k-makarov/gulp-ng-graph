(function(angular) {
    'use strict';

    angular.module('tags', []).service('tags.helpers', [function () {

        //Не использовать символы, которые требуют экранировки в RegExp
        var ESCAPE_STRING = '!ESCAPED!';

        //экранирует тэг в inputString
        var escapeTag = function (inputString, tag) {
            var tagContent = tag;
            var matches = tag.match(/[<](.*?)[>]/);
            if (matches) {
                tagContent = matches[1];
            }
            return {
                string: inputString.replace(new RegExp(tag, 'g'), ESCAPE_STRING + tagContent + ESCAPE_STRING),
                escaped: ESCAPE_STRING + tagContent + ESCAPE_STRING
            };
        };
        
        //убирает все тэги кроме тех, что указаны в tags
        var removeAllTags = function (inputString, tags) {
            if (!inputString) {
                return false;
            }
            var escapedTags = [];
            angular.forEach(tags, function (tag) {
                var result = escapeTag(inputString, tag);
                inputString = result.string;
                escapedTags.push({
                    escaped: result.escaped,
                    tag: tag
                });
            });
            var tmp = document.createElement('DIV');
            tmp.innerHTML = inputString;
            inputString = tmp.textContent || tmp.innerText;
            angular.forEach(escapedTags, function (escapedTag) {
                inputString = inputString.replace(new RegExp(escapedTag.escaped, 'g'), escapedTag.tag);
            });
            return inputString;
        };

        var replaceAllTags = function (inputString, replace, to) {
            var result = inputString;
            var patterns = [['<{0}>'], ['</{0}>'], ['<{0}[^>]+>', '<{0}>']];
            angular.forEach(patterns, function (pattern) {
                var patternFrom = pattern[0];
                var patternTo = pattern.length == 2 ? pattern[1] : patternFrom;
                result = result.replace(
                    new RegExp(patternFrom.replace('{0}', replace), 'g'),
                    patternTo.replace('{0}', to));
            });
            return result;
        };

        return {
            removeAllTags: removeAllTags,
            replaceAllTags: replaceAllTags
        };
    }]);

})(angular);