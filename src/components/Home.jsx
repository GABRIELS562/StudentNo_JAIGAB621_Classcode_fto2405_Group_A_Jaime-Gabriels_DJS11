import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Heading, Text, Card, Flex, Box } from '@radix-ui/themes';
import Slider from 'react-slick';
import { PlayIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_URL = 'https://podcast-api.netlify.app';

//duplicate but when i delete i get an error
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

function Home({ playAudio }) { //destructures playaudio function
  const [shows, setShows] = useState([]); //setter function initialised to empty array
  const [isLoading, setIsLoading] = useState(true); //is loadingn while loading 
  const [error, setError] = useState(null); //store error 

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
      setShows(data.slice(0, 10)); // Show top 10 podcasts in carousel 
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
  };/*
  Overall, this function does the following:

Fetches detailed information about a show from an API.
Checks if the show has any episodes.
If episodes exist, it plays the first episode of the first season.
If no episodes are found or if any errors occur during the process, it logs appropriate error messages.

This function is likely used when a user clicks on a show to start playing it, and it plays the first episode of the first season.
  */

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
      <Flex direction="column" align="center" justify="center" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Heading size="8" className="welcome-heading">Welcome to PodBlast</Heading>
        <Text size="4" align="center" mb="6" color="gray">Have a blast discovering and enjoying top podcasts</Text>
      </Flex>

      <Card className="carousel-container">
  <Slider {...settings}>
    {shows.map(show => (
      <Box key={show.id} className="carousel-item">
        <img 
          src={show.image} 
          alt={show.title} 
          className="carousel-image"
        />
        <Flex 
          direction="column" 
          className="carousel-item-content"
        >
          <Box>
            <Heading size="7" mb="3">{show.title}</Heading>
            <Text as="p" size="2" className="line-clamp" style={{ maxHeight: '4.5em', overflow: 'hidden' }}>
              {show.description ? (show.description.length > 150 ? show.description.substring(0, 150) + '...' : show.description) : 'No description available'}
            </Text>
          </Box>
          <Flex className="carousel-buttons" justify="center" gap="2">
            <Button 
              onClick={() => handlePlayAudio(show)} 
              size="2"
              className="carousel-button"style={{ 
                backgroundColor: '#64748b', 
                color: 'white',
                padding: '0 20px'
              }}
            >
              <PlayIcon /> Play Latest
            </Button>
            <Button 
              asChild 
              size="2"
              className="carousel-button" style={{ 
                backgroundColor: '#64748b', 
                color: 'white',
                padding: '0 20px'
              }}
            >
              <Link to={`/show/${show.id}`}>View Details</Link>
            </Button>
          </Flex>
        </Flex>
      </Box>
    ))}
  </Slider>
</Card>

      <Flex justify="center" mt="6">
        <Button asChild size="3" style={{ width: '30%', backgroundColor: '#64748b', color: 'white' }}>
          <Link to="/shows" className="view-all-link">
            View All Shows <ArrowRightIcon />
          </Link>
        </Button>
      </Flex>
    </Box>
  );
}

export default Home;