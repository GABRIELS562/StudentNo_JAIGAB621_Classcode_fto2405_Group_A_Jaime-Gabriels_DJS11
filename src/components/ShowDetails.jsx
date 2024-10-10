import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = 'https://podcast-api.netlify.app/id/';

function ShowDetails({ playAudio }) {
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchShowDetails = useCallback(async () => {
    try {
      console.log('Fetching show details for ID:', id);
      const response = await fetch(`${API_URL}${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched show details:', data);
      setShow(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching show details:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchShowDetails();
  }, [fetchShowDetails]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!show) return <div>Show not found</div>;

  return (
    <div className="show-details">
      <h1>{show.title}</h1>
      <img src={show.image} alt={show.title} />
      <p>{show.description}</p>
      <h2>Seasons</h2>
      {show.seasons.map((season) => (
        <div key={season.season} className="season">
          <h3>Season {season.season}</h3>
          <ul>
            {season.episodes.map((episode) => (
              <li key={episode.episode}>
                Episode {episode.episode}: {episode.title}
                <button onClick={() => playAudio(show.id, episode.title)}>Play</button>
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