import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Flex, Box, Text, Select } from '@radix-ui/themes';
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons';

const API_URL = 'https://podcast-api.netlify.app/shows';

function ShowList({ playAudio, toggleFavorite, isFavorite, searchQuery, playbackPositions, getGenreTitle, genreMap }) {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('recentlyUpdated');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    filterAndSortShows();
  }, [shows, sortOrder, selectedGenre, searchQuery]);

  const fetchShows = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }
      const data = await response.json();
      setShows(data);
      setFilteredShows(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
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
  };

  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handleGenreChange = (value) => {
    setSelectedGenre(value);
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

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
          <Button onClick={() => handleSortChange('recentlyUpdated')} variant={sortOrder === 'recentlyUpdated' ? 'solid' : 'outline'}>
            Most Recently Updated
          </Button>
          <Button onClick={() => handleSortChange('leastRecentlyUpdated')} variant={sortOrder === 'leastRecentlyUpdated' ? 'solid' : 'outline'}>
            Least Recently Updated
          </Button>
          <Button onClick={() => handleSortChange('titleAZ')} variant={sortOrder === 'titleAZ' ? 'solid' : 'outline'}>
            Title A-Z
          </Button>
          <Button onClick={() => handleSortChange('titleZA')} variant={sortOrder === 'titleZA' ? 'solid' : 'outline'}>
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
              <Text size="2" mb="2">Seasons: {show.seasons}</Text>
              <Text size="2" mb="2">Last updated: {new Date(show.updated).toLocaleDateString()}</Text>
              <Text size="2" mb="2">Genres: {show.genres.map(genreId => getGenreTitle(genreId)).join(', ')}</Text>
              <Flex gap="2" mt="2">
                <Button asChild size="1">
                  <Link to={`/show/${show.id}`}>View Details</Link>
                </Button>
                <Button onClick={() => playAudio(show.id, 1, 1)} size="1">Play</Button>
                <Button 
                  onClick={() => toggleFavorite(show)}
                  variant="ghost"
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