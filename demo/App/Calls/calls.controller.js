(function() {
    angular.module('calls.list').controller('CallsController', ['$q', '$scope', 'CallsService',
        function ($q, $scope, callsService) {
            //$scope.calls = callsService.getCalls({})

            $scope.CallsFilter = {
                Declined: false,
                Accepted: false,
                Important: false,
                SearchText: '',
                StartDate: null,
                EndDate: null
            };

            /*
                $scope.currentView = $scope.views[0];

                $scope.$watch('currentView', function (newValue, oldValue) {
                    if (newValue && newValue !== oldValue) {
                        $scope.$broadcast('tasksList.changeView', $scope.currentView);
                    }
                });
            */


        }]);
})()