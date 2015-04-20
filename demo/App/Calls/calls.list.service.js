(function (location) {
    angular.module('calls.list')
        .service('CallsService', ['$http', 'RoutesService', function ($http, routesService) {
            var controller = 'Calls';

            this.getCalls = function (filter) {

                if (filter.orderby == 0) { filter.orderby = "Date"; }
                if (filter.orderby == 1) { filter.orderby = "Person"; }
                if (filter.orderdirection == 1) { filter.orderdirection = "asc"; }
                if (filter.orderdirection == 2) { filter.orderdirection = "desc"; }

                return $http.get(routesService.create(controller, 'GetAll').url, { params: filter });
            };

            this.CallStatus = [

                { id: 0, code: 'New', title: "Поступил" },
                { id: 1, code: 'Answered', title: "Ответил" },
                { id: 2, code: 'Connect', title: "Соединить" },
                { id: 3, code: 'NotConnect', title: "Не соединять" },
                { id: 4, code: 'SetAside', title: "Отложить" },
            ];

        }]);
})(window.location);