import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearch, setPage } from './searchSlice';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  const { results, currentPage, itemsPerPage } = useSelector((state) => state.search);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  // console.log("Results Length:", results.length);
  // console.log("Items Per Page:", itemsPerPage);
  // console.log("Total Pages:", Math.ceil(results.length / itemsPerPage));

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
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
  
      <div className="results-grid">
        {currentItems.map((artist) => (
          <div key={artist.id} className="card">
            <h2>{artist.name}</h2>
            <div className="meta-info">
              <span className="album-label">Album:</span> {artist.album} 
              <span className="genre-tag">{artist.genre}</span>
            </div>
            
            <ul className="song-list">
              {artist.songs.map((song, i) => (
                <li key={i} className="song-item">{song}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination"> 
          <button 
            disabled={currentPage === 1} 
            onClick={() => dispatch(setPage(currentPage - 1))}
          >
            Previous
          </button>

          <span>Page {currentPage} of {totalPages}</span>

          <button 
            disabled={currentPage === totalPages} 
            onClick={() => dispatch(setPage(currentPage + 1))}
          >
            Next
          </button>
        </div> 
      )}
    </div>
  );
};

export default SearchBar;