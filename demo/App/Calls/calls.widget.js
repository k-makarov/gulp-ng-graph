'use strict';

(function () {
	var run = function () { };
	var mod = angular.module('calls', ['scrollButtons']);
	mod.directive("callsWidget", function () {
		return {
			restrict: "A"
            , replace: true
            , templateUrl: GlobalContext.getTemplateUrl('Calls/Templates/calls-widget.html')
            , link: function (scope, element, attrs) {
                var e = element[0];
                // Тут код для запуска Виджета Обмена сигналами и т.д.
                // Сделаем отдельный скрипт для этого
                var widget = document.CallsWidget = new callsWidget(15, 'callsWidgetList', 'callsWidgetListTempl');
                document.CallsWidget.Init();
                element.popup({
                    showOnClick: false,
                    id: 'callCardPopup',
                    content: function () {
                        return $('#callCard').html();
                    },
                    onCreate: function() {
                        widget.CallCardDialog_Init();
                    }
                });
            }
		};
	});
	//    mod.config(configuration).run([run]);
})();

function callsWidget(maxCalls, containerId, templClass) {
    var containerId;
    var MaxCallsCount = maxCalls;
    var TemplClass = templClass;
    var callsWidgetList = document.getElementById(containerId);

    var callTempl = $('.' + TemplClass)[0].outerHTML;
    var user = GlobalContext.getCurrentUser();

    var CallStatus=[
        {id:0, title:"Новое" },
        {id:1, title:"Ответил" },
        {id:2, title:"Соединить" },
        {id:3, title:"Не соединять" },
        {id:4, title:"Отложить" }
    ]

    // @see http://momentjs.com/docs/ (уже есть в проекте)
    function DateToHD(d) {
        if (d == null) {  d=Date(2000, 0, 1);    }
        if (d.getFullYear== undefined) {
            try {    d = fromISO(d);  
            } catch (e) {
                return d;
            }
        }
        if (d.getHours == undefined || d.getHours == null) {
            d = Date(2000, 0, 1);
        }
        var H = ('0' + d.getHours()).substr(-2, 2) + ":" + ('0' + d.getMinutes()).substr(-2, 2);
        var D = ('0' + d.getDate()).substr(-2, 2) + '.' + ('0' + (d.getMonth()+1)).substr(-2, 2) + '.' + d.getFullYear();
        return H+" "+D;
    }
    function DateToDH(d) {
        try {
            if (d == null) {  d=Date(2000, 0, 1);    }
            if (d.getFullYear== undefined) {
                try {    d = fromISO(d);  
                } catch (e) {
                    return d;
                }
            }
            if (d.getHours == undefined || d.getHours == null) {
                d = Date(2000, 0, 1);
            }
            var D = ('0' + d.getDate()).substr(-2, 2) + '.' + ('0' + (d.getMonth() + 1)).substr(-2, 2) + '.' + d.getFullYear();
            var H = ('0' + d.getHours()).substr(-2, 2) + ":" + ('0' + d.getMinutes()).substr(-2, 2);
            return D + " " + H;
        } catch (e) {
            return new Date(2000, 0, 1);
        }
    }

    function ddmmyyyy(d){
        var dd = d.getDate(); if (dd < 10) dd = '0' + dd;
        var mm = d.getMonth() + 1; if (mm < 10) mm = '0' + mm;
        var yyyy = d.getFullYear();
        return ("" + dd + "." + mm + "." + yyyy);
    };
    function toDate(ddMMyyyyhhmm) {
        // http://javascript.ru/basic/regular-expression+#metod-match-regexp
        var d = null;
        try{
            var a = ddMMyyyyhhmm.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/);
            var d = 0; var M = 0; var y = 0; var h = 0; var m = 0;
            d = parseInt(a[1]);
            M = parseInt(a[2]) - 1;
            y = parseInt(a[3]);
            h = parseInt(a[4]);
            m = parseInt(a[5]);

            d = new Date(y, M, d, h, m);
        }catch(e){        
        }
        return d;
    };

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
        if (call.Date.getHours==undefined) {
            try {
                call.Date = fromISO(call.Date);
            } catch (e) {
            }
        }
        try{
            call.Status = parseInt(call.Status);
        }catch(e){
        }
    }
    function ProcessCalls(calls) {
        for (var i = 0; i<calls.length; i++) {
            ProcessCall(calls[i])
        }    
    }

    this.LoadLastCalls = function (aferLoad) {
        $.get(GlobalContext.getUrl("api/calls/all"), { page: 1, pageSize: MaxCallsCount, orderby: "Date", orderdirection: 'desc' }, function (data) {
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

    function ShowCalls(calls){
        $(callsWidgetList).empty();
        var jqe;
        for (var i = 0; i < calls.length && i < MaxCallsCount ; i++) {
            jqe = RenderCall(calls[i]);
            AppendCall(jqe);
        }
    }

    function getColorForStatus(status) {
        var color = "grey";
        switch (status) {
            case 1: color = "green"; break;  // Ответил 
            case 2: color = "green"; break;  // Соединить 
            case 3: color = "red"; break;  // Не соединять 
            case 4: color = "grey"; break;  // Отложить 
        }
        return color;
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
            if(_call!=undefined){     this.call = _call;   }
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
            callsWidgetList.removeChild(callsWidgetList.childNodes[callsWidgetList.childNodes.length-1]);
        }
    }

    function newcall() {
        var call = {
            Id: 0,
            Date: new Date(),
            Office: "Москва",
            Phone: "+7-",
            Person: "",
            Purpose: "",
            Result: "",
            Comment: ""
        };
        return call;
    }

    this.CallCardDialog_Init = function() {
        //$(this).find('#CallCard-Date').datepicker({ altFormat: "dd.mm.yyyy" });
        $('#CallCard-Date').datetimepicker();
        var dlg = $("#callCardPopup");
        dlg.on("click", "#CallCard-Save", CallCardDialog_Save);
        dlg.on("click", "#CallCard-Close", CallCardDialog_Close);
        dlg.on("click", "#CallCard-Delete", CallCardDialog_Delete);
        dlg.find('#CallCard-Office, #CallCard-Status').switcher();
    };

    function CallCardDialog_Save() {
        var dlg = $("#callCardPopup");
        var call = newcall();
        call.Id = parseInt(dlg.find('#CallCard-Id').val());
        call.Date = toDate(dlg.find('#CallCard-Date').val());
        //call.Date = fromISO(dlg.find('#CallCard-Date').val());
        call.Status = dlg.find('#CallCard-Status').switcher('value');
        call.Office = dlg.find('#CallCard-Office').switcher('value');
        call.Person = dlg.find('#CallCard-Person').val();
        call.Phone = dlg.find('#CallCard-Phone').val();
        call.Purpose = dlg.find('#CallCard-Purpose').val();
        call.Result = dlg.find('#CallCard-Result').val();
        call.Comment = dlg.find('#CallCard-Comment').val();
        if (call.Date == null) {
            alert("Дата и время заданны не корректно!");
            return;
        }
        if (call.Purpose == undefined || call.Purpose == null || call.Purpose == "") {
            alert("Поле Тема не заполнено!");
            return;
        }
        if (call.Person == undefined || call.Purpose == null || call.Purpose == "") {
            alert("Поле Кто звонил не заполнено!");
            return;
        }
        try {
            if (call.Id == 0) {
                document.CallsWidget.CallAdd(call);
            } else if (call.Id > 0) {
                document.CallsWidget.CallUpdate(call);
            }
            $("#callsWidget").popup("close");
        } catch (e) {

        }

    }
    function CallCardDialog_Close() {
        $("#callsWidget").popup("close");

    }
    function CallCardDialog_Delete() {
        document.CallsWidget.CallDelete(parseInt($("#callCardPopup").find('#CallCard-Id').val()));
        $("#callsWidget").popup("close");
    }
    this.ShowCallCard = function (call) {
        $('#callsWidget').popup('show');

        var dlg = $("#callCardPopup");
        if (dlg.length == 0) { return;}
        
        if (call == undefined) {
            dlg.find('#callCard-title').text("Регистрация нового звонка");
            call = newcall();
        } else {
            dlg.find('#callCard-title').text("Звонок " + DateToHD(call.Date) + " от " + call.Person);
        }        
        // http://dhtmlx.com/docs/products/dhtmlxCalendar/samples/04_other/09_minutes_interval.html
        dlg.find('#CallCard-Id').val(call.Id);
        dlg.find('#CallCard-Date').val(DateToDH(call.Date));
        dlg.find('#CallCard-Hour').val(call.Date.getHours());
        dlg.find('#CallCard-Min').val(call.Date.getMinutes());
        dlg.find('#CallCard-Office').switcher('value', call.Office);
        dlg.find('#CallCard-Phone').val(call.Phone);
        dlg.find('#CallCard-Person').val(call.Person);
        dlg.find('#CallCard-Status').switcher('value', call.Status);
        dlg.find('#CallCard-Purpose').val(call.Purpose);
        dlg.find('#CallCard-Result').val(call.Result);
        dlg.find('#CallCard-Comment').val(call.Comment);

        //var dialog = $("#callCard").dialog({
        //    //call:call,
        //    dialogClass: "call-widget-card popup-dialog",
        //    title: "",
        //    zIndex: 10000,
        //    autoOpen: false,
        //    modal: true,
        //    width: 500,
        //    height:350,
        //    resizable: false,
        //    close: function () {         },
        //    open: function () {          }
        //});
        //dialog.dialog("open");
    };

    function getCallDecisionDialog() {
        var dlg = $("#callDecisionTemplate").clone();
        dlg.attr('id', null);
        dlg.find(".c-callDecision-Connect").click(callDecisionDialog_Connect);
        dlg.find(".c-callDecision-SetAside").click(callDecisionDialog_SetAside);
        dlg.find(".c-callDecision-NotConnect").click(callDecisionDialog_NotConnect);
        dlg.find(".c-callDecisionResultValue").click(callDecisionDialog_Close);
        return dlg;
    }

    function callDecisionDialog_Connect(e) {
        var sender = $(e.target).parents('.c-callDecision');
        var id = parseInt(sender.find('.c-CallDescription-Id').val());
        _callStatusUpdated(id, 1);
        document.CallsWidget.CallDecision(id, 1);
        closeDecisionDialog(sender);
    }
    function callDecisionDialog_SetAside(e) {
        var sender = $(e.target).parents('.c-callDecision');
        var id = parseInt(sender.find('.c-CallDescription-Id').val());
        document.CallsWidget.CallDecision(id, 4);
        closeDecisionDialog(sender);
    }
    function callDecisionDialog_NotConnect(e) {
        var sender = $(e.target).parents('.c-callDecision');
        var id = parseInt(sender.find('.c-CallDescription-Id').val());
        document.CallsWidget.CallDecision(id, 3);
        closeDecisionDialog(sender);
    }
    function callDecisionDialog_Close() {
        closeDecisionDialog(sender);
    }

    function closeDecisionDialog(element) {
        element.dialog("destroy").remove();
        arrangeDialogsOnRemove();
    }

    function _needDecision(call) {
        var dlg = getCallDecisionDialog();

        if (call == undefined) { return;}
        
        dlg.find('.c-CallDescription-Id').val(call.Id);
        dlg.find('.c-callDescription_time').text("Входящий звонок " + DateToDH(call.Date))
        dlg.find('.c-callDescription_person').text(call.Person);
        dlg.find('.c-callDescription_purpose').text(call.Purpose);

        dlg.dialog({
            call:call,
            dialogClass: "call-widget-decision",
            title: "Решение",
            zIndex: 10000,
            autoOpen: false,
            modal: true,
            width: 510,  height:220,
            resizable: false,
            close: function () {   },
            open: function () {
                $(this).find('.btnDecision').css('display', '');
                $(this).find('.callDecisionResult').css('display', 'none');
            }
        });
        dlg.dialog("open");
        arrangeDialogsOnAdd();
    };
    function _callDecision(callid, newStatus, call) {
        //alert("Принято решение " + CallStatus[newstatus].title);
        debugger
        var dlg = getCallDecisionDialog();

        dlg.find('.c-CallDescription-Id').val(call.Id);
        dlg.find('.c-callDescription_time').text("Входящий звонок " + DateToHD(call.Date))
        dlg.find('.c-callDescription_person').text(call.Person);
        dlg.find('.c-callDescription_purpose').text(call.Purpose);
        dlg.find('.btnDecision').css('display', 'none');
        dlg.find('.callDecisionResult').css('display', '');
        dlg.find('.c-callDecisionResultValue').attr('class', 'callDecisionResultValue' + newStatus);

        var dialog = $("#callDecision").dialog({
            call: call,
            dialogClass: "call-widget-decision",
            title: "Решение",
            zIndex: 10000,
            autoOpen: false,
            modal: true,
            width: 510, height: 220,
            resizable: false,
            close: function () { },
            open: function () {
            }
        });
        dialog.dialog("open");
        arrangeDialogsOnAdd();
    }

    function arrangeDialogsOnAdd() {
        var dialogs = $('.c-callDecision:not(#callDecisionTemplate)');
        dialogs.each(function (index, item) {
            if (index == dialogs.length - 1) {
                return;
            }
            $(item).parents('.ui-dialog').animate({
                top: '-=20',
                left: '-=20',
                speed: 500
            });
        });
    }

    function arrangeDialogsOnRemove() {
        var dialogs = $('.c-callDecision:not(#callDecisionTemplate)');
        dialogs.each(function (index, item) {
            $(item).parents('.ui-dialog').animate({
                top: '+=20',
                left: '+=20',
                speed: 500
            });
        });
    }

    this.GetCall = function (callid, callback) {
        var c;
        $.connection.callsHub.server.getCall(callid)
        .done(function(call){
            if(callback){
                callback(call);
            }else{
                c=call;    
            }            
        })
        .fail();
        if(callback==undefined){ // Тут бы нам дождаться ответа асинхронного
            for (var i = 0; i < 10 || c==undefined; i++) {
                //window.setTimeout(function(){},)
                //window.slee
            }

        }
        return c;
    }
    this.CallAdd = function (call, done) {
        $.connection.callsHub.server.callAdd(call, user.Name)
        .done(function (callid) {
            call.Id = callid;
            if (done) {    done(call);  }            
        })
        .fail(function (e) {
            console.log("CallsHub...callAdd error=>" + e);
        });
    };
    this.CallUpdate = function (call, done) {
        $.connection.callsHub.server.callSave(call, user.Name)
        .done(function (callid) {
            call.Id = callid;
            if (done) { done(call); }
        })
        .fail(function (e) {
            console.log("CallsHub...callAdd error=>" + e);
        });
    };
    this.CallDecision = function (callid, status) {
        $.connection.callsHub.server.callDecision(callid, status, user.Name)
        .done(function () {
            // Обновить везде статусы
        }).fail(function () {
            console.log("CallsHub...callDecision error=>" + e);
        });
    }
    this.CallDelete = function (callid) {
        $.connection.callsHub.server.callDelete(callid)
        .done(function () {
            // Удалять будем по сигналу от сервера
        })
        .fail(function (e) { console.log("deleteCall Error =>" + e) });
    }    

    function _callStatusUpdated(callid, newStatus, call) {
        if (call == undefined) {
            $('[data-call=' + callid + ']').each(function (i) {
                if (this.call != undefined) {
                    this.call.Status = newStatus;
                    if (this.callUpd != undefined) { this.callUpd(); }
                }
            })
        } else {
            _callUpdated(call);
        }
    }
    function _callAdded(call) {
        PrependCall(RenderCall(call));
        $("#call_" + call.Id).addClass("newcall").click(function () {
            $(this).removeClass('newcall');
        });
        if (user.Login == "head" && call.Status == 0) {
            _needDecision(call);
        }
    }

    function _callUpdated(call) {
        // Глобально ищем все элмменты имеющие такой код и пытаемся вызвать у них функцию обновления
        $('[data-call='+call.Id+']').each(function (i) {
            if (this.callUpd != undefined) {
                this.callUpd(call);
            }
        })
    }

    function _callDeleted(callid) {
        // Дергаем всех, что удалился элемент.
        $("#call_" + callid).each(function (i) {
            this.call = null;
            $(this).remove();
        })
    }

    // Инициализация и начальная загрузка
    this.Init = function () {
        this.LoadLastCalls(ShowCalls);

        $(window).on('callAdded', function (e, prm) {
            ProcessCall(prm.call);
            _callAdded(prm.call);
        });

        $(window).on('callUpdated', function (e, prm) {
            ProcessCall(prm.call);
            _callUpdated(prm.call);
        });

        $(window).on('callNeedDecision', function (e, prm) {
            ProcessCall(prm.call);
            _needDecision(prm.call);
        });
        $(window).on('hasCallDecision', function (e, prm) {
            ProcessCall(prm.call);
            _callStatusUpdated(prm.callid, prm.newStatus, prm.call);
            _callDecision(prm.callid, prm.newStatus, prm.call);
        });
        $(window).on('callDeleted', function (e, prm) {
            _callDeleted(prm.callid);
        });

    }
    return this;
}