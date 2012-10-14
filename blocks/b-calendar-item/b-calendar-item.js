({
    mustDeps: [
        { 
            block: 'b-link',
            mods: {pseudo: 'yes'}
        }
    ]
})

BEM.DOM.decl('b-calendar-item', {
    onSetMod: {
        js:  function(){
                this.bindTo('click', function(e) { this.trigger('click') });
                this.on('click', this.onDocumentClick, this);
         }

    },

    onDocumentClick: function(){
        this.findBlockInside('b-calendar-item__details').toggleMod('hidden', 'yes', 'no');
    }
});