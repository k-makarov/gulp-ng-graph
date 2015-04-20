(function ($) {
    $.widget('polpred.karusel', {
        options: {
            mode: 'horizontal',
            containerSize: 200, // значение которое установится в кач-ве max-width или max-height
            scrollOffset: 42, // сколько скролить при клике на стрелку
            animationTime: 220,
            nextBtnClass: 'widget-arrow-right', // для стилизации кнопок назад\вперед
            prevBtnClass: 'widget-arrow-left',
            wrap: false,
            disableMousewheel: false
        },
        _create: function () {
            var options = this.options,
                el = this.element,
                mode = this.options.mode,
                elProperty = mode == 'vertical' ? 'max-height' : 'max-width';
            el.css(elProperty, options.containerSize);
            el.css('overflow', 'hidden');

            if (!this.options.disableMousewheel) {
                this._initMouseWheel();
            }
            this._appendNextBtn();
            this._appendPrevBtn();
        },
        _appendNextBtn: function () {
            var btn = this._createNextArrow();
            if (!this.options.nextContainer) {
                this.element.after(btn);
            } else {
                var nextContainer = $(this.options.btnNextContainer);
                nextContainer.html(btn);
            }
            btn.click(function () {
                this._forward();
            }.bind(this));
        },
        _appendPrevBtn: function () {
            var btn = this._createPrevArrow();
            if (!this.options.btnPrevContainer) {
                this.element.before(btn);
            } else {
                var prevContainer = $(this.options.btnPrevContainer);
                prevContainer.html(btn);
            }
            btn.click(function () {
                this._backward();
            }.bind(this));
        },
        _createPrevArrow: function () {
            return this._createArrow(this.options.prevBtnClass);
        },
        _createNextArrow: function () {
            return this._createArrow(this.options.nextBtnClass);
        },
        _createArrow: function (className) {
            var btn = $('<div/>', {
                'class': className
            });
            return this.options.wrap ? $('<div/>').append(btn) : btn;
        },
        _scroll: function (scrollOffset) {
            var scrollDir = this.options.mode == 'horizontal' ? 'scrollLeft' : 'scrollTop';
            var animation = {};
            animation[scrollDir] = scrollOffset;
            return this.element.animate(animation, this.options.animationTime);
        },
        _forward: function () {
            return this._scroll('+=' + this.options.scrollOffset);
        },
        _backward: function () {
            return this._scroll('-=' + this.options.scrollOffset);
        },
        _moveScrolNoAnimation: function (offset) {
            var scrollDir = this.options.mode == 'horizontal' ? 'scrollLeft' : 'scrollTop';
            var currentScroll = this.element[scrollDir]();
            this.element[scrollDir](currentScroll + offset);
        },
        _initMouseWheel: function () {
            var keys = [37, 38, 39, 40],
                el = this.element;
            function preventDefault(e) {
                e = e || window.event;
                if (e.preventDefault)
                    e.preventDefault();
                e.returnValue = false;
            }
            function keydown(e) {
                for (var i = keys.length; i--;) {
                    if (e.keyCode === keys[i]) {
                        preventDefault(e);
                        return;
                    }
                }
            }
            function wheel(e) {
                preventDefault(e);
            }
            el.on('mouseenter', function (e) {
                // console.info('disable scroll', e.target);
                if (window.addEventListener) {
                    window.addEventListener('DOMMouseScroll', wheel, false);
                }
                window.onmousewheel = document.onmousewheel = wheel;
                document.onkeydown = keydown;
            }).on('mouseleave', function (e) {
                // console.info('enable scroll', e.target);
                if (window.removeEventListener) {
                    window.removeEventListener('DOMMouseScroll', wheel, false);
                }
                window.onmousewheel = document.onmousewheel = document.onkeydown = null;
            });
            el.mousewheel(function (e, b) {
                var offset = b > 0 ? -this.options.scrollOffset : this.options.scrollOffset;
                this._moveScrolNoAnimation(offset);
            }.bind(this));
        }
    });
})(jQuery)