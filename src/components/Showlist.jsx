import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'https://podcast-api.netlify.app';

function ShowList() {
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="show-list">
      <h1>All Shows</h1>
      {shows.map(show => (
        <div key={show.id} className="show-card">
          <img src={show.image} alt={show.title} />
          <h2>{show.title}</h2>
          <p>Seasons: {show.seasons}</p>
          <p>Last updated: {new Date(show.updated).toLocaleDateString()}</p>
          <p>Genres: {show.genres.join(', ')}</p>
          <Link to={`/show/${show.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

export default ShowList;