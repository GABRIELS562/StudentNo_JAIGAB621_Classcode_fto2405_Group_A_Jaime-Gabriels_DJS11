import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Heading, Text, Card, Flex, Box } from '@radix-ui/themes';
import Slider from 'react-slick';
import { PlayIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_URL = 'https://podcast-api.netlify.app';


function Home({ playAudio, searchQuery }) {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    filterShows();
  }, [shows, searchQuery]);

  const fetchShows = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }
      const data = await response.json();
      setShows(data);
      setFilteredShows(data.slice(0, 10)); // Initially show top 10 shows
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const filterShows = () => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = shows.filter(show =>
        show.title.toLowerCase().includes(lowercaseQuery) ||
        show.description.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredShows(filtered.slice(0, 10)); // Show top 10 filtered results
    } else {
      setFilteredShows(shows.slice(0, 10)); // Show top 10 when no search query
    }
  };

  const handlePlayAudio = async (show) => {
    try {
      const response = await fetch(`${API_URL}/id/${show.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const showDetails = await response.json();
      
      if (showDetails.seasons && showDetails.seasons.length > 0 &&
          showDetails.seasons[0].episodes && showDetails.seasons[0].episodes.length > 0) {
        const episode = showDetails.seasons[0].episodes[0];
        playAudio(show.id, episode.title, episode.file);
      } else {
        console.error('No episodes found for this show');
      }
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
  };

  if (isLoading) return <Box className="loading">Loading...</Box>;
  if (error) return <Box className="error">Error: {error}</Box>;

  return (
    <Box className="home">
      <Heading size="8" className="welcome-heading">Welcome to PodBlast</Heading>
      <Card className="carousel-container">
        <Slider {...settings}>
          {filteredShows.map(show => (
            <Box key={show.id} className="carousel-item">
              <img src={show.image} alt={show.title} className="carousel-image" />
              <Box className="carousel-item-content">
                <Heading size="6">{show.title}</Heading>
                <Text as="p" size="2" className="line-clamp">
                  {show.description ? (show.description.length > 100 ? show.description.substring(0, 100) + '...' : show.description) : 'No description available'}
                </Text>
                <Flex className="carousel-buttons" gap="3" mt="4">
                  <Button onClick={() => handlePlayAudio(show)} className="carousel-button">
                    <PlayIcon /> Play Latest
                  </Button>
                  <Link to={`/show/${show.id}`} className="carousel-button">
                    <Button variant="outline">
                      View Details
                    </Button>
                  </Link>
                </Flex>
              </Box>
            </Box>
          ))}
        </Slider>
      </Card>
      <Flex justify="center" mt="6">
        <Link to="/shows" className="view-all-link">
          <Button size="3">
            View All Shows <ArrowRightIcon />
          </Button>
        </Link>
      </Flex>
    </Box>
  );
}

export default Home;