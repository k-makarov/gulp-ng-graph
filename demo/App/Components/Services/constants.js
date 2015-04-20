(function () {
    'use strict';

    angular.module('constants', []).constant('constants', {
        TASK_STATUSES: {
            'InProcess': {
                Code: 1,
                Order: 2,
                Title: 'В работе',
                StatusClass: 'in-progress glyphicon-time'
            },
            'Completed': {
                Code: 2,
                Order: 0,
                Title: 'Выполнено',
                StatusClass: 'completed glyphicon-ok'
            },
            'Failed': {
                Code: 3,
                Order: 4,
                Title: 'Не выполнено',
                StatusClass: 'not-completed glyphicon-minus-sign'
            },
            'Hot': {
                Code: 4,
                Order: 3,
                Title: 'Горящее',
                StatusClass: 'hot glyphicon-time'
            },
            'Formal': {
                Code: 5,
                Order: 1,
                Title: 'Выполнено формально',
                StatusClass: 'formal glyphicon-ok'
            },
        },

        TASK_STATUS_CSS_CLASSES: {
            1: { cssClass: 'work', title: 'В работе' },
            2: { cssClass: 'done', title: 'Выполнено' },
            3: { cssClass: 'failed', title: 'Не выполнено' },
            4: { cssClass: 'hot', title: 'Горящее' },
            5: { cssClass: 'formal', title: 'Выполнено формально' }
        },
        
        ACTIVITY_TYPES: {
            0: {
                Code: 0,
                Description: 'С участием В.Путина',
                Color: 'event-type-red',
                Order: 0,
            },
            1: {
                Code: 1,
                Description: 'С участием Д.Медведева',
                Color: 'event-type-green',
                Order: 1,
            },
            2: {
                Code: 2,
                Description: 'Рабочая поездка',
                Color: 'event-type-blue',
                Order: 3,
            },
            3: {
                Code: 3,
                Description: 'С участием С.Иванова',
                Color: 'event-type-yellow',
                Order: 2,
            },
            4: {
                Code: 4,
                Description: 'Брифинг/интервью/прочее',
                Color: 'event-type-purple',
                Order: 4,
            }
        },
    });

})();