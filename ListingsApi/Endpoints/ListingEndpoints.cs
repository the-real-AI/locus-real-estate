using ListingsApi.Contracts;
using ListingsApi.Models;
using ListingsApi.Services;

namespace ListingsApi.Endpoints;

public static class ListingEndpoints
{
    public static void MapListingEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/listings").WithTags("Объявления недвижимости (Minimal API)");

        // 1. GET /api/listings/count
        group.MapGet("/count", (ListingStore store) =>
            Results.Ok(new CountResponse(store.GetCount())))
        .WithName("GetListingsCount")
        .WithSummary("Количество объявлений")
        .WithDescription("Возвращает общее количество объявлений в хранилище (в формате { count: N })");

        // 2. GET /api/listings (с фильтрацией, сортировкой и пагинацией)
        group.MapGet("/", (
            ListingStore store,
            string? district,
            decimal? maxPrice,
            string? sort,
            int? page,
            int? pageSize) =>
        {
            var items = store.GetAll().AsEnumerable();

            if (district is not null)
                items = items.Where(l => l.District.Equals(district, StringComparison.OrdinalIgnoreCase));

            if (maxPrice is not null)
                items = items.Where(l => l.Price <= maxPrice);

            if (!string.IsNullOrWhiteSpace(sort))
            {
                switch (sort.ToLowerInvariant())
                {
                    case "price":
                        items = items.OrderBy(l => l.Price);
                        break;
                    case "-price":
                        items = items.OrderByDescending(l => l.Price);
                        break;
                    default:
                        return Results.BadRequest("Неизвестное значение параметра sort. Допустимы: price, -price");
                }
            }

            var totalCount = items.Count();

            if (page.HasValue || pageSize.HasValue)
            {
                int p = page ?? 1;
                int ps = pageSize ?? 10;
                if (p < 1 || ps < 1)
                    return Results.BadRequest("Параметры page и pageSize должны быть больше 0");

                var pagedItems = items.Skip((p - 1) * ps).Take(ps).Select(ToResponse).ToList();
                return Results.Ok(new PagedResult<ListingResponse>(pagedItems, totalCount, p, ps));
            }

            return Results.Ok(items.Select(ToResponse));
        })
        .WithName("GetListings")
        .WithSummary("Список объявлений с фильтром по району, макс. цене, сортировке и пагинации");

        // 3. GET /api/listings/{id}
        group.MapGet("/{id:int}", (int id, ListingStore store) =>
            store.Get(id) is { } listing
                ? Results.Ok(ToResponse(listing))
                : Results.NotFound())
        .WithName("GetListing")
        .WithSummary("Одно объявление по идентификатору (id)");

        // 4. POST /api/listings — сохраняем OwnerId из заголовка X-Client-Id
        group.MapPost("/", async (HttpContext context, CreateListingRequest request, ListingStore store) =>
        {
            if (string.IsNullOrWhiteSpace(request.Title))
                return Results.BadRequest("Поле title обязательно для заполнения");
            if (request.Price <= 0)
                return Results.BadRequest("Поле price должно быть больше 0");
            if (request.Rooms is < 1 or > 10)
                return Results.BadRequest("Поле rooms должно быть от 1 до 10");

            var clientId = context.Request.Headers["X-Client-Id"].FirstOrDefault();
            if (!string.IsNullOrEmpty(clientId))
                request = request with { OwnerId = clientId };

            var created = store.Add(request);
            return Results.Created($"/api/listings/{created.Id}", ToResponse(created));
        })
        .WithName("CreateListing")
        .WithSummary("Создать новое объявление");

        // 5. PUT /api/listings/{id} — проверяем X-Client-Id
        group.MapPut("/{id:int}", async (HttpContext context, int id, UpdateListingRequest request, ListingStore store) =>
        {
            if (string.IsNullOrWhiteSpace(request.Title) || request.Price <= 0)
                return Results.BadRequest("Поле title обязательно, price должна быть > 0");

            var clientId = context.Request.Headers["X-Client-Id"].FirstOrDefault();
            string? requesterId = string.IsNullOrEmpty(clientId) ? null : clientId;

            var result = store.Update(id, request, requesterId);
            return result switch
            {
                OwnerCheckResult.Ok        => Results.NoContent(),
                OwnerCheckResult.NotFound  => Results.NotFound(),
                OwnerCheckResult.Forbidden => Results.Problem(
                    "Вы можете редактировать только свои объявления", statusCode: 403),
                _                          => Results.StatusCode(500)
            };
        })
        .WithName("UpdateListing")
        .WithSummary("Заменить объявление целиком (PUT)");

        // 6. PATCH /api/listings/{id}/price
        group.MapPatch("/{id:int}/price", async (HttpContext context, int id, PatchPriceRequest request, ListingStore store) =>
        {
            if (request.Price <= 0)
                return Results.BadRequest("Поле price должно быть больше 0");

            var clientId = context.Request.Headers["X-Client-Id"].FirstOrDefault();
            string? requesterId = string.IsNullOrEmpty(clientId) ? null : clientId;

            var result = store.UpdatePrice(id, request.Price, requesterId);
            if (result == OwnerCheckResult.NotFound)
                return Results.NotFound();
            if (result == OwnerCheckResult.Forbidden)
                return Results.Problem("Вы можете редактировать только свои объявления", statusCode: 403);

            var updated = store.Get(id);
            return updated is not null
                ? Results.Ok(ToResponse(updated))
                : Results.NotFound();
        })
        .WithName("PatchListingPrice")
        .WithSummary("Изменить только цену объявления (PATCH)");

        // 7. DELETE /api/listings/{id}
        group.MapDelete("/{id:int}", async (HttpContext context, int id, ListingStore store) =>
        {
            var clientId = context.Request.Headers["X-Client-Id"].FirstOrDefault();
            string? requesterId = string.IsNullOrEmpty(clientId) ? null : clientId;

            var result = store.Delete(id, requesterId);
            return result switch
            {
                OwnerCheckResult.Ok        => Results.NoContent(),
                OwnerCheckResult.NotFound  => Results.NotFound(),
                OwnerCheckResult.Forbidden => Results.Problem(
                    "Вы можете удалять только свои объявления", statusCode: 403),
                _                          => Results.StatusCode(500)
            };
        })
        .WithName("DeleteListing")
        .WithSummary("Удалить объявление");

        // 8. POST /api/listings/upload — загрузка фото
        group.MapPost("/upload", async (IFormFile file, IWebHostEnvironment env) =>
        {
            if (file is null || file.Length == 0)
                return Results.BadRequest("Файл фотографии не выбран");

            var uploadsFolder = Path.Combine(env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var ext = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"/uploads/{uniqueFileName}";
            return Results.Ok(new FileUploadResponse(fileUrl, uniqueFileName));
        })
        .DisableAntiforgery()
        .WithName("UploadListingPhoto")
        .WithSummary("Загрузить файл фотографии объявления");
    }

    private static ListingResponse ToResponse(Listing l) =>
        new(l.Id, l.Title, l.Price, l.District, l.Address, l.Rooms, l.ImageUrl ?? "", l.OwnerId ?? "", l.CreatedAt);
}
