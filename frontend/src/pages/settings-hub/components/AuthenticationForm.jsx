import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AuthenticationForm = ({ 
  onAuthenticate = () => {}, 
  isLoading = false,
  className = '' 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Focus on password input when component mounts
    const input = document.getElementById('parent-auth-password');
    if (input) {
      setTimeout(() => input?.focus(), 100);
    }
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!password?.trim()) {
      setError('Please enter your password');
      return;
    }

    setError('');
    
    try {
      // Mock authentication - in real app this would validate against backend
      if (password === 'parent123') {
        onAuthenticate(true);
      } else {
        setError('Incorrect password. Please try again. (Use: parent123)');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e?.target?.value);
    if (error) setError('');
  };

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-card rounded-lg shadow-medium border border-border p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-warning/10 rounded-full mx-auto mb-4">
            <Icon name="Shield" size={32} className="text-warning" />
          </div>
          <h2 className="text-xl font-heading font-semibold text-card-foreground mb-2">
            Parent Verification Required
          </h2>
          <p className="text-sm font-body text-muted-foreground">
            Please enter your password to access parental controls and settings
          </p>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              id="parent-auth-password"
              type={showPassword ? 'text' : 'password'}
              label="Parent Password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              error={error}
              required
              disabled={isLoading}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={!password?.trim()}
            iconName="Unlock"
            iconPosition="left"
          >
            {isLoading ? 'Verifying...' : 'Access Settings'}
          </Button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs font-caption text-muted-foreground">
              <p className="mb-1">
                <strong>Security Notice:</strong> This verification ensures only authorized parents can modify child settings.
              </p>
              <p>
                Your session will automatically expire after 30 minutes of inactivity.
              </p>
            </div>
          </div>
        </div>

        {/* Help Link */}
        <div className="text-center mt-4 pt-4 border-t border-border">
          <button
            type="button"
            className="text-xs font-caption text-primary hover:underline focus:outline-none focus:underline"
            onClick={() => {
              alert('Password reset functionality would be implemented here. For demo, use: parent123');
            }}
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationForm;