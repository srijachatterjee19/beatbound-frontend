import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearch, setPage } from './searchSlice';
import { MUSIC_DATA } from '../data/mockData';


const SearchBar = () => {
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

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
    dispatch(updateSearch(searchTerm)); 
    setActiveSearchTerm(searchTerm);
  };
    
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);
  
  return (
    <div className="container">
      <header className="app-header">
        <h1 className="title">Beatbound</h1>
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleFinalSearch(debouncedQuery); // GRID updates ONLY here
            }
            if (e.key === 'Escape') {
              setIsFocused(false);
              e.target.blur(); // Also removes the cursor from the box
            }
          }}
          onChange={(e) => setQuery(e.target.value)} // ONLY updates the text/dropdown
        />

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
                  onMouseDown={() => {
                    handleFinalSearch(debouncedQuery);
                    setIsFocused(false);
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
        {activeSearchTerm ? (
          <h2 className="results-title">
            Showing {results.length} results for "{activeSearchTerm}"
          </h2>
        ) : (
          <h2 className="results-title">All Albums</h2>
        )}
      </div>

      <div className="results-grid">
        {currentItems.map((item) => (
          <div key={item.id} className="card">
            <div className="album-placeholder">
              <span className="placeholder-icon">♪</span>
            </div>
            <h2 className="album-title">{item.album}</h2>
            <div className="meta-info">
              <span className="artist-name">{item.name}</span>
              <span className="genre-tag">{item.genre}</span>
            </div>
          </div>
        ))}
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