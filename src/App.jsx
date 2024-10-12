import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import Home from './components/Home';
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import Favorites from './components/Favorites';
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

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const storedCompletedEpisodes = JSON.parse(localStorage.getItem('completedEpisodes') || '[]');
    const storedTheme = localStorage.getItem('theme') || 'light';
    
    setFavorites(storedFavorites);
    setCompletedEpisodes(storedCompletedEpisodes);
    setTheme(storedTheme);
  }, []);

  const playAudio = (showId, episodeTitle, episodeFile) => {
    setCurrentlyPlaying({
      id: `${showId}-${episodeTitle}`,
      title: episodeTitle,
      show: showId,
      file: episodeFile
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

  const markEpisodeAsCompleted = (episode) => {
    setCompletedEpisodes(prevCompleted => {
      const newCompleted = [...prevCompleted, episode];
      localStorage.setItem('completedEpisodes', JSON.stringify(newCompleted));
      return newCompleted;
    });
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

          <main className="content">
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
          </main>

          {currentlyPlaying && (
            <div className="fixed-audio-player">
              <AudioPlayer 
                currentEpisode={currentlyPlaying}
                onComplete={() => markEpisodeAsCompleted(currentlyPlaying)}
              />
            </div>
          )}
        </div>
      </Router>
    </Theme>
  );
}

export default App;