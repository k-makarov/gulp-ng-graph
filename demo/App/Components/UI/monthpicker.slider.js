/**
 * Апдейт для monthpicker
 * Выбор года в monthpicker не через комбобокс, а через слайдер с кнопками 
 * @author k.makarov
 **/
(function (angular, $, _) {
    'use strict';

    var monthpickerSlider = function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                var monthpickerSelector = '#' + $attrs.monthpickerSliderFor,
                    previous = $('<a class="ui-datepicker-prev ui-corner-all mtz-monthpicker" title="<Пред"><span class="ui-icon ui-icon-circle-triangle-w mtz-monthpicker">&lt;Пред</span></a>'),
                    next = $('<a class="ui-datepicker-next ui-corner-all mtz-monthpicker" title="След>"><span class="ui-icon ui-icon-circle-triangle-e mtz-monthpicker">След&gt;</span></a>');

                var monthPickerYearSelector = '.mtz-monthpicker-year',
                    monthPickerHeaderSelector = '.ui-datepicker-header';

                var addSlider = function () {
                    var monthpicker = $(monthpickerSelector);
                    if (monthpicker.prop('monthpickerslider')) {
                        return;
                    }
                    monthpicker.prop('monthpickerslider', true);
                    var yearSelect = monthpicker.find(monthPickerYearSelector);
                    var yearsOptions = yearSelect.find('option');
                    var years = [];
                    var monthpickerHeader = monthpicker.find(monthPickerHeaderSelector);
                    var yearLabel = $('<span>').text(yearSelect.val()).addClass('mtz-slider-year');
                    monthpicker.addClass('mtz-monthpicker-slider');
                    yearSelect.hide();
                    yearsOptions.each(function () {
                        years.push(parseInt($(this).val()));
                    });
                    monthpicker.on('click', '.ui-datepicker-prev, .ui-datepicker-next, .ui-icon-circle-triangle-w, .ui-icon-circle-triangle-e', function (e) {
                        e.stopPropagation();
                        var target = $(e.target);
                        var calculatedYear;
                        if (target.hasClass('ui-icon-circle-triangle-w') || target.closest('.ui-datepicker-prev').length) {
                            calculatedYear = parseInt(yearSelect.val()) - 1;
                        } else {
                            calculatedYear = parseInt(yearSelect.val()) + 1;
                        }
                        if (_.contains(years, calculatedYear)) {
                            yearSelect.val(calculatedYear);
                            yearSelect.trigger('change');
                        }
                        return false;
                    });
                    monthpickerHeader.append(previous);
                    monthpickerHeader.append(next);
                    monthpickerHeader.append(yearLabel);
                    yearSelect.change(function() {
                        yearLabel.text(this.value);
                    });
                    $(document).unbind('mousedown.mtzmonthpicker').on('mousedown.mtzmonthpicker', function (e) {
                        if (!e.target.className
                            || (e.target.className.toString().indexOf('mtz-monthpicker') < 0
                                && e.target.className.toString().indexOf('ui-datepicker-header') < 0
                                && e.target.className.toString().indexOf('mtz-slider-year') < 0)) {
                            $(this).monthpicker('hideAll');
                        }
                    });
                };

                $element.on('$destroy', function() {
                    $element.monthpicker('destroy');
                    $(monthpickerSelector).remove();
                });

                setTimeout(addSlider, 300);
                $element.click(addSlider);
            },
        };
    };

    angular.module('monthpicker.slider', []).directive('monthpickerSlider', monthpickerSlider);
})(angular, $, _);