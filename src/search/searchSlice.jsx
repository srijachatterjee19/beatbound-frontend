import { createSlice } from '@reduxjs/toolkit';

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

      state.results = state.data.filter(item =>
        item.title?.toLowerCase().includes(term) ||
        item.artist?.toLowerCase().includes(term) ||
        item.album?.toLowerCase().includes(term) ||
        item.genre?.toLowerCase().includes(term)
      );

      state.currentPage = 1; 
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },

    resetSearch: (state) => {
      state.term = '';
      state.results = [];
      state.currentPage = 1;
    }
  },
});

export const { setData, updateSearch, setPage,resetSearch } = searchSlice.actions;
export default searchSlice.reducer; 