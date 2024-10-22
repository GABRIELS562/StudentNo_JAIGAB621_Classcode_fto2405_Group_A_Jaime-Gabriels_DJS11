import React, { useState, useRef, useEffect } from 'react';
import { Button, Flex, Text, Slider } from '@radix-ui/themes';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';

function AudioPlayer({ currentEpisode, onComplete, updatePlaybackPosition }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(currentEpisode?.currentTime || 0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);//Gives direct access to the HTML audio element It doesn't trigger re-renders when accessed or changed

  useEffect(() => {
    if (audioRef.current) {// Add event listeners
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', setAudioDuration);
      audioRef.current.addEventListener('ended', handleAudioEnd);
      return () => {   // Remove event listeners when component unmounts
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('loadedmetadata', setAudioDuration);
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      };
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (currentEpisode) {
      audioRef.current.src = currentEpisode.file; // 1. Set the audio source
      audioRef.current.currentTime = currentEpisode.currentTime || 0; // 2. Set the playback position
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentEpisode]);

  const togglePlay = () => {
    if (currentEpisode) {
      if (isPlaying) {
        audioRef.current.pause();// Pause if playing
      } else {
        audioRef.current.play(); // Play if paused
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateTime = () => {
    setCurrentTime(audioRef.current.currentTime);
    updatePlaybackPosition(currentEpisode.id, audioRef.current.currentTime);
  };

  const setAudioDuration = () => {
    setDuration(audioRef.current.duration);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onComplete) {
      onComplete(currentEpisode);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (value) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    updatePlaybackPosition(currentEpisode.id, newTime);
  };

  if (!currentEpisode) return null;

  return (
    <Flex direction="column" gap="2" className="audio-player bold-border">
      <audio ref={audioRef} />
      <Text size="2" weight="bold" style={{ color: 'black' }}>
        {currentEpisode.title} - {currentEpisode.showTitle}
      </Text>
      <Flex align="center" gap="2">
        <Button onClick={togglePlay} variant="ghost" size="1">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <Slider 
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={handleSeek}
          className="progress-bar"
        />
        <Text size="1" style={{ color: 'black' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </Flex>
      <Text size="2" style={{ color: 'black' }}>
        Season {currentEpisode.seasonNumber}, Episode {currentEpisode.episodeNumber}
      </Text>
    </Flex>
  );
}

export default AudioPlayer;