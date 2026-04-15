import { createSlice } from '@reduxjs/toolkit';

const playerSlice = createSlice({
    name: 'player',
    initialState: {
      currentTrack: null, // { id, title, artist, url }
      isPlaying: false,
      volume: 0.8,
    },
    reducers: {
      setTrack: (state, action) => {
        state.currentTrack = action.payload;
        state.isPlaying = true;
      },
      togglePlay: (state) => {
        state.isPlaying = !state.isPlaying;
      },
    },
  });

export const { setTrack, togglePlay } = playerSlice.actions;
export default playerSlice.reducer;