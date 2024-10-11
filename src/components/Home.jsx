import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_URL = 'https://podcast-api.netlify.app';

function Home({ playAudio }) {
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
      setShows(data.slice(0, 10)); // Only take the first 10 shows for the carousel
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home">
      <h1>Welcome to the Podcast App</h1>
      <div className="carousel-container">
        <Slider {...settings}>
          {shows.map(show => (
            <div key={show.id} className="carousel-item">
              <img src={show.image} alt={show.title} />
              <div className="carousel-item-content">
                <h3>{show.title}</h3>
                <p>{show.description ? (show.description.length > 100 ? show.description.substring(0, 100) + '...' : show.description) : 'No description available'}</p>
                <div className="carousel-buttons">
                  <Link to={`/show/${show.id}`} className="view-details-btn">View Details</Link>
                  <button onClick={() => playAudio(show.id, show.title)} className="play-button">Play</button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <Link to="/shows" className="view-all-link">View All Shows</Link>
    </div>
  );
}

export default Home;