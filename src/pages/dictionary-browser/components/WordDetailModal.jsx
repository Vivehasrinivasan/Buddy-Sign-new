import React, { useState, useRef, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WordDetailModal = ({ 
  word = null,
  isOpen = false,
  onClose = () => {},
  onBookmark = () => {},
  onMarkAsLearned = () => {},
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus management
      setTimeout(() => {
        if (modalRef?.current) {
          modalRef?.current?.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  const handleAudioPlay = async () => {
    if (audioLoading) return;
    
    setAudioLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2500);
    } catch (error) {
      console.error('Audio playback failed:', error);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleBookmark = () => {
    onBookmark(word?.id);
  };

  const handleMarkAsLearned = () => {
    onMarkAsLearned(word?.id);
  };

  if (!isOpen || !word) return null;

  const relatedWords = [
    { id: 'r1', word: 'Happy', category: 'Emotions', imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=200&h=150&fit=crop' },
    { id: 'r2', word: 'Excited', category: 'Emotions', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop' },
    { id: 'r3', word: 'Cheerful', category: 'Emotions', imageUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&h=150&fit=crop' }
  ];

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${className}`}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={modalRef}
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-card rounded-lg shadow-floating border border-border overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-heading font-bold text-card-foreground">
                {word?.word}
              </h2>
              {word?.difficulty && (
                <div className={`px-3 py-1 rounded-full text-sm font-caption ${
                  word?.difficulty === 'Easy' ? 'bg-success/10 text-success' :
                  word?.difficulty === 'Medium'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                }`}>
                  {word?.difficulty}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className="text-muted-foreground hover:text-card-foreground"
            >
              <Icon 
                name={word?.isBookmarked ? "Bookmark" : "BookmarkPlus"} 
                size={20}
                className={word?.isBookmarked ? "fill-current text-primary" : ""}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-card-foreground"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Media Section */}
              <div className="space-y-4">
                <div 
                  className={`relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer ${
                    imageZoomed ? 'fixed inset-4 z-50 aspect-auto' : ''
                  }`}
                  onClick={() => setImageZoomed(!imageZoomed)}
                >
                  <Image
                    src={word?.gifUrl || word?.imageUrl || "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=400&fit=crop"}
                    alt={`Sign language demonstration for ${word?.word}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Zoom Indicator */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-black/50 rounded-full p-2">
                      <Icon 
                        name={imageZoomed ? "ZoomOut" : "ZoomIn"} 
                        size={16} 
                        className="text-white" 
                      />
                    </div>
                  </div>

                  {/* GIF Indicator */}
                  {word?.hasGif && (
                    <div className="absolute bottom-2 left-2">
                      <div className="flex items-center space-x-1 bg-black/50 rounded-full px-3 py-1">
                        <Icon name="Play" size={14} className="text-white" />
                        <span className="text-sm font-caption text-white">Auto-play GIF</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Audio Controls */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleAudioPlay}
                    disabled={audioLoading}
                    iconName={isPlaying ? "Volume2" : "Volume1"}
                    iconPosition="left"
                    className="flex-1"
                  >
                    {audioLoading ? 'Loading Audio...' : isPlaying ? 'Playing Pronunciation' : 'Play Pronunciation'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-card-foreground"
                  >
                    <Icon name="RotateCcw" size={16} />
                  </Button>
                </div>
              </div>

              {/* Information Section */}
              <div className="space-y-4">
                {/* Category and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Tag" size={16} className="text-muted-foreground" />
                    <span className="font-body text-sm text-muted-foreground">
                      {word?.category || 'General'}
                    </span>
                  </div>
                  {word?.isLearned && (
                    <div className="flex items-center space-x-1">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="font-caption text-sm text-success">Learned</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-heading font-semibold text-base text-card-foreground mb-2">
                    Description
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {word?.description || `Learn how to sign "${word?.word}" in American Sign Language. This sign is commonly used in everyday conversation and is an essential part of basic ASL vocabulary.`}
                  </p>
                </div>

                {/* Example Sentences */}
                <div>
                  <h3 className="font-heading font-semibold text-base text-card-foreground mb-2">
                    Example Usage
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="font-body text-sm text-card-foreground">
                        "I feel {word?.word?.toLowerCase()} today!"
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="font-body text-sm text-card-foreground">
                        "The children look very {word?.word?.toLowerCase()}."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4 border-t border-border">
                  <Button
                    variant={word?.isLearned ? "outline" : "default"}
                    onClick={handleMarkAsLearned}
                    iconName={word?.isLearned ? "CheckCircle" : "Circle"}
                    iconPosition="left"
                    className="flex-1"
                  >
                    {word?.isLearned ? 'Mark as Not Learned' : 'Mark as Learned'}
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Share"
                    iconPosition="left"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Related Words */}
            <div className="border-t border-border pt-6">
              <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4">
                Related Words
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedWords?.map((relatedWord) => (
                  <div
                    key={relatedWord?.id}
                    className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      // In a real app, this would load the related word
                      console.log('Load related word:', relatedWord?.word);
                    }}
                  >
                    <div className="aspect-video bg-muted rounded-md overflow-hidden mb-3">
                      <Image
                        src={relatedWord?.imageUrl}
                        alt={`Sign for ${relatedWord?.word}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-heading font-medium text-sm text-card-foreground">
                      {relatedWord?.word}
                    </h4>
                    <p className="font-caption text-xs text-muted-foreground">
                      {relatedWord?.category}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetailModal;