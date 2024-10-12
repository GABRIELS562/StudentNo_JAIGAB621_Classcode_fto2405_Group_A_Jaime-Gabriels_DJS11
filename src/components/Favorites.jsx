import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@radix-ui/themes';

function Favorites({ playAudio, favorites, toggleFavorite }) {
  const [sortedFavorites, setSortedFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState('recentlyUpdated');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [genres, setGenres] = useState(['All']);

  useEffect(() => {
    extractGenres();
    filterAndSortFavorites();
  }, [favorites, sortOrder, selectedGenre]);

  const extractGenres = () => {
    const allGenres = favorites.flatMap(show => show.genres);
    const uniqueGenres = ['All', ...new Set(allGenres)];
    setGenres(uniqueGenres);
  };

  const filterAndSortFavorites = () => {
    let filtered = favorites;
    if (selectedGenre !== 'All') {
      filtered = favorites.filter(show => show.genres.includes(parseInt(selectedGenre)));
    }

    switch (sortOrder) {
      case 'recentlyUpdated':
        filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case 'leastRecentlyUpdated':
        filtered.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      case 'titleAZ':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleZA':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    }
    setSortedFavorites(filtered);
  };

  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handlePlayAudio = (show) => {
    if (show.seasons && show.seasons.length > 0 && show.seasons[0].episodes && show.seasons[0].episodes.length > 0) {
      const episode = show.seasons[0].episodes[0];
      playAudio(show.id, episode.title, episode.file);
    } else {
      console.error('No episodes found for this show');
    }
  };

  return (
    <div className="favorites">
      <h1>Your Favorites</h1>
      <div className="filter-sort-controls">
        <div className="genre-filter">
          <label htmlFor="genre-select">Genre: </label>
          <select id="genre-select" value={selectedGenre} onChange={handleGenreChange}>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre === 'All' ? 'All Genres' : genre}</option>
            ))}
          </select>
        </div>
        <div className="sort-controls">
          <Button onClick={() => handleSortChange('recentlyUpdated')} variant={sortOrder === 'recentlyUpdated' ? 'solid' : 'outline'}>
            Most Recently Updated
          </Button>
          <Button onClick={() => handleSortChange('leastRecentlyUpdated')} variant={sortOrder === 'leastRecentlyUpdated' ? 'solid' : 'outline'}>
            Least Recently Updated
          </Button>
          <Button onClick={() => handleSortChange('titleAZ')} variant={sortOrder === 'titleAZ' ? 'solid' : 'outline'}>
            Title A-Z
          </Button>
          <Button onClick={() => handleSortChange('titleZA')} variant={sortOrder === 'titleZA' ? 'solid' : 'outline'}>
            Title Z-A
          </Button>
        </div>
      </div>
      <div className="favorites-list">
        {sortedFavorites.map(show => (
          <div key={show.id} className="favorite-item">
            <img src={show.image} alt={show.title} />
            <h3>{show.title}</h3>
            <p>Added on: {new Date(show.dateAdded).toLocaleDateString()}</p>
            <p>Last updated: {new Date(show.updated).toLocaleDateString()}</p>
            <p>Genres: {show.genres.join(', ')}</p>
            <Link to={`/show/${show.id}`} className="view-details-btn">View Details</Link>
            <Button onClick={() => handlePlayAudio(show)} className="play-button">Play</Button>
            <Button onClick={() => toggleFavorite(show)} className="remove-favorite-button">
              Remove from Favorites
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;