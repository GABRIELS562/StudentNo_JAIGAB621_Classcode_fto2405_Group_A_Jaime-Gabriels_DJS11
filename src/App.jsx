import React, { useState, useEffect } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Avatar from '@radix-ui/react-avatar';
import * as Separator from '@radix-ui/react-separator';
import { 
  PlayCircle, 
  Heart,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import './App.css';

function App() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        const data = await response.json();
        setShows(data);
      } catch (error) {
        console.error('Error fetching shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
    loadFavoritesFromLocalStorage();
  }, []);

  const loadFavoritesFromLocalStorage = () => {
    const savedFavorites = localStorage.getItem('podcastFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const saveFavoritesToLocalStorage = (newFavorites) => {
    localStorage.setItem('podcastFavorites', JSON.stringify(newFavorites));
  };

  const toggleFavorite = (episode) => {
    const newFavorites = [...favorites];
    const existingIndex = favorites.findIndex(f => f.episodeId === episode.id);
    
    if (existingIndex >= 0) {
      newFavorites.splice(existingIndex, 1);
    } else {
      newFavorites.push({
        episodeId: episode.id,
        showId: episode.showId,
        seasonId: episode.seasonId,
        dateAdded: new Date().toISOString()
      });
    }
    
    setFavorites(newFavorites);
    saveFavoritesToLocalStorage(newFavorites);
  };

  const sortShows = (direction) => {
    const sortedShows = [...shows].sort((a, b) => {
      return direction === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
    setShows(sortedShows);
  };

  return (
    <div className="app-container">
      <NavigationMenu.Root className="navbar">
        <NavigationMenu.List className="navbar-content">
          <NavigationMenu.Item>
            <h1 className="app-title">Podcast App</h1>
          </NavigationMenu.Item>
          <div className="navbar-buttons">
            <button className="button-outline" onClick={() => sortShows('asc')}>
              <ArrowUpDown className="button-icon" />
              Sort A-Z
            </button>
            <button className="button-outline" onClick={() => loadFavoritesFromLocalStorage()}>
              <Heart className="button-icon" />
              Favorites
            </button>
          </div>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      {currentlyPlaying && (
        <div className="audio-player">
          <div className="audio-player-content">
            <div className="audio-player-info">
              <PlayCircle className="audio-player-icon" />
              <div>
                <p className="audio-player-title">{currentlyPlaying.title}</p>
                <p className="audio-player-subtitle">Now Playing</p>
              </div>
            </div>
            <div className="audio-progress">
              {/* Audio progress bar will be implemented later */}
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <RefreshCw className="loading-icon" />
          </div>
        ) : (
          <div className="shows-grid">
            {shows.map(show => (
              <div className="show-card" key={show.id}>
                <div className="show-card-header">
                  <Avatar.Root className="show-image-container">
                    <Avatar.Image
                      src={show.image || "/api/placeholder/400/320"}
                      alt={show.title}
                      className="show-image"
                    />
                    <Avatar.Fallback delayMs={600}>
                      {show.title.substring(0, 2)}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <h2 className="show-title">{show.title}</h2>
                </div>
                <div className="show-card-content">
                  <div className="show-metadata">
                    <span>{show.seasons} Seasons</span>
                    <Separator.Root 
                      className="separator" 
                      decorative 
                      orientation="vertical" 
                    />
                    <span>Updated: {new Date(show.updated).toLocaleDateString()}</span>
                  </div>
                  <div className="genre-tags">
                    {show.genres.map(genre => (
                      <span key={genre} className="genre-tag">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;