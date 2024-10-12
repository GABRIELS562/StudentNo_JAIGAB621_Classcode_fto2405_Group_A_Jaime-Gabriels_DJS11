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
import SearchBar from './components/SearchBar';
import '@radix-ui/themes/styles.css';
import './App.css';

function App() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [completedEpisodes, setCompletedEpisodes] = useState([]);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [playbackPositions, setPlaybackPositions] = useState({});

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const storedCompletedEpisodes = JSON.parse(localStorage.getItem('completedEpisodes') || '[]');
    const storedTheme = localStorage.getItem('theme') || 'light';
    const storedPlaybackPositions = JSON.parse(localStorage.getItem('playbackPositions') || '{}');
    
    setFavorites(storedFavorites);
    setCompletedEpisodes(storedCompletedEpisodes);
    setTheme(storedTheme);
    setPlaybackPositions(storedPlaybackPositions);
  }, []);

  const playAudio = (showId, episodeTitle, episodeFile) => {
    const episodeId = `${showId}-${episodeTitle}`;
    setCurrentlyPlaying({
      id: episodeId,
      title: episodeTitle,
      show: showId,
      file: episodeFile,
      currentTime: playbackPositions[episodeId] || 0
    });
  };

  const updatePlaybackPosition = (episodeId, currentTime) => {
    setPlaybackPositions(prev => {
      const updated = { ...prev, [episodeId]: currentTime };
      localStorage.setItem('playbackPositions', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (item, show = null) => {
    setFavorites(prevFavorites => {
      let newFavorites;
      if (item.episode || (show && item.title)) {
        // It's an episode
        const favId = show ? `${show.id}-${item.title}` : item.id;
        const index = prevFavorites.findIndex(fav => fav.id === favId);
        if (index > -1) {
          newFavorites = prevFavorites.filter(fav => fav.id !== favId);
        } else {
          newFavorites = [...prevFavorites, { 
            id: favId,
            showId: show ? show.id : item.showId,
            showTitle: show ? show.title : item.showTitle,
            title: item.title,
            season: item.season,
            episode: item.episode,
            file: item.file,
            image: show ? show.image : item.image,
            dateAdded: new Date().toISOString(),
            updated: show ? show.updated : item.updated
          }];
        }
      } else {
        // It's a show
        const index = prevFavorites.findIndex(fav => fav.id === item.id);
        if (index > -1) {
          newFavorites = prevFavorites.filter(fav => fav.id !== item.id);
        } else {
          newFavorites = [...prevFavorites, { 
            id: item.id,
            showId: item.id,
            showTitle: item.title,
            image: item.image,
            dateAdded: new Date().toISOString(),
            updated: item.updated
          }];
        }
      }
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (showId, episodeTitle) => {
    if (episodeTitle) {
      return favorites.some(fav => fav.id === `${showId}-${episodeTitle}`);
    }
    return favorites.some(fav => fav.showId === showId);
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

  const resetListeningHistory = () => {
    setCompletedEpisodes([]);
    localStorage.removeItem('completedEpisodes');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
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
            <SearchBar onSearch={handleSearch} searchQuery={searchQuery} />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </nav>

          <main className="content">
            <Routes>
              <Route path="/" element={<Home playAudio={playAudio} searchQuery={searchQuery} playbackPositions={playbackPositions} />} />
              <Route 
                path="/shows" 
                element={
                  <ShowList 
                    playAudio={playAudio} 
                    toggleFavorite={toggleFavorite} 
                    isFavorite={isFavorite}
                    searchQuery={searchQuery}
                    playbackPositions={playbackPositions}
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
                    playbackPositions={playbackPositions}
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
                    searchQuery={searchQuery}
                    onSearch={handleSearch}
                    playbackPositions={playbackPositions}
                  />
                } 
              />
              <Route 
                path="/completed" 
                element={
                  <CompletedEpisodes 
                    completedEpisodes={completedEpisodes}
                    playAudio={playAudio}
                    resetListeningHistory={resetListeningHistory}
                    searchQuery={searchQuery}
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
                updatePlaybackPosition={updatePlaybackPosition}
              />
            </div>
          )}
        </div>
      </Router>
    </Theme>
  );
}

export default App;