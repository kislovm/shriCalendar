({
    block: 'b-page',
    js: true,
    title: 'Расписание занятий ШРИ',
    head: [
        { elem: 'css', url: '_index.css'},
        { elem: 'css', url: '_index', ie: true },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: 'index.bemhtml.js' },
        { elem: 'js', url: '_index.js' }
    ],
    content: [
                {
                    block: 'b-calendar',
                    js: true
                }
    ]
})
