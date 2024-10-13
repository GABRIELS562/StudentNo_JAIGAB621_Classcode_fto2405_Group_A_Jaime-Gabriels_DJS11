import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Heading, Text, Card, Flex, Box } from '@radix-ui/themes';
import Slider from 'react-slick';
import { PlayIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_URL = 'https://podcast-api.netlify.app';

function CustomPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      style={{
        ...style,
        display: "block",
        left: "10px",
        zIndex: 1
      }}
      onClick={onClick}
    >
      <ChevronLeftIcon color="white" width="24" height="24" />
    </Box>
  );
}

function CustomNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      style={{
        ...style,
        display: "block",
        right: "10px"
      }}
      onClick={onClick}
    >
      <ChevronRightIcon color="white" width="24" height="24" />
    </Box>
  );
}

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
      setShows(data.slice(0, 10)); // Show top 10 podcasts
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
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
        playAudio(show.id, 1, episode.episode);
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
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  if (isLoading) return <Box className="loading">Loading...</Box>;
  if (error) return <Box className="error">Error: {error}</Box>;

  return (
    <Box className="home">
      <Heading size="8" className="welcome-heading">Welcome to PodBlast</Heading>
      <Text size="4" align="center" mb="6">Discover and enjoy top podcasts</Text>
      <Card className="carousel-container">
        <Slider {...settings}>
          {shows.map(show => (
            <Box key={show.id} className="carousel-item">
              <img src={show.image} alt={show.title} className="carousel-image" />
              <Box className="carousel-item-content">
                <Heading size="6">{show.title}</Heading>
                <Text as="p" size="2" className="line-clamp">
                  {show.description ? (show.description.length > 100 ? show.description.substring(0, 100) + '...' : show.description) : 'No description available'}
                </Text>
                <Flex className="carousel-buttons" gap="10" mt="4" size="1" align="left">
                  <Button onClick={() => handlePlayAudio(show)} className="carousel-button">
                    <PlayIcon /> Play Latest
                  </Button>
                  <Link to={`/show/${show.id}`} className="carousel-button">
                    <Button variant="solid" align="right" size="10">
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