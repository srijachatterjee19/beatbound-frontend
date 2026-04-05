import React, { useState, useEffect } from 'react';

const MusicPlayer = () => {
  // Dummy data: 180 seconds = 3 minutes
  const duration = 180; 
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);



  useEffect(() => {
    let interval = null;

    if (!isPaused && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    // Cleanup: This runs when the component unmounts or isPaused changes
    return () => clearInterval(interval);
  }, [isPaused, currentTime]);

  // Move the slider manually
  const handleSliderChange = (e) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
  };

  const progressPercent = (currentTime / duration) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

    return (
        <div className="player-wrapper">
            <div className="player-pill">
            {/* 1. Album and Artist Info (New) */}
            <div className="player-info">
                <p className="player-album-name">Abbey Road</p>
                <p className="player-artist-name">The Beatles</p>
            </div>

            {/* 2. Progress Slider Section */}
            <div className="progress-container">
                <span className="time-text left-time">{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSliderChange}
                    className="progress-slider"
                    style={{ 
                        /* Force the percentage calculation here */
                        '--progress': `${(currentTime / duration) * 100}%` 
                      }}
                />
                <span className="time-text right-time">{formatTime(duration)}</span>
            </div>

            {/* 3. Main Controls Section */}
            <div className="controls-row">
                <button className="nav-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
            
                <button className="play-pause-btn" onClick={() => setIsPaused(!isPaused)}>
                    {isPaused ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z"/></svg>
                    ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="black"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    )}
                </button>

                <button className="nav-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
            </div>
        </div>
    </div>
  );
};

export default MusicPlayer;