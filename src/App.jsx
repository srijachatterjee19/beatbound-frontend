// src/App.js
import React from 'react';
import SearchBar from './search/SearchBar'; 
import MusicPlayer from './music-player/MusicPlayer'; 

function App() {
  return (
    <div className="App">
      <div className="content-area">
      <SearchBar />
      </div>
      
      <MusicPlayer />
    </div>
  );
}

export default App;