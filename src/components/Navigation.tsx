import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, User, LogOut, Home, ShoppingBag } from 'lucide-react';

interface NavigationProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
  activeSection: 'marketplace' | 'profile';
  onSectionChange: (section: 'marketplace' | 'profile') => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout, activeSection, onSectionChange }) => {
  if (!user) return null;

  return (
    <nav className="bg-card border-b border-marketplace-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center glow-effect">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Student Marketplace
              </h1>
              <p className="text-xs text-muted-foreground">
                College community trading
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Button
              variant={activeSection === 'marketplace' ? 'default' : 'ghost'}
              onClick={() => onSectionChange('marketplace')}
              className={activeSection === 'marketplace' 
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
              }
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Marketplace
            </Button>
            
            <Button
              variant={activeSection === 'profile' ? 'default' : 'ghost'}
              onClick={() => onSectionChange('profile')}
              className={activeSection === 'profile' 
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
              }
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-marketplace-border">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email.split('@')[1]}</p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;