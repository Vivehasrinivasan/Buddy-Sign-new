import React from 'react';
import { motion } from 'framer-motion';
import { Clock, PlayCircle, PauseCircle, AlertCircle } from 'lucide-react';

const TimeManagementSection = ({ childData, onUpdate, isMobile }) => {
  const { timeManagement } = childData?.settings || {};

  const handleTimeUpdate = (field, value) => {
    onUpdate({
      [field]: value
    });
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const timeRemainingPercentage = timeManagement ? 
    Math.max(0, (timeManagement?.timeRemaining / timeManagement?.dailyLimit) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Daily Time Limit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Daily Time Limit
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={timeManagement?.dailyLimit || 60}
                onChange={(e) => handleTimeUpdate('dailyLimit', parseInt(e?.target?.value))}
                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-lg font-semibold text-foreground min-w-[60px]">
                {formatTime(timeManagement?.dailyLimit || 60)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Weekly Time Limit
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="210"
                max="840"
                step="30"
                value={timeManagement?.weeklyLimit || 420}
                onChange={(e) => handleTimeUpdate('weeklyLimit', parseInt(e?.target?.value))}
                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-lg font-semibold text-foreground min-w-[80px]">
                {formatTime(timeManagement?.weeklyLimit || 420)}
              </span>
            </div>
          </div>
        </div>

        {/* Time Remaining Indicator */}
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Time Remaining Today
            </h4>
            <span className="text-2xl font-bold text-foreground">
              {formatTime(timeManagement?.timeRemaining || 45)}
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-3 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${timeRemainingPercentage}%` }}
              transition={{ duration: 0.5 }}
              className={`h-3 rounded-full ${
                timeRemainingPercentage > 50 ? 'bg-success' :
                timeRemainingPercentage > 20 ? 'bg-warning' : 'bg-destructive'
              }`}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 min</span>
            <span>{formatTime(timeManagement?.dailyLimit || 60)}</span>
          </div>
        </div>
      </div>
      {/* Session Control Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PlayCircle className="w-5 h-5 text-success" />
              <span className="font-medium text-foreground">Auto-End Session</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={timeManagement?.autoEndSession || false}
                onChange={(e) => handleTimeUpdate('autoEndSession', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Automatically end session when time limit is reached
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PauseCircle className="w-5 h-5 text-warning" />
              <span className="font-medium text-foreground">Break Reminders</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={timeManagement?.breakReminders || false}
                onChange={(e) => handleTimeUpdate('breakReminders', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Show break suggestions every 20 minutes
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span className="font-medium text-foreground">Parental Override</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={timeManagement?.parentalOverride || false}
                onChange={(e) => handleTimeUpdate('parentalOverride', e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Allow parent to extend time when needed
          </p>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors">
          Add 15 Minutes
        </button>
        <button className="px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning/90 transition-colors">
          Pause Timer
        </button>
        <button className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors">
          End Session Now
        </button>
      </div>
    </div>
  );
};

export default TimeManagementSection;