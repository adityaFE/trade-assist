
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun, Monitor, Lock, Info, AlertCircle } from 'lucide-react';
import { getRandomAvatar } from '@/lib/avatar';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { user, updateUserPassword, updateUserAvatar } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.isGoogleUser) return;
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'New password and confirmation do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      await updateUserPassword(currentPassword, newPassword);
      
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully changed.',
      });
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: 'Failed to update password',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleChangeAvatar = async () => {
    if (!user || user.isGoogleUser) return;
    
    setIsUpdating(true);
    try {
      const newAvatar = getRandomAvatar(user.name);
      await updateUserAvatar(newAvatar);
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile avatar has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Failed to update avatar',
        description: 'There was an error updating your avatar.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your account password
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.isGoogleUser ? (
                  <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Google Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Your account is managed by Google. To change your password, visit your Google account settings.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Change your profile picture
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.isGoogleUser ? (
                  <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Google Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Your profile picture is managed by Google. To change it, update your Google account.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start space-y-4">
                    <Button 
                      onClick={handleChangeAvatar}
                      disabled={isUpdating}
                    >
                      Generate New Avatar
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      This will generate a new random avatar for your profile.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-5 w-5" />
                      <Label htmlFor="theme-light">Light</Label>
                    </div>
                    <Switch 
                      id="theme-light" 
                      checked={theme === 'light'} 
                      onCheckedChange={() => setTheme('light')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-5 w-5" />
                      <Label htmlFor="theme-dark">Dark</Label>
                    </div>
                    <Switch 
                      id="theme-dark" 
                      checked={theme === 'dark'} 
                      onCheckedChange={() => setTheme('dark')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-5 w-5" />
                      <Label htmlFor="theme-system">System</Label>
                    </div>
                    <Switch 
                      id="theme-system" 
                      checked={theme === 'system'} 
                      onCheckedChange={() => setTheme('system')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage your notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="price-alerts" className="font-medium">Price Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about significant price changes for stocks in your watchlist
                      </p>
                    </div>
                    <Switch id="price-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="news-updates" className="font-medium">News Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about important news for your watched stocks
                      </p>
                    </div>
                    <Switch id="news-updates" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="market-summaries" className="font-medium">Market Summaries</Label>
                      <p className="text-sm text-muted-foreground">
                        Get daily summaries of market performance
                      </p>
                    </div>
                    <Switch id="market-summaries" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
