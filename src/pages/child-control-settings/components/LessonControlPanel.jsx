import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Lock, Unlock, Eye, Settings } from 'lucide-react';

const LessonControlPanel = ({ childData, onUpdate, isMobile }) => {
  const { lessonControl } = childData?.settings || {};
  const [previewModule, setPreviewModule] = useState(null);

  const allModules = [
    {
      id: 'basic-signs',
      name: 'Basic Signs',
      description: 'Fundamental ASL signs and gestures',
      difficulty: 'beginner',
      ageRange: '4-12',
      lessonsCount: 24
    },
    {
      id: 'family-words',
      name: 'Family Words',
      description: 'Signs for family members and relationships',
      difficulty: 'beginner',
      ageRange: '4-12',
      lessonsCount: 18
    },
    {
      id: 'numbers',
      name: 'Numbers',
      description: 'Number signs and counting',
      difficulty: 'beginner',
      ageRange: '5-12',
      lessonsCount: 12
    },
    {
      id: 'colors',
      name: 'Colors',
      description: 'Color signs and descriptive words',
      difficulty: 'beginner',
      ageRange: '4-12',
      lessonsCount: 15
    },
    {
      id: 'emotions',
      name: 'Emotions',
      description: 'Feelings and emotional expressions',
      difficulty: 'intermediate',
      ageRange: '6-12',
      lessonsCount: 20
    },
    {
      id: 'advanced-grammar',
      name: 'Advanced Grammar',
      description: 'Complex sentence structures and grammar rules',
      difficulty: 'advanced',
      ageRange: '9-12',
      lessonsCount: 30
    },
    {
      id: 'complex-phrases',
      name: 'Complex Phrases',
      description: 'Multi-word phrases and conversations',
      difficulty: 'advanced',
      ageRange: '8-12',
      lessonsCount: 25
    }
  ];

  const handleModuleToggle = (moduleId) => {
    const currentEnabled = lessonControl?.enabledModules || [];
    const currentDisabled = lessonControl?.disabledModules || [];
    
    if (currentEnabled?.includes(moduleId)) {
      // Move from enabled to disabled
      onUpdate({
        enabledModules: currentEnabled?.filter(id => id !== moduleId),
        disabledModules: [...currentDisabled, moduleId]
      });
    } else {
      // Move from disabled to enabled
      onUpdate({
        enabledModules: [...currentEnabled, moduleId],
        disabledModules: currentDisabled?.filter(id => id !== moduleId)
      });
    }
  };

  const handleDifficultyChange = (difficulty) => {
    onUpdate({ difficultyLevel: difficulty });
  };

  const isModuleEnabled = (moduleId) => {
    return lessonControl?.enabledModules?.includes(moduleId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-success';
      case 'intermediate': return 'text-warning';
      case 'advanced': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const isModuleAppropriate = (module) => {
    const childAge = childData?.age || 8;
    const [minAge, maxAge] = module?.ageRange?.split('-')?.map(Number) || [4, 12];
    return childAge >= minAge && childAge <= maxAge;
  };

  return (
    <div className="space-y-6">
      {/* Difficulty Level Setting */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary" />
          Difficulty Level
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['beginner', 'intermediate', 'advanced']?.map(level => (
            <button
              key={level}
              onClick={() => handleDifficultyChange(level)}
              className={`p-3 rounded-lg border-2 transition-all ${
                lessonControl?.difficultyLevel === level
                  ? 'border-primary bg-primary/10 text-primary' :'border-border bg-card text-muted-foreground hover:border-primary/50'
              }`}
            >
              <div className="text-center">
                <div className={`font-semibold capitalize ${getDifficultyColor(level)}`}>
                  {level}
                </div>
                <div className="text-xs mt-1">
                  {level === 'beginner' && 'Ages 4-7'}
                  {level === 'intermediate' && 'Ages 6-10'}
                  {level === 'advanced' && 'Ages 8-12'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Age Appropriate Filter */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-foreground">Age-Appropriate Content Only</span>
          <span className="text-sm text-muted-foreground">
            (Child is {childData?.age} years old)
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={lessonControl?.ageAppropriate || false}
            onChange={(e) => onUpdate({ ageAppropriate: e?.target?.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
      {/* Learning Modules */}
      <div>
        <h4 className="font-semibold text-foreground mb-4 flex items-center">
          <Book className="w-5 h-5 mr-2 text-primary" />
          Learning Modules
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allModules?.map(module => {
            const isEnabled = isModuleEnabled(module?.id);
            const isAppropriate = isModuleAppropriate(module);
            const isRestricted = lessonControl?.ageAppropriate && !isAppropriate;
            
            return (
              <motion.div
                key={module?.id}
                layout
                className={`p-4 border-2 rounded-lg transition-all ${
                  isEnabled && !isRestricted
                    ? 'border-success bg-success/10'
                    : isRestricted
                    ? 'border-muted bg-muted/30 opacity-50' :'border-border bg-card'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-semibold text-foreground">{module?.name}</h5>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(module?.difficulty)} bg-muted`}>
                        {module?.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {module?.description}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>Ages: {module?.ageRange}</span>
                      <span>Lessons: {module?.lessonsCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setPreviewModule(module)}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      title="Preview content"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => !isRestricted && handleModuleToggle(module?.id)}
                      disabled={isRestricted}
                      className={`p-2 rounded-lg transition-colors ${
                        isRestricted
                          ? 'cursor-not-allowed opacity-50'
                          : isEnabled
                          ? 'bg-success text-white hover:bg-success/90' :'bg-muted text-muted-foreground hover:bg-primary hover:text-white'
                      }`}
                      title={isEnabled ? 'Disable module' : 'Enable module'}
                    >
                      {isEnabled ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {isRestricted && (
                  <div className="text-xs text-warning bg-warning/10 px-2 py-1 rounded">
                    ⚠️ Restricted by age-appropriate setting
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Custom Restrictions */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-3">Custom Restrictions</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <input type="checkbox" className="rounded" />
            <span>Block signs containing animals</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <input type="checkbox" className="rounded" />
            <span>Restrict medical/health related signs</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <input type="checkbox" className="rounded" />
            <span>Hide competition/comparison features</span>
          </div>
        </div>
        <button className="mt-3 text-sm text-primary hover:underline">
          + Add custom restriction
        </button>
      </div>
      {/* Preview Modal */}
      {previewModule && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewModule(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e?.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">
              {previewModule?.name} Preview
            </h3>
            <p className="text-muted-foreground mb-4">
              {previewModule?.description}
            </p>
            <div className="space-y-2 text-sm">
              <div>Difficulty: <span className={getDifficultyColor(previewModule?.difficulty)}>{previewModule?.difficulty}</span></div>
              <div>Age Range: {previewModule?.ageRange}</div>
              <div>Total Lessons: {previewModule?.lessonsCount}</div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setPreviewModule(null)}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                View Sample Lesson
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LessonControlPanel;