import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  return (
    <div className="favorites">
      <h1>Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>You haven&apos;t added any favorites yet.</p>
      ) : (
        <ul>
          {favorites.map(fav => (
            <li key={`${fav.showId}-${fav.seasonId}-${fav.episodeId}`}>
              <Link to={`/show/${fav.showId}`}>
                {fav.showTitle} - Season {fav.seasonId}, Episode {fav.episodeId}: {fav.episodeTitle}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;