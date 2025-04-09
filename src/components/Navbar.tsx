import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/App';
import { 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  LogOut,
  LayoutDashboard,
  Star,
  Newspaper,
  Settings,
  Sun,
  Moon,
  Monitor,
  BarChart2
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NotificationPanel from './NotificationPanel';
import SearchBar from './SearchBar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter
} from '@/components/ui/dialog';
import { LoadingSpinner } from './LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { path: '/watchlist', label: 'Watchlist', icon: <Star className="w-4 h-4 mr-2" /> },
    { path: '/news', label: 'News', icon: <Newspaper className="w-4 h-4 mr-2" /> },
    { path: '/paper-trading', label: 'Paper Trading', icon: <BarChart2 className="w-4 h-4 mr-2" /> },
  ];

  const handleLogoutClick = () =>{
    setShowLogoutConfirm(true);
  }

  const handleLogoutConfirm= () =>{
    setShowLogoutConfirm(false);
    setLoggingOut(true);
    logout()
    .then(() => {
      toast({
        title: 'Logout successful',
        description: 'You have been logged out successfully.',
      });
      navigate('/login');
    })
    .catch((error) => {
      toast({
        title: 'Logout failed',
        description: 'An error occurred while logging out.',
      });
    })
    .finally(() => {
      setLoggingOut(false);
    });
  }
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'system':
        return <Monitor className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogoutConfirm}
              disabled={loggingOut}
            >
              {loggingOut ? <LoadingSpinner /> : 'Logout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-[#E85D04] text-lg font-display font-medium">TradeAssist</span>
            </Link>
          </div>
          
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center">
                    {link.icon}
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <SearchBar />
            )}
            
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="mr-1">
                      {getThemeIcon()}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change theme</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isAuthenticated ? (
              <>
                <NotificationPanel />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer flex w-full items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleLogoutClick}
                      disabled={loggingOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
            
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>
        
        {isMobile && isMenuOpen && (
          <div className="md:hidden p-4 pt-0 pb-6 space-y-4 animate-slide-down">
            <div className="relative">
              <SearchBar />
            </div>
            
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium">
                <span className="flex items-center text-muted-foreground">
                  {getThemeIcon()}
                  <span className="ml-2">Theme</span>
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="h-8 w-8 p-0"
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="h-8 w-8 p-0"
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTheme('system')}
                    className="h-8 w-8 p-0"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center">
                    {link.icon}
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
