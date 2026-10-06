namespace ListingsApi.Models;

public class Listing
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public decimal Price { get; set; }
    public string District { get; set; } = "";
    public string Address { get; set; } = "";
    public int Rooms { get; set; }
    public string ImageUrl { get; set; } = "";
    public string OwnerId { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}
