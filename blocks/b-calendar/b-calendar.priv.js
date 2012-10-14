blocks['b-calendar'] = function(data) {
    var docs = data.docs || [{
                                number: "5",
                                title: "Привет",
                                text: "Тест",
                                url: "http://yandex.ru"
                            }];


    return {
        block: 'b-calendar-list',
        content: data.query ? 
            [
                { elem: 'title', content: 'Найдено ' + docs.length + ' документов' },
                docs.map(function(doc, i) {
                    doc.number = i + 1;
                    return blocks['b-calendar-item'](data, doc);
                })
            ] :
            { elem: 'empty', content: 'Задан пустой поисковый запрос.' }
    };
};
