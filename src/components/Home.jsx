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
  <Flex direction="column" align="center" justify="center" style={{ textAlign: 'center', marginBottom: '24px' }}>
    <Heading size="8" className="welcome-heading">Welcome to PodBlast</Heading>
    <Text size="4" align="center" mb="6" color="gray">Have a blast discovering and enjoying top podcasts</Text>
  </Flex>

  {/* Adjusted carousel size */}
  <Card className="carousel-container" style={{ height: '500px', width: '90%', margin: '0 auto', paddingBottom: '40px' }}>
    <Slider {...settings}>
      {shows.map(show => (
        <Box key={show.id} className="carousel-item" style={{ height: '100%', width: '90%', margin: '0 auto' }}>
        {/* Updated image styling */}
        <img 
          src={show.image} 
          alt={show.title} 
          className="carousel-image" 
          style={{ 
            width: '100%',         /* Ensure the image fills the width */
            height: '100%',        /* Ensure the image fills the height */
            objectFit: 'cover',    /* Make sure the image covers the entire area */
            objectPosition: 'center', /* Center the image in case of cropping */
          }} 
        />
        <Flex direction="column" className="carousel-item-content" style={{ height: '100%', padding: '10px' }}>
          <Heading size="7" mb="5">{show.title}</Heading>
          <Text as="p" size="4" className="line-clamp" style={{ flexGrow: 1, color: 'white' }}>
            {show.description ? (show.description.length > 100 ? show.description.substring(0, 100) + '...' : show.description) : 'No description available'}
          </Text>

            {/* Buttons with adjusted widths */}
            <Flex className="carousel-buttons" justify="between" mt="4">
              {/* Play Latest Button with 70% width */}
              <Button 
                onClick={() => handlePlayAudio(show)} 
                className="carousel-button" 
                size="2"
                variant="soft"
                radius="large"
                style={{ width: '5%', marginRight: '8px', backgroundColor: '#64748b', color: 'white' }}
              >
                <PlayIcon /> Play Latest
              </Button>

              {/* View Details Button with 30% width */}
              <Button 
                asChild 
                className="carousel-button" 
                size="2"
                variant="soft"
                radius="large"
                style={{ width: '5%', backgroundColor: '#64748b', color: 'white' }}
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
    <Button asChild size="3"
       style={{ width: '30%', backgroundColor: '#64748b', color: 'white' }}>
      <Link to="/shows" className="view-all-link">
        View All Shows <ArrowRightIcon />
      </Link>
    </Button>
  </Flex>
</Box>
    );
  }
  


export default Home;