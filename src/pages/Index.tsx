import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Search, Trophy, Users, Calendar } from "lucide-react";

// Mock data for popular venues and sports
const popularVenues = [
  {
    id: 1,
    name: "Elite Sports Complex",
    sports: ["Badminton", "Tennis"],
    location: "Downtown",
    pricePerHour: 25,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Prime Court Arena",
    sports: ["Football", "Cricket"],
    location: "North Zone",
    pricePerHour: 40,
    rating: 4.6,
  },
  {
    id: 3,
    name: "SportZone Central",
    sports: ["Badminton", "Table Tennis"],
    location: "Central Mall",
    pricePerHour: 20,
    rating: 4.5,
  },
];

const popularSports = [
  { name: "Badminton", venues: 25, icon: "🏸" },
  { name: "Tennis", venues: 18, icon: "🎾" },
  { name: "Football", venues: 12, icon: "⚽" },
  { name: "Basketball", venues: 15, icon: "🏀" },
  { name: "Cricket", venues: 8, icon: "🏏" },
  { name: "Table Tennis", venues: 22, icon: "🏓" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Book Your Perfect
              <span className="block text-primary-glow">Sports Venue</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Find and book local sports facilities instantly. Play your favorite sport with friends and community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/venues">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-3">
                  <Search className="mr-2 h-5 w-5" />
                  Find Venues
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-bounce-in">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Sports Venues</p>
            </div>
            <div className="animate-bounce-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Happy Players</p>
            </div>
            <div className="animate-bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <p className="text-muted-foreground">Sports Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Sports */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Sports</h2>
            <p className="text-muted-foreground text-lg">Choose from a wide variety of sports</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularSports.map((sport, index) => (
              <Card key={sport.name} className="text-center hover:shadow-card transition-smooth cursor-pointer group">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {sport.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{sport.name}</h3>
                  <p className="text-sm text-muted-foreground">{sport.venues} venues</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Popular Venues</h2>
              <p className="text-muted-foreground text-lg">Top-rated venues in your area</p>
            </div>
            <Link to="/venues">
              <Button variant="outline">
                View All Venues
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularVenues.map((venue) => (
              <Card key={venue.id} className="group hover:shadow-elevated transition-smooth">
                <div className="aspect-video bg-gradient-card rounded-t-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏟️</div>
                    <p className="text-sm text-muted-foreground">Venue Image</p>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors">
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
                  <div className="flex flex-wrap gap-1 mb-4">
                    {venue.sports.map((sport) => (
                      <Badge key={sport} variant="secondary" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-primary">₹{venue.pricePerHour}</span>
                      <span className="text-sm text-muted-foreground">/hour</span>
                    </div>
                    
                    <Link to={`/venue/${venue.id}`}>
                      <Button variant="sport" size="sm">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Play?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of sports enthusiasts who trust QuickCourt for their venue bookings
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-3">
                <Calendar className="mr-2 h-5 w-5" />
                Start Booking Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">QuickCourt</span>
              </div>
              <p className="text-secondary-foreground/80">
                Your trusted platform for booking sports venues and building community.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-secondary-foreground/80">
                <Link to="/venues" className="block hover:text-white transition-colors">Find Venues</Link>
                <Link to="/register" className="block hover:text-white transition-colors">Join Community</Link>
                <Link to="/login" className="block hover:text-white transition-colors">Sign In</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <div className="space-y-2 text-secondary-foreground/80">
                <a href="#" className="block hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block hover:text-white transition-colors">Contact Us</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="space-y-2 text-secondary-foreground/80">
                <a href="#" className="block hover:text-white transition-colors">Twitter</a>
                <a href="#" className="block hover:text-white transition-colors">Facebook</a>
                <a href="#" className="block hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-secondary-foreground/60">
            <p>&copy; 2024 QuickCourt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
