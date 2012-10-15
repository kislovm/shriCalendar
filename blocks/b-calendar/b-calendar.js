/** @requires BEM */
/** @requires BEM.DOM */

function sorter(a,b){
    return a.date > b.date;
}



BEM.DOM.decl('b-calendar', {

    onSetMod : {

        js : function() {

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
            BEM.blocks['b-calendar-item'].on(this.domElem, 'itemChange', this._onChange, this);
            BEM.blocks['b-buttons'].on(this.domElem, 'load', this._save, this);
            BEM.DOM.update(this.domElem, BEMHTML.apply(content));
            BEM.DOM.init(this.domElem);
        }

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
        var calendar = [];
        this.findBlocksInside('b-calendar-item').map(function(item){
            calendar.push(item.save());
        });
        return calendar;
    },

    _save: function(){
        alert(JSON.stringify(this.getJSON()));
    },

    save: function(){
        localStorage['calendar'] = JSON.stringify(this.getJSON());
    }

});


BEM.DOM.decl({block: 'b-buttons', elem: 'load-button'},{
    onSetMod: {
        js: function(){
            this.bindTo('click', function(e){this.trigger('load')});
            BEM.DOM.init(this.domElem);
        }
    }

});

