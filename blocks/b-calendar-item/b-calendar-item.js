BEM.DOM.decl('b-calendar-item', {
    onSetMod: {
        js:  function(){
                var eventBlocks = this.findBlocksInside('b-calendar-item__event');
                //BEM.blocks['b-calendar-item__event'].on(this.domElem, 'click', this.onDocumentClick, this);
                BEM.blocks['b-calendar-item__event'].on(this.domElem, 'eventChange', this._onChange, this)
                BEM.blocks['b-calendar-item__event'].on(this.domElem, 'rebuild', this._reBuild, this)
                BEM.DOM.init(this.domElem);
         }

    },

    _onChange: function(){
        this.trigger('itemChange');
    },

    _reBuild: function(){
        this.trigger('rebuild');
    },

    save: function(){
        var item = {};
        item.events = [];
        var data;
        item.date = this.domElem.data('date');
        this.findBlocksInside('b-calendar-item__event').map(function(event){
            data = event.save();
            data ? item.events.push(event.save()):false;
        });
        if(item.events.length == 0){
            this.destruct();
        }
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
                this.findBlockInside('b-calendar-item__cross').bindTo('click', function(e){
                                                                                    e.stopImmediatePropagation();
                                                                                    this.trigger('delete');
                                                                                });

                BEM.blocks['b-calendar-item__pencil'].on(this.domElem, 'edit', this._edit, this);
                this.findBlockInside('b-calendar-item__pencil').bindTo('click', function(e){
                                                                                    e.stopImmediatePropagation();
                                                                                    this.trigger('edit');
                                                                                });
                BEM.DOM.init(this.domElem);
            }
        },

        _build: function(data){
            this.trigger('eventChange');
            this.trigger('rebuild');
        },

        _delete: function(e){
            this.domElem.data('event', '');
            this.trigger('eventChange');
            this.destruct();
        },

        _onClick: function(e) {
            var page = this.findBlockOutside('b-page'),
                data = this.domElem.data('event');
                content = BEMHTML.apply({
                            block: 'b-popup',
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
                                            content: data.theme
                                        },
                                        {
                                            elem: 'content',
                                            photoUrl: data.photoUrl || "",
                                            presentationUrl: data.presentation || "",
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
                            ]
                        });
            BEM.DOM.append(page.domElem,content);
        },

        _edit: function() {
             var page = this.findBlockOutside('b-page'),
                data = this.domElem.data('event');
                content = BEMHTML.apply({
                            block: 'b-popup',
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
                                            content: "Редактирование"
                                        },
                                        {
                                            elem: 'form',
                                            tag: 'form',
                                            mix: [{'elem': 'content'}],
                                            content: [
                                                {
                                                    elem: 'input',
                                                    name: 'speaker',
                                                    content: "Докладчик",
                                                    value: data.speaker
                                                },
                                                {
                                                    elem: 'input',
                                                    name: 'theme',
                                                    content: "Тема",
                                                    value: data.theme
                                                },
                                                {
                                                    elem: 'input',
                                                    name: 'photoUrl',
                                                    content: "Фото докладчика",
                                                    value: data.photoUrl
                                                },
                                                {
                                                    elem: 'input',
                                                    name: 'time',
                                                    content: "Время",
                                                    value: data.time
                                                },
                                                {
                                                    elem: 'input',
                                                    name: 'thesis',
                                                    content: "Тезисы",
                                                    value: data.thesis
                                                },
                                                {
                                                    elem: 'input',
                                                    name: 'presentation',
                                                    content: "Ссылка на презентацию",
                                                    value: data.presentation
                                                },
                                                {
                                                    block: 'b-buttons',
                                                        content: [
                                                            {
                                                                elem: 'calendar-edit-button',
                                                                js: true,
                                                                mix: [{elem: 'button'}],
                                                                content: "Сохранить"
                                                            }
                                                        ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        });
            BEM.DOM.append(page.domElem,content);
            this.findBlockOutside('b-page').findBlockInside('b-buttons__calendar-edit-button').unbindFrom('click');
            this.findBlockOutside('b-page').findBlockInside('b-buttons__calendar-edit-button').bindTo('click', $.proxy(this.itemSave, this));
        },

        itemSave: function() {
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
            this.domElem.data('event', o);
            this.findBlockOutside('b-page').findBlockInside('b-popup').destruct();
            this._build(o);
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

BEM.DOM.decl('b-calendar-item__cross');
BEM.DOM.decl('b-calendar-item__pencil');