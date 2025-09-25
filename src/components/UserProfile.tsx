import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Edit3, Save, X, Mail, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface User {
  name: string;
  email: string;
  bio?: string;
  joinedDate?: string;
  listings?: number;
}

interface UserProfileProps {
  user: User;
  onUpdateBio: (bio: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateBio }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || '');

  const handleSave = () => {
    if (bio.length > 500) {
      toast({
        title: "Bio too long",
        description: "Bio must be less than 500 characters.",
        variant: "destructive",
      });
      return;
    }

    onUpdateBio(bio.trim());
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your bio has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setBio(user.bio || '');
    setIsEditing(false);
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDomain = (email: string): string => {
    return email.split('@')[1];
  };

  return (
    <Card className="marketplace-card border-marketplace-border">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-lg font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-foreground">
              {user.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
                {getDomain(user.email)}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {user.joinedDate || 'recently'}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{user.listings || 0} listings</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">About</h3>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-primary hover:text-accent hover:bg-primary/10"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="text-marketplace-success hover:text-marketplace-success/80"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell other students about yourself..."
                className="min-h-[100px] bg-input border-marketplace-border focus:ring-primary resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/500 characters
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {user.bio || "No bio added yet. Click edit to tell other students about yourself!"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;