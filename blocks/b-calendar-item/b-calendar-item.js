
BEM.DOM.decl('b-calendar-item', {
    onSetMod: {
        js:  function(){
                var eventBlocks = this.findBlocksInside('b-calendar-item__event');
                //BEM.blocks['b-calendar-item__event'].on(this.domElem, 'click', this.onDocumentClick, this);
                BEM.blocks['b-calendar-item__event'].on(this.domElem, 'eventChange', this._onChange, this)
                BEM.DOM.init(this.domElem);
         }

    },

    _onChange: function(){
        this.trigger('itemChange');
    },

    save: function(){
        var item = {};
        item.events = [];
        item.date = this.domElem.data('date');
        this.findBlocksInside('b-calendar-item__event').map(function(event){
            item.events.push(event.save());
        });
        return item;
    }
});


BEM.DOM.decl('b-calendar-item__event', {
        onSetMod: {
            js: function(){
                this.bindTo('click', function(e){this.trigger('click')});
                this.on('click', this._onClick, this);
                BEM.DOM.init(this.domElem);
            }
        },

        _onClick: function(e) {
            var page = this.findBlockOutside('b-page'),
                content = BEMHTML.apply({
                            block: 'b-popup',
                            js: true,
                            content: {
                                elem: 'window',
                                content: [
                                    {
                                        elem: 'title',
                                        content: this.theme
                                    }
                                ]
                            }
                        });
            BEM.DOM.append(page.domElem,content);
        },

        save: function() {
            return this.domElem.data('event');
        }
    }
)