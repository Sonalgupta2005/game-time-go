import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Clock, Wifi, Car, Coffee, Shield, Users, Calendar } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { venuesApi, handleApiSuccess } from "@/services/api";

interface VenueDetail {
  id: number;
  name: string;
  description: string;
  address: string;
  sports: string[];
  pricePerHour: number;
  rating: number;
  reviews: number;
  images: string[];
  amenities: Array<{ name: string; icon: any }>;
  courts: Array<{ id: number; name: string; sport: string; pricePerHour: number }>;
  reviewsData: Array<{ id: number; user: string; rating: number; comment: string; date: string }>;
  phone?: string;
  email?: string;
  operatingHours?: string;
}

const VenueDetail = () => {
  const { id } = useParams();
  const [venueDetails, setVenueDetails] = useState<VenueDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch venue details from API
  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // API call to Node.js backend to get venue details
        const response = await fetch(`/api/venues/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVenueDetails(data.venue);
        } else {
          const error = await response.json();
          toast(error.message || "Failed to load venue details");
        }
      } catch (error) {
        console.error('Fetch venue details error:', error);
        toast("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenueDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold mb-2">Loading venue details...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the venue information</p>
          </div>
        </main>
      </div>
    );
  }

  if (!venueDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-xl font-semibold mb-2">Venue not found</h3>
            <p className="text-muted-foreground">The venue you're looking for doesn't exist</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/venues" className="hover:text-primary">Venues</Link>
          <span>/</span>
          <span className="text-foreground">{venueDetails.name}</span>
        </div>

        {/* Main Image */}
        <div className="aspect-video bg-gradient-card rounded-lg mb-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏟️</div>
            <p className="text-muted-foreground">Venue Main Image</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{venueDetails.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{venueDetails.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{venueDetails.rating}</span>
                      <span className="text-muted-foreground">({venueDetails.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">₹{venueDetails.pricePerHour}</div>
                  <div className="text-sm text-muted-foreground">per hour</div>
                </div>
              </div>

              {/* Sports Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {venueDetails.sports.map((sport) => (
                  <Badge key={sport} variant="secondary">
                    {sport}
                  </Badge>
                ))}
              </div>

              <p className="text-muted-foreground">{venueDetails.description}</p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {venueDetails.amenities.map((amenity) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={amenity.name} className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                      <IconComponent className="h-4 w-4 text-primary" />
                      <span className="text-sm">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Courts */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Courts</h2>
              <div className="grid gap-4">
                {venueDetails.courts.map((court) => (
                  <Card key={court.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{court.name}</h3>
                          <p className="text-sm text-muted-foreground">{court.sport}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-semibold text-primary">₹{court.pricePerHour}</div>
                            <div className="text-xs text-muted-foreground">per hour</div>
                          </div>
                          <Link to={`/booking/${venueDetails.id}?court=${court.id}`}>
                            <Button variant="sport" size="sm">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {venueDetails.reviewsData.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{review.user}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Book Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Quick Book
                </CardTitle>
                <CardDescription>
                  Select a time slot and book instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to={`/booking/${venueDetails.id}`}>
                  <Button className="w-full" variant="hero">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Button>
                </Link>
                <div className="text-center text-sm text-muted-foreground">
                  Starting from ₹{venueDetails.pricePerHour}/hour
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">Address</h4>
                  <p className="text-sm text-muted-foreground">{venueDetails.address}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Phone</h4>
                  <p className="text-sm text-muted-foreground">{venueDetails.phone || "Contact venue for phone number"}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <p className="text-sm text-muted-foreground">{venueDetails.email || "Contact venue for email"}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Operating Hours</h4>
                  <p className="text-sm text-muted-foreground">{venueDetails.operatingHours || "6:00 AM - 11:00 PM"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VenueDetail;