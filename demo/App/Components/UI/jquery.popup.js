(function ($) {
    'use strict';
    $.widget('polpred.popup', {
        options: {
            dir: 'right',
            btnClose: '.btn-close',
            width: '270px',
            showOnClick: true
        },
        _create: function () {
            var options = this.options,
                $el = this.element,
                selector = options.selector;
            if (options.showOnClick) {
                if (selector) {
                    $el.on('click', selector, this._show.bind(this));
                } else {
                    $el.on('click', this._show.bind(this));
                }
            }
            if (this.options.btnClose) {
                $el.on('click', this.options.btnClose, this.close.bind(this));
            }
        },
        _show: function (e) {
            var $target = $(e.target);
            if ($target.parents('.popup_abs').length) {
                return;
            }
            this.show();
        },
        show: function() {
            var content = _.result(this.options, 'content'),
            wrapper = this._cachedWrapper;
            if (!wrapper) {
                wrapper = this._createPopupWrapper();
                wrapper.html(content).prependTo(this.element);
                // попап смещается на собственную ширину что бы оказаться слева от элемента
                var dir = this.options.dir;
                var offsetProp = dir == 'left' || dir == 'right' ? 'width' : 'height';
                var offset = wrapper[offsetProp]();
                var css = {};
                css[dir] = offset;
                if (this.options.width) {
                    css['width'] = this.options.width;
                }
                wrapper.css(css);
                this._cachedWrapper = wrapper;
                if (_.isFunction(this.options.onCreate)) {
                    this.options.onCreate.call(this);
                }
            }
            wrapper.show();
        },
        _createPopupWrapper: function () {
            var wrapper = $('<div/>', {
                'class': 'popup_abs'
            }).css('z-index', 9999); 
            $('<div/>', {
                'class': 'popup-title'
            }).append($('<span/>', {
                'class': 'btn-close'
            })).appendTo(wrapper);
            if (this.options.id) {
                wrapper.attr('id', this.options.id);
            }
            return wrapper;
        },
        close: function () {
            this._cachedWrapper.hide();
        }
    });
})(jQuery)