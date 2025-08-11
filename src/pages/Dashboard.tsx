import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import EditFacilityDialog from "@/components/EditFacilityDialog";
import PhotoUpload from "@/components/PhotoUpload";
import CourtManagement from "@/components/CourtManagement";
import { toast } from "@/components/ui/sonner";
import { facilityApi, handleApiSuccess } from "@/services/api";
import { 
  BarChart, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock, 
  MapPin,
  Plus,
  MoreHorizontal,
  CheckCircle,
  XCircle
} from "lucide-react";

// Mock data for facility owner dashboard
const dashboardStats = {
  totalBookings: 156,
  activeCourts: 8,
  monthlyEarnings: 45000,
  occupancyRate: 78
};

const recentBookings = [
  {
    id: 1,
    user: "John Doe",
    court: "Court 1",
    sport: "Badminton",
    date: "2024-01-20",
    time: "18:00 - 19:00",
    status: "confirmed",
    amount: 25
  },
  {
    id: 2,
    user: "Sarah Smith",
    court: "Tennis Court A",
    sport: "Tennis", 
    date: "2024-01-20",
    time: "16:00 - 18:00",
    status: "confirmed",
    amount: 80
  },
  {
    id: 3,
    user: "Mike Johnson",
    court: "Court 2",
    sport: "Badminton",
    date: "2024-01-19",
    time: "19:00 - 20:00",
    status: "completed",
    amount: 25
  }
];

const facilityData = {
  name: "Elite Sports Complex",
  location: "Downtown, City Center",
  description: "Premium sports facility with world-class amenities",
  sports: ["Badminton", "Tennis", "Basketball"],
  amenities: ["Parking", "Cafeteria", "Changing Rooms", "WiFi"]
};

const courtsData = [
  { id: 1, name: "Court 1", sport: "Badminton", pricePerHour: 25, status: "active" },
  { id: 2, name: "Court 2", sport: "Badminton", pricePerHour: 25, status: "active" },
  { id: 3, name: "Tennis Court A", sport: "Tennis", pricePerHour: 40, status: "active" },
  { id: 4, name: "Basketball Court", sport: "Basketball", pricePerHour: 60, status: "maintenance" }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleAcceptBooking = async (bookingId: number) => {
    try {
      const response = await facilityApi.acceptBooking(bookingId);
      const data = await handleApiSuccess(response);
      
      toast("Booking accepted successfully!");
      // Refresh bookings data
    } catch (error) {
      console.error('Accept booking error:', error);
      toast(error instanceof Error ? error.message : "Failed to accept booking");
    }
  };

  const handleRejectBooking = async (bookingId: number) => {
    try {
      const response = await facilityApi.rejectBooking(bookingId);
      const data = await handleApiSuccess(response);
      
      toast("Booking rejected successfully!");
      // Refresh bookings data
    } catch (error) {
      console.error('Reject booking error:', error);
      toast(error instanceof Error ? error.message : "Failed to reject booking");
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
      case 'active':
        return <Badge variant="default" className="bg-success">Active</Badge>;
      case 'maintenance':
        return <Badge variant="destructive">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Facility Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening at your facility.</p>
          </div>
          <Button variant="hero" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Court
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="facility">Facility</TabsTrigger>
            <TabsTrigger value="courts">Courts</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{dashboardStats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Courts</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{dashboardStats.activeCourts}</div>
                  <p className="text-xs text-muted-foreground">2 in maintenance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">₹{dashboardStats.monthlyEarnings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{dashboardStats.occupancyRate}%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>Daily bookings over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Chart will be implemented</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours</CardTitle>
                  <CardDescription>Most popular booking times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Heatmap will be implemented</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest bookings at your facility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{booking.user}</span>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.court} • {booking.sport} • {booking.date} at {booking.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-primary">₹{booking.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facility Management Tab */}
          <TabsContent value="facility">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Facility Information
                </CardTitle>
                <CardDescription>
                  Manage your facility details and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Facility Name</h4>
                    <p className="text-muted-foreground">{facilityData.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <p className="text-muted-foreground">{facilityData.location}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{facilityData.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Sports Available</h4>
                  <div className="flex flex-wrap gap-2">
                    {facilityData.sports.map((sport) => (
                      <Badge key={sport} variant="secondary">{sport}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {facilityData.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline">{amenity}</Badge>
                    ))}
                  </div>
                </div>

                <EditFacilityDialog 
                  facilityData={facilityData}
                  onSave={() => {
                    // Refresh facility data
                    toast("Facility data refreshed");
                  }}
                />
                
                <div className="mt-6">
                  <PhotoUpload />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courts Management Tab */}
          <TabsContent value="courts">
            <CourtManagement 
              courts={courtsData}
              onUpdate={() => {
                // Refresh courts data
                toast("Courts data refreshed");
              }}
            />
          </TabsContent>

          {/* Bookings Overview Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Overview
                </CardTitle>
                <CardDescription>
                  View and manage all bookings at your facility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{booking.user}</span>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.court} • {booking.sport}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {booking.date} at {booking.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-medium text-primary">₹{booking.amount}</div>
                        </div>
                        {booking.status === 'confirmed' && (
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAcceptBooking(booking.id)}
                              className="text-success hover:text-success"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRejectBooking(booking.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;