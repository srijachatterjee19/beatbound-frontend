import React, { useState, useEffect, useRef} from 'react';

const MusicPlayer = () => {
  // Dummy data: 180 seconds = 3 minutes
//   const duration = 180; 
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    // initialize audio only once
    audioRef.current = new Audio("http://localhost:5001/api/music/stream/1");
    
    const audio = audioRef.current;

    // event Listeners for the Stream
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPaused(true);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      isPaused ? audioRef.current.pause() : audioRef.current.play();
    }
  }, [isPaused]);

  // Scrubbing the slider
  const handleSliderChange = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time; 
    setCurrentTime(time);
  };

//   const progressPercent = (currentTime / duration) * 100;
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

    return (
        <div className="player-wrapper">
            <div className="player-pill">
            <div className="player-info">
                <p className="player-album-name">Dreamy 4</p>
                <p className="player-artist-name">YuraSoops</p>
            </div>

            <div className="progress-container">
                <span className="time-text">{formatTime(currentTime)}</span>
                <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSliderChange}
                className="progress-slider"
                style={{ '--progress': `${progressPercent}%` }}
                />
                <span className="time-text">{formatTime(duration)}</span>
            </div>

            {/* main Controls section */}
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