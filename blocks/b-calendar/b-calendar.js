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
            BEM.blocks['b-calendar-item'].on(this.domElem, 'itemChange', this._onChange, this);
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
                theme: event.theme
            });
            content[i].data = event;
        });
        return content;
    },


    save: function(){
        var calendar = [];
        this.findBlocksInside('b-calendar-item').map(function(item){
            calendar.push(item.save());
        });
        a = calendar;
        localStorage['calendar'] = JSON.stringify(calendar);
    }

});
