import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@radix-ui/themes';

const API_URL = 'https://podcast-api.netlify.app';

function Favorites({ playAudio, favorites, toggleFavorite }) {
  const [sortedFavorites, setSortedFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState('dateAdded');

  useEffect(() => {
    sortFavorites();
  }, [favorites, sortOrder]);

  const sortFavorites = () => {
    let sorted = [...favorites];
    switch (sortOrder) {
      case 'titleAZ':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleZA':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'mostRecentlyUpdated':
        sorted.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case 'leastRecentlyUpdated':
        sorted.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      case 'dateAdded':
      default:
        sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
    }
    setSortedFavorites(sorted);
  };

  const handlePlayAudio = async (show) => {
    try {
      const response = await fetch(`${API_URL}/id/${show.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const showDetails = await response.json();
      
      if (showDetails.seasons && showDetails.seasons.length > 0 &&
          showDetails.seasons[0].episodes && showDetails.seasons[0].episodes.length > 0) {
        const episode = showDetails.seasons[0].episodes[0];
        playAudio(show.id, episode.title, episode.file);
      } else {
        console.error('No episodes found for this show');
      }
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  return (
    <div className="favorites">
      <h1>Your Favorites</h1>
      <div className="sort-controls">
        <Button onClick={() => setSortOrder('dateAdded')} variant={sortOrder === 'dateAdded' ? 'solid' : 'outline'}>
          Date Added
        </Button>
        <Button onClick={() => setSortOrder('mostRecentlyUpdated')} variant={sortOrder === 'mostRecentlyUpdated' ? 'solid' : 'outline'}>
          Most Recently Updated
        </Button>
        <Button onClick={() => setSortOrder('leastRecentlyUpdated')} variant={sortOrder === 'leastRecentlyUpdated' ? 'solid' : 'outline'}>
          Least Recently Updated
        </Button>
        <Button onClick={() => setSortOrder('titleAZ')} variant={sortOrder === 'titleAZ' ? 'solid' : 'outline'}>
          Title A-Z
        </Button>
        <Button onClick={() => setSortOrder('titleZA')} variant={sortOrder === 'titleZA' ? 'solid' : 'outline'}>
          Title Z-A
        </Button>
      </div>
      <div className="favorites-list">
        {sortedFavorites.map(show => (
          <div key={show.id} className="favorite-item">
            <img src={show.image} alt={show.title} />
            <h3>{show.title}</h3>
            <p>Added on: {new Date(show.dateAdded).toLocaleDateString()}</p>
            <p>Last updated: {new Date(show.updated).toLocaleDateString()}</p>
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