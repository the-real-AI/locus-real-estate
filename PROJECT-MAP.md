# Карта проекта (Project Map)

> Полнофункциональная платформа объявлений о недвижимости: бэкенд на ASP.NET Core (.NET 10 Minimal API / MVC) и фронтенд-клиенты (Angular 19 и Vanilla Web).

## Навигация по модулям

| Путь | Назначение | Главная точка входа / Зависимости |
| --- | --- | --- |
| `ListingsApi/` | Бэкенд REST API: CRUD операции с объявлениями, пагинация, фильтрация, Swagger OpenAPI | `Program.cs` -> `Endpoints/ListingEndpoints.cs`, `Controllers/ListingsController.cs` |
| `ListingsApi/Models/` | Доменные модели (`Listing`) с валидацией обязательных полей (включая `Address`) | `Models/Listing.cs` |
| `ListingsApi/Services/` | In-memory хранилище данных объявлений с потокобезопасной синхронизацией (`lock`) | `Services/ListingStore.cs` |
| `ListingsApi/Contracts/` | DTO контракты запросов и ответов (`CreateListingRequest`, `ListingResponse`, etc.) | `Contracts/ListingContracts.cs` |
| `ListingsApi/wwwroot/` | Встроенный веб-портал Locus, каталог, админка и страница практики CSS (Урок 2) | `wwwroot/index.html`, `wwwroot/css-practice.html` (http://localhost:5000/css-practice.html) |
| `listings-web/` | Фронтенд-приложение на Angular с реактивным управлением состоянием через Signals | `src/main.ts` -> `src/app/app.ts`, `src/app/listing.ts` |
| `stitch_locus_real_estate_platform/` | Дизайн-макеты, HTML-прототипы экранов платформы и дизайн-система | `tashkent_modern_marketplace/DESIGN.md`, `locus_1/code.html`..`locus_4/code.html` |
| `kvartira/` | Автономный веб-интерфейс на чистом HTML5/CSS3/JavaScript для каталога квартир | `kvartira/index.html`, `kvartira/script.js` |
| `.agents/` | Конфигурация поведения агента, локальные правила и установленные навыки | `.agents/AGENTS.md`, `.agents/skills/` |

## Основные потоки запросов и данных

1. **Angular клиент -> API**: `listings-web/src/app/app.ts` -> `HttpClient.get('/api/listings')` -> `ListingsApi/Endpoints/ListingEndpoints.cs` -> `ListingStore.GetAll()` -> JSON-ответ.
2. **Создание объявления**: `POST /api/listings` -> `ListingEndpoints` (валидация DTO) -> `ListingStore.Add()` -> заголовок `Location: /api/listings/{id}` + DTO ответа.
3. **Обновление цены (PATCH)**: `PATCH /api/listings/{id}/price` -> `PatchPriceRequest` -> `ListingStore.UpdatePrice()` -> обновленный объект `ListingResponse`.
4. **MVC Контроллер (v2)**: `GET /api/v2/listings` -> `Controllers/ListingsController.cs` -> `ListingStore` -> результат со статусом 200 OK.
