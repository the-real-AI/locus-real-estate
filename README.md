# Урок 2. Практика: CRUD-API объявлений и Angular Интеграция

Данный репозиторий содержит полную реализацию практической работы Урока 2 курсов веб-разработки (C# .NET 10 + Angular).

## 🚀 Назначение проекта
Проект предоставляет полноценный CRUD-сервер объявлений о недвижимости на базе ASP.NET Core (.NET 10 Minimal API), задокументированный через OpenAPI и Swagger UI, с интеграцией Angular клиента.

---

## 📁 Структура проекта
- `ListingsApi/` — REST API сервер на C# (.NET 10)
  - `Program.cs` — конфигурация DI, CORS, OpenAPI, SwaggerUI и подключение маршрутов
  - `Models/Listing.cs` — сущность объявления (содержит обязательное поле `Address`)
  - `Contracts/ListingContracts.cs` — DTO записи (`CreateListingRequest`, `UpdateListingRequest`, `PatchPriceRequest`, `ListingResponse`, `CountResponse`, `PagedResult`)
  - `Services/ListingStore.cs` — потокбезопасное хранилище в памяти (`lock`)
  - `Endpoints/ListingEndpoints.cs` — Minimal API эндпоинты
  - `Controllers/ListingsController.cs` — контроллер в стиле MVC (Задание со звездочкой)
  - `listings.http` — тесты запросов для VS Code REST Client (8 стандартных + 5 дополнительных)
  - `wwwroot/index.html` — встроенный веб-интерфейс для интерактивной проверки CRUD
- `listings-web/` — Angular веб-клиент
  - `src/app/listing.ts` — интерфейс объявления
  - `src/app/app.ts` — компонент списка объявлений с `HttpClient` и `signal`

---

## ⚙️ Параметры запуска
- **Порт сервера**: `http://localhost:5000`
- **Swagger UI**: `http://localhost:5000/swagger`
- **OpenAPI Schema**: `http://localhost:5000/openapi/v1.json`
- **Интерактивный дашборд**: `http://localhost:5000/`

### Запуск C# API сервера:
```bash
cd ListingsApi
dotnet run
```

### Запуск Angular веб-клиента:
```bash
cd listings-web
ng serve
```
Откройте браузер по адресу `http://localhost:4200`.

---

## 📌 Список эндпоинтов API

| Метод | Маршрут | Описание | Код успешного ответа |
|-------|---------|----------|----------------------|
| `GET` | `/api/listings` | Получить список объявлений (поддерживает `district`, `maxPrice`, `sort`, `page`, `pageSize`) | 200 OK |
| `GET` | `/api/listings/count` | Получить количество объявлений ⭐ | 200 OK |
| `GET` | `/api/listings/{id}` | Получить одно объявление по ID | 200 OK / 404 Not Found |
| `POST` | `/api/listings` | Создать новое объявление (возвращает заголовок `Location`) | 201 Created / 400 Bad Request |
| `PUT` | `/api/listings/{id}` | Заменить объявление целиком | 204 No Content / 404 / 400 |
| `PATCH`| `/api/listings/{id}/price` | Частично обновить цену объявления ⭐ | 200 OK / 404 / 400 |
| `DELETE`| `/api/listings/{id}` | Удалить объявление по ID | 204 No Content / 404 |
| `GET` | `/api/v2/listings` | Список объявлений через MVC Controller ⭐ | 200 OK |

---

## ✅ Выполненные требования чек-листа
1. [x] `GET /api/listings` отдаёт список; фильтры `district` и `maxPrice` работают.
2. [x] `GET /api/listings/{id}` — 200 для существующего, 404 для несуществующего.
3. [x] `POST` — 201 с заголовком `Location`; валидация пустых данных — 400.
4. [x] `PUT` и `DELETE` — 204; для несуществующего id — 404.
5. [x] `/swagger` открывается, у всех методов есть описания.
6. [x] `listings.http` со всеми запросами находится в проекте.
7. [x] Angular интерфейс и компонент обновлены под структуру API.
8. [x] **Обязательное задание**: Добавлено поле `address` во все слои (модель, DTO, ответы, Swagger, тесты).
9. [x] **Задания со звездочкой**:
   - [x] Сортировка `?sort=price` и `?sort=-price` (с валидацией 400).
   - [x] Счётчик `GET /api/listings/count`.
   - [x] Частичное обновление `PATCH /api/listings/{id}/price`.
   - [x] Пагинация `?page=1&pageSize=10`.
   - [x] MVC Контроллер `ListingsController`.
