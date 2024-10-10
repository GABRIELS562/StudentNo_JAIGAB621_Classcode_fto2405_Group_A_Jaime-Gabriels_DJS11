import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = 'https://podcast-api.netlify.app/genre/id';

function ShowDetails() {
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
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link to="/shows">Back to Shows</Link>
    </div>
  );
}

export default ShowDetails;