//модуль для управления разграничением доступа на клиенте
(function(context, angular) {
    'use strict';

    //  Examples:
    //  <input access="Admin;Director" /> - доступна для юзера состоящего в любой из указанных ролей
    //  <input access="Admin" /> - доступна только для админа
    //  TODO опции что делать с контролом (дизейблить, скрывать, хайдить и тп)
    angular.module('access', [])
        .directive('access', [function() {
            return {
                restrict: 'EA',
                link: function($scope, $element, $attrs) {
                    var currentUserRoles = context.getCurrentUser().Roles;
                    var accessRoles = $attrs.access.split(';');

                    var userInRole = function(role) {
                        var result = false;
                        for (var i = 0; i < currentUserRoles.length; i++) {
                            var currentUserRole = currentUserRoles[i];
                            if (currentUserRole === role) {
                                result = true;
                                break;
                            }
                        }
                        return result;
                    };

                    var userHasOneOfAccessRoles = function() {
                        var result = false;
                        for (var i = 0; i < accessRoles.length; i++) {
                            var accessRole = accessRoles[i];
                            result = userInRole(accessRole);
                            if (result) {
                                break;
                            }
                        }
                        return result;
                    };

                    if (!userHasOneOfAccessRoles()) {
                        noAccessProccess();
                    }

                    function noAccessProccess() {
                        $element.css('display', 'none');
                    };
                },
            };
        }]);
})(GlobalContext, angular);
