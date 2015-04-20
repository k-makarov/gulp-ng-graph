'use strict';

angular.module('pagination', [])
    .controller('paginationController', ['$scope', function ($scope) {
        $scope.setPage = function (page, noCallback) {
            $scope.currentPage = page;
            var countOnPage = $scope.params.countOnPage;
            var from = 1 + (page - 1) * countOnPage;
            var to = from + countOnPage - 1;
            $scope.params.from = from;
            $scope.params.to = to;
            if (!noCallback) {
                var callback = $scope.params.pageChangeCallback;
                if (typeof callback == 'function') {
                    callback();
                }
            }
        };

        var refresh = function () {
            if ($scope.params) {
                $scope.pages = [];
                for (var i = 1; i <= $scope.params.pagesCount; i++) {
                    $scope.pages.push(i);
                }
                $scope.setPage(1, true);
            }
        };

        $scope.$watch('params.pagesCount', function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                refresh();
            }
        });

        refresh();
    }])
    .directive('pagination', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                params: '='
            },
            controller: 'paginationController',
            templateUrl: GlobalContext.getTemplateUrl('Components/Templates/pagination.html')
        };
    });