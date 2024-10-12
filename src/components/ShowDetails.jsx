import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@radix-ui/themes';
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons';

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

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!show) return <div className="not-found">Show not found</div>;

  return (
    <div className="show-details">
      <h1>{show.title}</h1>
      <img src={show.image} alt={show.title} className="show-image" />
      <p>{show.description}</p>
      <Button 
        onClick={() => toggleFavorite(show)}
        className={`favorite-button ${isFavorite(show.id) ? 'is-favorite' : ''}`}
      >
        {isFavorite(show.id) ? <StarFilledIcon /> : <StarIcon />}
        {isFavorite(show.id) ? 'Remove from Favorites' : 'Add to Favorites'}
      </Button>
      
      <h2>Seasons</h2>
      {show.seasons.map((season) => (
        <div key={season.season} className="season">
          <h3>Season {season.season}</h3>
          <ul className="episode-list">
            {season.episodes.map((episode) => (
              <li key={episode.episode} className="episode-item">
                <h4>Episode {episode.episode}: {episode.title}</h4>
                <p>{episode.description}</p>
                <Button onClick={() => playAudio(show.id, episode.title, episode.file)}>
  Play
</Button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <Link to="/shows" className="back-link">Back to Shows</Link>
    </div>
  );
}

export default ShowDetails;