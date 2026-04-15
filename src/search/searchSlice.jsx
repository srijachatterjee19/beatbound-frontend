import { createSlice } from '@reduxjs/toolkit';
import { fuzzyMatch } from '../utils/fuzzySearch';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    term: '',
    data: [],
    results: [],
    currentPage: 1,
    itemsPerPage: 12,
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
      state.results = action.payload;
    },

    updateSearch: (state, action) => {
      const term = action.payload.toLowerCase();

      state.term = term;

      state.results = state.data.filter(item => {
        const q = term;
      
        return (
          fuzzyMatch(item.title?.toLowerCase() || "", q) ||
          fuzzyMatch(item.artist?.toLowerCase() || "", q) ||
          fuzzyMatch(item.album?.toLowerCase() || "", q) ||
          fuzzyMatch(item.genre?.toLowerCase() || "", q) ||
          item.tags?.some(tag => fuzzyMatch(tag.toLowerCase(), q))
        );
      });

      state.currentPage = 1; 
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },

    resetSearch: (state) => {
      state.term = '';
      state.results = state.data;
      state.currentPage = 1;
    }
  },
});

export const { setData, updateSearch, setPage,resetSearch } = searchSlice.actions;
export default searchSlice.reducer; 