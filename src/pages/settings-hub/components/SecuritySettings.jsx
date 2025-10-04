import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecuritySettings = ({ className = '' }) => {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: true,
    loginNotifications: true,
    dataEncryption: true,
    biometricAuth: false,
    autoLogout: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const securityOptions = [
    {
      key: 'twoFactorAuth',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: 'Shield',
      color: 'text-primary',
      recommended: true
    },
    {
      key: 'sessionTimeout',
      title: 'Automatic Session Timeout',
      description: 'Automatically log out after 30 minutes of inactivity',
      icon: 'Clock',
      color: 'text-warning',
      recommended: true
    },
    {
      key: 'loginNotifications',
      title: 'Login Notifications',
      description: 'Get notified when someone accesses your account',
      icon: 'Bell',
      color: 'text-success',
      recommended: true
    },
    {
      key: 'dataEncryption',
      title: 'Data Encryption',
      description: 'Encrypt all stored learning progress and personal data',
      icon: 'Lock',
      color: 'text-secondary',
      recommended: true,
      disabled: true // Always enabled for child safety
    },
    {
      key: 'biometricAuth',
      title: 'Biometric Authentication',
      description: 'Use fingerprint or face recognition for quick access',
      icon: 'Fingerprint',
      color: 'text-accent',
      recommended: false
    },
    {
      key: 'autoLogout',
      title: 'Auto-logout on Device Switch',
      description: 'Automatically log out when switching between devices',
      icon: 'Smartphone',
      color: 'text-primary',
      recommended: false
    }
  ];

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    alert('Security settings saved successfully!');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Security & Privacy
          </h3>
          <p className="text-sm font-body text-muted-foreground">
            Manage your account security and privacy preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={20} className="text-success" />
          <span className="text-xs font-caption text-success font-medium">
            Secure
          </span>
        </div>
      </div>
      {/* Security Options */}
      <div className="space-y-4">
        {securityOptions?.map((option) => (
          <div
            key={option?.key}
            className="bg-card rounded-lg border border-border p-4 hover:shadow-soft transition-shadow duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 bg-muted/30 rounded-lg flex-shrink-0`}>
                <Icon name={option?.icon} size={20} className={option?.color} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-body font-medium text-card-foreground">
                    {option?.title}
                  </h4>
                  {option?.recommended && (
                    <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-caption rounded-full">
                      Recommended
                    </span>
                  )}
                  {option?.disabled && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-caption rounded-full">
                      Always On
                    </span>
                  )}
                </div>
                <p className="text-xs font-caption text-muted-foreground mb-3">
                  {option?.description}
                </p>
                
                <Checkbox
                  checked={settings?.[option?.key]}
                  onChange={(e) => handleSettingChange(option?.key, e?.target?.checked)}
                  disabled={option?.disabled}
                  label={`Enable ${option?.title}`}
                  size="sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Security Score */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-body font-medium text-foreground">
            Security Score
          </h4>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-muted rounded-full">
              <div 
                className="h-2 bg-gradient-to-r from-success to-primary rounded-full transition-all duration-500"
                style={{ width: '85%' }}
              />
            </div>
            <span className="text-sm font-mono font-medium text-success">85%</span>
          </div>
        </div>
        <p className="text-xs font-caption text-muted-foreground">
          Your account security is strong. Consider enabling two-factor authentication for maximum protection.
        </p>
      </div>
      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button
          variant="default"
          onClick={handleSaveSettings}
          iconName="Save"
          iconPosition="left"
        >
          Save Security Settings
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;