(function() {
    'use strict';

    angular.module('dictionaries.main').service('$dictionaryBuilder', [function() {
        var dictionaryTypes = {
            Author: 0,
            Responsible: 1,
            Department: 2,
            Curator: 3
        };
        
        var datePattern = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;

        var isDate = function (field, internalName) {
            if (internalName.toLowerCase() === 'birthday') {
                return true;
            }
            if (!field) {
                return false;
            }
            return field.match(datePattern) ? true : false;
        };

        var displayNames = {
            ShortName: 'Краткое наименование',
            FullName: 'Наименование',
            Okogu: 'ОКОГУ',
            Description: 'Описание',
            Email: 'E-mail',
            Name: 'ФИО',
            TelephoneNumber: 'Телефон',
            BirthDay: 'День рождения',
            Day: 'День',
            DayType: 'Тип'
        };

        //недоступны для редактирования
        var disabledFields = ['DayType'];

        var constructFields = function(item) {
            var fields = [];
            for (var key in item) {
                var displayName = displayNames[key];
                if (displayName) {
                    fields.push({
                        InternalName: key,
                        DisplayName: displayName,
                        IsDate: isDate(item[key], key),
                        IsDisabled: _.indexOf(disabledFields, key) >= 0
                    });
                }
            }
            return fields;
        };

        var dictionary = function(options) {
            options = options || {};
            options.data = options.data || [];
            angular.extend(dictionary.prototype, options);
            dictionary.prototype.type = dictionaryTypes[options.typeDescriptor];
            dictionary.prototype.fields = constructFields(options.data[0] || null);
        };

        var dictionaryItem = function(options) {
            options = options || {};
            angular.extend(dictionaryItem.prototype, options);
            dictionaryItem.prototype.type = dictionaryTypes[options.typeDescriptor];
            dictionaryItem.prototype.fields = constructFields(options.data || null);
        };

        return {
            Dictionary: dictionary,
            DictionaryItem: dictionaryItem,
            DictionaryTypes: dictionaryTypes,
        };
    }]);
})();
