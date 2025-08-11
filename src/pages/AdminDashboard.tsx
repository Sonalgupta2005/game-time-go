import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Building, 
  Calendar, 
  TrendingUp,
  BarChart3,
  UserCheck,
  Shield,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  UserX
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { adminApi, handleApiSuccess } from "@/services/api";

// Mock data - replace with API calls
const mockStats = {
  totalUsers: 1250,
  totalFacilityOwners: 85,
  totalBookings: 3420,
  totalActiveCourts: 156
};

const mockPendingFacilities = [
  {
    id: 1,
    name: "SportZone Elite",
    owner: "John Smith",
    location: "Downtown",
    sports: ["Tennis", "Badminton"],
    submittedDate: "2024-01-15",
    status: "pending"
  },
  {
    id: 2,
    name: "Premier Courts",
    owner: "Sarah Johnson",
    location: "Uptown",
    sports: ["Basketball", "Football"],
    submittedDate: "2024-01-14",
    status: "pending"
  }
];

const mockUsers = [
  {
    id: 1,
    name: "Alice Cooper",
    email: "alice@example.com",
    role: "user",
    status: "active",
    joinedDate: "2023-12-01",
    totalBookings: 15
  },
  {
    id: 2,
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "facility_owner",
    status: "active",
    joinedDate: "2023-11-15",
    totalBookings: 0
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "user",
    status: "banned",
    joinedDate: "2023-10-20",
    totalBookings: 25
  }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(mockStats);
  const [pendingFacilities, setPendingFacilities] = useState(mockPendingFacilities);
  const [users, setUsers] = useState(mockUsers);
  const [userFilter, setUserFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Load admin stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await adminApi.getStats();
        const data = await handleApiSuccess(response);
        setStats(data);
      } catch (error) {
        console.error('Load stats error:', error);
        // Use mock data on error
      }
    };

    loadStats();
  }, []);

  const handleApproveFacility = async (facilityId: number) => {
    try {
      const response = await adminApi.approveFacility(facilityId, "Approved after review");
      const data = await handleApiSuccess(response);
      
      toast("Facility approved successfully!");
      setPendingFacilities(prev => prev.filter(f => f.id !== facilityId));
    } catch (error) {
      console.error('Approve facility error:', error);
      toast(error instanceof Error ? error.message : "Failed to approve facility");
    }
  };

  const handleRejectFacility = async (facilityId: number) => {
    try {
      const response = await adminApi.rejectFacility(facilityId, "Rejected - incomplete information");
      const data = await handleApiSuccess(response);
      
      toast("Facility rejected successfully!");
      setPendingFacilities(prev => prev.filter(f => f.id !== facilityId));
    } catch (error) {
      console.error('Reject facility error:', error);
      toast(error instanceof Error ? error.message : "Failed to reject facility");
    }
  };

  const handleBanUser = async (userId: number) => {
    try {
      const response = await adminApi.banUser(userId);
      const data = await handleApiSuccess(response);
      
      toast("User banned successfully!");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'banned' } : u));
    } catch (error) {
      console.error('Ban user error:', error);
      toast(error instanceof Error ? error.message : "Failed to ban user");
    }
  };

  const handleUnbanUser = async (userId: number) => {
    try {
      const response = await adminApi.unbanUser(userId);
      const data = await handleApiSuccess(response);
      
      toast("User unbanned successfully!");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u));
    } catch (error) {
      console.error('Unban user error:', error);
      toast(error instanceof Error ? error.message : "Failed to unban user");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userFilter.toLowerCase()) ||
                         user.email.toLowerCase().includes(userFilter.toLowerCase());
    const matchesRole = !roleFilter || roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = !statusFilter || statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success">Active</Badge>;
      case 'banned':
        return <Badge variant="destructive">Banned</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'user':
        return <Badge variant="outline">User</Badge>;
      case 'facility_owner':
        return <Badge variant="secondary">Facility Owner</Badge>;
      case 'admin':
        return <Badge variant="default">Admin</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">System management and oversight</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Facility Owners</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalFacilityOwners}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Courts</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalActiveCourts}</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Activity Over Time</CardTitle>
                  <CardDescription>Daily booking trends for the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Chart will be implemented</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Registration Trends</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Chart will be implemented</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <CardTitle>Facility Approval</CardTitle>
                <CardDescription>
                  Review and approve pending facility registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingFacilities.map((facility) => (
                    <div key={facility.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{facility.name}</h3>
                            {getStatusBadge(facility.status)}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>Owner: {facility.owner}</div>
                            <div>Location: {facility.location}</div>
                            <div>Submitted: {facility.submittedDate}</div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {facility.sports.map((sport) => (
                                <Badge key={sport} variant="outline" className="text-xs">
                                  {sport}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApproveFacility(facility.id)}
                            className="text-success hover:text-success"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRejectFacility(facility.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {pendingFacilities.length === 0 && (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No pending facilities</h3>
                      <p className="text-muted-foreground">All facility registrations have been processed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage all users and facility owners
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="facility_owner">Facility Owner</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{user.name}</h3>
                            {getRoleBadge(user.role)}
                            {getStatusBadge(user.status)}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>Email: {user.email}</div>
                            <div>Joined: {user.joinedDate}</div>
                            <div>Total Bookings: {user.totalBookings}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View History
                          </Button>
                          {user.status === 'active' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleBanUser(user.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Ban className="h-3 w-3 mr-1" />
                              Ban User
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUnbanUser(user.id)}
                              className="text-success hover:text-success"
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Unban User
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>
                  Manage your admin account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Admin Profile Management</h3>
                  <p className="text-muted-foreground">Profile editing functionality will be implemented</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;