import React, { useState, useRef } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WordCard = ({ 
  word = {},
  onCardClick = () => {},
  onBookmark = () => {},
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef(null);

  const handleAudioPlay = async (e) => {
    e?.stopPropagation();
    
    if (audioLoading) return;
    
    setAudioLoading(true);
    
    try {
      // Simulate audio loading and playback
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsPlaying(true);
      
      // Simulate audio duration
      setTimeout(() => {
        setIsPlaying(false);
      }, 2000);
    } catch (error) {
      console.error('Audio playback failed:', error);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleBookmark = (e) => {
    e?.stopPropagation();
    onBookmark(word?.id);
  };

  const handleCardClick = () => {
    onCardClick(word);
  };

  return (
    <div 
      className={`group bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-200 cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Image/GIF Container */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <Image
          src={word?.gifUrl || word?.imageUrl || "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop"}
          alt={`Sign language demonstration for ${word?.word}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Icon 
                name={word?.isBookmarked ? "Bookmark" : "BookmarkPlus"} 
                size={14}
                className={word?.isBookmarked ? "fill-current" : ""}
              />
            </Button>
          </div>

          {/* Play Indicator */}
          {word?.hasGif && (
            <div className="absolute bottom-2 left-2">
              <div className="flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1">
                <Icon name="Play" size={12} className="text-white" />
                <span className="text-xs font-caption text-white">GIF</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-base text-card-foreground truncate">
              {word?.word}
            </h3>
            {word?.category && (
              <p className="font-caption text-xs text-muted-foreground mt-1">
                {word?.category}
              </p>
            )}
          </div>
          
          {/* Difficulty Badge */}
          {word?.difficulty && (
            <div className={`flex-shrink-0 ml-2 px-2 py-1 rounded-full text-xs font-caption ${
              word?.difficulty === 'Easy' ? 'bg-success/10 text-success' :
              word?.difficulty === 'Medium'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
            }`}>
              {word?.difficulty}
            </div>
          )}
        </div>

        {/* Description */}
        {word?.description && (
          <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-3">
            {word?.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Audio Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAudioPlay}
              disabled={audioLoading}
              iconName={isPlaying ? "Volume2" : "Volume1"}
              iconPosition="left"
              iconSize={14}
              className="text-muted-foreground hover:text-card-foreground"
            >
              {audioLoading ? 'Loading...' : isPlaying ? 'Playing' : 'Listen'}
            </Button>
          </div>

          {/* Progress Indicator */}
          {word?.isLearned && (
            <div className="flex items-center space-x-1">
              <Icon name="CheckCircle" size={14} className="text-success" />
              <span className="font-caption text-xs text-success">Learned</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordCard;