/**
 * Нотификатор SignalR
 * @author k.makarov
 * Проброс событий идет на $window
 * Для подключения своего события необходимо добавить код в addListeners()
 * Создается и доступен в window.GlobalContext. 
 */
(function ($) {

    'use strict';

    window.notificator = (function () {
        var polpredHub;
        var callsHub;
        var initialize = function () {
            polpredHub = $.connection.polpredHub;
            callsHub = $.connection.callsHub;
            var tryingToReconnect = false;
            $.connection.hub.reconnecting(function () { tryingToReconnect = true; });
            $.connection.hub.reconnected(function () { tryingToReconnect = false; });
            $.connection.hub.disconnected(function () {
                if (tryingToReconnect) {
                    setTimeout(function () { $.connection.hub.start(); }, 60000);
                }
            });

            $.connection.hub.start();
            setInterval(function () { $.connection.hub.start(); }, 300000);
            addListeners();
        };

        var addListener = function (listenerName, handler) {
            polpredHub.client[listenerName] = handler;
        };

        var addListenerCall = function (listenerName, handler) {
            callsHub.client[listenerName] = handler;
        };

        var addListeners = function () {
            addListener('newChatMessageAdded', function (sender, message) {
                $(window).trigger('newChatMessageAdded', {
                    sender: sender,
                    data: message
                });
            });
            addListener('chatMessagesRemoved', function (sender, ids) {
                $(window).trigger('chatMessagesRemoved', {
                    sender: sender,
                    data: ids
                });
            });
            addListener('receptionsChanged', function (kind) {
                $(window).trigger('receptionsChanged', { kind: kind });
            });
            addListener('receptionCalendarChanged', function () {
                $(window).trigger('receptionCalendarChanged');
            });
            addListenerCall('callAdded', function (call) {
                $(window).trigger('callAdded', { call: call });
            });
            addListenerCall('callUpdated', function (call) {
                $(window).trigger('callUpdated', { call: call });
            });
            addListenerCall('callNeedDecision', function (call) {
                $(window).trigger('callNeedDecision', { call: call });
            });
            addListenerCall('hasCallDecision', function (callid, newStatus, call) {
                $(window).trigger('hasCallDecision', { callid: callid, newStatus: newStatus, call: call });
            });
            addListenerCall('callDeleted', function (callid) {
                $(window).trigger('callDeleted', { callid: callid });
            });
        };

        initialize();

    });

})(jQuery);
