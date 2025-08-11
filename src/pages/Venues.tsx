import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Clock, Filter } from "lucide-react";

// Mock data for venues
const mockVenues = [
  {
    id: 1,
    name: "Elite Sports Complex",
    sports: ["Badminton", "Tennis", "Basketball"],
    location: "Downtown, City Center",
    pricePerHour: 25,
    rating: 4.8,
    image: "/api/placeholder/300/200",
    amenities: ["Parking", "Changing Room", "Water"],
  },
  {
    id: 2,
    name: "Prime Court Arena",
    sports: ["Football", "Cricket"],
    location: "North Zone, Stadium Road",
    pricePerHour: 40,
    rating: 4.6,
    image: "/api/placeholder/300/200",
    amenities: ["Parking", "Cafeteria", "Equipment"],
  },
  {
    id: 3,
    name: "SportZone Central",
    sports: ["Badminton", "Table Tennis"],
    location: "Central Mall, 2nd Floor",
    pricePerHour: 20,
    rating: 4.5,
    image: "/api/placeholder/300/200",
    amenities: ["AC", "Parking", "Lockers"],
  },
  {
    id: 4,
    name: "Champions Arena",
    sports: ["Tennis", "Squash"],
    location: "Sports District, Main Road",
    pricePerHour: 35,
    rating: 4.9,
    image: "/api/placeholder/300/200",
    amenities: ["Premium", "Coaching", "Equipment"],
  }
];

const Venues = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const filteredVenues = mockVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = !selectedSport || venue.sports.includes(selectedSport);
    return matchesSearch && matchesSport;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Your Perfect Venue</h1>
          <p className="text-muted-foreground">Book the best sports facilities near you</p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 p-6 bg-card rounded-lg shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Sport Filter */}
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sports</SelectItem>
                <SelectItem value="Badminton">Badminton</SelectItem>
                <SelectItem value="Tennis">Tennis</SelectItem>
                <SelectItem value="Basketball">Basketball</SelectItem>
                <SelectItem value="Football">Football</SelectItem>
                <SelectItem value="Cricket">Cricket</SelectItem>
                <SelectItem value="Table Tennis">Table Tennis</SelectItem>
                <SelectItem value="Squash">Squash</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Prices</SelectItem>
                <SelectItem value="0-25">Under ₹25/hr</SelectItem>
                <SelectItem value="25-40">₹25-40/hr</SelectItem>
                <SelectItem value="40+">Above ₹40/hr</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Button */}
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="group hover:shadow-elevated transition-smooth cursor-pointer">
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-card flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏟️</div>
                    <p className="text-sm text-muted-foreground">Venue Image</p>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {venue.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {venue.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{venue.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Sports Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {venue.sports.map((sport) => (
                    <Badge key={sport} variant="secondary" className="text-xs">
                      {sport}
                    </Badge>
                  ))}
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {venue.amenities.slice(0, 3).map((amenity) => (
                    <span key={amenity} className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-primary">₹{venue.pricePerHour}</span>
                    <span className="text-sm text-muted-foreground">/hour</span>
                  </div>
                  
                  <Link to={`/venue/${venue.id}`}>
                    <Button variant="sport" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No venues found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search filters</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedSport("");
                setPriceFilter("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Venues;