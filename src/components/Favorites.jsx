import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

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
                <Link to={`/show/${show.id}`}>View Details</Link>
                <button onClick={() => removeFavorite(show.id)}>Remove from Favorites</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;