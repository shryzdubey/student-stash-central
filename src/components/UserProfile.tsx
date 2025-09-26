import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Edit3, Save, X, Mail, Calendar, Camera, Shield, Star, Plus, MessageSquare, Package, Heart, GraduationCap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface User {
  name: string;
  email: string;
  bio?: string;
  major?: string;
  skills?: string;
  lookingFor?: string;
  joinedDate?: string;
  listings?: number;
  profilePicture?: string;
  rating?: number;
  totalReviews?: number;
  isVerified?: boolean;
  isCollegeVerified?: boolean;
}

interface UserProfileProps {
  user: User;
  onUpdateBio: (bio: string) => void;
  onUpdateProfile?: (updates: Partial<User>) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateBio, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: user.bio || '',
    major: user.major || '',
    skills: user.skills || '',
    lookingFor: user.lookingFor || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (profileData.bio.length > 500) {
      toast({
        title: "Bio too long",
        description: "Bio must be less than 500 characters.",
        variant: "destructive",
      });
      return;
    }

    onUpdateBio(profileData.bio.trim());
    onUpdateProfile?.(profileData);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setProfileData({
      bio: user.bio || '',
      major: user.major || '',
      skills: user.skills || '',
      lookingFor: user.lookingFor || ''
    });
    setIsEditing(false);
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onUpdateProfile?.({ profilePicture: imageUrl });
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDomain = (email: string): string => {
    return email.split('@')[1];
  };

  const isEduOrg = (email: string): boolean => {
    const domain = getDomain(email);
    return domain.endsWith('.edu') || domain.endsWith('.org');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="marketplace-card border-marketplace-border">
        <CardHeader className="pb-4">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-primary/20">
                <AvatarImage src={user.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background border-2 border-primary/20 p-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-4 h-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-xl font-bold text-foreground">
                  {user.name}
                </CardTitle>
                {user.isVerified && (
                  <Shield className="w-4 h-4 text-blue-500" />
                )}
                {isEduOrg(user.email) && (
                  <GraduationCap className="w-4 h-4 text-primary" />
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {getDomain(user.email)}
                </Badge>
              </div>
              
              {/* Rating */}
              {user.rating && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {renderStars(user.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {user.rating}/5 ({user.totalReviews || 0} reviews)
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user.joinedDate || 'recently'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{user.listings || 0} listings</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Listing
              </Button>
              <Button variant="outline" className="justify-start" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
              <Button variant="outline" className="justify-start" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Saved Items
              </Button>
              <Button variant="outline" className="justify-start" size="sm">
                <Package className="w-4 h-4 mr-2" />
                My Listings
              </Button>
            </div>
          </div>

          <Separator />

          {/* Profile Information */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Profile Information</h3>
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
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Major/Field of Study</label>
                  <Input
                    value={profileData.major}
                    onChange={(e) => setProfileData(prev => ({ ...prev, major: e.target.value }))}
                    placeholder="e.g., Computer Science, Business Administration"
                    className="bg-input border-marketplace-border"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Skills & Interests</label>
                  <Input
                    value={profileData.skills}
                    onChange={(e) => setProfileData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="e.g., Programming, Photography, Music"
                    className="bg-input border-marketplace-border"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Looking For</label>
                  <Input
                    value={profileData.lookingFor}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lookingFor: e.target.value }))}
                    placeholder="e.g., Study partner, Used textbooks, Electronics"
                    className="bg-input border-marketplace-border"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">About Me</label>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell other students about yourself..."
                    className="min-h-[100px] bg-input border-marketplace-border focus:ring-primary resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {profileData.bio.length}/500 characters
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {user.major && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Major:</span>
                    <p className="text-sm text-foreground">{user.major}</p>
                  </div>
                )}
                
                {user.skills && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Skills & Interests:</span>
                    <p className="text-sm text-foreground">{user.skills}</p>
                  </div>
                )}
                
                {user.lookingFor && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Looking For:</span>
                    <p className="text-sm text-foreground">{user.lookingFor}</p>
                  </div>
                )}
                
                <div>
                  <span className="text-xs font-medium text-muted-foreground">About Me:</span>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    {user.bio || "No bio added yet. Click edit to tell other students about yourself!"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats & Activity Card */}
      <Card className="marketplace-card border-marketplace-border">
        <CardHeader>
          <CardTitle className="text-lg">Activity & Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{user.listings || 0}</div>
              <div className="text-xs text-muted-foreground">Active Listings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{user.rating || 0}</div>
              <div className="text-xs text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-marketplace-success">{user.totalReviews || 0}</div>
              <div className="text-xs text-muted-foreground">Total Reviews</div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Verification Status</h4>
            <div className="flex flex-wrap gap-2">
              {user.isVerified && (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Email Verified
                </Badge>
              )}
              {isEduOrg(user.email) && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  College Verified
                </Badge>
              )}
              {!user.isVerified && (
                <Badge variant="outline" className="text-muted-foreground">
                  Pending Verification
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;