import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import Home from './components/Home';
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import FavoritesManager from './components/FavoritesManager';
import ThemeToggle from './components/ThemeToggle';
import AudioPlayer from './components/AudioPlayer';
import CompletedEpisodes from './components/CompletedEpisodes';
import '@radix-ui/themes/styles.css';
import './App.css';

function App() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [completedEpisodes, setCompletedEpisodes] = useState([]);
  const [theme, setTheme] = useState('light');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const storedCompletedEpisodes = JSON.parse(localStorage.getItem('completedEpisodes') || '[]');
    const storedTheme = localStorage.getItem('theme') || 'light';
    
    setFavorites(storedFavorites);
    setCompletedEpisodes(storedCompletedEpisodes);
    setTheme(storedTheme);

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = (event) => {
    if (isAudioPlaying) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  const playAudio = (episode) => {
    setCurrentlyPlaying(episode);
    setIsAudioPlaying(true);
  };

  const pauseAudio = () => {
    setIsAudioPlaying(false);
  };

  const resumeAudio = () => {
    setIsAudioPlaying(true);
  };

  const closeAudioPlayer = () => {
    setCurrentlyPlaying(null);
    setIsAudioPlaying(false);
  };

  const markEpisodeAsCompleted = (episode) => {
    setCompletedEpisodes(prevCompleted => {
      const newCompleted = [...prevCompleted, episode];
      localStorage.setItem('completedEpisodes', JSON.stringify(newCompleted));
      return newCompleted;
    });
  };

  const toggleFavorite = (show) => {
    setFavorites(prevFavorites => {
      const index = prevFavorites.findIndex(fav => fav.id === show.id);
      let newFavorites;
      if (index > -1) {
        newFavorites = prevFavorites.filter(fav => fav.id !== show.id);
      } else {
        newFavorites = [...prevFavorites, { ...show, dateAdded: new Date().toISOString() }];
      }
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (showId) => {
    return favorites.some(fav => fav.id === showId);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Theme appearance={theme}>
      <Router>
        <div className="app">
          <nav className={`navbar ${theme}`}>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shows">Shows</Link></li>
              <li><Link to="/favorites">Favorites</Link></li>
              <li><Link to="/completed">Completed Episodes</Link></li>
            </ul>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </nav>

          <Routes>
            <Route path="/" element={<Home playAudio={playAudio} />} />
            <Route 
              path="/shows" 
              element={
                <ShowList 
                  playAudio={playAudio} 
                  toggleFavorite={toggleFavorite} 
                  isFavorite={isFavorite}
                  completedEpisodes={completedEpisodes}
                />
              } 
            />
            <Route 
              path="/show/:id" 
              element={
                <ShowDetails 
                  playAudio={playAudio} 
                  toggleFavorite={toggleFavorite} 
                  isFavorite={isFavorite}
                  completedEpisodes={completedEpisodes}
                />
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <FavoritesManager 
                  playAudio={playAudio} 
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  completedEpisodes={completedEpisodes}
                />
              } 
            />
            <Route 
              path="/completed" 
              element={
                <CompletedEpisodes 
                  completedEpisodes={completedEpisodes}
                  playAudio={playAudio}
                />
              } 
            />
          </Routes>

          {currentlyPlaying && (
            <AudioPlayer 
              currentEpisode={currentlyPlaying}
              onClose={closeAudioPlayer}
              onPause={pauseAudio}
              onPlay={resumeAudio}
              onComplete={markEpisodeAsCompleted}
            />
          )}
        </div>
      </Router>
    </Theme>
  );
}

export default App;