(function (context, moment, window) {
    'use strict';

    angular.module('chat')
        .controller('ChatController', ['$scope', 'chat.factory',
            function ($scope, factory) {

                $scope.user = GlobalContext.getCurrentUser();

                $scope.messages = [];

                var currentPage = 1;

                var loadNextPage = function () {
                    if ($scope.loading) {
                        return;
                    }
                    $scope.loading = true;
                    factory.get(currentPage).then(function (response) {
                        if (response && response.data) {
                            if (currentPage != 1) {
                                var date = response.data[0].CreateDate;
                                var dateHeader = {
                                    isDateHeader: true,
                                    date: date
                                };
                                response.data.push(dateHeader);
                            }
                            $scope.messages = response.data.concat($scope.messages);
                            if (currentPage == 1) {
                                scrollToBottom();
                            }
                            currentPage++;
                        }
                        $scope.loading = false;
                    });
                };

                var scrollToBottom = function () {
                    var SCROLL_TIMEOUT = 100;
                    var SCROLL_INERTIA = 1000;
                    var scrollOptions = {
                        scrollInertia: SCROLL_INERTIA
                    };
                    window.setTimeout(function () {
                        $scope.$broadcast('customScroll.scrollTo', 'chat', 'bottom', scrollOptions);
                    }, SCROLL_TIMEOUT);
                };

                var initialize = function () {
                    loadNextPage();

                    $(window).on('newChatMessageAdded', function (e, signal) {
                        var fn = function () {
                            if ($scope.user.Id !== signal.sender) {
                                signal.data.isNew = true;
                            }
                            $scope.messages.push(signal.data);
                            scrollToBottom();
                        };
                        $scope.$apply(fn);
                    });

                    $(window).on('chatMessagesRemoved', function (e, signal) {
                        var fn = function () {
                            $scope.messages = _.filter($scope.messages, function (m) {
                                return !_.find(signal.data, function (d) {
                                    return d === m.Id;
                                });
                            });
                        };
                        $scope.$apply(fn);
                    });
                };

                initialize();

                $scope.scrollParams = {
                    id: 'chat',
                    callbacks: {
                        onTotalScrollBack: function () {
                            loadNextPage();
                        }
                    }
                };

                $scope.send = function () {
                    var text = getTrimmedMessageText();
                    if (text) {
                        factory.send(text).then(function (response) {
                            $scope.messageText = '';
                        });
                    }
                };

                $scope.toLocalTime = function (messageDate) {
                    return moment.utc(messageDate, moment.ISO_8601).format('HH:mm');
                };

                var getSelected = function () {
                    return _.filter($scope.messages, function (message) {
                        return message.selected;
                    });
                };

                $scope.removeSelected = function () {
                    var selected = getSelected();
                    if (selected.length != 0) {
                        factory.remove(_.map(selected, function (message) {
                            return message.Id;
                        }));
                    }
                };

                $scope.anyMessageSelected = function () {
                    return getSelected().length != 0;
                };

                var getTrimmedMessageText = function () {
                    return $.trim($scope.messageText);
                };

                $scope.isMessageTextEmpty = function () {
                    return !getTrimmedMessageText();
                };

                $scope.onMessageClick = function (message) {
                    if (!$scope.user.isAssistant()) {
                        return;
                    }
                    message.selected = !message.selected;
                };

                $scope.inputKeyUp = function (event) {
                    if (event.keyCode == 13) {
                        $scope.send();
                    }
                };
            }
        ]);
})(GlobalContext, moment, window);
