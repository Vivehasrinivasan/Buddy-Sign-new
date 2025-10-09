import React from 'react';
import Button from '../../../components/ui/Button';
import { HoverEffect } from '../../../components/ui/card-hover-effect';

const AlphabetFilter = ({ 
  selectedLetter = '', 
  onLetterSelect = () => {},
  className = '' 
}) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'?.split('');

  // Create alphabet items for hover effect component
  const alphabetItems = alphabet.map(letter => ({
    title: letter,
    description: `Words starting with ${letter}`,
    link: letter,
  }));

  const handleLetterClick = (item) => {
    onLetterSelect(item.link);
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-4 ${className}`}>
      <h3 className="text-sm font-heading font-semibold text-card-foreground mb-4">
        Select a letter to see words starting with that letter
      </h3>
      
      {/* 7-Column Horizontal Grid Layout */}
      <div className="grid grid-cols-7 gap-3">
        {alphabet?.map((letter) => (
          <Button
            key={letter}
            variant={selectedLetter === letter ? 'default' : 'outline'}
            size="lg"
            onClick={() => onLetterSelect(letter)}
            className="h-12 text-lg font-bold hover:scale-105 transition-transform duration-150"
            style={{
              background: selectedLetter === letter ? '#FFDB58' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              color: 'black',
              border: selectedLetter === letter ? '1px solid #FFF380' : '1px solid #b9c48a',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '700',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.16s ease',
              boxShadow: selectedLetter === letter ? '0 8px 25px rgba(0,0,0,0.1)' : '0 4px 16px rgba(0,0,0,0.07)'
            }}
          >
            {letter}
          </Button>
        ))}
      </div>
      
      {/* Clear Filter */}
      {selectedLetter && (
        <div className="mt-4 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLetterSelect('')}
            iconName="X"
            iconPosition="left"
            iconSize={14}
            className="text-muted-foreground hover:text-card-foreground"
          >
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlphabetFilter;