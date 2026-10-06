using ListingsApi.Contracts;
using ListingsApi.Data;
using ListingsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ListingsApi.Endpoints;

public static class DistrictEndpoints
{
    public static void MapDistrictEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/districts").WithTags("Районы (Урок 3 EF Core)");

        // 1. GET /api/districts
        group.MapGet("/", async (ListingsDbContext db) =>
        {
            var districts = await db.Districts
                .AsNoTracking()
                .OrderBy(d => d.Id)
                .Select(d => new DistrictResponse(
                    d.Id,
                    d.Name,
                    db.Listings.Count(l => l.District == d.Name)
                ))
                .ToListAsync();

            return Results.Ok(districts);
        })
        .WithName("GetDistricts")
        .WithSummary("Список всех районов")
        .WithDescription("Возвращает список всех районов с количеством привязанных объявлений (EF Core LINQ)");

        // 2. GET /api/districts/{id}
        group.MapGet("/{id:int}", async (int id, ListingsDbContext db) =>
        {
            var district = await db.Districts
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == id);

            if (district is null)
                return Results.NotFound(new { message = $"Район с id={id} не найден" });

            var count = await db.Listings.CountAsync(l => l.District == district.Name);
            return Results.Ok(new DistrictResponse(district.Id, district.Name, count));
        })
        .WithName("GetDistrictById")
        .WithSummary("Получить район по ID")
        .WithDescription("Возвращает информацию о районе и количество объявлений");

        // 3. POST /api/districts
        group.MapPost("/", async (CreateDistrictRequest request, ListingsDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return Results.BadRequest(new { message = "Название района обязательно для заполнения" });

            var trimmedName = request.Name.Trim();
            var exists = await db.Districts.AnyAsync(d => d.Name.ToLower() == trimmedName.ToLower());
            if (exists)
                return Results.Conflict(new { message = $"Район «{trimmedName}» уже существует" });

            var district = new District { Name = trimmedName };
            db.Districts.Add(district);
            await db.SaveChangesAsync();

            return Results.Created($"/api/districts/{district.Id}", new DistrictResponse(district.Id, district.Name, 0));
        })
        .WithName("CreateDistrict")
        .WithSummary("Создать новый район")
        .WithDescription("Добавляет новый район в базу данных SQLite");

        // 4. DELETE /api/districts/{id} (с проверкой связи Restrict)
        group.MapDelete("/{id:int}", async (int id, ListingsDbContext db) =>
        {
            var district = await db.Districts.FindAsync(id);
            if (district is null)
                return Results.NotFound(new { message = $"Район с id={id} не найден" });

            var listingsCount = await db.Listings.CountAsync(l => l.District == district.Name);
            if (listingsCount > 0)
            {
                return Results.BadRequest(new
                {
                    message = $"Нельзя удалить район «{district.Name}», так как к нему привязано {listingsCount} объявлений (DeleteBehavior.Restrict)"
                });
            }

            db.Districts.Remove(district);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteDistrict")
        .WithSummary("Удалить район")
        .WithDescription("Удаляет район, если в нем нет объявлений");
    }
}
