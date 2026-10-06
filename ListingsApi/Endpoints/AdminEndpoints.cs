using ListingsApi.Contracts;
using ListingsApi.Services;

namespace ListingsApi.Endpoints;

public static class AdminEndpoints
{
    private const string AdminUser = "admin";
    private const string AdminPass = "admin123";
    public const string AdminToken = "admin-secret-token-session-key-2026";

    public static void MapAdminEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/admin").WithTags("Административный API");

        // 1. Вход администратора
        group.MapPost("/login", (AdminLoginRequest req) =>
        {
            if (req.Username == AdminUser && req.Password == AdminPass)
            {
                return Results.Ok(new AdminLoginResponse(true, AdminToken, "Успешный вход в панель администратора"));
            }

            return Results.Json(new AdminLoginResponse(false, "", "Неверное имя пользователя или пароль"), statusCode: 401);
        })
        .WithName("AdminLogin")
        .WithSummary("Авторизация администратора");

        // 2. Статистика базы данных для админки
        group.MapGet("/stats", (ListingStore store, HttpContext context) =>
        {
            if (!IsAuthorized(context)) return Results.Unauthorized();

            var listings = store.GetAll();
            int total = listings.Count;
            decimal totalVal = listings.Sum(l => l.Price);
            decimal avgPrice = total > 0 ? Math.Round(totalVal / total, 2) : 0;
            int districts = listings.Select(l => l.District).Distinct().Count();

            return Results.Ok(new AdminStatsResponse(total, totalVal, avgPrice, districts, "🟢 SQLite (listings.db) Подключена"));
        })
        .WithName("AdminStats")
        .WithSummary("Системная статистика для админки");
    }

    public static bool IsAuthorized(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("Authorization", out var token))
        {
            var tokenStr = token.ToString().Replace("Bearer ", "");
            return tokenStr == AdminToken;
        }
        return false;
    }
}
