/** @requires BEM */
/** @requires BEM.DOM */

function sorter(a,b){
    return a.date > b.date;
}

String.prototype.isJson = function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }


BEM.DOM.decl('b-calendar', {

    onSetMod: {

        js: function(){
            this._build();
            BEM.blocks['b-calendar-item'].on(this.domElem, 'itemChange', this._onChange, this);
            BEM.blocks['b-buttons'].on(this.domElem, 'load', this._load, this);
            BEM.blocks['b-buttons'].on(this.domElem, 'save', this._save, this);
            BEM.blocks['b-buttons'].on(this.domElem, 'add', this._add, this);
        }

    },

    _build: function(){
        var calendar = localStorage['calendar'],
            content = [],
            that = this;

        if (calendar){
            calendar = JSON.parse(calendar);
            [].sort.call(calendar,sorter);//maybe need sort before saving
            calendar.map(function(day){
                day.date = new Date(day.date);//complicated thing
                var dateString = [day.date.getDate(),day.date.getMonth()+1,day.date.getFullYear()].join('.');
                content.push({
                    block: 'b-calendar-item',
                    js: true,
                    attrs: {'data-date': day.date.getTime()},
                    content: [
                                {
                                    elem: 'date',
                                    js: true,
                                    date: dateString
                                }
                    ].concat(that._buildEvents(day.events))
                });
            });
        }
        content.push({
            block: 'b-buttons',
            js: true,
            content: [
                {
                    elem: 'save-button',
                    js: true,
                    mix: [{elem: 'button'}],
                    content: "Сохранить"
                },
                {
                    elem: 'load-button',
                    mix: [{elem: 'button'}],
                    content: "Выгрузить"
                },
                {
                    elem: 'add-button',
                    mix: [{elem: 'button'}],
                    content: "Добавить"
                }
            ]

        });
        BEM.DOM.update(this.domElem, BEMHTML.apply(content));
        BEM.DOM.init(this.domElem);
    },

    _onChange: function(){
        this.save();
    },


    _buildEvents: function(events){
        content = [];
        events.map(function(event,i){
            content.push({
                elem: 'event',
                js: true,
                attrs: {'data-event': JSON.stringify(event)},
                data: event,
                speaker: event.speaker,
                theme: event.theme,
            });
            content[i].data = event;
        });
        return content;
    },

    getJSON: function(){
        var calendar = [],
            data;
        this.findBlocksInside('b-calendar-item').map(function(item){
            data = item.save();
            data.events.length > 0 ? calendar.push(data): false;
        });
        return calendar;
    },

    _load: function(){
        var json = JSON.stringify(this.getJSON());
        BEM.DOM.append(this.domElem, BEMHTML.apply({
                block : 'b-popup',
                js: true,
                content: [
                    {
                        elem: 'bg'
                    },
                    {
                        elem: 'window',
                        content: [
                            {
                                elem: 'title',
                                content: 'Экспорт календаря'
                            },
                            {
                                block: 'b-text',
                                content: json
                            }
                        ]
                    }
                ]
                
            })
        );
    },

    _save: function(){
        var json = JSON.stringify(this.getJSON());
        BEM.DOM.append(this.domElem, BEMHTML.apply({
                block : 'b-popup',
                js: true,
                content: [
                    {
                        elem: 'bg'
                    },
                    {
                        elem: 'window',
                        content: [
                            {
                                elem: 'title',
                                content: 'Импорт календаря'
                            },
                            {
                                elem: 'textarea',
                                mix: [{'elem': 'content'}],
                                content: json
                            },
                            {
                                block: 'b-buttons',
                                    content: [
                                        {
                                            elem: 'calendar-save-button',
                                            js: true,
                                            mix: [{elem: 'button'}],
                                            content: "Сохранить"
                                        }
                                    ]
                            }
                        ]
                    }
                ]
                
            })
        );
        this.findBlockOutside('b-page').findBlockInside('b-buttons__calendar-save-button').unbindFrom('click');
        this.findBlockOutside('b-page').findBlockInside('b-buttons__calendar-save-button').bindTo('click', $.proxy(this.calendarSave, this));
    },

    _add : function(){
        BEM.DOM.append(this.domElem, BEMHTML.apply({
                block : 'b-popup',
                js: true,
                content: [
                    {
                        elem: 'bg'
                    },
                    {
                        elem: 'window',
                        content: [
                            {
                                elem: 'title',
                                content: 'Добавление лекции'
                            },
                            {
                                elem: 'form',
                                tag: 'form',
                                mix: [{'elem': 'content'}],
                                content: [
                                    {
                                        elem: 'input',
                                        name: 'speaker',
                                        content: "Докладчик"
                                    },
                                    {
                                        elem: 'input',
                                        name: 'theme',
                                        content: "тема"
                                    },
                                    {
                                        elem: 'input',
                                        name: 'photoUrl',
                                        content: "Фото докладчика"
                                    },
                                    {
                                        elem: 'dateInput',
                                        name: 'date',
                                        content: "Дата"
                                    },
                                    {
                                        elem: 'input',
                                        name: 'time',
                                        content: "Время"
                                    },
                                    {
                                        elem: 'input',
                                        name: 'thesis',
                                        content: "Тезисы"
                                    },
                                    {
                                        elem: 'input',
                                        name: 'presentation',
                                        content: "Ссылка на презентацию"
                                    },
                                    
                                ]
                            },
                            {
                                block: 'b-buttons',
                                    content: [
                                        {
                                            elem: 'calendar-add-button',
                                            js: true,
                                            mix: [{elem: 'button'}],
                                            content: "Сохранить"
                                        }
                                    ]
                            }
                        ]
                    }
                ]
                
            })
        );
        this.findBlockOutside('b-page').findBlockInside('b-buttons__calendar-add-button').unbindFrom('click');
        this.findBlockOutside('b-page').findBlockInside('b-buttons__calendar-add-button').bindTo('click', $.proxy(this.add, this));
    },

    add: function(){
        var o = {};
        var a = this.findBlockOutside('b-page').findBlockInside('b-popup__form').domElem.serializeArray();
        $.each(a, function() {
           if (o[this.name]) {
               if (!o[this.name].push) {
                   o[this.name] = [o[this.name]];
               }
               o[this.name].push(this.value || '');
           } else {
               o[this.name] = this.value || '';
           }
        });
        if(o.date == ''){
            alert('Обязательно укажите дату');
            return;
        }
        this.addEventToCalendar(o);
    },

    addEventToCalendar: function(event){
        var i = this.findDateInCaledar(event.date);
        var calendar = JSON.parse(localStorage['calendar']);
        console.log(i);
        if (i != undefined){
            calendar[i].events.push(event);
            console.log(calendar);
        }
        else {
            calendar.push({
                date: event.date,
                events: [
                    event
                ]
            });
        }
        localStorage['calendar'] = JSON.stringify(calendar);
        this._build();
    },

    findDateInCaledar: function(date){ //obviosly calendar must be an object property
        var calendar = JSON.parse(localStorage['calendar']),
            date = new Date(date),
            calendarDate;
        var _date = [date.getDate(), date.getMonth(), date.getFullYear()].join();
         for(var i=0,l=calendar.length;i<l;i++){
            calendarDate = new Date(calendar[i].date);
            calendarDate = [calendarDate.getDate(), calendarDate.getMonth(), calendarDate.getFullYear()].join(); //in case of incorrect date
            if (calendarDate == _date)
                return i;
        };
    },

    calendarSave: function(){
        var calendar = this.findBlockOutside('b-page').findBlockInside('b-popup__textarea').domElem.val();
        if (calendar.isJson());
            localStorage['calendar'] = calendar;
        this._build();
    },

    save: function(){
        localStorage['calendar'] = JSON.stringify(this.getJSON());
    }

});


BEM.DOM.decl('b-buttons',{
    onSetMod: {
        js: function(){
            var loadButton = this.findBlockInside('b-buttons__load-button');
            loadButton.bindTo('click', function(e){this.trigger('click')});
            loadButton.on('click', this._onLoad,this);

            var saveButton = this.findBlockInside('b-buttons__save-button');
            saveButton.bindTo('click', function(e){this.trigger('click')});
            saveButton.on('click', this._onSave, this);
            
            var addButton = this.findBlockInside('b-buttons__add-button');
            addButton.bindTo('click', function(e){this.trigger('click')});
            addButton.on('click', this._onAdd, this);

            BEM.DOM.init(this.domElem);
        }
    },

    _onLoad: function(){
        this.trigger('load');
    },

    _onSave: function(){
        this.trigger('save');
    },

    _onAdd: function(){
        this.trigger('add');
    }


});

