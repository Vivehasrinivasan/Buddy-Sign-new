import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ChildControlModal = ({ isOpen, onClose, child, onUpdate, isActive }) => {
  const [controls, setControls] = useState(child?.controls || {
    timeLimit: 30,
    difficulty: 'beginner',
    contentRestrictions: [],
    pandaEnabled: true,
    soundEnabled: true,
    autoSave: true,
    parentNotifications: true,
    forumAccess: false,
    canResetPoints: false
  });

  const [hasChanges, setHasChanges] = useState(false);

  if (!isOpen || !child) return null;

  const timeLimitOptions = [
    { value: '15', label: '15 minutes' },
    { value: '20', label: '20 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: 'unlimited', label: 'No limit' }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner - Easy lessons' },
    { value: 'intermediate', label: 'Intermediate - Moderate challenge' },
    { value: 'advanced', label: 'Advanced - Full difficulty' },
    { value: 'adaptive', label: 'Adaptive - Adjusts automatically' }
  ];

  const contentRestrictionOptions = [
    { value: 'advanced-topics', label: 'Advanced Topics' },
    { value: 'numbers-advanced', label: 'Complex Numbers' },
    { value: 'emotional-content', label: 'Emotional Content' },
    { value: 'social-situations', label: 'Social Situations' },
    { value: 'abstract-concepts', label: 'Abstract Concepts' }
  ];

  const handleControlChange = (key, value) => {
    setControls(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleContentRestrictionToggle = (restriction) => {
    setControls(prev => ({
      ...prev,
      contentRestrictions: prev.contentRestrictions.includes(restriction)
        ? prev.contentRestrictions.filter(r => r !== restriction)
        : [...prev.contentRestrictions, restriction]
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate?.(child.id, controls);
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    setControls(child?.controls || {
      timeLimit: 30,
      difficulty: 'beginner',
      contentRestrictions: [],
      pandaEnabled: true,
      soundEnabled: true,
      autoSave: true,
      parentNotifications: true,
      forumAccess: false,
      canResetPoints: false
    });
    setHasChanges(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-card rounded-lg border-2 border-primary shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-lg font-bold">
              {child.avatar}
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-card-foreground">
                {child.name} - Control Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                {isActive ? '⭐ Active Child - Changes apply immediately' : 'Inactive - Will apply when child becomes active'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Active Child Notice */}
          {isActive && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Icon name="Star" size={20} className="text-primary" />
                <div>
                  <h3 className="text-sm font-body font-semibold text-card-foreground">
                    Currently Active Child
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Changes to these settings will immediately affect all app pages and learning experiences
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Time Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold text-card-foreground flex items-center">
              <Icon name="Clock" size={20} className="text-accent mr-2" />
              Screen Time Management
            </h3>
            
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              <div>
                <label className="text-sm font-body font-medium text-card-foreground mb-2 block">
                  Daily Time Limit
                </label>
                <Select
                  value={controls.timeLimit.toString()}
                  onValueChange={(value) => handleControlChange('timeLimit', value === 'unlimited' ? 'unlimited' : parseInt(value))}
                  options={timeLimitOptions}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum learning time per day. App will automatically save progress and pause when limit is reached.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-body font-medium text-card-foreground">
                    Auto-Save Progress
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Automatically save learning progress every few minutes
                  </p>
                </div>
                <button
                  onClick={() => handleControlChange('autoSave', !controls.autoSave)}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200
                    ${controls.autoSave ? 'bg-primary' : 'bg-muted'}
                  `}
                >
                  <div className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                    ${controls.autoSave ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold text-card-foreground flex items-center">
              <Icon name="BookOpen" size={20} className="text-secondary mr-2" />
              Learning Preferences
            </h3>
            
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              <div>
                <label className="text-sm font-body font-medium text-card-foreground mb-2 block">
                  Difficulty Level
                </label>
                <Select
                  value={controls.difficulty}
                  onValueChange={(value) => handleControlChange('difficulty', value)}
                  options={difficultyOptions}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Adjusts lesson complexity and pacing to match your child's learning level
                </p>
              </div>
            </div>
          </div>

          {/* Content Restrictions */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold text-card-foreground flex items-center">
              <Icon name="Shield" size={20} className="text-warning mr-2" />
              Content Restrictions
            </h3>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select content types to restrict for this child. Restricted content will not appear in lessons or activities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contentRestrictionOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleContentRestrictionToggle(option.value)}
                  >
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                      ${controls.contentRestrictions.includes(option.value) 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground'
                      }
                    `}>
                      {controls.contentRestrictions.includes(option.value) && (
                        <Icon name="Check" size={12} className="text-white" />
                      )}
                    </div>
                    <span className="text-sm font-body text-card-foreground">
                      {option.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* App Features & Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold text-card-foreground flex items-center">
              <Icon name="Settings" size={20} className="text-info mr-2" />
              App Features & Controls
            </h3>
            
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-body font-medium text-card-foreground">
                    Panda Companion
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Show the friendly panda guide throughout lessons
                  </p>
                </div>
                <button
                  onClick={() => handleControlChange('pandaEnabled', !controls.pandaEnabled)}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200
                    ${controls.pandaEnabled ? 'bg-primary' : 'bg-muted'}
                  `}
                >
                  <div className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                    ${controls.pandaEnabled ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-body font-medium text-card-foreground">
                    Sound Effects
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Play sounds for interactions, achievements, and feedback
                  </p>
                </div>
                <button
                  onClick={() => handleControlChange('soundEnabled', !controls.soundEnabled)}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200
                    ${controls.soundEnabled ? 'bg-primary' : 'bg-muted'}
                  `}
                >
                  <div className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                    ${controls.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-body font-medium text-card-foreground">
                    Forum Access
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Allow child to participate in community discussions and forums
                  </p>
                </div>
                <button
                  onClick={() => handleControlChange('forumAccess', !controls.forumAccess)}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200
                    ${controls.forumAccess ? 'bg-primary' : 'bg-muted'}
                  `}
                >
                  <div className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                    ${controls.forumAccess ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-body font-medium text-card-foreground">
                    Points Reset Permission
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Allow child to reset their points and achievements (requires parent approval)
                  </p>
                </div>
                <button
                  onClick={() => handleControlChange('canResetPoints', !controls.canResetPoints)}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200
                    ${controls.canResetPoints ? 'bg-primary' : 'bg-muted'}
                  `}
                >
                  <div className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                    ${controls.canResetPoints ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-body font-medium text-card-foreground">
                    Parent Notifications
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Receive updates about your child's learning progress and achievements
                  </p>
                </div>
                <button
                  onClick={() => handleControlChange('parentNotifications', !controls.parentNotifications)}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200
                    ${controls.parentNotifications ? 'bg-primary' : 'bg-muted'}
                  `}
                >
                  <div className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                    ${controls.parentNotifications ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              <Icon name="X" size={16} className="mr-2" />
              Cancel
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Reset Changes
            </Button>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            className={!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <Icon name="Save" size={16} className="mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChildControlModal;