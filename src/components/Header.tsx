import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Search, Menu, MapPin } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

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
          <Link 
            to="/venues" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/venues') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Venues
          </Link>
          <Link 
            to="/profile" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/profile') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            My Bookings
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>
          
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

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;