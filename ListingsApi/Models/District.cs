namespace ListingsApi.Models;

public class District
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public List<Listing> Listings { get; set; } = new();
}
