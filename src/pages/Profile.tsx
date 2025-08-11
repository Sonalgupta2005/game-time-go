import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar, Clock, Star, X } from "lucide-react";

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 9876543210",
  avatar: "/api/placeholder/100/100",
  joinedDate: "January 2024",
  totalBookings: 25,
  favoritesSports: ["Badminton", "Tennis"]
};

// Mock bookings data
const bookingsData = [
  {
    id: 1,
    venue: "Elite Sports Complex",
    court: "Court 1",
    sport: "Badminton",
    date: "2024-01-20",
    time: "18:00 - 19:00",
    status: "confirmed",
    price: 25
  },
  {
    id: 2,
    venue: "Prime Court Arena",
    court: "Tennis Court A",
    sport: "Tennis",
    date: "2024-01-22",
    time: "16:00 - 18:00",
    status: "confirmed",
    price: 80
  },
  {
    id: 3,
    venue: "SportZone Central",
    court: "Court 3",
    sport: "Badminton",
    date: "2024-01-15",
    time: "19:00 - 20:00",
    status: "completed",
    price: 20
  },
  {
    id: 4,
    venue: "Champions Arena",
    court: "Squash Court 1",
    sport: "Squash",
    date: "2024-01-10",
    time: "17:00 - 18:00",
    status: "cancelled",
    price: 35
  }
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone
  });

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = (bookingId: number) => {
    // Handle booking cancellation
    console.log("Cancelling booking:", bookingId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-success">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const upcomingBookings = bookingsData.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.date) >= new Date()
  );
  
  const pastBookings = bookingsData.filter(booking => 
    booking.status === 'completed' || new Date(booking.date) < new Date()
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-lg">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{userData.name}</CardTitle>
                <CardDescription>
                  Member since {userData.joinedDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{userData.totalBookings}</div>
                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{userData.favoritesSports.length}</div>
                    <div className="text-sm text-muted-foreground">Sports Played</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Favorite Sports</h4>
                  <div className="flex flex-wrap gap-1">
                    {userData.favoritesSports.map((sport) => (
                      <Badge key={sport} variant="secondary" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                <TabsTrigger value="profile">Profile Settings</TabsTrigger>
              </TabsList>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-6">
                {/* Upcoming Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Bookings
                    </CardTitle>
                    <CardDescription>
                      Your confirmed bookings for upcoming dates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
                        <p className="text-muted-foreground mb-4">Book a venue to start playing!</p>
                        <Button variant="hero">Browse Venues</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <div key={booking.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{booking.venue}</h3>
                                  {getStatusBadge(booking.status)}
                                </div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{booking.court} - {booking.sport}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{booking.date} at {booking.time}</span>
                                  </div>
                                </div>
                                <div className="font-medium text-primary">₹{booking.price}</div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCancel(booking.id)}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Past Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Booking History</CardTitle>
                    <CardDescription>
                      Your past and cancelled bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <div key={booking.id} className="p-4 border rounded-lg opacity-75">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{booking.venue}</h3>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{booking.court} - {booking.sport}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{booking.date} at {booking.time}</span>
                                </div>
                              </div>
                              <div className="font-medium">₹{booking.price}</div>
                            </div>
                            {booking.status === 'completed' && (
                              <Button variant="outline" size="sm">
                                <Star className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Settings Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSave} variant="hero">
                            Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              setFormData({
                                name: userData.name,
                                email: userData.email,
                                phone: userData.phone
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;