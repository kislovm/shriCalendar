    /** @requires BEM */
/** @requires BEM.DOM */



BEM.DOM.decl('b-popup', {

    onSetMod: {

        js: function() {
                this.page = this.findBlockOutside('b-page');
                this.page.setMod('popup', 'yes')
                this.bindTo('click', function(e){this.trigger('click')});
                this.on('click', this._onClick, this);
            }

        },

        _destruct: function() {
            this.page.setMod('popup', 'no');
            this.destruct();
        },

        _onClick: function(e) {
                console.log(e);
                this._destruct();
        }

});
