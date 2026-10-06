using ListingsApi.Data;
using ListingsApi.Endpoints;
using ListingsApi.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Настройка Kestrel на два независимых порта: 5000 (Публичный) и 5001 (Админ)
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000);
    options.ListenAnyIP(5001);
});

// 1. Регистрация базы данных SQLite и сервисов
builder.Services.AddDbContext<ListingsDbContext>(options =>
    options.UseSqlite("Data Source=listings.db"));

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddScoped<ListingStore>();

builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.SetIsOriginAllowed(_ => true)
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials()));

var app = builder.Build();

// 2. Инициализация и создание базы данных SQLite (listings.db)
DbInitializer.Initialize(app);

// 3. Настройка конвейера обработки запросов
app.UseCors();

// Перенаправление обращений на порту 5001 к странице admin.html, и запрет доступа к ней с других портов
app.Use(async (context, next) =>
{
    if (context.Connection.LocalPort == 5001)
    {
        if (context.Request.Path == "/" || context.Request.Path == "/index.html")
        {
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath, "admin.html"));
            return;
        }
    }
    else
    {
        // На основном порту (5000) админка недоступна
        if (context.Request.Path == "/admin.html" || context.Request.Path == "/admin")
        {
            context.Response.StatusCode = 404;
            var notFoundPath = Path.Combine(app.Environment.WebRootPath, "404.html");
            if (File.Exists(notFoundPath))
            {
                context.Response.ContentType = "text/html; charset=utf-8";
                await context.Response.SendFileAsync(notFoundPath);
            }
            return;
        }
    }
    await next();
});

app.UseStatusCodePages(async context =>
{
    if (context.HttpContext.Response.StatusCode == 404 && !context.HttpContext.Response.HasStarted)
    {
        context.HttpContext.Response.ContentType = "text/html; charset=utf-8";
        var path = Path.Combine(app.Environment.WebRootPath, "404.html");
        if (File.Exists(path))
        {
            await context.HttpContext.Response.SendFileAsync(path);
        }
    }
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapOpenApi(); // документ: /openapi/v1.json

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/openapi/v1.json", "API Объявлений v1 (Русская версия)");
    options.RoutePrefix = "swagger"; // страница Swagger доступна по адресу /swagger
    options.DocumentTitle = "Listings API — Документация и Тестирование";
    options.InjectJavascript("/swagger-ru.js"); // Инъекция полного скрипта русификации UI
});

app.MapListingEndpoints();
app.MapDistrictEndpoints();
app.MapAdminEndpoints();
app.MapControllers();

app.Run();
