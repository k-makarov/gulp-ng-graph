(function (angular, moment) {
    
    var mapper = function () {

        var buildDateTime = function (time, date) {
            return moment.utc(date + time, 'DD.MM.YYYY HH:mm').toDate().toISOString();
        };

        var baseMap = function(event) {
            return {
                Id: event.Id || null,
                Theme: event.Theme || null,
                Note: event.Note || null,
                ActivityType: event.hasOwnProperty('ActivityType') ? event.ActivityType : null,
            };
        };

        this.toActivity = function (event) {
            if (!event) {
                return null;
            }
            return angular.extend({
                StartTime: buildDateTime(event.StartTime, event.Date),
                EndTime: buildDateTime(event.EndTime, event.Date),
            }, baseMap(event));
        };

        this.fromCalendarEvent = function (event) {
            if (!event) {
                return null;
            }
            var today = moment().format('YYYY-MM-DD');
            var isToday = moment(today).isSame(moment(event.StartTime).format('YYYY-MM-DD'), 'day');
            return angular.extend({
                StartTime: event.WithoutTime ? null : event.StartTimeLocal || null,
                EndTime: event.WithoutTime ? null : event.EndTimeLocal || null,
                IsToday: isToday,
                Date: !isToday ? moment(event.StartTime).format('DD.MM.YYYY') : null,
            }, baseMap(event));
        };

    };

    mapper.$inject = [];

    angular.module('reception.event-editor').service('reception.event-editor.mapper', mapper);

})(angular, moment);