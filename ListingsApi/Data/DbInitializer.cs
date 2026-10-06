using ListingsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ListingsApi.Data;

public static class DbInitializer
{
    public static void Initialize(IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ListingsDbContext>();

        // Гарантируем создание базы данных SQLite (listings.db)
        context.Database.EnsureCreated();

        // Безопасное обновление схемы для существующей БД
        try
        {
            context.Database.ExecuteSqlRaw("ALTER TABLE Listings ADD COLUMN ImageUrl TEXT DEFAULT ''");
        }
        catch
        {
            // Колонка уже существует
        }

        try
        {
            context.Database.ExecuteSqlRaw("ALTER TABLE Listings ADD COLUMN OwnerId TEXT DEFAULT ''");
        }
        catch
        {
            // Колонка уже существует
        }

        // Инициализация районов (Урок 3 EF Core)
        if (!context.Districts.Any())
        {
            context.Districts.AddRange(
                new District { Name = "Чиланзар" },
                new District { Name = "Юнусабад" },
                new District { Name = "Мирзо-Улугбек" },
                new District { Name = "Мирабад" },
                new District { Name = "Яккасарай" },
                new District { Name = "Шайхантахур" }
            );
            context.SaveChanges();
        }

        // Проверяем наличие объявлений. Если пусто — заполняем начальными данными
        if (!context.Listings.Any())
        {
            context.Listings.AddRange(
                new Listing
                {
                    Title = "2-комн. рядом с метро Чиланзар",
                    Price = 48000,
                    District = "Чиланзар",
                    Address = "ул. Катартал, д. 12",
                    Rooms = 2,
                    ImageUrl = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&auto=format&fit=crop&q=80",
                    CreatedAt = DateTime.UtcNow
                },
                new Listing
                {
                    Title = "3-комн. с ремонтом",
                    Price = 71000,
                    District = "Юнусабад",
                    Address = "14-й квартал, д. 5",
                    Rooms = 3,
                    ImageUrl = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&auto=format&fit=crop&q=80",
                    CreatedAt = DateTime.UtcNow
                },
                new Listing
                {
                    Title = "1-комн. студия",
                    Price = 32000,
                    District = "Мирзо-Улугбек",
                    Address = "пр-т Мустакиллик, д. 88",
                    Rooms = 1,
                    ImageUrl = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&auto=format&fit=crop&q=80",
                    CreatedAt = DateTime.UtcNow
                }
            );

            context.SaveChanges();
        }
    }
}
