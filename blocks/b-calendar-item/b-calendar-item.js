
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
                this.bindTo('mouseover', this._mouseIn);
                this.bindTo('mouseout', this._mouseOut);
                BEM.blocks['b-calendar-item__cross'].on(this.domElem, 'delete', this._delete, this);
                BEM.DOM.init(this.domElem);
            }
        },

        _delete: function(e){
            console.log('delete');
        },

        _onClick: function(e) {
            var page = this.findBlockOutside('b-page'),
                data = this.domElem.data('event');
                content = BEMHTML.apply({
                            block: 'b-popup',
                            js: true,
                            content: {
                                elem: 'window',
                                content: [
                                    {
                                        elem: 'title',
                                        content: data.theme
                                    },
                                    {
                                        elem: 'content',
                                        photoUrl: data.photoUrl || "",
                                        content: [
                                            {
                                                elem: 'reporter', //some incostency in names
                                                content: "Докладчик: " + (data.speaker || "Не указан")
                                            },
                                            {
                                                block: 'b-text',
                                                content: "Дата: " + (data.date || "Не указана")
                                            },
                                            {
                                                block: 'b-text',
                                                content: "Время: " + (data.time || "Не указано")
                                            },
                                            {
                                                block: 'b-text',
                                                content: "Тезисы: " + (data.thesis || "Не указаны")
                                            }
                                        ]
                                    }
                                ]
                            }
                        });
            BEM.DOM.append(page.domElem,content);
        },

        _mouseIn: function() {
            this.setMod('hover', 'yes');
        },

        _mouseOut: function() {
            this.setMod('hover', 'no');
        },

        save: function() {
            return this.domElem.data('event');
        }
    }
);

BEM.DOM.decl('b-calendar-item__cross',{
    onSetMod : {
        js : function(){
            this.bindTo('click', function(e){this.trigger('delete')});
            BEM.DOM.init(this.domElem);
        }
    }

});