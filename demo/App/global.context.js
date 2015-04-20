/**
 * Контекст приложения, доступный во всех скриптах.
 * Создан для нотификации о push-сообщениях, работой с url и объектом текущего пользователя
 * Весь код не входящий в перечисленный выше список - мусор, который не должен быть здесь
 */
(function (window, $, Notificator) {
    'use strict';

    var GlobalContext = (function () {
        var user;
        this.Notificatior = new Notificator();

        this.getRootUrl = function () {
            return window.document.getElementById('web-site-url').value;
        };

        this.getUrl = function (url) {
            return this.getRootUrl() + url;
        };

        this.getTemplateUrl = function (path) {
            return this.getRootUrl() + 'Scripts/App/' + path + '?' + new Date().getTime();
        };

        this.getCurrentUser = function () {
            if (user) {
                return user;
            }
            $.ajax({
                url: this.getRootUrl() + 'account/getuser',
                type: 'POST',
                dataType: 'json',
                async: false,
                success: function (data) {
                    user = data;
                    user.isAssistant = function () { return _.find(user.Roles, function (role) { return role === 'assistant'; }); };
                }
            });
            return user;
        };

        this.logout = function () {
            user = null;
            $('#logoutForm').submit();
        };

        /**
         * хелпер для контроля жадности ангуляра
         * @return количество watcher`ов на страницу
         */
        this.getNgWatchersCount = function () {
            var root = $(document.getElementsByTagName('body'));
            var watchers = [];
            var f = function (element) {
                if (element.data().hasOwnProperty('$scope')) {
                    angular.forEach(element.data().$scope.$$watchers, function (watcher) {
                        watchers.push(watcher);
                    });
                }

                angular.forEach(element.children(), function (childElement) {
                    f($(childElement));
                });
            };
            f(root);
            console.info('On this page you have: ' + watchers.length + ' watchers. (Be careful if more 2000 watchers)');
            return watchers.length;
        };
    });

    window.GlobalContext = new GlobalContext();

})(window, jQuery, notificator);