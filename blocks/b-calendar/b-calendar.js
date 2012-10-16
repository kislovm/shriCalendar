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
                var dateString = [day.date.getDate(),day.date.getMonth(),day.date.getFullYear()].join('.');
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

    calendarSave: function(e){
        var calendar = this.findBlockOutside('b-page').findBlockInside('b-popup__textarea').domElem.val();
        if (calendar.isJson());
            localStorage['calendar'] = calendar;
        this._build();
    },

    save: function(){
        localStorage['calendar'] = JSON.stringify(this.getJSON());
    }

});


BEM.DOM.decl({block: 'b-buttons', elem: 'load-button'},{
    onSetMod: {
        js: function(){
            loadButton = this.findBlockInside('b-buttons__load-button');
            loadButton.bindTo('click', function(e){this.trigger('click')});
            loadButton.on('click', this._onLoad,this);

            saveButton = this.findBlockInside('b-buttons__save-button');
            saveButton.bindTo('click', function(e){this.trigger('click')});
            saveButton.on('click', this._onSave, this);
            BEM.DOM.init(this.domElem);
        }
    },

    _onLoad: function(){
        this.trigger('load');
    },

    _onSave: function(){
        this.trigger('save');
    }


});

