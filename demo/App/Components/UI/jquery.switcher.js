(function ($) {
    'use strict';
    $.widget('polpred.switcher', {
        options: {
            selector: '.btn',
            selectedClass: 'selected',
            toggle: false
        },
        _create: function () {
            var options = this.options,
                $el = this.element;
            $el.addClass('btn-group').children().addClass('btn btn-default');
            var self = this;
            $el.on('click', options.selector, function () {
                self._select($(this));
            });
        },
        _select: function ($el) {
            var selected = this.options.selectedClass;
            if (this.options.toggle) {
                $el.toggleClass(selected);
            } else {
                $el.addClass(selected);
            }
            if ($el.hasClass(selected)) {
                $el.siblings().removeClass(selected);
            }
        },
        value: function (value) {
            if (value || value == 0) {
                var el = this.element.children('[data-val="' + value + '"]');
                console.info(el);
                this._select(el);
            } else {
                return this.element.children('.selected').attr('data-val');
            }
        }
    });
})(jQuery)