import React from 'react';
import Button from '../../../components/ui/Button';

const AuthToggle = ({ activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`flex bg-muted/30 rounded-lg p-1 ${className}`}>
      <Button
        variant={activeTab === 'signin' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTabChange('signin')}
        className={`flex-1 transition-all duration-200 ${
          activeTab === 'signin' ?'shadow-soft' :'hover:bg-muted/50'
        }`}
      >
        Sign In
      </Button>
      <Button
        variant={activeTab === 'signup' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTabChange('signup')}
        className={`flex-1 transition-all duration-200 ${
          activeTab === 'signup' ?'shadow-soft' :'hover:bg-muted/50'
        }`}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default AuthToggle;