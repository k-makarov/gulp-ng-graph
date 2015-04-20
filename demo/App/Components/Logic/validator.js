'use strict';

angular.module('validator', [])
    .directive('validator', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function ($scope, $element, $attrs, ctrl) {
                var parseDate = function (str) {
                    return jQuery.datepicker.parseDate('dd.mm.yy', str);
                };

                var isValidDate = function (str) {
                    var result = true;
                    if (str) {
                        try {
                            parseDate(str);
                        } catch (e) {
                            result = false;
                        }
                    }
                    return result;
                };

                var isDateBefore = function (value1, value2) {
                    var result = true;
                    try {
                        var date1 = parseDate(value1);
                        var date2 = parseDate(value2);
                        result = date1 <= date2;
                    } catch (e) {
                    }
                    return result;
                };

                var isDateAfter = function (value1, value2) {
                    return isDateBefore(value2, value1);
                };

                var validate = function (value) {
                    var validatorType = $attrs.validator;
                    var lessThan = $attrs.lessThan;
                    var greaterThan = $attrs.greaterThan;
                    if (validatorType == 'date') {
                        ctrl.$setValidity('date', isValidDate(value));
                        if (lessThan) {
                            ctrl.$setValidity('dateBefore', isDateBefore(value, lessThan));
                        }
                        if (greaterThan) {
                            ctrl.$setValidity('dateAfter', isDateAfter(value, greaterThan));
                        }
                    }
                    return value;
                };

                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.push(validate);

                $attrs.$observe('lessThan', function () {
                    return validate(ctrl.$viewValue);
                });

                $attrs.$observe('greaterThan', function () {
                    return validate(ctrl.$viewValue);
                });
            }
        };
    });