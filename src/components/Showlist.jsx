import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@radix-ui/themes';
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons';

const API_URL = 'https://podcast-api.netlify.app';

function ShowList({ playAudio, toggleFavorite, isFavorite }) {
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }
      const data = await response.json();
      setShows(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (show, event) => {
    event.preventDefault(); // Prevent navigation to show details
    toggleFavorite(show);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="show-list-container">
      <h1>All Podcast Shows</h1>
      <div className="show-list">
        {shows.map(show => (
          <div key={show.id} className="show-card">
            <img src={show.image} alt={show.title} />
            <div className="show-card-content">
              <h2>{show.title}</h2>
              <p>Seasons: {show.seasons}</p>
              <p>Last updated: {new Date(show.updated).toLocaleDateString()}</p>
              <p>Genres: {show.genres.join(', ')}</p>
              <div className="show-card-actions">
                <Link to={`/show/${show.id}`} className="view-details-btn">View Details</Link>
                <Button onClick={() => playAudio(show.id, show.title)} className="play-button">Play</Button>
                <Button 
                  onClick={(e) => handleToggleFavorite(show, e)} 
                  className="favorite-button"
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