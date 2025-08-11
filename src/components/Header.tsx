import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Search, Menu, MapPin, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AdminAccessDialog from "./AdminAccessDialog";
import { toast } from "@/components/ui/sonner";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast("Logged out successfully!");
      navigate('/');
    } catch (error) {
      toast("Logout failed. Please try again.");
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleBasedDashboard = (role: string) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'facility_owner':
        return '/dashboard';
      default:
        return '/profile';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">QuickCourt</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated && (
            <>
              <Link 
                to="/venues" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/venues') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Venues
              </Link>
              <Link 
                to={getRoleBasedDashboard(user?.role || 'user')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/profile') || isActive('/dashboard') || isActive('/admin/dashboard') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {user?.role === 'admin' ? 'Admin Panel' : user?.role === 'facility_owner' ? 'Dashboard' : 'My Bookings'}
              </Link>
            </>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>
          
          {!isAuthenticated ? (
            <>
              <AdminAccessDialog />
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              
              <Link to="/register">
                <Button variant="hero" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials(user?.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate(getRoleBasedDashboard(user?.role || 'user'))}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{user?.role === 'admin' ? 'Admin Panel' : user?.role === 'facility_owner' ? 'Dashboard' : 'Profile'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;