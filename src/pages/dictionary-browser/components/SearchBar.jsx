import React, { useState, useRef, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ 
  searchQuery = '', 
  onSearchChange = () => {},
  suggestions = [],
  onSuggestionSelect = () => {},
  className = '' 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    onSearchChange(value);
    setShowSuggestions(value?.length > 0 && suggestions?.length > 0);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setFocusedIndex(prev => 
          prev < suggestions?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (focusedIndex >= 0) {
          handleSuggestionClick(suggestions?.[focusedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
    setFocusedIndex(-1);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    setShowSuggestions(false);
    setFocusedIndex(-1);
    if (searchRef?.current) {
      const input = searchRef?.current?.querySelector('input');
      if (input) input?.focus();
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a word..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            padding: '12px 50px 12px 16px',
            border: '1px solid #b9c48a',
            borderRadius: '8px',
            fontSize: '16px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
            outline: 'none',
            transition: 'all 0.16s ease',
            fontFamily: 'Segoe UI, sans-serif'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#44a060';
            e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            if (searchQuery?.length > 0 && suggestions?.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#b9c48a';
            e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)';
          }}
        />
        
        {/* Search Icon */}
        <div className="absolute right-7 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Icon name="Search" size={18} className="text-[#73c673]" />
        </div>
        
        {/* Clear Button */}
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground hover:text-card-foreground"
          >
            <Icon name="X" size={12} />
          </Button>
        )}
      </div>
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions?.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-medium z-50 max-h-60 overflow-y-auto"
        >
          {suggestions?.map((suggestion, index) => (
            <button
              key={suggestion?.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                index === focusedIndex ? 'bg-muted/50' : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === suggestions?.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                <Icon name="Hash" size={14} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-popover-foreground truncate">
                  {suggestion?.word}
                </p>
                {suggestion?.category && (
                  <p className="font-caption text-xs text-muted-foreground">
                    {suggestion?.category}
                  </p>
                )}
              </div>
              <Icon name="ArrowUpRight" size={14} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;