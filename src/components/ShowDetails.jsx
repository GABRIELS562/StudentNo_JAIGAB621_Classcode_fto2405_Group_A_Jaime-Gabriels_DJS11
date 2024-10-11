import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = 'https://podcast-api.netlify.app/id/';

function ShowDetails({ playAudio, toggleFavorite, isFavorite }) {
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchShowDetails();
  }, [id]);

  const fetchShowDetails = async () => {
    try {
      const response = await fetch(`${API_URL}${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const data = await response.json();
      setShow(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (show) {
      toggleFavorite({
        id: show.id,
        title: show.title,
        image: show.image,
        seasons: show.seasons.length,
        updated: show.updated,
        genres: show.genres
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!show) return <div>Show not found</div>;

  return (
    <div className="show-details">
      <h1>{show.title}</h1>
      <img src={show.image} alt={show.title} className="show-image" />
      <button 
        onClick={handleToggleFavorite} 
        className={`favorite-button ${isFavorite(show.id) ? 'is-favorite' : ''}`}
      >
        {isFavorite(show.id) ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
      <p>{show.description}</p>
      
      {/* ... rest of the component remains the same ... */}
    </div>
  );
}

export default ShowDetails;