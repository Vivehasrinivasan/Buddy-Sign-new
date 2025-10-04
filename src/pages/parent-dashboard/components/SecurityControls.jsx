import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityControls = ({ sessionTimer, onExtendSession, onLogout }) => {
  const [showSecurityTips, setShowSecurityTips] = useState(false);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getSessionStatus = () => {
    if (sessionTimer > 900) return { color: 'success', text: 'Secure', icon: 'Shield' };
    if (sessionTimer > 300) return { color: 'accent', text: 'Warning', icon: 'AlertTriangle' };
    return { color: 'destructive', text: 'Expiring', icon: 'Clock' };
  };

  const sessionStatus = getSessionStatus();

  const securityFeatures = [
    {
      title: "Automatic Logout",
      description: "Sessions expire after 30 minutes of inactivity",
      icon: "Clock",
      status: "Active"
    },
    {
      title: "Child Data Protection",
      description: "Real names encrypted, fake names used in app",
      icon: "Shield",
      status: "Secured"
    },
    {
      title: "Activity Monitoring",
      description: "Track screen time and learning patterns",
      icon: "Eye",
      status: "Enabled"
    },
    {
      title: "Safe Environment",
      description: "No social features, content-filtered",
      icon: "Lock",
      status: "Protected"
    }
  ];

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-destructive/10 to-accent/10 p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-destructive rounded-lg">
            <Icon name="Shield" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              Security Controls
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Session management and safety measures
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Session Status */}
        <div className={`
          bg-${sessionStatus?.color}/10 border border-${sessionStatus?.color}/20 
          rounded-lg p-4
        `}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon name={sessionStatus?.icon} size={18} className={`text-${sessionStatus?.color}`} />
              <h4 className="text-sm font-body font-semibold text-foreground">
                Session Status: {sessionStatus?.text}
              </h4>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-muted-foreground">Time Remaining:</span>
              <span className={`text-xl font-mono font-bold text-${sessionStatus?.color}`}>
                {formatTime(sessionTimer)}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-3">
              <motion.div 
                className={`bg-${sessionStatus?.color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${(sessionTimer / 1800) * 100}%` }}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={onExtendSession}
                disabled={sessionTimer < 60}
                className="px-3 py-2 text-xs bg-success text-white hover:bg-success/90 flex items-center space-x-1"
              >
                <Icon name="RefreshCw" size={14} />
                <span>Extend Session</span>
              </Button>

              <Button
                onClick={onLogout}
                className="px-3 py-2 text-xs bg-destructive text-white hover:bg-destructive/90 flex items-center space-x-1"
              >
                <Icon name="LogOut" size={14} />
                <span>Logout Now</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-body font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Lock" size={16} className="text-primary" />
              <span>Security Features</span>
            </h4>
            <button
              onClick={() => setShowSecurityTips(!showSecurityTips)}
              className="text-xs text-primary hover:text-primary/80"
            >
              {showSecurityTips ? 'Hide Tips' : 'Show Tips'}
            </button>
          </div>
          
          <div className="space-y-3">
            {securityFeatures?.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                    <Icon name={feature?.icon} size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-body font-medium text-foreground">
                      {feature?.title}
                    </div>
                    <div className="text-xs font-caption text-muted-foreground">
                      {feature?.description}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-caption text-success bg-success/20 px-2 py-1 rounded-full">
                  {feature?.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Tips */}
        {showSecurityTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-accent/10 border border-accent/20 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={18} className="text-accent mt-0.5" />
              <div>
                <h5 className="text-sm font-body font-semibold text-foreground mb-2">
                  Security Best Practices
                </h5>
                <div className="space-y-2 text-xs font-caption text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={12} className="text-success mt-0.5" />
                    <span>Always logout when finished to protect your children's data</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={12} className="text-success mt-0.5" />
                    <span>Regularly review your children's learning activity and screen time</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={12} className="text-success mt-0.5" />
                    <span>Keep your parent password secure and don't share it</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={12} className="text-success mt-0.5" />
                    <span>Monitor notification settings to stay informed about progress</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Emergency Actions */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="AlertTriangle" size={18} className="text-destructive" />
            <h4 className="text-sm font-body font-semibold text-foreground">
              Emergency Actions
            </h4>
          </div>
          
          <p className="text-xs font-caption text-muted-foreground mb-4">
            Use these actions if you suspect unauthorized access to your account.
          </p>

          <div className="space-y-2">
            <Button className="w-full px-3 py-2 text-xs bg-destructive/20 text-destructive hover:bg-destructive/30 flex items-center justify-center space-x-2">
              <Icon name="Ban" size={14} />
              <span>Lock All Child Accounts</span>
            </Button>

            <Button className="w-full px-3 py-2 text-xs bg-destructive text-white hover:bg-destructive/90 flex items-center justify-center space-x-2">
              <Icon name="PhoneCall" size={14} />
              <span>Contact Emergency Support</span>
            </Button>
          </div>
        </div>

        {/* Privacy Reminder */}
        <div className="bg-gradient-to-r from-success/5 to-primary/5 rounded-lg p-4 border border-success/20">
          <div className="flex items-center space-x-3">
            <Icon 
              name="Heart" 
              size={18} 
              className="text-success animate-pulse" 
            />
            <div>
              <h5 className="text-sm font-body font-semibold text-foreground">
                Safe Learning Environment
              </h5>
              <p className="text-xs font-caption text-muted-foreground mt-1">
                Your family's privacy and security are our top priority. All data is encrypted, and children's real identities are protected throughout the learning experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityControls;