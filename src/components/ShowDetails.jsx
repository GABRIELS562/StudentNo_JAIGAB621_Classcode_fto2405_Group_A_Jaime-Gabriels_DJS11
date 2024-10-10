import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import AudioPlayer from './AudioPlayer';

const API_URL = 'https://podcast-api.netlify.app/id/';

function ShowDetails() {
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const { id } = useParams();

  // ... (keep existing fetchShowDetails, useEffect, checkIfFavorite, and toggleFavorite functions)

  const handleEpisodeSelect = (episode) => {
    setSelectedEpisode(episode);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!show) return <div>Show not found</div>;

  return (
    <div className="show-details">
      <h1>{show.title}</h1>
      <img src={show.image} alt={show.title} />
      <button onClick={toggleFavorite} className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}>
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
      <p>{show.description}</p>
      <h2>Seasons</h2>
      {show.seasons.map((season) => (
        <div key={season.season} className="season">
          <h3>Season {season.season}</h3>
          <ul>
            {season.episodes.map((episode) => (
              <li key={episode.episode}>
                Episode {episode.episode}: {episode.title}
                <button onClick={() => handleEpisodeSelect(episode)}>Play</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {selectedEpisode && (
        <div className="selected-episode">
          <h3>Now Playing: {selectedEpisode.title}</h3>
          <AudioPlayer episode={selectedEpisode} />
        </div>
      )}
      <Link to="/shows" className="back-link">Back to Shows</Link>
    </div>
  );
}

export default ShowDetails;