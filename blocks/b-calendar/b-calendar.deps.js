({
    mustDeps: [
        {
            block: 'b-calendar-item',
            mods: {status: 'clicked'}
        },
        {
            block: 'i-bem',
            elem: 'dom',
            mods: {'init': 'auto'}
        }
    ],
    shouldDeps: [
        {
            block: 'b-popup',
            js: true
        }
    ]
})
