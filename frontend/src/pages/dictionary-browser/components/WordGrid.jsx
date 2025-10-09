import React, { useState, useEffect, useRef, useCallback } from 'react';
import WordCard from './WordCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WordGrid = ({ 
  words = [],
  loading = false,
  hasMore = true,
  onLoadMore = () => {},
  onWordClick = () => {},
  onBookmark = () => {},
  className = '' 
}) => {
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target?.isIntersecting && hasMore && !loading && !loadingMore) {
      setLoadingMore(true);
      onLoadMore()?.finally(() => {
        setLoadingMore(false);
      });
    }
  }, [hasMore, loading, loadingMore, onLoadMore]);

  useEffect(() => {
    const element = loadingRef?.current;
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    };

    observerRef.current = new IntersectionObserver(handleObserver, option);
    if (element) observerRef?.current?.observe(element);

    return () => {
      if (observerRef?.current && element) {
        observerRef?.current?.unobserve(element);
      }
    };
  }, [handleObserver]);

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-video bg-muted"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
        <div className="h-8 bg-muted rounded w-full"></div>
      </div>
    </div>
  );

  if (loading && words?.length === 0) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(12)]?.map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!loading && words?.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
          No words found
        </h3>
        <p className="font-body text-sm text-muted-foreground text-center max-w-md">
          Try adjusting your search terms or filters to find the sign language words you're looking for.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={() => window.location?.reload()}
        >
          Reset Search
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Grid3x3" size={16} className="text-muted-foreground" />
          <span className="font-body text-sm text-muted-foreground">
            {words?.length} word{words?.length !== 1 ? 's' : ''} found
          </span>
        </div>
        
        {/* View Options */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-card-foreground"
          >
            <Icon name="Grid3x3" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-card-foreground"
          >
            <Icon name="List" size={16} />
          </Button>
        </div>
      </div>
      {/* Word Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {words?.map((word) => (
          <WordCard
            key={word?.id}
            word={word}
            onCardClick={onWordClick}
            onBookmark={onBookmark}
          />
        ))}
      </div>
      {/* Loading More Indicator */}
      {(loadingMore || (hasMore && !loading)) && (
        <div 
          ref={loadingRef}
          className="flex items-center justify-center py-8 mt-6"
        >
          {loadingMore ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="font-body text-sm text-muted-foreground">
                Loading more words...
              </span>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setLoadingMore(true);
                onLoadMore()?.finally(() => setLoadingMore(false));
              }}
              iconName="ChevronDown"
              iconPosition="right"
            >
              Load More Words
            </Button>
          )}
        </div>
      )}
      {/* End of Results */}
      {!hasMore && words?.length > 0 && (
        <div className="flex items-center justify-center py-8 mt-6 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="font-body text-sm text-muted-foreground">
              You've seen all available words
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordGrid;