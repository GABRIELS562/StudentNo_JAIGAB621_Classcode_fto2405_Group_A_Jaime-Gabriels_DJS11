import React from 'react';
import { Link } from 'react-router-dom';

function Favorites({ playAudio, favorites, toggleFavorite }) {
  return (
    <div className="favorites">
      <h1>Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>You haven't added any favorites yet.</p>
      ) : (
        <div className="favorites-list">
          {favorites.map(show => (
            <div key={show.id} className="favorite-item">
              <img src={show.image} alt={show.title} />
              <div className="favorite-content">
                <h2>{show.title}</h2>
                <Link to={`/show/${show.id}`} className="view-details-btn">View Details</Link>
                <button onClick={() => playAudio(show.id, show.title)} className="play-button">Play</button>
                <button onClick={() => toggleFavorite(show)} className="favorite-button">
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;