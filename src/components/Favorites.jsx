import React, { useState, useMemo } from 'react';
import { Button, Box, Text, Flex, Card, Select, ScrollArea } from '@radix-ui/themes';
import { PlayIcon, StarFilledIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

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
            <Select.Trigger aria-label="Select genre" />
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
      {filteredAndSortedFavorites.length === 0 ? (
        <Text size="3">No favorites found. {searchQuery || selectedGenre !== 'All' ? 'Try a different search term or genre.' : ''}</Text>
      ) : (
        <ScrollArea style={{ height: 'calc(100vh - 250px)' }}>
          <Flex wrap="wrap" gap="4">
            {filteredAndSortedFavorites.map((favorite) => (
              <Card key={favorite.id} style={{ width: '250px' }}>
                <img 
                  src={favorite.image} 
                  alt={favorite.showTitle} 
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px 4px 0 0' }} 
                />
                <Box p="3">
                  <Text weight="bold" size="3" mb="1">{favorite.showTitle}</Text>
                  {favorite.title && (
                    <Text size="2" mb="1">Episode: {favorite.title}</Text>
                  )}
                  {favorite.season && (
                    <Text size="2" mb="1">Season: {favorite.season}</Text>
                  )}
                  {favorite.episode && (
                    <Text size="2" mb="1">Episode Number: {favorite.episode}</Text>
                  )}
                  {Array.isArray(favorite.genres) && favorite.genres.length > 0 && (
                    <Text size="2" mb="1">
                      Genres: {favorite.genres.join(', ')}
                    </Text>
                  )}
                  <Text size="2" mb="2">Added on: {new Date(favorite.dateAdded).toLocaleDateString()}</Text>
                  <Text size="2" mb="2">Updated: {new Date(favorite.updated).toLocaleDateString()}</Text>
                  <Flex gap="2">
                    <Button onClick={() => handlePlayAudio(favorite)} size="1" style={{ flex: 1 }}>
                      <PlayIcon /> Play
                    </Button>
                    <Button onClick={() => handleRemoveFavorite(favorite)} size="1" variant="outline" style={{ flex: 1 }}>
                      <StarFilledIcon /> Remove
                    </Button>
                  </Flex>
                </Box>
              </Card>
            ))}
          </Flex>
        </ScrollArea>
      )}
    </Box>
  );
}

export default Favorites;