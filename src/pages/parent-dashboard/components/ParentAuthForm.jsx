import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ParentAuthForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await onLogin(credentials);
      if (!success) {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl shadow-soft border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4"
          >
            <Icon name="Shield" size={32} color="white" />
          </motion.div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Parent Authentication Required
          </h2>
          <p className="text-sm font-body text-muted-foreground">
            Please verify your identity to access the secure parent dashboard
          </p>
        </div>
      </div>
      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-accent/10 border border-accent/20 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-accent mt-0.5" />
              <div>
                <h4 className="text-sm font-body font-semibold text-foreground">
                  Security Notice
                </h4>
                <p className="text-xs font-caption text-muted-foreground mt-1">
                  This secure area requires password authentication. Sessions automatically expire after 30 minutes of inactivity for safety.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-body font-medium text-foreground mb-2">
              Parent Email Address
            </label>
            <div className="relative">
              <Input
                type="email"
                value={credentials?.email}
                onChange={(e) => handleChange('email', e?.target?.value)}
                placeholder="Enter your registered email"
                className="pl-10"
                required
              />
              <Icon 
                name="Mail" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-body font-medium text-foreground mb-2">
              Parent Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={credentials?.password}
                onChange={(e) => handleChange('password', e?.target?.value)}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                required
              />
              <Icon 
                name="Lock" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-3"
            >
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-destructive" />
                <p className="text-sm font-body text-destructive">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-success/10 border border-success/20 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <Icon name="Key" size={18} className="text-success mt-0.5" />
              <div>
                <h4 className="text-sm font-body font-semibold text-foreground">
                  Demo Login Credentials
                </h4>
                <div className="text-xs font-caption text-muted-foreground mt-1 space-y-1">
                  <div><strong>Email:</strong> parent@buddysign.com</div>
                  <div><strong>Password:</strong> parent123</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="submit"
              disabled={isLoading || !credentials?.email || !credentials?.password}
              className="w-full flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Icon name="Unlock" size={18} />
                  <span>Access Parent Dashboard</span>
                </>
              )}
            </Button>
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="pt-4 border-t border-border"
          >
            <h4 className="text-sm font-body font-semibold text-foreground mb-3">
              Security Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-caption text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={14} className="text-accent" />
                <span>Auto-logout after 30 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={14} className="text-success" />
                <span>Encrypted session management</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Eye" size={14} className="text-primary" />
                <span>Child activity monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Lock" size={14} className="text-secondary" />
                <span>Data privacy protection</span>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default ParentAuthForm;  