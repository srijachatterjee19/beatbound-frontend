// src/search/searchSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { MUSIC_DATA } from '../data/mockData'; 

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    term: '',
    results: MUSIC_DATA,
    currentPage: 1,
    itemsPerPage: 10, 
  },
  reducers: {
    updateSearch: (state, action) => {
      const term = action.payload.toLowerCase();
      state.results = MUSIC_DATA.filter((item) => {
        return (
          item.name.toLowerCase().includes(term) ||
          item.album.toLowerCase().includes(term) ||
          item.genre.toLowerCase().includes(term) ||
          item.songs.some(song => song.toLowerCase().includes(term))
        );
      });
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;  // updates the global page number
    }
  },
});

export const { updateSearch, setPage } = searchSlice.actions;
export default searchSlice.reducer; 