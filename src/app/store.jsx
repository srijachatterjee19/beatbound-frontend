import { configureStore } from '@reduxjs/toolkit';
import searchReducer from "../search/searchSlice";
import playerReducer from '../music-player/playerSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    player: playerReducer,
  },
});