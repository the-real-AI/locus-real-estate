namespace ListingsApi.Contracts;

// Запрос на вход администратора
public record AdminLoginRequest(string Username, string Password);

// Ответ авторизации администратора
public record AdminLoginResponse(bool Success, string Token, string Message);

// Системная статистика для админки
public record AdminStatsResponse(int TotalListings, decimal TotalValue, decimal AvgPrice, int UniqueDistricts, string DatabaseStatus);
