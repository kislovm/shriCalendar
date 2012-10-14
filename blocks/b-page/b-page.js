BEM.DOM.decl('b-page', {
        onSetMod : {
            'js' : function() {
                BEM.DOM.init(this.domElem);
            }
        },

     
        onDocumentClick: function(e){
            BEM.DOM.append(this.domElem, BEMHTML.apply({
                block: 'b-popup',
                js: true,
                content: {

                    elem: 'window',
                    content: [
                        {
                            elem: 'title',
                            content: 'Лекция: история браузеров'
                        },

                        {
                            elem: 'content',
                            photoUrl: 'http://avatars.yandex.net/get-avatar/1631268/d1475c0925815cdad8cbe33244d56097.6305-normal',
                            content: [
                                {
                                    elem: 'reporter',
                                    content: "Докладчик: Вегед"
                                },
                                {
                                    block: 'b-text',
                                    content: "Дата: 2 сентября 2012"
                                },
                                {
                                    block: 'b-text',
                                    content: "Время: 18:00"
                                },
                                {
                                    block: 'b-text',
                                    content: "Тезисы: браузеры развивались долго фывфывыф, все было плохо, теперь все хорошо"
                                }
                            ]
                        }
                    ]
                }
            }
            ));
            BEM.DOM.init(this.domElem);
        },

    });
