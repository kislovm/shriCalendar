var info = 'nothing';

var block = [
                {
                    block: 'b-link',
                    mods : { pseudo : 'yes', togcolor : 'yes', color: 'green' },
                    url: '#',
                    target: '_blank',
                    title: 'Click me',
                    content : info
                },
                {
                    block: 'b-link',
                    mods : { pseudo : 'yes', togcolor : 'yes', color: 'green' },
                    url: '#',
                    target: '_blank',
                    title: 'Click me',
                    content : info
                },
                {
                    block: 'b-link',
                    mods : { pseudo : 'yes', togcolor : 'yes', color: 'green' },
                    url: '#',
                    target: '_blank',
                    title: 'Click me',
                    content : info
                },
                {
                    block: 'b-link',
                    mods : { pseudo : 'yes', togcolor : 'yes', color: 'green' },
                    url: '#',
                    target: '_blank',
                    title: 'Click me',
                    content : info
                },                                                

]


BEM.DOM.decl('b-page', {
    onSetMod : {
        'js' : function() {
            BEM.DOM.update(this.domElem, BEMHTML.apply(
                block
            ));
            BEM.DOM.init(this.domElem);
        }
    }
});
