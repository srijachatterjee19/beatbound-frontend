import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { togglePlay } from '../music-player/playerSlice';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const MusicPlayer = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const { currentTrack, isPlaying } = useSelector((state) => state.player || {});

  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
  }, [isPlaying, currentTrack]);

  return (
    <div className="player-wrapper">
      <div className="player-pill">
        {/* 1. Top Progress Bar */}
        <div className="slider-container">
          <div className="slider-track">
            {/* We'll keep this static for now as requested */}
            <div className="slider-fill" style={{ width: '60%' }}></div>
            <div className="slider-thumb" style={{ left: '60%' }}></div>
          </div>
        </div>

        {/* 2. Centered Controls Only */}
        <div className="control-row-centered">
          <SkipBack size={28} fill="currentColor" className="cursor-pointer" />
          
          <button className="play-circle" onClick={() => dispatch(togglePlay())}>
            {isPlaying ? (
              <Pause size={24} fill="black" />
            ) : (
              <Play size={24} fill="black" style={{ marginLeft: '4px' }} />
            )}
          </button>
          
          <SkipForward size={28} fill="currentColor" className="cursor-pointer" />
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack ? `http://localhost:5000/api/stream/${currentTrack.id}` : ""} 
      />
    </div>
  );
};

export default MusicPlayer;