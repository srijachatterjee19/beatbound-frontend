import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearch } from './searchSlice';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const results = useSelector((state) => state.search.results);

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
        {results.map((artist) => (
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
    </div>
  );
};

export default SearchBar;