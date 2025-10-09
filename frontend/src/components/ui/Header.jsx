import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user = null, onSignOut = () => {}, className = '' }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSignOut = () => {
    setIsProfileOpen(false);
    onSignOut();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft ${className}`}>
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Hand" size={24} color="white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-heading font-bold text-foreground">BuddySign</h1>
            <p className="text-xs font-caption text-muted-foreground hidden sm:block">
              Learn sign language with your panda friend
            </p>
          </div>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="relative" ref={profileRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProfileToggle}
              className="flex items-center space-x-2 hover:bg-muted/50 transition-smooth"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <span className="font-body text-sm text-foreground hidden md:block">
                {user?.name || 'User'}
              </span>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
              />
            </Button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-medium animate-fade-in">
                <div className="p-3 border-b border-border">
                  <p className="font-body font-medium text-sm text-popover-foreground">
                    {user?.name || 'User'}
                  </p>
                  <p className="font-caption text-xs text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-body text-popover-foreground hover:bg-muted/50 rounded-md transition-smooth"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-body text-popover-foreground hover:bg-muted/50 rounded-md transition-smooth"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-body text-destructive hover:bg-destructive/10 rounded-md transition-smooth"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sign In Button for non-authenticated users */}
        {!user && (
          <Button
            variant="default"
            size="sm"
            iconName="LogIn"
            iconPosition="left"
            onClick={() => window.location.href = '/sign-in-sign-up'}
            className="font-body"
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;