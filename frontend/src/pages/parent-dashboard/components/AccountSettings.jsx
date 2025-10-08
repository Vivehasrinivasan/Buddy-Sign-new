import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AccountSettings = ({ parentData, onUpdateSettings }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      weekly: true,
      achievements: true
    },
    privacy: {
      analytics: true,
      sharing: false,
      dataCollection: true
    },
    preferences: {
      language: 'English',
      timezone: 'Auto',
      theme: 'System'
    }
  });

  const [showDataExport, setShowDataExport] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [setting]: value
      }
    }));
  };

  const handleExportData = () => {
    // In a real app, this would trigger a data export
    setShowDataExport(true);
    setTimeout(() => setShowDataExport(false), 3000);
  };

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary/10 to-accent/10 p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-lg">
            <Icon name="Settings" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              Account Settings
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Manage subscription, notifications, and privacy preferences
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Subscription Management */}
        <div className="bg-success/10 rounded-lg p-4 border border-success/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon name="Crown" size={18} className="text-success" />
              <h4 className="text-sm font-body font-semibold text-foreground">
                Subscription Management
              </h4>
            </div>
            <span className="text-xs bg-success text-white px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          
          <div className="space-y-3 text-xs font-caption text-muted-foreground">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong className="text-foreground">Plan:</strong><br />
                {parentData?.subscriptionStatus}
              </div>
              <div>
                <strong className="text-foreground">Renewal:</strong><br />
                {new Date(parentData?.subscriptionExpiry)?.toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center space-x-3 pt-2">
              <Button className="px-3 py-1.5 text-xs">
                Manage Subscription
              </Button>
              <Button className="px-3 py-1.5 text-xs bg-muted text-muted-foreground">
                Billing History
              </Button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h4 className="text-sm font-body font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Bell" size={16} className="text-primary" />
            <span>Notification Preferences</span>
          </h4>
          
          <div className="space-y-3">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
            >
              <div>
                <div className="text-sm font-body text-foreground">Email Notifications</div>
                <div className="text-xs font-caption text-muted-foreground">
                  Receive updates about your children's progress
                </div>
              </div>
              <Checkbox
                checked={settings?.notifications?.email}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'email', checked)
                }
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
            >
              <div>
                <div className="text-sm font-body text-foreground">Weekly Reports</div>
                <div className="text-xs font-caption text-muted-foreground">
                  Summary of family learning progress
                </div>
              </div>
              <Checkbox
                checked={settings?.notifications?.weekly}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'weekly', checked)
                }
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
            >
              <div>
                <div className="text-sm font-body text-foreground">Achievement Alerts</div>
                <div className="text-xs font-caption text-muted-foreground">
                  When children earn new badges or complete milestones
                </div>
              </div>
              <Checkbox
                checked={settings?.notifications?.achievements}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'achievements', checked)
                }
              />
            </motion.div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h4 className="text-sm font-body font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-accent" />
            <span>Data Privacy Settings</span>
          </h4>
          
          <div className="space-y-3">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
            >
              <div>
                <div className="text-sm font-body text-foreground">Anonymous Analytics</div>
                <div className="text-xs font-caption text-muted-foreground">
                  Help improve the app with anonymized usage data
                </div>
              </div>
              <Checkbox
                checked={settings?.privacy?.analytics}
                onCheckedChange={(checked) => 
                  handleSettingChange('privacy', 'analytics', checked)
                }
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
            >
              <div>
                <div className="text-sm font-body text-foreground">Data Collection</div>
                <div className="text-xs font-caption text-muted-foreground">
                  Collect learning progress for personalized recommendations
                </div>
              </div>
              <Checkbox
                checked={settings?.privacy?.dataCollection}
                onCheckedChange={(checked) => 
                  handleSettingChange('privacy', 'dataCollection', checked)
                }
              />
            </motion.div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon name="Database" size={18} className="text-accent" />
              <h4 className="text-sm font-body font-semibold text-foreground">
                Data Management
              </h4>
            </div>
          </div>
          
          <p className="text-xs font-caption text-muted-foreground mb-4">
            Export your family's learning data or request account deletion. All data is encrypted and handled according to our privacy policy.
          </p>

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleExportData}
              className="px-3 py-1.5 text-xs bg-accent text-white hover:bg-accent/90"
            >
              <div className="flex items-center space-x-1">
                <Icon name="Download" size={14} />
                <span>Export Data</span>
              </div>
            </Button>

            <Button className="px-3 py-1.5 text-xs bg-muted text-muted-foreground hover:bg-muted/80">
              <div className="flex items-center space-x-1">
                <Icon name="AlertTriangle" size={14} />
                <span>Delete Account</span>
              </div>
            </Button>
          </div>

          {showDataExport && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg"
            >
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle" size={16} />
                <span className="text-xs font-body">
                  Data export initiated! You'll receive an email when ready.
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Support & Help */}
        <div>
          <h4 className="text-sm font-body font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="HelpCircle" size={16} className="text-primary" />
            <span>Support & Help</span>
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button className="px-3 py-2 text-xs bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center space-x-2">
              <Icon name="MessageCircle" size={14} />
              <span>Contact Support</span>
            </Button>

            <Button className="px-3 py-2 text-xs bg-secondary/10 text-secondary hover:bg-secondary/20 flex items-center justify-center space-x-2">
              <Icon name="FileText" size={14} />
              <span>Help Center</span>
            </Button>

            <Button className="px-3 py-2 text-xs bg-success/10 text-success hover:bg-success/20 flex items-center justify-center space-x-2">
              <Icon name="Star" size={14} />
              <span>Rate App</span>
            </Button>

            <Button className="px-3 py-2 text-xs bg-accent/10 text-accent hover:bg-accent/20 flex items-center justify-center space-x-2">
              <Icon name="Share" size={14} />
              <span>Refer Friends</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;