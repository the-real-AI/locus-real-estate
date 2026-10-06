namespace ListingsApi.Contracts;

// то, что клиент присылает при создании (с полями Address, ImageUrl и OwnerId)
public record CreateListingRequest(string Title, decimal Price, string District, string Address, int Rooms, string? ImageUrl = null, string? OwnerId = null);

// то, что клиент присылает при полной замене (PUT)
public record UpdateListingRequest(string Title, decimal Price, string District, string Address, int Rooms, string? ImageUrl = null, string? OwnerId = null);

// то, что клиент присылает при частичном обновлении цены (PATCH - задание со звездочкой)
public record PatchPriceRequest(decimal Price);

// то, что клиент получает в ответе
public record ListingResponse(int Id, string Title, decimal Price, string District, string Address, int Rooms, string ImageUrl, string OwnerId, DateTime CreatedAt);

// ответ после загрузки файла фото
public record FileUploadResponse(string Url, string FileName);

// ответ для количества элементов (GET /api/listings/count)
public record CountResponse(int Count);

// ответ для пагинации (задание со звездочкой)
public record PagedResult<T>(IReadOnlyList<T> Items, int Total, int Page, int PageSize);

// DTO контракты для районов (Урок 3 EF Core)
public record DistrictResponse(int Id, string Name, int ListingsCount);
public record CreateDistrictRequest(string Name);

