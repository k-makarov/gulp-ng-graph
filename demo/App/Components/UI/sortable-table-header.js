'use strict';

angular.module('tables', [])
    .controller('sortableTableHeaderController', ['$sce', '$scope', function ($sce, $scope) {

        var SORTABLE_COLUMN_CLASS = 'pointer';

        $scope.isSortable = function (column) {
            return column.sortIndex >= 0;
        }

        $scope.getColumnClass = function (column) {
            var result = {};
            if (column.cssClass) {
                result[column.cssClass] = true;
            }
            if ($scope.params.enabled && $scope.isSortable(column)) {
                result[SORTABLE_COLUMN_CLASS] = true;
            }
            return result;
        }

        $scope.getColumnTitle = function (column) {
            return $sce.trustAsHtml(column.title);
        }

        $scope.getOrderText = function (column) {
            var result = '';
            if (column.sortIndex === $scope.params.sorting.column) {
                result = $scope.params.sorting.direction === $scope.params.orderDirectionAsc ? '&#8593;' : '&#8595;';
            }
            return $sce.trustAsHtml(result);
        };

        $scope.setOrder = function (column) {
            var params = $scope.params;
            var sorting = params.sorting;
            var orderDirectionAsc = params.orderDirectionAsc;
            var orderDirectionDesc = params.orderDirectionDesc;
            if (!params.enabled || !$scope.isSortable(column)) {
                return;
            }
            if (column.sortIndex !== sorting.column) {
                sorting.column = column.sortIndex;
                sorting.direction = orderDirectionAsc;
            } else {
                sorting.direction = sorting.direction === orderDirectionAsc
                    ? orderDirectionDesc : orderDirectionAsc;
            }
            if (params.callback && typeof params.callback == 'function') {
                params.callback();
            }
        };
    }])
    .directive('sortableTableHeader', function () {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                params: '='
            },
            controller: 'sortableTableHeaderController',
            templateUrl: GlobalContext.getTemplateUrl('Components/Templates/sortable-table-header.html')
        };
    });