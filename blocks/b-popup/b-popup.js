/** @requires BEM */
/** @requires BEM.DOM */



BEM.DOM.decl('b-popup', {

    onSetMod: {

        js: function() {
                this.bindTo('click', function(e){this.trigger('click')});
                this.on('click', this._onClick, this);
                console.log(this);
            }

        },

        _onClick: function(e) {
                console.log(e);
                this.destruct();
        }

});
