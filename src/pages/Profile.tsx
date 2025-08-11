import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, MapPin, Calendar, Clock, Star, X, Filter } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { userApi, bookingsApi, handleApiSuccess } from "@/services/api";

interface Booking {
  id: number;
  venue: string;
  court: string;
  sport: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  price: number;
  location?: string;
}

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch user bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoadingBookings(true);
        const response = await bookingsApi.getUserBookings();
        const data = await response.json();

        if (response.ok) {
          setBookings(data.bookings || []);
        } else {
          toast(data.message || "Failed to load bookings");
        }
      } catch (error) {
        console.error('Fetch bookings error:', error);
        toast("Network error. Please try again.");
      } finally {
        setIsLoadingBookings(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const response = await userApi.updateProfile(formData);
      const data = await handleApiSuccess(response);

      // Update user context with new data
      updateUser(formData);
      
      toast("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      toast(error instanceof Error ? error.message : "Failed to update profile");
    }
  };

  const handleCancel = async (bookingId: number) => {
    try {
      const response = await bookingsApi.cancel(bookingId);
      const data = await handleApiSuccess(response);

      // Update bookings list
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      ));
      
      toast("Booking cancelled successfully!");
    } catch (error) {
      console.error('Cancel booking error:', error);
      toast(error instanceof Error ? error.message : "Failed to cancel booking");
    }
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

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.date) >= new Date()
  );
  
  const filteredPastBookings = bookings.filter(booking => {
    const isPast = booking.status === 'completed' || booking.status === 'cancelled' || new Date(booking.date) < new Date();
    const matchesDate = !dateFilter || booking.date.includes(dateFilter);
    const matchesStatus = !statusFilter || statusFilter === "all" || booking.status === statusFilter;
    return isPast && matchesDate && matchesStatus;
  });

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const totalBookings = bookings.length;
  const sportsPlayed = new Set(bookings.map(b => b.sport)).size;

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
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-lg">
                    {user?.name ? getUserInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.name}</CardTitle>
                <CardDescription>
                  Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{totalBookings}</div>
                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{sportsPlayed}</div>
                    <div className="text-sm text-muted-foreground">Sports Played</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recent Sports</h4>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Set(bookings.slice(0, 5).map(b => b.sport))).map((sport) => (
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
                    {isLoadingBookings ? (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">⏳</div>
                        <h3 className="text-lg font-medium mb-2">Loading bookings...</h3>
                        <p className="text-muted-foreground">Please wait while we fetch your bookings</p>
                      </div>
                    ) : upcomingBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
                        <p className="text-muted-foreground mb-4">Book a venue to start playing!</p>
                        <Button variant="hero" onClick={() => window.location.href = '/venues'}>Browse Venues</Button>
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
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Booking History</CardTitle>
                        <CardDescription>
                          Your past and cancelled bookings
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by date" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Dates</SelectItem>
                            <SelectItem value="2024-01">January 2024</SelectItem>
                            <SelectItem value="2023-12">December 2023</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredPastBookings.map((booking) => (
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
                                name: user?.name || "",
                                email: user?.email || "",
                                phone: user?.phone || ""
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