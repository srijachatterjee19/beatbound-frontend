// src/search/searchSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { MUSIC_DATA } from '../data/mockData'; 

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    term: '',
    results: MUSIC_DATA,
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
  },
});

export const { updateSearch } = searchSlice.actions;
export default searchSlice.reducer; 