import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const AuthGateModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  onAuthenticate = () => {},
  targetPath = '',
  className = '' 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setIsLoading(false);
      // Focus on password input when modal opens
      setTimeout(() => {
        const input = document.getElementById('parent-password');
        if (input) input?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!password?.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would validate against actual parent credentials
      if (password === 'parent123') {
        onAuthenticate(targetPath);
        onClose();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${className}`}
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-card rounded-lg shadow-floating border border-border animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
              <Icon name="Lock" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-semibold text-card-foreground">
                Parent Verification
              </h2>
              <p className="text-sm font-caption text-muted-foreground">
                Settings require parent permission
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isLoading}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center mb-6">
            <p className="text-sm font-body text-muted-foreground">
              To access parental controls and settings, please enter your parent password.
            </p>
          </div>

          <Input
            id="parent-password"
            type="password"
            label="Parent Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e?.target?.value)}
            error={error}
            required
            disabled={isLoading}
            className="mb-4"
          />

          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isLoading}
              disabled={!password?.trim()}
              className="flex-1"
            >
              {isLoading ? 'Verifying...' : 'Continue'}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs font-caption text-muted-foreground">
              Forgot your password?{' '}
              <button
                type="button"
                className="text-primary hover:underline focus:outline-none focus:underline"
                onClick={() => {
                  // In a real app, this would trigger password reset flow
                  alert('Password reset functionality would be implemented here');
                }}
              >
                Reset it here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthGateModal;