import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@radix-ui/themes';
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons';

const API_URL = 'https://podcast-api.netlify.app/shows';

function ShowList({ playAudio, toggleFavorite, isFavorite }) {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('recentlyUpdated');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [genres, setGenres] = useState(['All']);

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    filterAndSortShows();
  }, [shows, sortOrder, selectedGenre]);

  const fetchShows = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }
      const data = await response.json();
      setShows(data);
      extractGenres(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const extractGenres = (showsData) => {
    const allGenres = showsData.flatMap(show => show.genres);
    const uniqueGenres = ['All', ...new Set(allGenres)];
    setGenres(uniqueGenres);
  };

  const filterAndSortShows = () => {
    let filtered = shows;
    if (selectedGenre !== 'All') {
      filtered = shows.filter(show => show.genres.includes(parseInt(selectedGenre)));
    }

    switch (sortOrder) {
      case 'titleAZ':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleZA':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'recentlyUpdated':
        filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case 'leastRecentlyUpdated':
        filtered.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      default:
        filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    }
    setFilteredShows(filtered);
  };

  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handlePlayAudio = async (show) => {
    try {
      const response = await fetch(`https://podcast-api.netlify.app/id/${show.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const showDetails = await response.json();
      console.log("Fetched show details:", showDetails);

      if (showDetails.seasons && showDetails.seasons.length > 0 &&
          showDetails.seasons[0].episodes && showDetails.seasons[0].episodes.length > 0) {
        const episode = showDetails.seasons[0].episodes[0];
        console.log("Playing episode:", episode);
        playAudio(show.id, episode.title, episode.file);
      } else {
        console.error('No episodes found for this show');
      }
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="show-list-container">
      <h1>All Podcast Shows</h1>
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
      <div className="show-list">
        {filteredShows.map(show => (
          <div key={show.id} className="show-card">
            <img src={show.image} alt={show.title} />
            <div className="show-card-content">
              <h2>{show.title}</h2>
              <p>Seasons: {show.seasons}</p>
              <p>Last updated: {new Date(show.updated).toLocaleDateString()}</p>
              <p>Genres: {show.genres.join(', ')}</p>
              <div className="show-card-actions">
                <Link to={`/show/${show.id}`} className="view-details-btn">View Details</Link>
                <Button onClick={() => handlePlayAudio(show)} className="play-button">Play</Button>
                <Button 
                  onClick={() => toggleFavorite(show)} 
                  className={`favorite-button ${isFavorite(show.id) ? 'is-favorite' : ''}`}
                  variant="ghost"
                >
                  {isFavorite(show.id) ? <StarFilledIcon /> : <StarIcon />}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowList;