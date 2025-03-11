import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const { user, logout } = useAuth();
  const [_, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data: notifications = [] } = useQuery({
    queryKey: [`/api/notifications/${user?.id}`],
    enabled: !!user,
  });
  
  const unreadCount = notifications.filter((n: any) => !n.read).length;
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <header className="bg-void-black border-b border-resistance-red">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-space font-bold">
            <span className="text-matrix-green">&lt;</span>
            <span className="text-resistance-red">Exit</span>Node
            <span className="text-matrix-green">&gt;</span>
          </h1>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="text-stark-white opacity-70 hover:opacity-100 hover:text-matrix-green transition">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/#leaderboard" className="text-stark-white opacity-70 hover:opacity-100 hover:text-matrix-green transition">
                Leaderboard
              </a>
            </li>
            <li>
              <a href="/#network" className="text-stark-white opacity-70 hover:opacity-100 hover:text-matrix-green transition">
                Network
              </a>
            </li>
            <li>
              <a href="/#resources" className="text-stark-white opacity-70 hover:opacity-100 hover:text-matrix-green transition">
                Resources
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-stark-white focus:outline-none p-0 relative">
                      <i className="fas fa-bell"></i>
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-resistance-red text-xs w-4 h-4 rounded-full flex items-center justify-center">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-deep-space border border-resistance-red">
                    <DropdownMenuItem className="text-matrix-green">View all notifications</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 focus:outline-none p-0">
                    <div className="w-8 h-8 rounded-full bg-resistance-red flex items-center justify-center text-void-black font-bold">
                      {user.avatarInitials}
                    </div>
                    <span className="hidden md:inline-block">#{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-deep-space border border-resistance-red">
                  <DropdownMenuItem className="text-matrix-green">Profile</DropdownMenuItem>
                  <DropdownMenuItem className="text-matrix-green">Settings</DropdownMenuItem>
                  <DropdownMenuItem className="text-resistance-red" onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              className="bg-void-black border border-resistance-red hover:bg-resistance-red hover:text-void-black transition"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
          
          <Button 
            className="md:hidden text-stark-white p-0" 
            variant="ghost"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-void-black border-t border-resistance-red py-2">
          <div className="container mx-auto px-4">
            <ul className="space-y-2">
              <li>
                <a 
                  href="/" 
                  className="block py-2 text-stark-white hover:text-matrix-green"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="/#leaderboard" 
                  className="block py-2 text-stark-white hover:text-matrix-green"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Leaderboard
                </a>
              </li>
              <li>
                <a 
                  href="/#network" 
                  className="block py-2 text-stark-white hover:text-matrix-green"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Network
                </a>
              </li>
              <li>
                <a 
                  href="/#resources" 
                  className="block py-2 text-stark-white hover:text-matrix-green"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
