(function() {
    angular.module('modal', ['ngDialog', 'angucomplete']);

    angular.module('modal').service('modal.builder', ['ngDialog', function (ngDialog) {

        // Ex.
        // var warning = new modalBuilder.Warning({
        //     Message: 'Текст сообщения'
        // });
        var warning = (function(options) {
            options = options || {};
            options.Title = 'Внимание';
            return new simple(options);
        });

        var error = (function (options) {
            options = options || {};
            options.Title = 'Ошибка';
            return new simple(options);
        });

        var simple = (function(options) {
            options = options || {};
            var params = {
                template: '<h4>{{Title}}</h4><div>{{Message}}</div>',
                plain: true,
                controller: ['$scope', function($scope) {
                    $.extend($scope, options || {}, {});
                }],
            };
            $.extend(this, ngDialog.open(params), {});
        });

        // Ex.
        // var confirm = new modalBuilder.Confirm({
        //     Title: 'Вы уверены?',
        //     Message: 'Текст сообщения',
        //     onConfirm: function() {},
        // });
        var confirm = (function(options) {
            options = options || {};
            var params = {
                template: '<h4>{{Title}}</h4><div>{{Message}}</div><div><button class="button-blue short-button" ng-click="onConfirmClick()">Да</button><button class="button-gray short-button" ng-click="closeThisDialog()">Нет</button></div>',
                plain: true,
                controller: ['$scope', function($scope) {
                    $.extend($scope, options || {}, {});
                    $scope.onConfirmClick = function() {
                        if ($scope.onConfirm) {
                            $scope.onConfirm();
                        }
                        $scope.closeThisDialog();
                    };
                }],
            };
            $.extend(this, ngDialog.open(params), {});
        });

        var autocompleteModal = (function(options) {
        	var params = {
        	    template: GlobalContext.getTemplateUrl('Components/Templates/autocomplete-modal-template.html'),
                controller: ['$scope', function($scope) {
                    $.extend($scope, options || {}, {});
                }],
        	};
        	$.extend(this, ngDialog.open($.extend(params, options || {}, {})), {});
        });

        var dialog = (function(options) {
            return ngDialog.open(options);
        });

        return {
            Simple: simple,
            Warning: warning,
            Error: error,
            Confirm: confirm,
    		AutocompleteModal: autocompleteModal,
            Dialog: dialog,
    	};
    }]);

})();