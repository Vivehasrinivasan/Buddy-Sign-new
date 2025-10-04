import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, MessageSquare, Database, Bell, Camera, Info } from 'lucide-react';

const SafetyFeatures = ({ childData, onUpdate, isMobile }) => {
  const { safety } = childData?.settings || {};
  const [showDataPrivacyInfo, setShowDataPrivacyInfo] = useState(false);

  const handleSafetyUpdate = (field, value) => {
    onUpdate({
      [field]: value
    });
  };

  const contentFilterOptions = [
    {
      value: 'strict',
      label: 'Strict',
      description: 'Maximum filtering - only basic, child-friendly content',
      color: 'text-success'
    },
    {
      value: 'moderate',
      label: 'Moderate',
      description: 'Balanced filtering - most age-appropriate content',
      color: 'text-warning'
    },
    {
      value: 'minimal',
      label: 'Minimal',
      description: 'Light filtering - broader content access',
      color: 'text-destructive'
    }
  ];

  const dataSharingOptions = [
    {
      value: 'none',
      label: 'No Data Sharing',
      description: 'No data shared with third parties',
      icon: '🔒'
    },
    {
      value: 'minimal',
      label: 'Minimal Sharing',
      description: 'Only essential analytics for app improvement',
      icon: '🔐'
    },
    {
      value: 'standard',
      label: 'Standard Sharing',
      description: 'Standard analytics and educational research',
      icon: '📊'
    }
  ];

  const privacyExplanations = {
    contentFilter: 'Controls what type of signs and content your child can access. Strict mode ensures only basic, universally appropriate signs are shown.',
    communicationRestrictions: 'Prevents your child from accessing any social features, messaging, or communication tools within the app.',
    dataSharing: 'Determines how your child\'s learning data is used for analytics and educational research. All data is anonymized.',
    parentalNotifications: 'Get alerts about your child\'s progress, session times, and any content concerns.',
    screenshotPrevention: 'Prevents screenshots and screen recording to protect your child\'s privacy and prevent sharing of learning content.'
  };

  return (
    <div className="space-y-6">
      {/* Content Filtering */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground flex items-center">
            <Eye className="w-5 h-5 mr-2 text-primary" />
            Content Filtering
          </h4>
          <button
            onClick={() => setShowDataPrivacyInfo(!showDataPrivacyInfo)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {contentFilterOptions?.map(option => (
            <label
              key={option?.value}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                safety?.contentFilter === option?.value
                  ? 'border-primary bg-primary/10' :'border-border bg-card hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name="contentFilter"
                value={option?.value}
                checked={safety?.contentFilter === option?.value}
                onChange={(e) => handleSafetyUpdate('contentFilter', e?.target?.value)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className={`font-medium ${option?.color}`}>
                  {option?.label}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {option?.description}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                safety?.contentFilter === option?.value
                  ? 'border-primary bg-primary' :'border-muted'
              }`}>
                {safety?.contentFilter === option?.value && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                )}
              </div>
            </label>
          ))}
        </div>

        {showDataPrivacyInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground"
          >
            {privacyExplanations?.contentFilter}
          </motion.div>
        )}
      </div>
      {/* Communication Restrictions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-primary" />
            Communication Restrictions
          </h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <div className="font-medium text-foreground">Block All Communication</div>
              <div className="text-sm text-muted-foreground">
                Disable all social features and messaging
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={safety?.communicationRestrictions || false}
                onChange={(e) => handleSafetyUpdate('communicationRestrictions', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-sm">
              <input 
                type="checkbox" 
                disabled={safety?.communicationRestrictions}
                className="rounded" 
              />
              <span className={safety?.communicationRestrictions ? 'text-muted-foreground line-through' : ''}>
                Allow teacher messages
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <input 
                type="checkbox" 
                disabled={safety?.communicationRestrictions}
                className="rounded" 
              />
              <span className={safety?.communicationRestrictions ? 'text-muted-foreground line-through' : ''}>
                Allow progress sharing
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <input 
                type="checkbox" 
                disabled={safety?.communicationRestrictions}
                className="rounded" 
              />
              <span className={safety?.communicationRestrictions ? 'text-muted-foreground line-through' : ''}>
                Allow leaderboards
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <input 
                type="checkbox" 
                disabled={safety?.communicationRestrictions}
                className="rounded" 
              />
              <span className={safety?.communicationRestrictions ? 'text-muted-foreground line-through' : ''}>
                Allow study groups
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Data Sharing Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground flex items-center">
            <Database className="w-5 h-5 mr-2 text-primary" />
            Data Sharing Preferences
          </h4>
        </div>
        
        <div className="space-y-3">
          {dataSharingOptions?.map(option => (
            <label
              key={option?.value}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                safety?.dataSharing === option?.value
                  ? 'border-primary bg-primary/10' :'border-border bg-card hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name="dataSharing"
                value={option?.value}
                checked={safety?.dataSharing === option?.value}
                onChange={(e) => handleSafetyUpdate('dataSharing', e?.target?.value)}
                className="sr-only"
              />
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-2xl">{option?.icon}</span>
                <div>
                  <div className="font-medium text-foreground">
                    {option?.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {option?.description}
                  </div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                safety?.dataSharing === option?.value
                  ? 'border-primary bg-primary' :'border-muted'
              }`}>
                {safety?.dataSharing === option?.value && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                )}
              </div>
            </label>
          ))}
        </div>
      </div>
      {/* Additional Safety Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-semibold text-foreground mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary" />
          Additional Safety Controls
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-warning" />
              <div>
                <div className="font-medium text-foreground">Parental Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive alerts about progress and safety concerns
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={safety?.parentalNotifications || false}
                onChange={(e) => handleSafetyUpdate('parentalNotifications', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Camera className="w-5 h-5 text-destructive" />
              <div>
                <div className="font-medium text-foreground">Screenshot Prevention</div>
                <div className="text-sm text-muted-foreground">
                  Block screenshots and screen recording for privacy
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={safety?.screenshotPrevention || false}
                onChange={(e) => handleSafetyUpdate('screenshotPrevention', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
      {/* Privacy Information */}
      <div className="bg-muted/20 border border-muted rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Privacy Commitment</p>
            <p className="mb-2">
              We are committed to protecting your child's privacy and safety. All data is encrypted, 
              and we follow strict data protection regulations including COPPA and GDPR.
            </p>
            <div className="space-x-4">
              <button className="text-primary hover:underline">Privacy Policy</button>
              <button className="text-primary hover:underline">Safety Guidelines</button>
              <button className="text-primary hover:underline">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyFeatures;