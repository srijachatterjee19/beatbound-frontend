import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearch, setPage } from './searchSlice';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  const { results, currentPage, itemsPerPage, term } = useSelector((state) => state.search);

  // Filter the results to only include things that match the query
  // Then take the top 5
  const filteredHits = results.filter(item => 
    item.album.toLowerCase().includes(query.toLowerCase()) || 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  // Only show suggestions if there is actually a search term
  const topFiveHits = query.length > 0 ? filteredHits.slice(0, 5) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  // console.log("Results Length:", results.length);
  // console.log("Items Per Page:", itemsPerPage);
  // console.log("Total Pages:", Math.ceil(results.length / itemsPerPage));
  // console.log("Top Five Hits:", topFiveHits);

  useEffect(() => {
    dispatch(updateSearch(query));
  }, [query, dispatch]);

  return (
    <div className="container">
      <h1 className="title">Music Discovery</h1>
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search artists, albums, or songs..."
          value={query}
          // onChange={(e) => setQuery(e.target.value)}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value); // Updates the text you see in the bar
            dispatch(updateSearch(value)); // Updates Redux so we get "hits"
          }}
        />

        {query.length > 0 && topFiveHits.length > 0 && (
          <ul className="search-dropdown">
            {topFiveHits.map((hit) => (
              <li key={hit.id} className="dropdown-item">
                <span className="dot"></span>
                <div className="item-text">
                  <span className="item-album">{hit.album}</span>
                  <span className="item-artist">{hit.name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
  
      <div className="results-grid">
        {currentItems.map((artist) => (
          <div key={artist.id} className="card">
            <div className="album-placeholder">
              <span className="placeholder-icon">♪</span>
            </div>

            <h2 className="album-title">{artist.album}</h2>
      
            <div className="meta-info">
              <span className="artist-name">{artist.name}</span>
              <span className="genre-tag">{artist.genre}</span>
            </div>
            
            {/* <ul className="song-list">
              {artist.songs.map((song, i) => (
                <li key={i} className="song-item">{song}</li>
              ))}
            </ul> */}
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