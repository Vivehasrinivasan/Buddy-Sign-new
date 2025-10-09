import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ParentUserCard = ({ parentData, sessionTimer, onLogout }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getSessionStatus = () => {
    if (sessionTimer > 600) return { color: 'success', text: 'Active', icon: 'CheckCircle' };
    if (sessionTimer > 300) return { color: 'accent', text: 'Warning', icon: 'AlertTriangle' };
    return { color: 'destructive', text: 'Expiring', icon: 'Clock' };
  };

  const sessionStatus = getSessionStatus();

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="User" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Parent Account Information
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                Account overview and session management
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors text-sm font-body"
          >
            <div className="flex items-center space-x-2">
              <Icon name="LogOut" size={16} />
              <span>Logout</span>
            </div>
          </motion.button>
        </div>
      </div>
      <div className="p-6">
        {/* Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* User Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <Icon name="UserCheck" size={28} color="white" />
              </div>
              <div>
                <h4 className="text-xl font-heading font-bold text-foreground">
                  {parentData?.name}
                </h4>
                <p className="text-sm font-body text-muted-foreground">
                  {parentData?.email}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-body text-muted-foreground">Account ID:</span>
                <span className="font-mono text-foreground">{parentData?.id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-body text-muted-foreground">Account Created:</span>
                <span className="font-body text-foreground">
                  {new Date(parentData?.accountCreated)?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-body text-muted-foreground">Subscription:</span>
                <span className="font-body text-success font-semibold">
                  {parentData?.subscriptionStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="space-y-4">
            <div className={`
              bg-${sessionStatus?.color}/10 border border-${sessionStatus?.color}/20 
              rounded-lg p-4
            `}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon name={sessionStatus?.icon} size={16} className={`text-${sessionStatus?.color}`} />
                  <span className="text-sm font-body font-semibold text-foreground">
                    Session Status
                  </span>
                </div>
                <span className={`text-sm font-body font-medium text-${sessionStatus?.color}`}>
                  {sessionStatus?.text}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-caption text-muted-foreground">Time Remaining:</span>
                  <span className={`text-lg font-mono font-bold text-${sessionStatus?.color}`}>
                    {formatTime(sessionTimer)}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div 
                    className={`bg-${sessionStatus?.color} h-2 rounded-full`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${(sessionTimer / 1800) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-muted/20 rounded-lg p-4">
              <h5 className="text-sm font-body font-semibold text-foreground mb-2">
                Session Details
              </h5>
              <div className="space-y-1 text-xs font-caption text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Session Started:</span>
                  <span>
                    {parentData?.sessionStart 
                      ? new Date(parentData?.sessionStart)?.toLocaleTimeString()
                      : 'Just now'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-logout:</span>
                  <span>30 minutes inactivity</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-lg p-4 border border-success/20">
          <div className="flex items-start space-x-3">
            <Icon name="Crown" size={20} className="text-success mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-body font-semibold text-foreground">
                  {parentData?.subscriptionStatus}
                </h5>
                <span className="text-xs font-caption text-success bg-success/20 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-caption text-muted-foreground">
                <div>
                  <strong className="text-foreground">Expires:</strong><br />
                  {new Date(parentData?.subscriptionExpiry)?.toLocaleDateString()}
                </div>
                <div>
                  <strong className="text-foreground">Features:</strong><br />
                  Multiple children, Progress tracking
                </div>
                <div>
                  <strong className="text-foreground">Support:</strong><br />
                  Priority customer service
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-body"
          >
            <Icon name="Settings" size={16} />
            <span>Account Settings</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors text-sm font-body"
          >
            <Icon name="RefreshCw" size={16} />
            <span>Extend Session</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm font-body"
          >
            <Icon name="Download" size={16} />
            <span>Export Data</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ParentUserCard;