import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Flex, Box, Text, Select } from '@radix-ui/themes';
import { StarFilledIcon, StarIcon, PlayIcon } from '@radix-ui/react-icons';

const API_BASE_URL = 'https://podcast-api.netlify.app';
const SHOWS_URL = `${API_BASE_URL}/shows`;

function ShowList({ playAudio, toggleFavorite, isFavorite, searchQuery, playbackPositions, getGenreTitle, genreMap }) {//all props
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('recentlyUpdated');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [showDetails, setShowDetails] = useState({});

  useEffect(() => {// run when component mounts
    fetchShows();
  }, []);

  useEffect(() => {
    filterAndSortShows();
  }, [shows, sortOrder, selectedGenre, searchQuery]);//runs when user clicks

  useEffect(() => {
    fetchShowDetails();
  }, [filteredShows]);// details ofv filtered shoews

  const fetchShows = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(SHOWS_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }
      const data = await response.json();
      setShows(data);//all show data displayed
      setFilteredShows(data);//sets it to be all the same 
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };//not displayed alphabetically but would be taking away order button

  const fetchShowDetails = async () => {//fethes more detailed information
    const details = {};
    for (const show of filteredShows) {
      try {
        const response = await fetch(`${API_BASE_URL}/id/${show.id}`);
        if (response.ok) {
          const data = await response.json();
          const totalEpisodes = data.seasons.reduce((sum, season) => sum + season.episodes.length, 0);//episode counting  function enhances the ShowList component by providing additional information (total episode count) for each show in the filtered list. 
          details[show.id] = { totalEpisodes };
        }
      } catch (error) {
        console.error(`Error fetching details for show ${show.id}:`, error);
      }
    }
    setShowDetails(details);
  };

  const filterAndSortShows = () => {
    let filtered = shows;
    
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(show => 
        show.title.toLowerCase().includes(lowercaseQuery) ||
        show.description.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(show => show.genres.includes(parseInt(selectedGenre)));
    }

    switch (sortOrder) {
      case 'titleAZ':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleZA':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'recentlyUpdated':
        filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case 'leastRecentlyUpdated':
        filtered.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      default:
        filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    }
    setFilteredShows(filtered);
  };//localeCompare() compares two strings in alphabetical orderReturns negative if a comes before b, positive if b comes before a
  //Swapping a and b reverses the order
  

  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);//update sort state
  };

  const handleGenreChange = (value) => {
    setSelectedGenre(value);//update genre state
  };

  const handlePlayAudio = async (show) => {
    try {
      const response = await fetch(`${API_BASE_URL}/id/${show.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const showDetails = await response.json();
      
      if (showDetails.seasons && showDetails.seasons.length > 0 &&//check if seasons and episodes
          showDetails.seasons[0].episodes && showDetails.seasons[0].episodes.length > 0) {
        const firstEpisode = showDetails.seasons[0].episodes[0];//gets first episode
        playAudio(show.id, 1, firstEpisode.episode);//plays first episode
      } else {
        console.error('No episodes found for this show');
      }
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;//if clicked it will load


  return (
    <Box className="show-list-container">
      <Text size="8" weight="bold" mb="4">All Podcast Shows</Text>
      <Flex direction="column" gap="4" mb="4">
        <Flex gap="2" wrap="wrap">
          <Select.Root value={selectedGenre} onValueChange={handleGenreChange}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="All">All Genres</Select.Item>
              {Object.entries(genreMap).map(([id, title]) => (
                <Select.Item key={id} value={id}>{title}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        <Flex gap="2" wrap="wrap">
          <Button style={{ backgroundColor: '#64748b', color: 'white' }} onClick={() => handleSortChange('recentlyUpdated')} variant={sortOrder === 'recentlyUpdated' ? 'solid' : 'outline'}>
            Most Recently Updated
          </Button>
          <Button style={{ backgroundColor: '#64748b', color: 'white' }} onClick={() => handleSortChange('leastRecentlyUpdated')} variant={sortOrder === 'leastRecentlyUpdated' ? 'solid' : 'outline'}>
            Least Recently Updated
          </Button>
          <Button style={{ backgroundColor: '#64748b', color: 'white' }} onClick={() => handleSortChange('titleAZ')} variant={sortOrder === 'titleAZ' ? 'solid' : 'outline'}>
            Title A-Z
          </Button>
          <Button style={{ backgroundColor: '#64748b', color: 'white' }} onClick={() => handleSortChange('titleZA')} variant={sortOrder === 'titleZA' ? 'solid' : 'outline'}>
            Title Z-A
          </Button>
        </Flex>
      </Flex>
      <Flex wrap="wrap" gap="4" className="show-list">
        {filteredShows.map(show => (
          <Card key={show.id} style={{ width: '300px' }}>
            <img src={show.image} alt={show.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <Box p="3">
              <Text size="5" weight="bold" mb="2">{show.title}</Text>
              <br />
              <Text size="2" mb="2">Seasons: {show.seasons}</Text>
              <br />
              <Text size="2" mb="2">Episodes: {showDetails[show.id]?.totalEpisodes || 'Loading...'}</Text>
              <br />
              <Text size="2" mb="2">Last updated: {new Date(show.updated).toLocaleDateString()}</Text><br />
              <Text size="2" mb="2">Genres: {show.genres.map(genreId => getGenreTitle(genreId)).join(', ')}</Text>
              <br />
            
              <Flex className="button-container" gap="2" mt="2">
                <Button asChild className="full-width-button view-details-btn custom-button" size="2" variant="soft" style={{ whiteSpace:'nowrap', maxWidth:"100px", backgroundColor: '#64748b', color: 'white' }}>
                  <Link to={`/show/${show.id}`}>View Details</Link>
                </Button>
                <Button style={{ backgroundColor: '#64748b', color: 'white' }} onClick={() => handlePlayAudio(show)} className="full-width-button play-button custom-button" size="1">
                  <PlayIcon /> Play
                </Button>
                <Button 
                  onClick={() => toggleFavorite(show)}
                  variant="ghost"
                  className="full-width-button favorite-button custom-button"
                  size="1"
                >
                  {isFavorite(show.id) ? <StarFilledIcon /> : <StarIcon />}
                </Button>
              </Flex>
            </Box>
          </Card>
        ))}
      </Flex>
    </Box>
  );
}

export default ShowList;