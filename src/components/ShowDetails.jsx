import React, { useState, useMemo } from 'react';
import { Button, Box, Text, Flex, Card, Select } from '@radix-ui/themes';
import { PlayIcon, StarFilledIcon, StarIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

function Favorites({ 
  playAudio, 
  favorites, 
  toggleFavorite, 
  searchQuery, 
  playbackPositions, 
  getGenreTitle, 
  genreMap 
}) {
  const [sortOrder, setSortOrder] = useState('recentlyUpdated');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const availableGenres = useMemo(() => {
    const genres = new Set();
    favorites.forEach(fav => {
      if (Array.isArray(fav.genres)) {
        fav.genres.forEach(genre => genres.add(genre));
      }
    });
    return Array.from(genres);
  }, [favorites]);

  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = favorites;
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = favorites.filter(fav => 
        fav.showTitle.toLowerCase().includes(lowercaseQuery) ||
        (fav.title && fav.title.toLowerCase().includes(lowercaseQuery))
      );
    }
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(fav => 
        Array.isArray(fav.genres) && fav.genres.includes(getGenreTitle(parseInt(selectedGenre)))
      );
    }
    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'recentlyUpdated':
          return new Date(b.updated) - new Date(a.updated);
        case 'leastRecentlyUpdated':
          return new Date(a.updated) - new Date(b.updated);
        case 'titleAZ':
          return a.showTitle.localeCompare(b.showTitle);
        case 'titleZA':
          return b.showTitle.localeCompare(a.showTitle);
        default:
          return 0;
      }
    });
  }, [favorites, searchQuery, sortOrder, selectedGenre, getGenreTitle]);

  const handleRemoveFavorite = (favorite) => {
    toggleFavorite(favorite);
  };

  const handlePlayAudio = (favorite) => {
    playAudio(favorite.showId, favorite.season || 1, favorite.episode || 1);
  };

  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handleGenreChange = (value) => {
    setSelectedGenre(value);
  };

  return (
    <Box className="favorites" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Text size="8" weight="bold" mb="4">Your Favorites</Text>
      <Flex direction="column" gap="4" mb="4">
        <Flex gap="2" wrap="wrap">
          <Select.Root value={selectedGenre} onValueChange={handleGenreChange}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="All">All Genres</Select.Item>
              {Object.entries(genreMap).map(([id, title]) => (
                availableGenres.includes(title) && (
                  <Select.Item key={id} value={id}>{title}</Select.Item>
                )
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
      {filteredAndSortedFavorites.length === 0 ? (
        <Text size="3">No favorites found. {searchQuery || selectedGenre !== 'All' ? 'Try a different search term or genre.' : ''}</Text>
      ) : (
        <Flex wrap="wrap" gap="4" className="show-list">
          {filteredAndSortedFavorites.map((favorite) => (
            <Card key={favorite.id} style={{ width: '300px' }}>
              <img 
                src={favorite.image} 
                alt={favorite.showTitle} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
              />
              <Box p="3">
                <Text size="5" weight="bold" mb="2">{favorite.showTitle}</Text>
                <br />
                <Text size="2" mb="2">Seasons: {favorite.seasons || 'N/A'}</Text>
                <br />
                <Text size="2" mb="2">Last updated: {new Date(favorite.updated).toLocaleDateString()}</Text>
                <br />
                <Text size="2" mb="2">Genres: {Array.isArray(favorite.genres) ? favorite.genres.join(', ') : 'N/A'}</Text>
                <br />
                <Flex className="button-container" gap="2" mt="2">
                  <Button 
                    asChild 
                    className="full-width-button view-details-btn custom-button" 
                    size="2" 
                    variant="soft" 
                    style={{ 
                      whiteSpace: 'nowrap', 
                      maxWidth: "100px", 
                      backgroundColor: '#64748b', 
                      color: 'white' 
                    }}
                  >
                    <Link to={`/show/${favorite.showId}`}>View Details</Link>
                  </Button>
                  <Button 
                    style={{ backgroundColor: '#64748b', color: 'white' }} 
                    onClick={() => handlePlayAudio(favorite)} 
                    className="full-width-button play-button custom-button" 
                    size="1"
                  >
                    <PlayIcon /> Play
                  </Button>
                  <Button 
                    onClick={() => handleRemoveFavorite(favorite)}
                    variant="ghost"
                    className="full-width-button favorite-button custom-button"
                    size="1"
                  >
                    <StarFilledIcon />
                  </Button>
                </Flex>
              </Box>
            </Card>
          ))}
        </Flex>
      )}
    </Box>
  );
}

export default Favorites;