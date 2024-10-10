import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'https://podcast-api.netlify.app';

function ShowList({ playAudio }) {
  const [shows, setShows] = useState([]);
  const [sortedShows, setSortedShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [favorites, setFavorites] = useState([]);

  // ... (keep existing useEffect, fetchShows, loadFavorites, sortShows, handleSortChange, toggleFavorite, and isFavorite functions)

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="show-list-container">
      <h1>All Shows</h1>
      {/* ... (keep existing sort controls) */}
      <div className="show-list">
        {sortedShows.map(show => (
          <div key={show.id} className="show-card">
            <img src={show.image} alt={show.title} />
            <div className="show-card-content">
              <h2>{show.title}</h2>
              <p>Seasons: {show.seasons}</p>
              <p>Last updated: {new Date(show.updated).toLocaleDateString()}</p>
              <p>Genres: {show.genres.join(', ')}</p>
              <Link to={`/show/${show.id}`}>View Details</Link>
              <button 
                onClick={() => toggleFavorite(show)}
                className={`favorite-button ${isFavorite(show.id) ? 'is-favorite' : ''}`}
              >
                {isFavorite(show.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              <button onClick={() => playAudio(show.id, show.title)} className="play-button">
                Play
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowList;