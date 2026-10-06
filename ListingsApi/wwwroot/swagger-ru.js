// Скрипт полной русификации интерфейса Swagger UI
window.addEventListener('DOMContentLoaded', () => {
    const translations = {
        'Parameters': 'Параметры',
        'No parameters': 'Параметры отсутствуют',
        'Responses': 'Варианты ответов',
        'Code': 'Код ответа',
        'Description': 'Описание',
        'Links': 'Ссылки',
        'No Links': 'Ссылки отсутствуют',
        'Try it out': '🧪 Тестировать запрос',
        'Cancel': 'Отмена',
        'Execute': '▶️ Выполнить запрос',
        'Clear': 'Очистить',
        'Media type': 'Формат данных',
        'Controls Accept header.': 'Управляет заголовком Accept',
        'Example Value': 'Пример ответа',
        'Schema': 'Схема объекта',
        'Response body': 'Тело ответа',
        'Response headers': 'Заголовки ответа',
        'Download': 'Скачать',
        'Request duration': 'Время выполнения',
        'Server response': 'Ответ сервера',
        'Send empty value': 'Отправить пустое значение'
    };

    function translateUI() {
        // Заменяем текст в кнопках
        document.querySelectorAll('.btn.try-out__btn').forEach(btn => {
            if (btn.innerText.trim() === 'Try it out') btn.innerText = translations['Try it out'];
            if (btn.innerText.trim() === 'Cancel') btn.innerText = translations['Cancel'];
        });

        document.querySelectorAll('.btn.execute').forEach(btn => {
            if (btn.innerText.trim() === 'Execute') btn.innerText = translations['Execute'];
        });

        document.querySelectorAll('.btn.btn-clear').forEach(btn => {
            if (btn.innerText.trim() === 'Clear') btn.innerText = translations['Clear'];
        });

        // Заменяем заголовки таблиц и секций
        document.querySelectorAll('.opblock-section-header h4, .responses-wrapper h4, .parameters-container h4').forEach(el => {
            const txt = el.innerText.trim();
            if (translations[txt]) el.innerText = translations[txt];
        });

        document.querySelectorAll('.col_header').forEach(el => {
            const txt = el.innerText.trim();
            if (translations[txt]) el.innerText = translations[txt];
        });

        document.querySelectorAll('.tabli button, .tabli a').forEach(el => {
            const txt = el.innerText.trim();
            if (translations[txt]) el.innerText = translations[txt];
        });

        document.querySelectorAll('.opblock-description-wrapper, .response-control-media-type__accept-message').forEach(el => {
            const txt = el.innerText.trim();
            if (translations[txt]) el.innerText = translations[txt];
        });

        document.querySelectorAll('p').forEach(el => {
            const txt = el.innerText.trim();
            if (translations[txt]) el.innerText = translations[txt];
        });
    }

    // Слушаем изменения DOM для динамически открываемых эндпоинтов в Swagger UI
    const observer = new MutationObserver(() => {
        translateUI();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(translateUI, 500);
});
