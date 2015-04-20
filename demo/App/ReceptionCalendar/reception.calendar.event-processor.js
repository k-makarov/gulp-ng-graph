/**
 * Модуль обработки мероприятий, пришедших с сервера и адаптации их к календарю
 * @author k.makarov
 */
(function (angular, _, moment) {

    /**
     * начало отсчета времени в календаре в режиме "день"
     * @type {Number}
     */
    var WORKING_TIME_BEGIN_HOUR = 0;

    /**
     * конец отсчета времени в календаре в режиме "день"
     * @type {Number}
     */
    var WORKING_TIME_END_HOUR = 23;

    /**
     * минимальное количество мероприятий, отображаемое за один день в режиме "неделя"
     * @type {Number}
     */
    var MIN_EVENTS_COUNT_IN_WEEK_DAY = 4;

    /**
     * значение времени начала\конца для т.н. "мероприятий без времени"
     * @type {String}
     */
    var NO_TIME_EVENT = '00:00';

    /**
     * что выводить вместо времени у т.н. "мероприятий без времени"
     * @type {String}
     */
    var NO_TIME_EVENT_OUT = '???';

    /**
     * @classdesc процессор для обработки мероприятий, пришедших с сервера
     * @class
     */
    var Processor = (function() {
        function Processor() {}

        /**
         * рабочее время в календаре
         * @type {Array}
         */
        var workingHours = _.range(WORKING_TIME_BEGIN_HOUR, WORKING_TIME_END_HOUR + 1);
        
        /**
         * обработчик для вставки пустых мероприятий в незанятые часы
         * нужен для вывода в календаре свободного времени
         * @param {Array} events обрабатываемые мероприятия
         */
        var getFreeTimeHours = function (events) {
            var freeHours = workingHours;
            _.each(events, function (event) {
                var eventRange = _.range(parseInt(event.StartTimeLocalHour),
                    parseInt(moment.utc(event.EndTime, moment.ISO_8601).format('mm')) ? parseInt(event.EndTimeLocalHour) + 1 : parseInt(event.EndTimeLocalHour));
                freeHours = _.filter(freeHours, function (hour) {
                    return !_.find(eventRange, function (eventHour) {
                        return eventHour === hour;
                    });
                });
            });
            _.each(freeHours, function(hour) {
                hour = hour.toString();
                hour = hour.length === 1 ? '0' + hour : hour;
                events.unshift({
                    StartTimeLocal: hour + ':00',
                    StartTimeLocalHour: hour + '',
                    isEmpty: true,
                });
            });
        };

        /**
         * группирует мероприятия по дням недели для календаря в режиме "неделя"
         * @param  {Array} events       обрабатываемые мероприятия
         * @param  {Object} currentWeek объект с описанием текущей недели (нужен для обработки мероприятий для режима "неделя")
         * @return {Array}              обработанные мероприятия
         */
        var groupEventsByWeekDay = function (events, currentWeek) {
            var day = currentWeek.moment.startOf('isoweek');
            var weekDays = {
                'Понедельник': 'Пн',
                'Вторник': 'Вт',
                'Среда': 'Ср',
                'Четверг': 'Чт',
                'Пятница': 'Пт',
                'Суббота': 'Сб',
                'Воскресенье': 'Вс',
            };
            var groupedEvents = [];
            _.each(weekDays, function (weekDay, key) {
                var dayEvents = {
                    Title: key,
                    ShortTitle: weekDay,
                    Day: day.format('D'),
                    Month: day.format('MMMM'),
                    Events: [],
                };
                var dayStart = day.format('YYYY-MM-DD');
                _.each(events, function (event) {
                    var eventStart = moment.utc(event.StartTime, moment.ISO_8601).format('YYYY-MM-DD');
                    if (moment(eventStart).isSame(dayStart, 'day')) {
                        dayEvents.Events.push(event);
                    }
                });
                if (!moment(dayStart).isSame(moment().format('YYYY-MM-DD'), 'day')) {
                    dayEvents.collapsed = true;
                }
                dayEvents.Events = _.sortBy(dayEvents.Events, 'StartTimeLocalHour');
                dayEvents.NotCompletedEventsCount = getNotCompletedEventsCount(dayEvents);
                for (var i = dayEvents.Events.length; i <= MIN_EVENTS_COUNT_IN_WEEK_DAY; i++) {
                    dayEvents.Events.push({});
                }
                day = day.add(1, 'days');
                groupedEvents.push(dayEvents);
            }.bind(this));
            day = day.subtract(1, 'weeks');
            return groupedEvents;
        };

        /**
         * восстанавливает раскрытые\закрытые дни в календаре в режиме "неделя"
         * @param  {Array} events    обрабатываемые мероприятия
         * @param  {Array} oldEvents при перезагрузке эвентов указывается старый массив для того, чтобы правильно расставить раскрытые группы в режиме "неделя"
         * @return {Array}           обработанные мероприятия
         */
        var restoreCollapsedEvents = function (events, oldEvents) {
            _.each(events, function (dayEvents) {
                var oldDayEvents = _.find(oldEvents, function (e) {
                    return e.Title === dayEvents.Title;
                });
                dayEvents.collapsed = oldDayEvents ? oldDayEvents.collapsed : true;
            });
            return events;
        };

        /**
         * получает количество незавершенных элементов в коллекции мероприятий за день
         * @param  {Array} dayEvents коллекция мероприятий за день
         * @return {Int}             
         */
        var getNotCompletedEventsCount = function (dayEvents) {
            var notCompletedEvents = _.filter(dayEvents.Events, function (event) {
                return !event.IsCompleted && event.Id;
            });
            return notCompletedEvents && notCompletedEvents.length ? notCompletedEvents.length : 0;
        };

        /**
         * Обработчик "мероприятий без времени"
         */
        var setNoTimeEventsOutput = (function () {
            var setter = function (event) {
                if (event.StartTimeLocal === NO_TIME_EVENT && event.EndTimeLocal === NO_TIME_EVENT) {
                    event.StartTimeLocal = event.EndTimeLocal = NO_TIME_EVENT_OUT;
                    event.WithoutTime = true;
                }
            };
            /**
             * @param  {Array}  events      обрабатываемые мероприятия
             * @param  {Object} modes       енум с типами мероприятий
             * @param  {String} currentMode текущий режим календаря
             */
            return function (events, modes, currentMode) {
                if (currentMode === modes.Week) {
                    _.each(events, function (day) {
                        _.each(day.Events, function (event) {
                            setter(event);
                        });
                    });
                } else {
                    _.each(events, function (event) { setter(event); });
                }
            };
        })();

        /**
         * приводим к локальному времени, получаем описание типа и длительность в часах
         * и тп общие вещи для мероприятий календаря обоих режимов
         * @param {Array} events         обрабатываемые мероприятия
         * @param {Object} activityTypes енум с типами мероприятий
         */
        var setEventsCommonDescription = function(events, activityTypes) {
            _.each(events, function(event) {
                event.StartTimeLocal = moment.utc(event.StartTime, moment.ISO_8601).format('HH:mm');
                event.EndTimeLocal = moment.utc(event.EndTime, moment.ISO_8601).format('HH:mm');
                event.EndTimeLocalHour = moment.utc(event.EndTime, moment.ISO_8601).format('HH');
                event.StartTimeLocalHour = moment.utc(event.StartTime, moment.ISO_8601).format('HH');
                event.DurationInHours = event.EndTimeLocalHour - event.StartTimeLocalHour;
                event.DurationInHourTimes = new Array(event.DurationInHours);
                event.DayMonth = moment.utc(event.StartTime, moment.ISO_8601).format('D MMMM');
                event.DayOfWeek = moment.utc(event.StartTime, moment.ISO_8601).format('dddd');
                var type = activityTypes[event.ActivityType];
                event.ActivityTypeDescription = type ? type.Description : null;
            });
        };

        /**
         * обрабатывает серверные мероприятия для календаря
         * @param  {Array} events         мероприятия, пришедшие с сервера
         * @param  {Object} activityTypes енум с типами мероприятий
         * @param  {String} currentMode   текущий режим календаря
         * @param  {Object} modes         енум режимов календаря
         * @param  {Object} currentWeek   объект с описанием текущей недели (нужен для обработки мероприятий для режима "неделя")
         * @param  {Array} oldEvents      при перезагрузке эвентов указывается старый массив для того, чтобы правильно расставить раскрытые группы в режиме "неделя"
         * @return {Array}                обработанные мероприятия
         */
        Processor.prototype.processEvents = function(events, activityTypes, currentMode, modes, currentWeek, oldEvents) {
            setEventsCommonDescription(events, activityTypes);
            if (currentMode === modes.Day) {
                getFreeTimeHours(events);
            } else {
                events = groupEventsByWeekDay(events, currentWeek);
                if (oldEvents) {
                    events = restoreCollapsedEvents(events, oldEvents);
                }
            }
            setNoTimeEventsOutput(events, modes, currentMode);
            return events;
        };

        /**
         * статический метод-фабрика для сервиса ангуляра
         * @return {Processor} 
         */
        Processor.ProcessorFactory = function() {
            return new Processor();
        };

        return Processor;
    })();

    angular.module('reception.calendar').service('reception.calendar.event-processor', Processor.ProcessorFactory);
})(angular, _, moment);