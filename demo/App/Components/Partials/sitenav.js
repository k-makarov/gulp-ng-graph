(function($, angular) {
    'use strict';

    var siteNavDirective = (function() {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                var LINK_CLASS = '.header-btn-link',
                    BTN_CLASS = '.header-btn',
                    ACTIVE_CLASS = 'active',
                    LEFT_ARROW = '#site-nav-arrow-left',
                    RIGHT_ARROW = '#site-nav-arrow-right',
                    NAV_CONTAINTER = '.site-nav-container',
                    SCROLL_OFFSET = 145;

                var getLocation = function() {
                    var loc = window.location.href,
                        index = loc.indexOf('#');
                    if (index > 0) {
                        loc = loc.substring(0, index);
                    }
                    return loc;
                };

                var setActiveMenu = function() {
                    var loc = getLocation();
                    $($element.find(LINK_CLASS)).each(function() {
                        if (this.href === loc || loc.indexOf($(this).data('nav')) > -1) {
                            $($(this).find(BTN_CLASS)).addClass(ACTIVE_CLASS);
                            return;
                        }
                    });
                };

                var createSiteNavCarousel = function() {
                    var navContainer = $(NAV_CONTAINTER);
                    $($element.find(LEFT_ARROW)).hide();
                    $($element.find(RIGHT_ARROW)).click(function() {
                         $(this).hide();
                         $($element.find(LEFT_ARROW)).show();
                        navContainer.animate({
                            scrollLeft: '+=' + SCROLL_OFFSET
                        }, 500);
                    });
                    $(LEFT_ARROW).click(function() {
                        $(this).hide();
                        $($element.find(RIGHT_ARROW)).show();
                        navContainer.animate({
                            scrollLeft: '-=' + SCROLL_OFFSET
                        }, 500);
                    });
                };

                createSiteNavCarousel();
                setActiveMenu();
            },
        };
    });

    angular
        .module('sitenav', [])
        .directive('siteNav', [siteNavDirective]);

})(jQuery, angular);
