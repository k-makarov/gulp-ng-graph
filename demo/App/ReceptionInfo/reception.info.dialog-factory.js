(function(angular, context, moment) {
    'use strict';
    
    var PrinterDialog = (function (params, modalBuilder, receptionFactory) {
        this.template = context.getTemplateUrl('ReceptionInfo/Templates/reception-info-printer-modal-template.html');
        this.className = 'ngdialog-theme-default reception-info-printer-dialog';
        this.controller = ['$scope', function($scope) {
            $scope.controller = this;
            this.model = {};
            this.model.ReportParams = params || {};
            var months = {
                'Января': 'январь',
                'Февраля': 'февраль',
                'Марта': 'март',
                'Апреля': 'апрель',
                'Мая': 'май',
                'Июня': 'июнь',
                'Июля': 'июль',
                'Августа': 'август',
                'Сентября': 'сентябрь',
                'Октября': 'октябрь',
                'Ноября': 'ноябрь',
                'Декабря': 'декабрь'
            };
            
            this.model.ReportParams.MonthYear = months[moment().format('MMMM')] + ' ' + moment().format('YYYY');
            
            this.reportTypesEnum = {
                Today: 0,
                Event: 1,
                MonthEvents: 2
            };
            this.reportTypes = [
                { Value: this.reportTypesEnum.Today, Description: 'События на сегодня' },
                { Value: this.reportTypesEnum.Event, Description: 'Мероприятия' },
                { Value: this.reportTypesEnum.MonthEvents, Description: 'Мероприятия на месяц' }
            ];

            this.onPrintClick = function () {
                location.href = receptionFactory.print(this.model);
            };
        }];
        return new modalBuilder.Dialog(this);
    });

    var printerDialogFactory = function (modalBuilder, receptionFactory) {
        var createPrinterDialog = function (params) {
            return new PrinterDialog(params, modalBuilder, receptionFactory);
        };
        return {
            createPrinterDialog: createPrinterDialog,
        };
    };

    printerDialogFactory.$inject = ['modal.builder', 'reception.info.factory'];

    angular.module('reception.info').factory('reception.info.dialog-factory', printerDialogFactory);
})(angular, GlobalContext, moment);