    /** @requires BEM */
/** @requires BEM.DOM */



BEM.DOM.decl('b-popup', {

    onSetMod: {

        js: function() {
                this.page = this.findBlockOutside('b-page');
                this.page.setMod('popup', 'yes')
                this.findBlockInside('b-popup__bg').bindTo('click', function(e){this.trigger('destruct')});
                BEM.blocks['b-popup__bg'].on(this.domElem, 'destruct', this._destruct, this);
            }

        },

        _destruct: function() {
            this.page.setMod('popup', 'no');
            this.destruct();
        },

});
