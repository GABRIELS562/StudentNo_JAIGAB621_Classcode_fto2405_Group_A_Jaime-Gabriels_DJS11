import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import Home from './components/Home';
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import Favorites from './components/Favorites';
import ThemeToggle from './components/ThemeToggle';
import '@radix-ui/themes/styles.css';
import './App.css';

const DEMO_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

function App() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
  }, []);

  const playAudio = (showId, showTitle) => {
    if (currentlyPlaying && currentlyPlaying.id === showId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying({ id: showId, title: showTitle });
    }
  };

  const toggleFavorite = (show) => {
    setFavorites(prevFavorites => {
      const index = prevFavorites.findIndex(fav => fav.id === show.id);
      let newFavorites;
      if (index > -1) {
        newFavorites = prevFavorites.filter(fav => fav.id !== show.id);
      } else {
        newFavorites = [...prevFavorites, show];
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
                />
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <Favorites 
                  playAudio={playAudio} 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                />
              } 
            />
          </Routes>

          {currentlyPlaying && (
            <div className="audio-player">
              <p>Now Playing: {currentlyPlaying.title}</p>
              <audio src={DEMO_AUDIO_URL} autoPlay controls />
            </div>
          )}
        </div>
      </Router>
    </Theme>
  );
}

export default App;