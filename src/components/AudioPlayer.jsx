import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@radix-ui/themes';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';

function AudioPlayer({ currentEpisode, onClose, onPause, onPlay, onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', setAudioDuration);
      audioRef.current.addEventListener('ended', handleAudioEnd);
      return () => {
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('loadedmetadata', setAudioDuration);
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      };
    }
  }, [currentEpisode]);

  useEffect(() => {
    if (currentEpisode) {
      setIsPlaying(true);
      audioRef.current.play();
      onPlay();
    }
  }, [currentEpisode, onPlay]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      onPause();
    } else {
      audioRef.current.play();
      onPlay();
    }
    setIsPlaying(!isPlaying);
  };

  const updateTime = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const setAudioDuration = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    onPause();
    onComplete(currentEpisode);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentEpisode) return null;

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={currentEpisode.file} />
      <div className="audio-info">
        <h3>{currentEpisode.title}</h3>
        <p>{currentEpisode.show}</p>
      </div>
      <div className="audio-controls">
        <Button onClick={togglePlay} variant="ghost">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="progress-bar"
        />
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
      <Button onClick={onClose} variant="ghost">Close</Button>
    </div>
  );
}

export default AudioPlayer;