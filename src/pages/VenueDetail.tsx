import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Clock, Wifi, Car, Coffee, Shield, Users, Calendar } from "lucide-react";

// Mock venue data
const venueDetails = {
  id: 1,
  name: "Elite Sports Complex",
  description: "Premium sports facility with world-class amenities and professional courts. Perfect for tournaments, training, and casual play.",
  address: "123 Sports Avenue, Downtown, City Center, 110001",
  sports: ["Badminton", "Tennis", "Basketball", "Table Tennis"],
  pricePerHour: 25,
  rating: 4.8,
  reviews: 156,
  images: ["/api/placeholder/800/400", "/api/placeholder/400/300", "/api/placeholder/400/300"],
  amenities: [
    { name: "Free WiFi", icon: Wifi },
    { name: "Parking", icon: Car },
    { name: "Cafeteria", icon: Coffee },
    { name: "Security", icon: Shield },
    { name: "Changing Rooms", icon: Users },
  ],
  courts: [
    { id: 1, name: "Court 1", sport: "Badminton", pricePerHour: 25 },
    { id: 2, name: "Court 2", sport: "Badminton", pricePerHour: 25 },
    { id: 3, name: "Tennis Court A", sport: "Tennis", pricePerHour: 40 },
    { id: 4, name: "Basketball Court", sport: "Basketball", pricePerHour: 60 },
  ],
  reviewsData: [
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      comment: "Excellent facilities and very well maintained courts. Staff is friendly and helpful.",
      date: "2024-01-15"
    },
    {
      id: 2,
      user: "Sarah Smith", 
      rating: 4,
      comment: "Great venue for badminton. Booking process was smooth and courts are in good condition.",
      date: "2024-01-10"
    }
  ]
};

const VenueDetail = () => {
  const { id } = useParams();

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
                  <p className="text-sm text-muted-foreground">+91 9876543210</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <p className="text-sm text-muted-foreground">info@elitesports.com</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Operating Hours</h4>
                  <p className="text-sm text-muted-foreground">6:00 AM - 11:00 PM</p>
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