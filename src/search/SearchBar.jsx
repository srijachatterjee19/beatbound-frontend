import React, { useState, useEffect,memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearch, setPage } from './searchSlice';
import { MUSIC_DATA } from '../data/mockData';

const SearchCard = memo(({ item, index }) => {
  return (
    <div 
      className="card card-animate" 
      onClick={() => dispatch(setTrack(item))}
    >
      <div className="album-placeholder">
        <span className="placeholder-icon">♪</span>
      </div>
      <div className="card-content-wrapper">
        <h2 className="album-title">{item.album}</h2>
        <div className="card-subtitle-row">
          <span className="artist-name">{item.name}</span>
          <span className="genre-tag">{item.genre}</span>
        </div>
      </div>
    </div>
  );
});

// Set display name for better debugging in Profiler
SearchCard.displayName = 'SearchCard';


const SearchBar = () => {
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {results = [] , currentPage = 1, itemsPerPage = 12} = useSelector((state) => state.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 100);
    return () => clearTimeout(handler);
  }, [query]);

  // Unified filtering logic: Get ALL matches for the "See all" count
  const allMatches = debouncedQuery.length > 0 
    ? MUSIC_DATA.filter(item => 
        item.album?.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
        item.name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        item.genre?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        item.songs?.some(song => song.toLowerCase().includes(debouncedQuery.toLowerCase()))
      )
    : [];

  // Slice exactly the top 4 for the search container display
  const topFourHits = allMatches.slice(0, 4);

  const handleFinalSearch = (searchTerm) => {
    const cleanTerm = searchTerm.trim();
    if (!cleanTerm) return; // Ignore empty searches

    setIsLoading(true); // Start loading

    setTimeout(() => {
      dispatch(updateSearch(searchTerm)); 
      setActiveSearchTerm(searchTerm);
      setIsLoading(false); // Stop loading
    }, 1000); // Simulate a delay for loading state
  };
    
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);
  
  return (
    <div className="container">
      <header className="app-header">
        <h1 className="title">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Beatbound
          </a>
        </h1>
        <p className="subtitle">Where every beat tells a story</p>
      </header>
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search artists, albums, or songs..."
          value={query}
          onFocus={() => setIsFocused(true)}
          // The timeout gives the 'click' on a suggestion time to fire
          onBlur={() => setTimeout(() => setIsFocused(false), 500)}
          onKeyDown={(e) => e.key === 'Enter' && handleFinalSearch(query)}
          onChange={(e) => setQuery(e.target.value)} // ONLY updates the text/dropdown
        />
        <button 
          className="search-submit-btn"
          onClick={() => handleFinalSearch(query)}
          aria-label="Submit search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        {/* Search Container: Shows Top 4 hits as the user types */}
        {isFocused && query.length > 0 && (
          <div className="search-suggestions-container" >
            {allMatches.length > 0 ? (
              <>
                <div className="mini-results-grid">
                  {topFourHits.map((hit) => (
                    <div 
                      key={hit.id} 
                      className="mini-result-item" 
                      onMouseDown={() => {
                        setQuery(hit.album);
                        handleFinalSearch(hit.album);
                        setIsFocused(false);
                      }}
                    >
                      <div className="mini-art">♪</div>
                      <div className="mini-text">
                        <span className="mini-title">{hit.album}</span>
                        <span className="mini-subtitle">{hit.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  className="see-all-results" 
                  onMouseDown={() => handleFinalSearch(query)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFinalSearch(query);
                    }
                  }}
                >
                  See all {allMatches.length} results
                </button>
              </>
            ) : (
              <p className="no-results">No matches found</p>
            )}
          </div>
        )}
      </div>
  
      <div className="results-status">
        {/* Show "Results for..." only if not loading and we have a search term */}
        {activeSearchTerm && !isLoading ? (
          <h2 className="results-title">
            Showing {results.length} {results.length === 1 ? 'result' : 'results'} for "{activeSearchTerm}"
          </h2>
        ) : !activeSearchTerm && !isLoading ? (
          /* Show "All Albums" only when there is no active search and not loading */
          <h2 className="results-title">All Albums</h2>
        ) : (
          /* While loading, we can leave this empty or show a "Searching..." subtitle */
          <h2 className="results-title">&nbsp;</h2> 
        )}
      </div>

      <div className="results-container">
        {isLoading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p className="loading-text">Finding your rhythm...</p>
          </div>
        ) : (
          <div className="results-grid">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <SearchCard key={item.id} item={item} index={index} />
              ))
            ) : (
              <div className="no-results-state">
                <p>No albums found for "{activeSearchTerm}"</p>
                <button onClick={handleLogoClick}>Clear Search</button>
              </div>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination"> 
          <button 
            className="pagination-btn" 
            disabled={currentPage === 1} 
            onClick={() => dispatch(setPage(currentPage - 1))}
          >
            ← Prev
          </button>
          
          <span className="page-info">
            {currentPage} / {totalPages}
          </span>
          
          <button 
            className="pagination-btn" 
            disabled={currentPage === totalPages} 
            onClick={() => dispatch(setPage(currentPage + 1))}
          >
            Next →
          </button>
        </div> 
      )}
    </div>
  );
};

export default SearchBar;