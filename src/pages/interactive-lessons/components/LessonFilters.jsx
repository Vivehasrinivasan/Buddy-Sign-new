import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LessonFilters = ({ 
  filters = {},
  onFilterChange = () => {},
  onClearFilters = () => {},
  className = '' 
}) => {
  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', icon: 'Circle' },
    { value: 'intermediate', label: 'Intermediate', icon: 'CircleDot' },
    { value: 'advanced', label: 'Advanced', icon: 'Target' }
  ];

  const categories = [
    { value: 'alphabet', label: 'Alphabet', icon: 'Type' },
    { value: 'numbers', label: 'Numbers', icon: 'Hash' },
    { value: 'greetings', label: 'Greetings', icon: 'Hand' },
    { value: 'family', label: 'Family', icon: 'Users' },
    { value: 'colors', label: 'Colors', icon: 'Palette' },
    { value: 'animals', label: 'Animals', icon: 'Dog' },
    { value: 'food', label: 'Food', icon: 'Apple' },
    { value: 'emotions', label: 'Emotions', icon: 'Heart' }
  ];

  const durations = [
    { value: '5', label: '5 min or less' },
    { value: '10', label: '10 min or less' },
    { value: '15', label: '15 min or less' },
    { value: '20', label: '20+ min' }
  ];

  const handleFilterToggle = (filterType, value) => {
    const currentValues = filters?.[filterType] || [];
    const newValues = currentValues?.includes(value)
      ? currentValues?.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...filters,
      [filterType]: newValues
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(arr => arr && arr?.length > 0);

  return (
    <div className={`bg-card border border-border rounded-lg p-6 space-y-6 shadow-md ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-card-foreground">
          Filter Lessons
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={14}
            className="text-muted-foreground hover:text-card-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-body font-medium text-card-foreground">
          Categories
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          {categories?.map((category) => {
            const isActive = filters?.category?.includes(category?.value);
            return (
              <button
                key={category?.value}
                onClick={() => handleFilterToggle('category', category?.value)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-body transition-all duration-200 shadow-sm hover:shadow-md
                  ${isActive 
                    ? 'text-black shadow-soft' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
                style={{
                  background: isActive ? '#FFDB58' : undefined,
                  border: isActive ? '1px solid #FFF380' : undefined
                }}
              >
                <Icon name={category?.icon} size={16} />
                <span>{category?.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-body font-medium text-card-foreground">
          Progress Status
        </h4>
        <div className="space-y-2">
          {[
            { value: 'completed', label: 'Completed', icon: 'CheckCircle', color: 'text-success' },
            { value: 'in-progress', label: 'In Progress', icon: 'PlayCircle', color: 'text-primary' },
            { value: 'not-started', label: 'Not Started', icon: 'Circle', color: 'text-muted-foreground' }
          ]?.map((status) => {
            const isActive = filters?.status?.includes(status?.value);
            return (
              <label
                key={status?.value}
                className={`
                  flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors duration-200
                  ${isActive ? 'bg-muted/50' : 'hover:bg-muted/30'}
                `}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => handleFilterToggle('status', status?.value)}
                  className="sr-only"
                />
                <div className={`
                  w-4 h-4 rounded border-2 flex items-center justify-center transition-colors duration-200
                  ${isActive 
                    ? 'border-primary bg-primary' :'border-muted-foreground'
                  }
                `}>
                  {isActive && (
                    <Icon name="Check" size={12} className="text-primary-foreground" />
                  )}
                </div>
                <Icon name={status?.icon} size={16} className={status?.color} />
                <span className="text-sm font-body text-card-foreground">
                  {status?.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm font-caption text-muted-foreground">
            <Icon name="Filter" size={16} />
            <span>
              {Object.values(filters)?.reduce((total, arr) => total + (arr?.length || 0), 0)} filter(s) active
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonFilters;