// src/search/searchSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { MUSIC_DATA } from '../data/mockData'; 

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    term: '',
    data: [], // This will hold the full dataset, but we can also just use MUSIC_DATA directly in the reducer
    results: MUSIC_DATA,
    currentPage: 1,
    itemsPerPage: 12, 
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
      state.currentPage = 1; 
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;  // updates the global page number
    }
  },
});

export const { updateSearch, setPage } = searchSlice.actions;
export default searchSlice.reducer; 