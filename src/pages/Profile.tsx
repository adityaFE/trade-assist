
import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import { getRandomAvatar, getAvatarWithStyle, AVATAR_STYLES } from '@/lib/avatar';
import { updateUserAvatar } from '@/store/authStore';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter
} from '@/components/ui/dialog';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(AVATAR_STYLES[0]);
  const [previewAvatar, setPreviewAvatar] = useState('');

  const handleRandomAvatar = async () => {
    if (!user) return;
    
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

  const openAvatarSelector = () => {
    if (!user) return;
    // Generate preview with current style
    const preview = getAvatarWithStyle(selectedStyle, user.name || user.email);
    setPreviewAvatar(preview);
    setShowAvatarDialog(true);
  };

  const handleStyleChange = (style: string) => {
    if (!user) return;
    setSelectedStyle(style);
    // Update preview
    const preview = getAvatarWithStyle(style, user.name || user.email);
    setPreviewAvatar(preview);
  };

  const saveSelectedAvatar = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await updateUserAvatar(previewAvatar);
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile avatar has been updated with your selected style.',
      });
      setShowAvatarDialog(false);
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
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-medium">Profile Photo</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground mb-4">
                  {user?.isGoogleUser ? 'Google account' : 'Email account'}
                </p>
                <div className="w-full space-y-2">
                  <Button 
                    variant="default" 
                    onClick={openAvatarSelector}
                    disabled={isUpdating || user?.isGoogleUser}
                    className="w-full"
                  >
                    {isUpdating ? 'Updating...' : 'Choose Avatar Style'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRandomAvatar}
                    disabled={isUpdating || user?.isGoogleUser}
                    className="w-full"
                  >
                    Generate Random Avatar
                  </Button>
                </div>
                {user?.isGoogleUser && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Avatar is managed by your Google account
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={user?.name} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={user?.email} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-type">Account Type</Label>
                  <Input 
                    id="account-type" 
                    value={user?.isGoogleUser ? 'Google Sign-In' : 'Email and Password'} 
                    readOnly 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Avatar Style Selection Dialog */}
        <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Choose Avatar Style</DialogTitle>
              <DialogDescription>
                Select a style for your profile avatar
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center space-y-4 py-4">
              <Avatar className="h-32 w-32 mb-2">
                <AvatarImage src={previewAvatar} alt="Preview" />
                <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="grid grid-cols-3 gap-2 w-full">
                {AVATAR_STYLES.map((style) => (
                  <Button
                    key={style}
                    variant={selectedStyle === style ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => handleStyleChange(style)}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAvatarDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={saveSelectedAvatar} 
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Avatar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Profile;
