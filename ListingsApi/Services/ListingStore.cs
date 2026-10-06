using ListingsApi.Contracts;
using ListingsApi.Data;
using ListingsApi.Models;

namespace ListingsApi.Services;

/// <summary>Результат операции изменения/удаления с проверкой прав</summary>
public enum OwnerCheckResult { Ok, NotFound, Forbidden }

public class ListingStore
{
    private readonly ListingsDbContext _db;

    public ListingStore(ListingsDbContext db)
    {
        _db = db;
    }

    public IReadOnlyList<Listing> GetAll()
    {
        return _db.Listings.ToList();
    }

    public int GetCount()
    {
        return _db.Listings.Count();
    }

    public Listing? Get(int id)
    {
        return _db.Listings.FirstOrDefault(l => l.Id == id);
    }

    public Listing Add(CreateListingRequest r)
    {
        var listing = new Listing
        {
            Title = r.Title,
            Price = r.Price,
            District = r.District,
            Address = r.Address,
            Rooms = r.Rooms,
            ImageUrl = r.ImageUrl ?? "",
            OwnerId = r.OwnerId ?? "",
            CreatedAt = DateTime.UtcNow
        };

        _db.Listings.Add(listing);
        _db.SaveChanges();
        return listing;
    }

    /// <summary>Обновляет объявление. requesterId = null означает администратор (без ограничений).</summary>
    public OwnerCheckResult Update(int id, UpdateListingRequest r, string? requesterId)
    {
        var listing = _db.Listings.FirstOrDefault(l => l.Id == id);
        if (listing is null) return OwnerCheckResult.NotFound;

        // Если запросчик задан и объявление принадлежит другому — запрещаем
        if (requesterId is not null && listing.OwnerId != "" && listing.OwnerId != requesterId)
            return OwnerCheckResult.Forbidden;

        listing.Title = r.Title;
        listing.Price = r.Price;
        listing.District = r.District;
        listing.Address = r.Address;
        listing.Rooms = r.Rooms;
        if (r.ImageUrl is not null)
            listing.ImageUrl = r.ImageUrl;

        _db.SaveChanges();
        return OwnerCheckResult.Ok;
    }

    /// <summary>Обновляет цену. requesterId = null означает администратор.</summary>
    public OwnerCheckResult UpdatePrice(int id, decimal newPrice, string? requesterId)
    {
        var listing = _db.Listings.FirstOrDefault(l => l.Id == id);
        if (listing is null) return OwnerCheckResult.NotFound;

        if (requesterId is not null && listing.OwnerId != "" && listing.OwnerId != requesterId)
            return OwnerCheckResult.Forbidden;

        listing.Price = newPrice;
        _db.SaveChanges();
        return OwnerCheckResult.Ok;
    }

    /// <summary>Удаляет объявление. requesterId = null означает администратор.</summary>
    public OwnerCheckResult Delete(int id, string? requesterId)
    {
        var listing = _db.Listings.FirstOrDefault(l => l.Id == id);
        if (listing is null) return OwnerCheckResult.NotFound;

        if (requesterId is not null && listing.OwnerId != "" && listing.OwnerId != requesterId)
            return OwnerCheckResult.Forbidden;

        _db.Listings.Remove(listing);
        _db.SaveChanges();
        return OwnerCheckResult.Ok;
    }
}
