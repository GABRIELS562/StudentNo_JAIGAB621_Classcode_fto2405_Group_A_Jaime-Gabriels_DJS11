import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
 

const API_BASE_URL = 'https://podcast-api.netlify.app';

const genreMap = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family"
};

function App() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [listeningHistory, setListeningHistory] = useState([]);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [playbackPositions, setPlaybackPositions] = useState({});

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const storedListeningHistory = JSON.parse(localStorage.getItem('listeningHistory') || '[]');
    const storedTheme = localStorage.getItem('theme') || 'light';
    const storedPlaybackPositions = JSON.parse(localStorage.getItem('playbackPositions') || '{}');
    
    setFavorites(storedFavorites);
    setListeningHistory(storedListeningHistory);
    setTheme(storedTheme);
    setPlaybackPositions(storedPlaybackPositions);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (currentlyPlaying) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentlyPlaying]);

  const getGenreTitle = (genreId) => genreMap[genreId] || "Unknown Genre";

  const playAudio = async (showId, seasonNumber, episodeNumber) => {
    try {
      console.log(`Playing audio: Show ${showId}, Season ${seasonNumber}, Episode ${episodeNumber}`);
      const response = await fetch(`${API_BASE_URL}/id/${showId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const showData = await response.json();
      const season = showData.seasons.find(s => s.season === parseInt(seasonNumber));
      if (!season) {
        throw new Error('Season not found');
      }
      const episode = season.episodes.find(e => e.episode === parseInt(episodeNumber));
      if (!episode) {
        throw new Error('Episode not found');
      }
      
      const episodeId = `${showId}-S${seasonNumber}E${episodeNumber}`;
      const newEpisode = {
        id: episodeId,
        showId,
        showTitle: showData.title,
        seasonNumber,
        episodeNumber,
        title: episode.title,
        file: episode.file,
        image: showData.image,
        currentTime: playbackPositions[episodeId] || 0,
        completed: false,
        startDate: new Date().toISOString()
      };

      setCurrentlyPlaying(newEpisode);
      updateListeningHistory(newEpisode);
      console.log("Now playing:", episodeId);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const updateListeningHistory = (episode) => {
    setListeningHistory(prevHistory => {
      const index = prevHistory.findIndex(e => e.id === episode.id);
      let newHistory;
      if (index > -1) {
        newHistory = [
          { ...prevHistory[index], ...episode },
          ...prevHistory.slice(0, index),
          ...prevHistory.slice(index + 1)
        ];
      } else {
        newHistory = [episode, ...prevHistory];
      }
      localStorage.setItem('listeningHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const updatePlaybackPosition = (episodeId, currentTime) => {
    setPlaybackPositions(prev => {
      const updated = { ...prev, [episodeId]: currentTime };
      localStorage.setItem('playbackPositions', JSON.stringify(updated));
      return updated;
    });

    setListeningHistory(prevHistory => {
      const newHistory = prevHistory.map(episode => 
        episode.id === episodeId ? { ...episode, currentTime } : episode
      );
      localStorage.setItem('listeningHistory', JSON.stringify(newHistory));
      return newHistory;
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
            genres: show ? show.genres.map(getGenreTitle) : item.genres,
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
            genres: item.genres.map(getGenreTitle),
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
    const completedEpisode = { ...episode, completed: true, completedDate: new Date().toISOString() };
    updateListeningHistory(completedEpisode);
  };

  const resetListeningHistory = () => {
    setListeningHistory([]);
    setPlaybackPositions({});
    localStorage.removeItem('listeningHistory');
    localStorage.removeItem('playbackPositions');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Theme appearance={theme}>
      <Router>
        <div className={`app ${theme}`}>
          <nav className={`navbar ${theme}`}>
            <div className="navbar-content">
              <div className="navbar-center">
                <Link to="/">Home</Link>
                <Link to="/shows">Shows</Link>
                <Link to="/favorites">Favorites</Link>
                <Link to="/completed">Listening History</Link>
              </div>
              <div className="navbar-right">
                <SearchBar onSearch={handleSearch} />
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </div>
            </div>
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
                    searchQuery={searchQuery}
                    playbackPositions={playbackPositions}
                    getGenreTitle={getGenreTitle}
                    genreMap={genreMap}
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
                    getGenreTitle={getGenreTitle}
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
                    playbackPositions={playbackPositions}
                    getGenreTitle={getGenreTitle}
                    genreMap={genreMap}
                  />
                } 
              />
              <Route 
                path="/completed" 
                element={
                  <CompletedEpisodes 
                    listeningHistory={listeningHistory}
                    playAudio={playAudio}
                    resetListeningHistory={resetListeningHistory}
                    searchQuery={searchQuery}
                    playbackPositions={playbackPositions}
                    getGenreTitle={getGenreTitle}
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