using ListingsApi.Contracts;
using ListingsApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ListingsApi.Controllers;

[ApiController]
[Route("api/v2/listings")]
[Tags("Listings Controller V2")]
public class ListingsController : ControllerBase
{
    private readonly ListingStore _store;

    public ListingsController(ListingStore store)
    {
        _store = store;
    }

    /// <summary>
    /// Демонстрационный endpoint в стиле ControllerBase (Задание со звездочкой)
    /// </summary>
    [HttpGet]
    public ActionResult<IEnumerable<ListingResponse>> GetAll()
    {
        var items = _store.GetAll().Select(l =>
            new ListingResponse(l.Id, l.Title, l.Price, l.District, l.Address, l.Rooms, l.ImageUrl ?? "", l.OwnerId ?? "", l.CreatedAt));
        return Ok(items);
    }
}
