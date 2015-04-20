(function(angular, moment, context) {
    'use strict';

    var printerDirectiveFactory = function() {
        var directive = {
            replace: true,
            restrict: 'E',
            scope: true,
            templateUrl: context.getTemplateUrl('ReceptionInfo/Templates/reception-info-printer-template.html'),
            controller: printerDirectiveController
        };
        return directive;
    };
    
    var printerDirectiveController = function ($scope, $rootScope, dialogFactory) {
        $scope.controller = this;
        
        this.onPrintClick = function () {
            $rootScope.$broadcast('reception-calendar:get:current');
        };

        $rootScope.$on('reception-calendar:current', function (e, current) {
            dialogFactory.createPrinterDialog({
                Start: moment(current.start).format('DD.MM.YYYY'),
                End: moment(current.end).format('DD.MM.YYYY')
            });
        });
    };

    printerDirectiveController.$inject = ['$scope', '$rootScope', 'reception.info.dialog-factory'];

    angular.module('reception.info').directive('receptionInfoPrinter', printerDirectiveFactory);

})(angular, moment, GlobalContext);