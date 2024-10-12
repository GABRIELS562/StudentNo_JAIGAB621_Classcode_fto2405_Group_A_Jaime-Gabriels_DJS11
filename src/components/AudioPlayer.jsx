import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@radix-ui/themes';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';

function AudioPlayer({ currentEpisode, onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentEpisode && currentEpisode.file) {
      audioRef.current.src = currentEpisode.file;
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      setIsPlaying(true);
    }
  }, [currentEpisode]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    // Add event listeners
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    // Clean up event listeners
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentEpisode) return null;

  return (
    <div className="audio-player">
      <audio ref={audioRef} onEnded={onComplete} />
      <div className="audio-info">
        <p>{currentEpisode.title} - {currentEpisode.show}</p>
      </div>
      <div className="audio-controls">
        <Button onClick={togglePlay} variant="ghost" size="1">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="progress-bar"
        />
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default AudioPlayer;