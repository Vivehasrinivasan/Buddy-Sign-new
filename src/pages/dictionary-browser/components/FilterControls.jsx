import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ 
  filters = {},
  onFilterChange = () => {},
  onClearFilters = () => {},
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'animals', label: 'Animals' },
    { value: 'colors', label: 'Colors' },
    { value: 'family', label: 'Family' },
    { value: 'food', label: 'Food & Drinks' },
    { value: 'emotions', label: 'Emotions' },
    { value: 'actions', label: 'Actions' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'alphabet', label: 'Alphabet' },
    { value: 'greetings', label: 'Greetings' },
    { value: 'school', label: 'School' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = filters?.category && filters?.category !== '';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Filter Button */}
      <Button
        variant={hasActiveFilters ? "default" : "outline"}
        onClick={() => setIsOpen(!isOpen)}
        iconName="Filter"
        iconPosition="left"
        className="whitespace-nowrap"
      >
        Category
        {hasActiveFilters && (
          <span className="ml-2 px-2 py-0.5 bg-primary-foreground text-primary rounded-full text-xs">
            {categoryOptions.find(opt => opt.value === filters?.category)?.label}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-lg border border-border shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-sm text-card-foreground">
                Filter by Category
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleFilterChange('category', '');
                    setIsOpen(false);
                  }}
                  iconName="X"
                  iconPosition="left"
                  iconSize={14}
                  className="text-muted-foreground hover:text-card-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleFilterChange('category', option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    filters?.category === option.value
                      ? 'bg-muted text-card-foreground'
                      : 'hover:bg-muted text-card-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;