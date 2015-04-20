'use strict';

Date.prototype.YYYYMMDD = function () {
    var dd = this.getDate(); if (dd < 10) dd = '0' + dd;
    var mm = this.getMonth() + 1; if (mm < 10) mm = '0' + mm;
    var yyyy = this.getFullYear();
    return ("" + yyyy + "-" + mm + "-" + dd);
};
Date.prototype.toISO = function () {
    var dd = this.getDate(); if (dd < 10) dd = '0' + dd;
    var MM = this.getMonth() + 1; if (MM < 10) MM = '0' + MM;
    var yyyy = this.getFullYear();
    var hh = this.getHours(); if (hh < 10) hh = '0' + hh;
    var mm = this.getMinutes(); if (mm < 10) mm = '0' + mm;
    var ss = this.getSeconds(); if (ss < 10) ss = '0' + ss;
    return ("" + yyyy + "-" + MM + "-" + dd + "T" + hh + ":" + mm + ":" + ss);
};
Date.prototype.fromISO = function (date) { //function DateFromISO(date) {
    if (date == undefined) { return date;}
    var timestamp, struct, minutesOffset = 0;
    //              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
    if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(date))) {
        timestamp = new Date(struct[1], struct[2]-1, struct[3], struct[4], struct[5], struct[6]);
    }else {
        timestamp = origParse ? origParse(date) : NaN;
    }
    return timestamp;
};

function ActivitySheduler(scheduler_here, InitDate, mode, core) {

    //scheduler.config.server_utc = true;

    scheduler.config.xml_date = "%Y-%m-%d %H:%i";
    scheduler.config.multi_day = true;
    scheduler.config.mark_now = true;
    scheduler.config.max_month_events = 5;
    scheduler.config.resize_month_events = true;

    scheduler.config.details_on_dblclick = true;
    scheduler.config.details_on_create = true;
    scheduler.config.full_day = true;

    scheduler.config.first_hour = 0;
    scheduler.config.last_hour = 24;
    scheduler.config.limit_time_select = false;

    scheduler.setLoadMode("week");
    scheduler.config.show_loading = true;
    scheduler.config.event_duration = 60;
    scheduler.config.auto_end_date = true;

    scheduler.config.container_autoresize = false;
    scheduler.config.month_day_min_height = 100;
    scheduler.config.drag_create = false;
    scheduler.config.select = false;

    //scheduler.templates.hour_scale = function (date) {   return scheduler.date.date_to_str(scheduler.config.hour_date)(date); };
    // ext/dhtmlxscheduler_container_autoresize.js

    scheduler.config.cascade_event_display = true; // enable rendering, default value = false
    scheduler.config.cascade_event_count = 4; // how many events events will be displayed in cascade style (max), default value = 4
    scheduler.config.cascade_event_margin = 10; // margin between events, default value = 30

    scheduler.locale.labels.grid_tab = "Списком";
    scheduler.locale.labels["icon_cancel"] = "Закрыть";

    scheduler.xy.min_event_height = 30; // 30 minutes is the shortest duration to be displayed as is
    //scheduler.xy.bar_height = 40;
    //scheduler.templates.lightbox_header = function (start, end, event) { return "Details for " + event.text; }
    
    scheduler.ActivityTypes = [
        { key: 0, label: 'с участием В.Путина' },
        { key: 1, label: 'с участием Д.Медведева' },
        { key: 2, label: 'Рабочая поездка' },
        { key: 3, label: 'С участием С.Иванова' },
        { key: 4, label: 'Брифинг/ интервью' },
        { key: 5, label: 'День рождения' }
    ];
    var toDay=new Date();
    scheduler.ActivityFilter = {
        from: new Date(toDay.getFullYear(), toDay.getMonth() - 1, toDay.getDate()),
        to:new Date(),
        text: "",
        activityTypes: [0, 1, 2, 3, 4, 5],
        importantOnly: false,
        toDay:new Date()
    }

    scheduler.templates.event_class = function (start, end, event) {
        var css = "event ";
        if (event.IsImportant) {
            css += " event_i";
        } else {
            css += " event_" + event.ActivityType;
        } 

        if (event.id == scheduler.getState().select_id) {  css += " selected";  }
        return css; 
    };    
    // http://docs.dhtmlx.com/scheduler/mini_calendar_templates.html
    // http://docs.dhtmlx.com/scheduler/custom_lightbox_editor.html

    scheduler.form_blocks["ActivityTypeEditor"] = {
        render: function (sns) {
            //var s = '<div id="ActivityTypeSelector" class="activityTypeSelector dhx_cal_ltext dhx_cal_radio">';
            var s = '<div id="ActivityTypesSelector" class="activityTypesSelector dhx_cal_ltext">';
            for (var i = 0; i < scheduler.ActivityTypes.length; i++) {
                var at = scheduler.ActivityTypes[i];
                //s += '<div class="ActivityTypeDiv ActivityType' + at.key + '" onclick="ActivityTypeDivClick(' +at.key + ')">' +
                s += '<div class="ActivityTypeDiv ActivityType' + at.key + '">' +
                    '<input id="ActivityType' + at.key + '" value="' + at.key + '" name="Тип события" class="activityType_radio"  type="radio" />' +
                    '<label for="ActivityType' + at.key + '"><span class="btnRound" ></span><span>' + at.label + '</span></label>' +
                    '</div>';
            }
            s += '</div>';

            return s;
        },
        set_value: function (node, value, ev) {
            if (ev.ActivityType == undefined) {
                ev.ActivityType = 0;
            }
            var n = document.getElementById("ActivityType" + ev.ActivityType);
            if (n != null && n != undefined) {
                n.checked = true;
            }
        },
        get_value: function (node, ev) {
            var at, n;
            for (var i = 0; i < scheduler.ActivityTypes.length; i++) {
                at = scheduler.ActivityTypes[i];
                n = document.getElementById("ActivityType" + at.key);
                if (n != null && n != undefined) {
                   if (n.checked) { ev.ActivityType = at.key; }
                }
            }
            return ev.ActivityType;
        },
        focus: function (node) {     }
    };

    // scheduler.Participants Диало выбора Участников
    scheduler.Participants = { }
    
    scheduler.Participants.SetSelected = function () {
        // Установка выбранных
        $('#ParticipantsList').find('input[type="checkbox"]:checked').each(function () {
            var p = {};
            p.Id = $(this).data('id');
            p.Name = $(this).data('name');
            scheduler.lb_participant_add(p);
            this.checked = false;
        });
        return;
    }

    scheduler.Participants.Render= function (ps, page) {
        var plist = $('#ParticipantsList');
        var htm = '';
        var p;
        for (var i = 0; i < ps.length; i++) {
            p = ps[i];
            htm += "<tr>" +
                "<td>"+
                    "<input type='checkbox' data-id='" + p.Id + "' data-name='" + p.Name + "'>" +
                "</td>" +
                "<td>" + "<img width='75' height='75' src='" + GlobalContext.getUrl("Content/Images/noimage_75_75.png") + "'/>" + "</td>" +
                "<td>" +"<p class='name'>" + p.Name + "</p>" +
                        "<p class='position'>" + (p.Description == null ? "" : p.Description) + "</p>" +
                        "<p class='contacts'>Тел. " + (p.TelephoneNumber == null ? "(не задан)" : p.TelephoneNumber) + "; E-mail " + (p.Email == null ? "(не задан)" : p.Email) + "</p>" +
                "</td>" +
            "</tr>";

        }
        plist.html(htm);
        var pgs = '<tr><td>'
        for (var i = 1; i < 9; i++) {
            pgs += "<a " + (i == page ? "class='current'" : "") + " href='javascript:scheduler.Participants.Search(" + i + ");' data-id='" + i + "'> " + i + "</a>";
        }
        pgs += "</td></tr>";
        $('#ParticipantsPaginator').html(pgs);
    }

    scheduler.Participants.Search = function (page) {
        var  text=$('#searchParticipantsText').val();

        $.get(GlobalContext.getUrl("api/dic/participants/ByFilter"), { text: text, page: page, pageSize: 5 }, function (data) {
            scheduler.Participants.Render(data.Data, page);
        }, "json")
        .done(function () { })
        .fail(function () {
            console.log("fail");
        })
        .always(function () {
        });

    }

    scheduler.Participants.Show = function () {
        var head = "<div id='searchParticipants' class='filter'>" +
                    "<input id='searchParticipantsText' name='searchParticipants' type='text' placeholder='ПОИСК'>" +
                    "<span id='btnSearchParticipants' class='search-task-icon' onclick='scheduler.Participants.Search(1)'></span>" +
                "</div>";
        var body = "<div id='ParticipantsListDiv'><table id='ParticipantsList' class='ParticipantsList'></table></div>";
        var paging = "<table id='ParticipantsPaginator' class='paginator' data-curpage='0'></table>";
        var button = "<span class='btn_1'><span><input class='participants-save' type='button' value='Сохранить'></span></span>" +
                    "<a class='btn_2' href='javascript:void(0);'><span class='participants-cancel'>Отмена</span></a>";

        $("#participants_sel").html(head + body + paging);
        
        var dialog = $("#participants_sel").dialog({
            dialogClass:"participants",
            title: "Участники",
            zIndex: 100000,
            autoOpen: false,
            modal: true,
            width: 360,
            resizable: false,
            close: function () {   $("#participants_sel").empty();},
            buttons: {
                "Выбрать": function () { scheduler.Participants.SetSelected(); },
                "Закрыть": function () { $(this).dialog("close"); }
            },
            open: function(){        
            }
        });
        scheduler.Participants.Search(1);
        dialog.dialog("open");
    }

    scheduler.lb_participant_del = function (id) {
        $('#lb_participant_' + id).remove();
    }
    scheduler.lb_participant_add = function (p) {
        if ($('#lb_participants').find('div[data-id=' + p.Id + ']').length > 0) {   return;  }
        var s= "<div id='lb_participant_" + p.Id + "' class='lb_participant' data-id='" + p.Id + "'>" + p.Name
            + " <a href='javascript:scheduler.lb_participant_del(" + p.Id + ")'>"
            + "<img src='" + GlobalContext.getUrl('Content/Images/delete_icon.png') + "'/>"
            + "</a></div>";
        $('#lb_participants').prepend(s);
    }

    scheduler.form_blocks["Participants"] = {
        render: function (sns) {
            var s = "<div id='lb_participants' class='lb_participants'>" +
                "&nbsp;&nbsp;<a class='participant-link' href='javascript:scheduler.Participants.Show();'>Добавить</a>" +
                "</div><div id='participants_sel' class='participants_sel' style='display:none'></div> ";
            return s;
        },
        set_value: function (node, value, ev) {
            if (value == undefined || value == null) { return; }
            var p;
            $(node).find('.lb_participant').remove();
            for (var i = 0; i < value.length; i++) { // Id Name
                p = value[i];
                scheduler.lb_participant_add(p);
            }
        },
        get_value: function (node, ev) {
            ev.Participants = [];
            $(node).find('.lb_participant').each(function (i, el) {
                var p = {};
                p.Id = $(el).data('id');
                p.Name = $(el).text();
                ev.Participants.push(p);
            });
            return ev.Participants;
        },
        focus: function (node) { }
    }

    // http://dhtmlx.com/docs/products/dhtmlxVault/
    scheduler.Files = {  }
    scheduler.Files.Show = function () {
    }
    scheduler.lb_file_del = function (id) {
        $('#lb_file_' + id).remove();
    }
    scheduler.lb_file_add = function (f) {
        if ($('#lb_files').find('div[data-id=' + f.Id + ']').length > 0) { return; }
        var s = "<div id='lb_file_" + f.Id + "' class='lb_file' data-id='" + f.Id + "'>"
            + "<a href='" + GlobalContext.getUrl("api/file/" + f.Id) + "'><img src='" + GlobalContext.getUrl("Content/Images/doc.png") + "'/></a>"
            + f.Name
            + " <a href='javascript:scheduler.lb_file_del(" + f.Id + ")'>"
            + "<img src='" + GlobalContext.getUrl('Content/Images/delete_icon.png') + "'/>"
            + "</a></div>";
        $('#lb_files').prepend(s);

    }
    scheduler.form_blocks["Files"] ={
        render: function (sns) {
            var s = "<div id='lb_files' class='lb_files'>" +
                "&nbsp;&nbsp;<a class='file-link' href='javascript:scheduler.Files.Show();'>Добавить</a>" +
                "</div>";
            return s;
        },
        set_value: function (node, value, ev) {
            //value = [{ Id: 1092, Name: 'Документ.docx' }, { Id: 1091, Name: 'Договор купли-продажи авто.docx' }];
            if (value == undefined || value == null) { return; }
            var p;
            $(node).find('.lb_file').remove();
            for (var i = 0; i < value.length; i++) { // Id Name
                p = value[i];
                scheduler.lb_file_add(p);
            }
        },
        get_value: function (node, ev) {
            ev.Files = [];
            $(node).find('.lb_file').each(function (i, el) {
                var f = {};
                f.Id = $(el).data('id');
                f.Name = $(el).text();
                ev.Files.push(p);
            });
            return ev.Files;
        },
        focus: function (node) {     }    
    }
    scheduler.templates.calendar_time = scheduler.date.date_to_str("%d.%m.%Y");
    scheduler.config.lightbox.sections = [
        //{ name: "time",        map_to: "auto",         height: 60, type: "time" },
        { name: "time", map_to: "auto", height: 60, type: "calendar_time" },
        { name: "Тип события", map_to: "ActivityType", height: 50, type: "ActivityTypeEditor"},
        { name: "Тема", map_to: "text", height: 40, type: "textarea", focus: true },
        { name: "Подробности", map_to: "Note", height: 43, type: "textarea" },
        { name: "Место", map_to: "Location", height: 50, type: "textarea" },
        { name: "Важное", map_to: "IsImportant", height: 25, type: "checkbox" },
        //{ name: "Черновик", map_to: "IsDraft", height: 25, type: "checkbox" },
        //{ name: "Участники", map_to: "Participants", height: 50, type: "Participants" },        
        { name: "Файлы", map_to: "Files", height: 50, type: "Files" },
        // 	{name:"time", height:72, type:"time", time_format:["%H:%i", "%m", "%d", "%Y"], map_to:"auto"}
    ];

    // Read-only Mode  http://docs.dhtmlx.com/scheduler/readonly.html
    // scheduler.config.readonly = true;

    scheduler.templates.tooltip_text = function (start, end, ev) {
        return ev.text + "<br/><b>Начало:</b> " +
        scheduler.templates.tooltip_date_format(start) +
        "<br/><b>Окончание:</b> " + scheduler.templates.tooltip_date_format(end);
    };
    scheduler.templates.tooltip_date_format = function (date) {
        var formatFunc = scheduler.date.date_to_str("%d.%m.%Y %H:%i");
        return formatFunc(date);
    }

    scheduler.set_hav_h = function () {
        try {
            if (typeof scheduler !== "undefined") {
                if (window.innerWidth < 768) {
                    if (scheduler.skin == "glossy" || scheduler.skin == "classic") {
                        scheduler.xy.nav_height = 81;
                    } else { scheduler.xy.nav_height = 120; }
                } else {
                    scheduler.xy.nav_height = 159;
                }
                return true;
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    //scheduler.attachEvent("onSchedulerResize", set_hav_h);
    //scheduler.attachEvent("onBeforeViewChange", set_hav_h);

    scheduler.ShearchActivity = function (text, activitytypes, importantOnly) {
        if (text == undefined) {
            var o=document.getElementById('searchActivityText');
            if(o!=null){
                scheduler.ActivityFilter.text = o.value;
            }            
        }
        if (importantOnly == undefined) {
            var o = document.getElementById('atype_sel_important');
            if (o != null) {
                importantOnly = o.checked;
            } else {
                importantOnly = false;
            }
        }
        scheduler.ActivityFilter.importantOnly = importantOnly;

        if (activitytypes == undefined) {
            var activitytypes = [];
            var o;
            o = document.getElementById('atype_sel_0');
            if (o != null) {  if (o.checked) { activitytypes.push(0); }}

            o = document.getElementById('atype_sel_1');
            if (o != null) { if (o.checked) { activitytypes.push(1); } }

            o = document.getElementById('atype_sel_2');
            if (o != null) { if (o.checked) { activitytypes.push(2); } }

            o = document.getElementById('atype_sel_3');
            if (o != null) { if (o.checked) { activitytypes.push(3); } }

            o = document.getElementById('atype_sel_4');
            if (o != null) { if (o.checked) { activitytypes.push(4); } }

            o = document.getElementById('atype_sel_5');
            if (o != null) { if (o.checked) { activitytypes.push(5); } }

            scheduler.ActivityFilter.activityTypes = activitytypes;
        }

        var toDay = new Date();

        toDay = scheduler.getState().date;
        if (toDay.getFullYear() < 2000 || toDay.getFullYear() > 2100) {
            toDay = scheduler.ActivityFilter.toDay;
        }

        scheduler.setCurrentView(toDay, scheduler.getState().mode);
    }

    scheduler.addActivity=function(){    
        var ev = {  ActivityType:0 };
        scheduler.addEventNow(ev);
    }

    scheduler.ActivityProcess = function (act) {
        act.id = act.Id;
        act.text = act.Theme;
        act.StartTime = Date.prototype.fromISO(act.StartTime);
        act.EndTime = Date.prototype.fromISO(act.EndTime);
        act.start_date = act.StartTime,
        act.end_date = act.EndTime;
    }

    scheduler.ActivitiesProcess = function (acts) {
        for (var i = 0; i < acts.length; i++) {
            scheduler.ActivityProcess(acts[i]);
        }
        scheduler.clearAll();
        scheduler.parse(acts, "json");
    }

    scheduler.ActivitiesLoad = function () {
        $.get(GlobalContext.getUrl("api/activities/all/"), {
            from: scheduler.ActivityFilter.from.YYYYMMDD(),
            to: scheduler.ActivityFilter.to.YYYYMMDD(),
            types: scheduler.ActivityFilter.activityTypes.join(','),
            importantOnly: scheduler.ActivityFilter.importantOnly,
            word: scheduler.ActivityFilter.text
        }, function (data) {
            scheduler.ActivitiesProcess(data);
        }, "json")
        .done(function () {     })
        .fail(function () {
            console.log("fail");
        })
        .always(function () {
        });
    }

    scheduler.ActivityLoadSync = function (id, afterSuccessLoaded) {
        // http://habrahabr.ru/post/108542/
        try {
            $.ajax({
                url: GlobalContext.getUrl("api/activities/") + id, type: "GET", async: false, dataType: "json",
                success: function (data, textStatus) {
                    scheduler.ActivityProcess(data);
                    afterSuccessLoaded(data);
                },
                error: function (event, request, settings) {
                    result = false; console.log(event);
                }
            });
        } catch (e) {
            result = false; console.log(e);
        }

    }

    scheduler.attachEvent("onBeforeLightbox", function (id) {
        // fires immediately before the user opens the lightbox (edit form)
        // id	string	the event's id
        // Returns  boolean	defines whether the default action of the event will be triggered (true) or canceled (false)

        var res = false;
        var ev = scheduler.getEvent(id);
        if (ev.Id == undefined) { return true; }
        scheduler.ActivityLoadSync(id, function (data) {
            scheduler.setEvent(id, data);
            ev =data;
            res = true;
            });
        //ActivityTypeDivClick(ev.ActivityType);
        return res;
    });

    scheduler.attachEvent("onViewChange", function (new_mode, new_date) {
        var state = scheduler.getState();
        var mode = state.mode;
        if (mode == undefined) { return; }

        if (2000<new_date.getFullYear() && new_date.getFullYear() < 2100) {
            scheduler.ActivityFilter.toDay = new_date;
        }
        if (new_mode == "grid") {
            if (new_date.getFullYear() > 2100) {
                new_date = scheduler.ActivityFilter.to;
            }
            
            scheduler.ActivityFilter.from = new Date(new_date.getFullYear(), new_date.getMonth() - 1, new_date.getDate());
            scheduler.ActivityFilter.to = new Date(new_date.getFullYear(), new_date.getMonth() + 1, new_date.getDate());
            if (scheduler.ActivityFilter.text != "") {
                scheduler.ActivityFilter.from = (new Date(new_date.getFullYear() - 1, new_date.getMonth(), new_date.getDate()));
            }
        }
        if (new_mode != "grid") {
            scheduler.ActivityFilter.from = new Date(state.min_date.getFullYear(), state.min_date.getMonth(), state.min_date.getDate()-1);
            scheduler.ActivityFilter.to   = new Date(state.max_date.getFullYear(), state.max_date.getMonth(), state.max_date.getDate() + 1);
        }
        if (new_mode == "week") {
            $(".dhx_cal_data")[0].scrollTop = $(".dhx_cal_data")[0].scrollHeight *(9/24);
        }
        scheduler.ActivitiesLoad();
        scheduler.callEvent('dateRangeUpdated', [scheduler.ActivityFilter.from, scheduler.ActivityFilter.to]);
        return true;
    });

    scheduler.attachEvent("onEventCreated", function (id, e) {
        // fires when the user starts to create a new event (by double click or dragging)
        // id  string the event's id 
        // e  Event a native event object
        var ev = this.getEvent(id);
        ev.ActivityType = 0;
        return;
    });

    // Асинхронный вызов всегда возвращает true
    scheduler.ActivitySave = function (id, ev, is_new) {
        ev.StartTime = ev.start_date;
        ev.EndTime = ev.end_date;
        ev.Theme = ev.text;
        var a = {
            id: 0, ActivityType: ev.ActivityType,
            Theme: ev.text, Note: ev.Note, Location: ev.Location,
            IsImportant: ev.IsImportant, IsDraft: ev.IsDraft,
            StartTime: ev.start_date.toISO(),
            EndTime: ev.end_date.toISO(),
            Participants: ev.Participants,
            Files: ev.Files
        }
        if (is_new) {
            a.Date = is_new.toISO();
            $.post(GlobalContext.getUrl("api/activities/Create"), a, function (data) {
                scheduler.changeEventId(id, data);
                ev.id = data; ev.Id = data;
            }, "json")
            .done(function () { })
            .fail(function () { console.log("fail"); })
            .always(function () {
            });

        } else {
            a.id = id;
            $.post(GlobalContext.getUrl("api/activities/Update"), a, function (data) { }, "json")
            .done(function () { })
            .fail(function () { console.log("fail"); })
            .always(function () {
            });
        }
        return true;
    }
    // Синхронный вызов, что бы дождаться подтверждения сохранения
    scheduler.ActivitySaveSync = function (id, ev, is_new) {
        var result = true;
        ev.StartTime = ev.start_date;
        ev.EndTime = ev.end_date;
        ev.Theme = ev.text;
        var a = {
            id: 0, ActivityType: ev.ActivityType,
            Theme: ev.text, Note: ev.Note, Location: ev.Location,
            IsImportant: ev.IsImportant, IsDraft: ev.IsDraft,
            StartTime: ev.start_date.toISO(),
            EndTime: ev.end_date.toISO(),
            Participants:ev.Participants,
            Files: ev.Files
        }
        if (is_new) {
            a.Date = is_new.toISO();
            try {
                $.ajax({
                    url: GlobalContext.getUrl("api/activities/Create"), type: "POST", async: false, data: a,
                    success: function (data, textStatus) { result = true; },
                    error: function (event, request, settings) {
                        result = false; console.log(event);
                    }
                });
            } catch (e) {
                result = false; console.log(e);
            }
        } else {
            a.id = id;
            try {
                $.ajax({
                    url: GlobalContext.getUrl("api/activities/Update"), type: "POST", async: false, data: a,
                    success: function (data, textStatus) { result = true; },
                    error: function (event, request, settings) { result = false; console.log(event); }
                });
            } catch (e) {
                result = false; console.log(e);
            }
        }
        return result;
    }

    scheduler.ActivityDelete = function (id) {
        $.post(GlobalContext.getUrl("api/activities/Delete"), { id: id }, function (data) { }, "json")
        .done(function () { })
        .fail(function () { console.log("fail"); })
        .always(function () {
        });
    }

    scheduler.attachEvent("onEventChanged", function (id, ev) {
        // occurs after the user has edited an event and saved the changes (after clicking on the edit and save buttons in the event's bar or in the details window)
        // id  string the event's id 
        // ev  object the event's object 

        var ev = this.getEvent(id);
        scheduler.ActivitySave(id, ev, null)
        return;
    });

    scheduler.attachEvent("onEventDeleted", function (id) {
        // fires after the specified event was deleted (version 3.0+)
        // id  string the event's id 
        this.ActivityDelete(id);
    });

    scheduler.attachEvent("onEventDrag", function (id, mode, e) {
        // fires when the user drags/resizes events in the scheduler
        // id  string the event's id 
        // mode  string the dragging mode: "move","resize" or "new-size" (creating new events) 
        // e  Event a native event object 
        var ev = this.getEvent(id);
        scheduler.ActivitySave(id, ev, null)
    });

    scheduler.attachEvent("onEventSave", function (id, ev, is_new) {
        // fires when the user clicks on the 'save' button in the lightbox (edit form)
        // id  string the event's id 
        // ev  object an intermediate event's object that contains the lightbox's values. 
        // is_new  Date returns the date of event's creation (i.e. the current date), if the user is saving a new event. null - if the event to save already exists 
        // Returns boolean defines whether the default action of the event will be triggered (true) or canceled (false) 
        if (!ev.text) {
            alert("Обязательно заполните Тему");
            return false;
        }
        return scheduler.ActivitySaveSync(id, ev, is_new);
    });

    scheduler.attachEvent("onEventLoading", function (ev) {
        // fires when an event is being loaded from the data source
        // ev  object the event object (the object of a data item) 
        return true;
    });

    scheduler.config.icons_select = ["icon_details", "icon_delete"];

    scheduler.renderEvent = function (container, ev, width, height, header_content, body_content) {
        var container_width = container.style.width; // e.g. "105px"

        // move section
        var html = "<div class='dhx_event_move event_move' style='width: " + container_width + "'></div>";

        // container for event contents
        html += "<div class='event_body'>";
        html += "<span class='event_date'>";
        // two options here: show only start date for short events or start+end for long
        if ((ev.end_date - ev.start_date) / 60000 > 60) { // if event is longer than 40 minutes
            html += scheduler.templates.event_header(ev.start_date, ev.end_date, ev);
            html += "</span><br/>";
        } else {
            html += scheduler.templates.event_date(ev.start_date) + "</span>";
        }
        // displaying event text
        html += "<span>" + scheduler.templates.event_text(ev.start_date, ev.end_date, ev) + "</span>";
        html += "</div>";

        // resize section
        html += "<div class='dhx_event_resize event_resize' style='width: " + container_width + "'></div>";

        container.innerHTML = html;
        return true; // required, true - we've created custom form; false - display default one instead
    };

    // http://docs.dhtmlx.com/scheduler/samples/03_extensions/27_grid_view.html
    // http://docs.dhtmlx.com/scheduler/grid_view.html
    // http://docs.dhtmlx.com/scheduler/grid_view_templates.html
    scheduler.createGridView({
        fields: [{ id: "start_date", label: 'Начало', sort: 'date', align: 'center', width: 150, valign: 'top' },
                 { id: "end_date", label: 'Конец', sort: 'date', align: 'center', width: 150, valign: 'bottom' },
                 { id: "text", label: 'Тема', width: '*', valign: 'middle', sort: 'str' }]
        //, paging: true
        //, unit: "month"
        //, step:1
    });

    scheduler.show_minical = function (){
        if (scheduler.isCalendarVisible())
            scheduler.destroyCalendar();
        else
            scheduler.renderCalendar({
                position: "dhx_minical_icon",
                date: scheduler._date,
                navigation: true,
                handler: function (date, calendar) {
                    scheduler.setCurrentView(date);
                    scheduler.destroyCalendar()
                }
            });
    }

    //--------------------------------------------------------
    this.Init = function () {
        if (core != 'angular') {
            var container = document.getElementById(scheduler_here);
                if (container == undefined) { return; }
                container.innerHTML = ""
                + "<div id='activities_scheduler' class='dhx_cal_container' style='height:600px;'>"
                + "    <div class='dhx_cal_navline'>"
                + "      <div class='dhx_cal_tab' name='day_tab'></div>"
                + "      <div class='dhx_cal_tab' name='week_tab' ></div>"
                + "      <div class='dhx_cal_tab' name='month_tab'></div>"
                //+ "      <div class='dhx_cal_tab' name='year_tab' ></div>"
                + "      <div class='dhx_cal_tab' name='grid_tab'></div>"
                + "      <div class='dhx_minical_icon' id='dhx_minical_icon' onclick='scheduler.show_minical()'>&nbsp;</div>"
                + "      <div class='dhx_cal_date' style='left: 550px; width: 300px;'></div>"
                + "      <div class='dhx_cal_today_button'></div>"
                + "      <div class='dhx_cal_prev_button'>&nbsp;</div>"
                + "      <div class='dhx_cal_next_button'>&nbsp;</div>"
                + "  </div>"
                + "  <div class='dhx_cal_header'></div><div class='dhx_cal_data'></div>"
                + "</div>";
        }
        scheduler.init(scheduler_here, InitDate, mode);
        }
    return this;
}

!function (a, b, c, d) { "use strict"; var e = "prettyCheckable", f = "plugin_" + e, g = { label: "", labelPosition: "right", customClass: "", color: "blue" }, h = function (c) { b.ko && a(c).on("change", function (b) { if (b.preventDefault(), b.originalEvent === d) { var c = a(this).closest(".clearfix"), e = a(c).find("a:first"), f = e.hasClass("checked"); f === !0 ? e.addClass("checked") : e.removeClass("checked") } }), c.find("a:first, label").on("touchstart click", function (c) { c.preventDefault(); var d = a(this).closest(".clearfix"), e = d.find("input"), f = d.find("a:first"); f.hasClass("disabled") !== !0 && ("radio" === e.prop("type") && a('input[name="' + e.attr("name") + '"]').each(function (b, c) { a(c).prop("checked", !1).parent().find("a:first").removeClass("checked") }), b.ko ? ko.utils.triggerEvent(e[0], "click") : e.prop("checked") ? e.prop("checked", !1).change() : e.prop("checked", !0).change(), f.toggleClass("checked")) }), c.find("a:first").on("keyup", function (b) { 32 === b.keyCode && a(this).click() }) }, i = function (b) { this.element = b, this.options = a.extend({}, g) }; i.prototype = { init: function (b) { a.extend(this.options, b); var c = a(this.element); c.parent().addClass("has-pretty-child"), c.css("display", "none"); var e = c.data("type") !== d ? c.data("type") : c.attr("type"), f = null, g = c.attr("id"); if (g !== d) { var i = a("label[for=" + g + "]"); i.length > 0 && (f = i.text(), i.remove()) } "" === this.options.label && (this.options.label = f), f = c.data("label") !== d ? c.data("label") : this.options.label; var j = c.data("labelposition") !== d ? "label" + c.data("labelposition") : "label" + this.options.labelPosition, k = c.data("customclass") !== d ? c.data("customclass") : this.options.customClass, l = c.data("color") !== d ? c.data("color") : this.options.color, m = c.prop("disabled") === !0 ? "disabled" : "", n = ["pretty" + e, j, k, l].join(" "); c.wrap('<div class="clearfix ' + n + '"></div>').parent().html(); var o = [], p = c.prop("checked") ? "checked" : ""; "labelright" === j ? (o.push('<a href="#" class="' + p + " " + m + '"></a>'), o.push('<label for="' + c.attr("id") + '">' + f + "</label>")) : (o.push('<label for="' + c.attr("id") + '">' + f + "</label>"), o.push('<a href="#" class="' + p + " " + m + '"></a>')), c.parent().append(o.join("\n")), h(c.parent()) }, check: function () { "radio" === a(this.element).prop("type") && a('input[name="' + a(this.element).attr("name") + '"]').each(function (b, c) { a(c).prop("checked", !1).attr("checked", !1).parent().find("a:first").removeClass("checked") }), a(this.element).prop("checked", !0).attr("checked", !0).parent().find("a:first").addClass("checked") }, uncheck: function () { a(this.element).prop("checked", !1).attr("checked", !1).parent().find("a:first").removeClass("checked") }, enable: function () { a(this.element).removeAttr("disabled").parent().find("a:first").removeClass("disabled") }, disable: function () { a(this.element).attr("disabled", "disabled").parent().find("a:first").addClass("disabled") }, destroy: function () { var b = a(this.element), c = b.clone(), e = b.attr("id"); if (e !== d) { var f = a("label[for=" + e + "]"); f.length > 0 && f.insertBefore(b.parent()) } c.removeAttr("style").insertAfter(f), b.parent().remove() } }, a.fn[e] = function (b) { var c, d; if (this.data(f) instanceof i || this.data(f, new i(this)), d = this.data(f), d.element = this, "undefined" == typeof b || "object" == typeof b) "function" == typeof d.init && d.init(b); else { if ("string" == typeof b && "function" == typeof d[b]) return c = Array.prototype.slice.call(arguments, 1), d[b].apply(d, c); a.error("Method " + b + " does not exist on jQuery." + e) } } }(jQuery, window, document);