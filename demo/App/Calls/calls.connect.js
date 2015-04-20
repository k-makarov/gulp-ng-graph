'use strict';

(function () {
    var run = function () { };
    var mod = angular.module('calls.list', ['scrollButtons']);

    mod.directive("callsConnect",function () {
        return {
            restrict: "A"
            , replace: true
            , templateUrl: GlobalContext.getTemplateUrl('Calls/Templates/calls-connect.html')

            , link: function (scope, element, attrs) {
                var e = element[0];
                // Тут код для запуска Виджета Обмена сигналами и т.д.
                // Сделаем отдельный скрипт для этого
                document.CallConnect = new CallConnect(15, 'callsConWidgetList', 'callsConWidgetListTempl');
                document.CallConnect.Init();
            }
        };
    });
    //    mod.config(configuration).run([run]);
})();

function CallConnect(maxCalls, containerId, templClass) {

    var containerId;
    var MaxCallsCount = maxCalls;
    var TemplClass = templClass;
    var callsWidgetList = document.getElementById(containerId);

    var callTempl = $('.' + TemplClass)[0].outerHTML;
    var user = GlobalContext.getCurrentUser();


    this.Init = function () {
        this.LoadLastCalls(ShowCalls);
    }

    function toISO(d) {
        var dd = d.getDate(); if (dd < 10) dd = '0' + dd;
        var MM = d.getMonth() + 1; if (MM < 10) MM = '0' + MM;
        var yyyy = d.getFullYear();
        var hh = d.getHours(); if (hh < 10) hh = '0' + hh;
        var mm = d.getMinutes(); if (mm < 10) mm = '0' + mm;
        var ss = d.getSeconds(); if (ss < 10) ss = '0' + ss;
        return ("" + yyyy + "-" + MM + "-" + dd + "T" + hh + ":" + mm + ":" + ss);
    };
    function fromISO(date) { //function DateFromISO(date) {
        if (date == undefined) { return date; }
        var timestamp, struct, minutesOffset = 0;
        //              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
        if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(date))) {
            timestamp = new Date(struct[1], struct[2] - 1, struct[3], struct[4], struct[5], struct[6]);
        } else {
            timestamp = null;
        }
        return timestamp;
    };

    function ProcessCall(call) {
        if (call.Date.getHours == undefined) {
            try {      call.Date = fromISO(call.Date);      } catch (e) {      }
        }
        try {       call.Status = parseInt(call.Status);    } catch (e) {     }
    }
    function ProcessCalls(calls) {
        for (var i = 0; i < calls.length; i++) {
            ProcessCall(calls[i])
        }
    }

    this.LoadLastCalls = function (aferLoad) {
        $.get(GlobalContext.getUrl("api/calls/all"), { page: 1, pageSize: 20, orderby: "Date", orderdirection: 'desc', status:1 }, function (data) {
            ProcessCalls(data);
            if (aferLoad != undefined) {
                aferLoad(data);
            }
        }, "json")
        .done(function () { })
        .fail(function (e) {
            console.log("fail " + e);
        })
        .always(function () {
        });
    }

    function ShowCalls(calls) {
        $(callsWidgetList).empty();
        var jqe;
        for (var i = 0; i < calls.length && i < MaxCallsCount ; i++) {
            jqe = RenderCall(calls[i]);
            AppendCall(jqe);
        }
    }

    function RenderCall(call) {
        var color = getColorForStatus(call.Status);
        var s = callTempl
            .replace('{{call.id}}', call.Id)
            .replace('{{call.time.date}}', DateToHD(call.Date))
            .replace('{{call.type.color}}', color)
            .replace('{{call.person}}', call.Person)
            .replace('{{call.purpose}}', call.Purpose);
        var jqe = $(s);
        jqe.attr('id', 'call_' + call.Id).removeClass(TemplClass).data('id', call.Id);
        jqe.attr('data-call', call.Id);
        jqe[0].call = call; // Фокус покус
        jqe[0].callUpd = function (_call) {
            if (_call != undefined) { this.call = _call; }
            var color = getColorForStatus(this.call.Status);
            $(this).find('.call-icon').attr('class', 'call-icon ' + color);
            $(this).find('.call-time').text(DateToHD(this.call.Date));
            $(this).find('.call-title').text(this.call.Person + '. ' + this.call.Purpose);
        };

        return jqe;
    }

    function AppendCall(s) {
        // AttachInfo(s);
        $(callsWidgetList).append(s);
        if (callsWidgetList.childNodes.length > MaxCallsCount) {
            callsWidgetList.removeChild(callsWidgetList.childNodes[0]);
        }
    }
    function PrependCall(s) {
        $(callsWidgetList).prepend(s);
        if (callsWidgetList.childNodes.length > MaxCallsCount) {
            callsWidgetList.removeChild(callsWidgetList.childNodes[callsWidgetList.childNodes.length - 1]);
        }
    }


}
