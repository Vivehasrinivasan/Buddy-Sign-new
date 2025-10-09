import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import AuthGateModal from '../../components/ui/AuthGateModal';
import AlphabetFilter from './components/AlphabetFilter';
import SearchBar from './components/SearchBar';
import FilterControls from './components/FilterControls';
import WordGrid from './components/WordGrid';
import WordDetailModal from './components/WordDetailModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DictionaryBrowser = () => {
  const navigate = useNavigate();
  
  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTargetPath, setAuthTargetPath] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [wordDetailOpen, setWordDetailOpen] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    status: ''
  });
  
  // Data State
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock User Data
  const [user] = useState({
    id: 1,
    name: 'Emma Johnson',
    email: 'emma@example.com',
    points: 750,
    isParent: false
  });

  // Mock Dictionary Data
  const mockWords = [
    {
      id: 1,
      word: 'Happy',
      category: 'Emotions',
      difficulty: 'Easy',
      description: 'A feeling of joy and contentment. This sign shows positive emotions and is used frequently in daily conversation.',
      imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop',
      gifUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop',
      hasGif: true,
      isBookmarked: true,
      isLearned: true
    },
    {
      id: 2,
      word: 'Apple',
      category: 'Food',
      difficulty: 'Easy',
      description: 'A common fruit that is red, green, or yellow. This sign is often one of the first food signs children learn.',
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
      gifUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
      hasGif: true,
      isBookmarked: false,
      isLearned: false
    },
    {
      id: 3,
      word: 'Cat',
      category: 'Animals',
      difficulty: 'Easy',
      description: 'A small domesticated carnivorous mammal. This animal sign mimics the whiskers of a cat.',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
      gifUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
      hasGif: true,
      isBookmarked: true,
      isLearned: false
    },
    {
      id: 4,
      word: 'Blue',
      category: 'Colors',
      difficulty: 'Medium',
      description: 'The color of the sky and ocean. Color signs in ASL often relate to objects of that color.',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
      gifUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
      hasGif: true,
      isBookmarked: false,
      isLearned: true
    },
    {
      id: 5,
      word: 'Family',
      category: 'Family',
      difficulty: 'Medium',
      description: 'A group of people related by blood or marriage. This sign represents the bond between family members.',
      imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
      gifUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
      hasGif: true,
      isBookmarked: true,
      isLearned: false
    },
    {
      id: 6,
      word: 'Dance',
      category: 'Actions',
      difficulty: 'Hard',
      description: 'To move rhythmically to music. This action sign shows the movement and rhythm of dancing.',
      imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop',
      gifUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop',
      hasGif: true,
      isBookmarked: false,
      isLearned: false
    },
    {
      id: 7,
      word: 'Hello',
      category: 'Greetings',
      difficulty: 'Easy',
      description: 'A common greeting used when meeting someone. One of the most important signs to learn first.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      gifUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      hasGif: true,
      isBookmarked: true,
      isLearned: true
    },
    {
      id: 8,
      word: 'Book',
      category: 'School',
      difficulty: 'Easy',
      description: 'A written or printed work consisting of pages. This sign mimics opening and closing a book.',
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      gifUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      hasGif: true,
      isBookmarked: false,
      isLearned: true
    }
  ];

  // Initialize data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWords(mockWords);
      setFilteredWords(mockWords);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...words];

    // Apply letter filter
    if (selectedLetter) {
      filtered = filtered?.filter(word => 
        word?.word?.toUpperCase()?.startsWith(selectedLetter)
      );
    }

    // Apply search query
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(word =>
        word?.word?.toLowerCase()?.includes(query) ||
        word?.category?.toLowerCase()?.includes(query) ||
        word?.description?.toLowerCase()?.includes(query)
      );
    }

    // Apply category filter
    if (filters?.category) {
      filtered = filtered?.filter(word => 
        word?.category?.toLowerCase() === filters?.category?.toLowerCase()
      );
    }

    // Apply difficulty filter
    if (filters?.difficulty) {
      filtered = filtered?.filter(word => word?.difficulty === filters?.difficulty);
    }

    // Apply status filter
    if (filters?.status) {
      switch (filters?.status) {
        case 'learned':
          filtered = filtered?.filter(word => word?.isLearned);
          break;
        case 'bookmarked':
          filtered = filtered?.filter(word => word?.isBookmarked);
          break;
        case 'recent':
          // Mock recent filter - in real app would check recent activity
          filtered = filtered?.slice(0, 4);
          break;
      }
    }

    setFilteredWords(filtered);

    // Update suggestions for search
    if (searchQuery?.trim()) {
      const searchSuggestions = words?.filter(word => 
          word?.word?.toLowerCase()?.includes(searchQuery?.toLowerCase()) &&
          word?.word?.toLowerCase() !== searchQuery?.toLowerCase()
        )?.slice(0, 5)?.map(word => ({
          id: word?.id,
          word: word?.word,
          category: word?.category
        }));
      setSuggestions(searchSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [words, selectedLetter, searchQuery, filters]);

  // Event Handlers
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleAuthRequired = (targetPath) => {
    setAuthTargetPath(targetPath);
    setAuthModalOpen(true);
  };

  const handleAuthenticate = (targetPath) => {
    // Mock authentication success
    navigate(targetPath);
  };

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter === selectedLetter ? '' : letter);
    setSearchQuery('');
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setSelectedLetter('');
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion?.word);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      status: ''
    });
    setSearchQuery('');
    setSelectedLetter('');
  };

  const handleWordClick = (word) => {
    setSelectedWord(word);
    setWordDetailOpen(true);
  };

  const handleBookmark = (wordId) => {
    setWords(prevWords =>
      prevWords?.map(word =>
        word?.id === wordId
          ? { ...word, isBookmarked: !word?.isBookmarked }
          : word
      )
    );
  };

  const handleMarkAsLearned = (wordId) => {
    setWords(prevWords =>
      prevWords?.map(word =>
        word?.id === wordId
          ? { ...word, isLearned: !word?.isLearned }
          : word
      )
    );
  };

  const handleLoadMore = useCallback(async () => {
    // Simulate loading more data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would fetch more data from API
    const nextPage = currentPage + 1;
    if (nextPage > 3) {
      setHasMore(false);
      return;
    }
    
    setCurrentPage(nextPage);
    // Mock: no additional words to add in this demo
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        user={user}
        onSignOut={() => navigate('/sign-in-sign-up')}
      />
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        user={user}
        onAuthRequired={handleAuthRequired}
      />
      {/* Main Content */}
      <main className="pt-16 lg:ml-60">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                Sign Language Dictionary
              </h1>
              <p className="font-body text-muted-foreground mt-1">
                Explore and learn sign language vocabulary with visual demonstrations
              </p>
            </div>
            
            {/* Category Filter - Top Right */}
            <div className="hidden md:block">
              <FilterControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              suggestions={suggestions}
              onSuggestionSelect={handleSuggestionSelect}
            />

            {/* Alphabet Filter */}
            <AlphabetFilter
              selectedLetter={selectedLetter}
              onLetterSelect={handleLetterSelect}
            />
          </div>

          {/* Results Summary */}
          {(searchQuery || selectedLetter || Object.values(filters)?.some(f => f)) && (
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Filter" size={16} className="text-muted-foreground" />
                  <span className="font-body text-sm text-muted-foreground">
                    Active filters:
                  </span>
                  {searchQuery && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-caption">
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {selectedLetter && (
                    <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-caption">
                      Letter: {selectedLetter}
                    </span>
                  )}
                  {filters?.category && (
                    <span className="bg-accent/10 text-accent-foreground px-2 py-1 rounded-full text-xs font-caption">
                      Category: {filters?.category}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  iconName="X"
                  iconPosition="left"
                  iconSize={14}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}

          {/* Word Grid */}
          <WordGrid
            words={filteredWords}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onWordClick={handleWordClick}
            onBookmark={handleBookmark}
          />
        </div>
      </main>
      {/* Modals */}
      <AuthGateModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticate={handleAuthenticate}
        targetPath={authTargetPath}
      />
      <WordDetailModal
        word={selectedWord}
        isOpen={wordDetailOpen}
        onClose={() => setWordDetailOpen(false)}
        onBookmark={handleBookmark}
        onMarkAsLearned={handleMarkAsLearned}
      />
    </div>
  );
};

export default DictionaryBrowser;