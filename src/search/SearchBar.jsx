import React, { useState, useEffect,memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearch, setPage, setData,resetSearch } from './searchSlice';
import { setTrack,togglePlay } from '../music-player/playerSlice';
import { fuzzyMatch } from '../utils/fuzzySearch';


const SearchCard = memo(({ item, isPlaying, isCurrent }) => {
  const dispatch = useDispatch();

  const isPlayable = item?.fileThere;

  const handleCardClick = () => {
    if (!isPlayable) return;
    dispatch(setTrack(item));
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();

    if (!isPlayable) return;

    if (isCurrent) {
      dispatch(togglePlay());
    } else {
      dispatch(setTrack(item));
    }
  };

  return (
    <div className={`card card-animate ${!isPlayable ? 'disabled' : ''}  `} onClick={handleCardClick}>
      
      <div className="album-placeholder">

        {isPlayable && (
          <div className="overlay">
            <button className="play-btn" onClick={handlePlayPause}>
              {isCurrent && isPlaying ? (
                // ⏸
                <svg width="32" height="32" viewBox="0 0 24 24" fill="black">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                // ▶
                <svg width="32" height="32" viewBox="0 0 24 24" fill="black">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="card-content-wrapper">
        <h2 className="album-title">{item.album}</h2>
        <div className="card-subtitle-row">
          <span className="artist-name">{item.title}</span>
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

  const handleLogoClick = () => {
    dispatch(resetSearch());
  };

  const { data = [], results = [], currentPage = 1, itemsPerPage = 12 } =
  useSelector((state) => state.search);
  
  const { currentTrack, isPlaying } = useSelector(state => state.player);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/music/songs');
        const json = await res.json();

        dispatch(setData(json.data)); 
      } catch (err) {
        console.error('Error fetching songs:', err);
      }
    };

    fetchSongs();
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 100);
    return () => clearTimeout(handler);
  }, [query]);

  const allMatches = debouncedQuery.length > 0 
  ? data.filter(item => {
      const q = debouncedQuery.toLowerCase();

      return (
        fuzzyMatch(item.title?.toLowerCase() || "", q) ||
        fuzzyMatch(item.artist?.toLowerCase() || "", q) ||
        fuzzyMatch(item.album?.toLowerCase() || "", q) ||
        fuzzyMatch(item.genre?.toLowerCase() || "", q) ||
        item.tags?.some(tag => fuzzyMatch(tag.toLowerCase(), q))
      );
    })
  : [];

  const topFourHits = allMatches.slice(0, 4);

  const handleFinalSearch = (searchTerm) => {
    const cleanTerm = searchTerm.trim();
    if (!cleanTerm) return;

    setIsLoading(true);

    setTimeout(() => {
      dispatch(updateSearch(searchTerm)); 
      setActiveSearchTerm(searchTerm);
      setIsLoading(false);
    }, 500);
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
          onBlur={() => setTimeout(() => setIsFocused(false), 500)}
          onKeyDown={(e) => e.key === 'Enter' && handleFinalSearch(query)}
          onChange={(e) => setQuery(e.target.value)}
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
                        // setQuery(hit.title);
                        handleFinalSearch(hit.title);
                        setIsFocused(false);
                      }}
                    >
                      <div className="mini-art">♪</div>
                      <div className="mini-text">
                        <span className="mini-title">{hit.title}</span>
                        <span className="mini-subtitle">{hit.artist}</span>
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
            Showing {results.length} results for "{query}"
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
              <SearchCard
                  key={item.id}
                  item={item}
                  isPlaying={isPlaying}
                  isCurrent={currentTrack?.id === item.id}
                />
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