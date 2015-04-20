angular.module('calls.list')
    .controller('callsGridController', ['$q', '$sce', '$scope', 'RoutesService', 'CallsService', '$rootScope', function ($q, $sce, $scope, routesService, callsService, $rootScope) {
        var CALLS_COUNT_ON_PAGE = 20;

        var callsActionPanelFilter = {};
        var page = 1;

        $scope.CallStatus = callsService.CallStatus;

        $scope.sorting = { column: "Date", direction: "desc" };

        $scope.sortableTableHeaderParams = {
            columns: [
                { title: 'Статус', cssClass: 'width-70 center' },
                { title: 'Результат', cssClass: 'width-100' },
                { title: 'Время', cssClass: 'width-100 center', sortIndex: 0 },
                { title: 'Звонок от', sortIndex: 1 },
                { title: 'Тема звонка' }
            ],
            orderDirectionAsc: 1,
            orderDirectionDesc: 2,
            sorting: $scope.sorting,
            enabled: null,
            callback: function () {
                updateCallsOrder();
            }
        };

        var classForStatus = ["call_gray", "call_green", "call_green", "call_red", "call_gray"];

        $scope.getCallClass = function (call) {
            var result = classForStatus[call.Status] || '';
            if (call.Office == 'Москва') {
                result += ' city-1';
            } else if (call.Office == 'Хабаровск') {
                result += ' city-2';
            }
            return result;
        }

        function updateCallsOrder() {
            var filter = getFilter();
            callsService.getCalls(filter)
                .success(function (result) {
                    $scope.Calls = result;
                });
        }

        //wtf?
        function processCalls(Calls) {
            for (var i = 0; i < Calls.length ; i++) {
                //Calls[i]
            }
        }

        function getFilter() {
            var CALL_STATUS_ID_DECLINED = 3;
            var CALL_STATUS_ID_ACCEPTED = 1;

            var statusIds = [];
            if ($scope.params.filter.Declined) {
                statusIds.push(CALL_STATUS_ID_DECLINED);
            }
            if ($scope.params.filter.Accepted) {
                statusIds.push(CALL_STATUS_ID_ACCEPTED);
            }

            var isImportant = $scope.params.filter.Important || null;

            return {
                statusIds: statusIds,
                isImportant: isImportant,
                orderby: $scope.sorting.column,
                orderdirection: $scope.sorting.direction,
                searchText: $scope.params.filter.SearchText,
                page: page,
                pageSize: 15,
            };
        }

        function listernActionPanelEvents() {
            $rootScope.$on('callsActionPanel:filter', function (e, data) {
                if (!data) {
                    return;
                }
                page = 1;
                callsActionPanelFilter = data;
                updateCallsList();
            });
        }

        var updateCallsList = function () {
            var filter = $.extend({}, getFilter(), callsActionPanelFilter);
            callsService.getCalls(filter).success(function (result) {
                $scope.Calls = result;
            });
        };

        $scope.$watchCollection('params.filter', function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                page = 1;
                updateCallsList();
            }
        });

        var loadNextPage = function () {
            if ($scope.loading) {
                return;
            }
            ++page;
            var filter = $.extend({}, getFilter(), callsActionPanelFilter);
            $scope.loading = true;
            var promise = callsService.getCalls(filter);
            promise.success(function (response) {
                $scope.Calls.push.apply($scope.Calls, response);
                $scope.loading = false;
            });
        };

        $scope.scrollParams = {
            callbacks: {
                onTotalScroll: function () {
                    loadNextPage();
                }
            }
        };

        listernActionPanelEvents();
        updateCallsList();
    }])
    .directive("callsGrid", function () {
        return {
            restrict: "A",
            replace: true,
            scope: { params: '=' },
            controller: 'callsGridController',
            templateUrl: GlobalContext.getTemplateUrl('Calls/Templates/calls-list-grid.html')
        };
    });