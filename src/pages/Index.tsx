import React, { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import UserProfile from '@/components/UserProfile';
import CreateListing from '@/components/CreateListing';
import MarketplaceGrid from '@/components/MarketplaceGrid';
import Navigation from '@/components/Navigation';
import { Listing } from '@/components/CreateListing';
import { GraduationCap } from 'lucide-react';
import heroImage from '@/assets/marketplace-hero.jpg';

interface User {
  name: string;
  email: string;
  bio?: string;
  joinedDate?: string;
  listings?: number;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeSection, setActiveSection] = useState<'marketplace' | 'profile'>('marketplace');

  // Load user and listings from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('marketplace-user');
    const savedListings = localStorage.getItem('marketplace-listings');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedListings) {
      setListings(JSON.parse(savedListings));
    } else {
      // Add some sample listings for demo
      const sampleListings: Listing[] = [
        {
          id: '1',
          title: 'Calculus Textbook - Early Transcendentals',
          description: 'Excellent condition calculus textbook. Used for one semester only. All pages intact, minimal highlighting.',
          price: 85.00,
          condition: 'like-new',
          category: 'Textbooks',
          tags: ['math', 'calculus', 'stewart'],
          seller: 'Sarah Chen',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        },
        {
          id: '2', 
          title: 'MacBook Pro 13" M1 Chip',
          description: 'Barely used MacBook Pro with M1 chip. Perfect for computer science students. Includes original charger and box.',
          price: 950.00,
          condition: 'like-new',
          category: 'Electronics',
          tags: ['laptop', 'apple', 'programming'],
          seller: 'Alex Rodriguez',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        },
        {
          id: '3',
          title: 'Organic Chemistry Study Guide',
          description: 'Comprehensive study guide with practice problems. Helped me get an A in organic chemistry!',
          price: 25.00,
          condition: 'good',
          category: 'Textbooks',
          tags: ['chemistry', 'study-guide', 'organic'],
          seller: 'Emma Watson',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        }
      ];
      setListings(sampleListings);
      localStorage.setItem('marketplace-listings', JSON.stringify(sampleListings));
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('marketplace-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('marketplace-user');
    }
  }, [user]);

  // Save listings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('marketplace-listings', JSON.stringify(listings));
  }, [listings]);

  const handleLogin = (userData: { name: string; email: string }) => {
    const newUser: User = {
      ...userData,
      bio: '',
      joinedDate: 'January 2024',
      listings: listings.filter(l => l.seller === userData.name).length,
    };
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveSection('marketplace');
  };

  const handleUpdateBio = (bio: string) => {
    if (user) {
      const updatedUser = { ...user, bio };
      setUser(updatedUser);
    }
  };

  const handleCreateListing = (listingData: Omit<Listing, 'id' | 'createdAt'>) => {
    const newListing: Listing = {
      ...listingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setListings(prev => [newListing, ...prev]);
    
    // Update user's listing count
    if (user) {
      setUser(prev => prev ? { ...prev, listings: (prev.listings || 0) + 1 } : null);
    }
  };

  // If not logged in, show auth form
  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-marketplace-bg">
      <Navigation
        user={user}
        onLogout={handleLogout}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'marketplace' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl">
              <div 
                className="h-64 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
                <div className="relative h-full flex items-center px-8">
                  <div className="max-w-lg">
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                      Student <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Marketplace</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      Buy and sell items within your college community. From textbooks to electronics, find what you need from fellow students.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>✅ Verified .edu/.org emails only</span>
                      <span>✅ Safe campus trading</span>
                      <span>✅ Student prices</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Listing */}
            <CreateListing onCreateListing={handleCreateListing} userName={user.name} />
            
            {/* Marketplace Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Recent Listings</h2>
                <div className="text-sm text-muted-foreground">
                  {listings.length} active listings
                </div>
              </div>
              <MarketplaceGrid listings={listings} />
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
              <p className="text-muted-foreground">
                Manage your profile information and view your marketplace activity.
              </p>
            </div>
            <UserProfile user={user} onUpdateBio={handleUpdateBio} />
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-card border-t border-marketplace-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">
                Student Marketplace © 2024
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Safe trading for college communities
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
