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
                    a = day.date;
                    content.push({
                        block: 'b-calendar-item',
                        content: [
                                    {
                                        elem: 'date',
                                        js: true,
                                        date: [day.date.getDate(),day.date.getMonth(),day.date.getFullYear()].join('.')
                                    }
                        ].concat(that._buildEvents(day.events))
                    });
                });
            }
            BEM.DOM.update(this.domElem, BEMHTML.apply(content));
            a = this.findBlockInside({ blockName : 'b-calendar-item__event'});
            BEM.DOM.init(this.domElem);
        }

    },

    _buildEvents: function(events){
        content = [];
        events.map(function(event){
            content.push({
                elem: 'event',
                js: true,
                speaker: event.speaker,
                theme: event.theme
            });
        });
        return content;
    }

});


BEM.DOM.decl('b-calendar-item__event', {

    onSetMod : {

        js : function(){

            this.bindTo('click', function(e){this.trigger('click')});
            this.on(this.domElem, 'click', function(e){ console.log(123) }, this)
            BEM.DOM.init(this.domElem);
        }
    }

});