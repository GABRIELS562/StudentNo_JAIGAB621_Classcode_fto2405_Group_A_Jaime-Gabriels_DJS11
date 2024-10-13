import React, { useState, useMemo, useCallback } from 'react';
import { Button, Box, Text, Flex } from '@radix-ui/themes';

function Favorites({ favorites, toggleFavorite, playAudio, searchQuery }) {
  const [sortOrder, setSortOrder] = useState('dateAdded');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [error, setError] = useState(null);

  const sortFunction = (a, b) => {
    switch (sortOrder) {
      case 'dateAdded':
        return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      case 'mostRecentlyUpdated':
        return new Date(b.updated || 0) - new Date(a.updated || 0);
      case 'leastRecentlyUpdated':
        return new Date(a.updated || 0) - new Date(b.updated || 0);
      case 'titleAZ':
        return (a.showTitle || '').localeCompare(b.showTitle || '');
      case 'titleZA':
        return (b.showTitle || '').localeCompare(a.showTitle || '');
      default:
        return 0;
    }
  };

  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = favorites;
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = favorites.filter(fav => 
        fav.showTitle.toLowerCase().includes(lowercaseQuery)
      );
    }
    return [...filtered].sort(sortFunction);
  }, [favorites, searchQuery, sortOrder]);

  const handleRemoveFavorite = (favorite) => {
    toggleFavorite(favorite);
  };

  const handlePlayAudio = useCallback((favorite) => {
    console.log("Attempting to play audio for:", favorite);
    setError(null);
    setCurrentlyPlaying(favorite);

    // Use the same placeholder audio as in the ShowList component
    const placeholderAudio = 'https://file-examples.com/storage/fe8c7eef0c6364f6c9504cc/2017/11/file_example_MP3_700KB.mp3';

    try {
      // Use showId if available, otherwise fall back to id
      const id = favorite.showId || favorite.id;
      playAudio(id, favorite.showTitle, placeholderAudio);
      console.log("Audio play function called with:", id, favorite.showTitle, placeholderAudio);
    } catch (err) {
      console.error("Error in handlePlayAudio:", err);
      setError(`An error occurred: ${err.message}`);
    }
  }, [playAudio]);

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  return (
    <Box className="favorites">
      <Text size="8" mb="4">Your Favorites</Text>
      {error && <Text color="red" mb="4">{error}</Text>}
      <Flex gap="2" wrap="wrap" mb="4">
        <Button onClick={() => handleSortChange('dateAdded')} variant={sortOrder === 'dateAdded' ? 'solid' : 'outline'}>
          Date Added
        </Button>
        <Button onClick={() => handleSortChange('mostRecentlyUpdated')} variant={sortOrder === 'mostRecentlyUpdated' ? 'solid' : 'outline'}>
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
      {filteredAndSortedFavorites.length === 0 ? (
        <Text size="3">No favorites found. {searchQuery ? 'Try a different search term.' : ''}</Text>
      ) : (
        <Flex wrap="wrap" gap="4">
          {filteredAndSortedFavorites.map((favorite) => (
            <Box key={favorite.showId || favorite.id} style={{ width: '250px', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px' }}>
              {favorite.image && (
                <img 
                  src={favorite.image} 
                  alt={favorite.showTitle} 
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} 
                />
              )}
              <Text weight="bold" size="3" mb="1">{favorite.showTitle}</Text>
              <Text size="2" mb="1">Added on: {favorite.dateAdded ? new Date(favorite.dateAdded).toLocaleDateString() : 'Unknown'}</Text>
              <Text size="2" mb="2">Last updated: {favorite.updated ? new Date(favorite.updated).toLocaleDateString() : 'Unknown'}</Text>
              <Flex gap="2">
                <Button onClick={() => handlePlayAudio(favorite)} size="1" style={{ flex: 1 }}>
                  Play
                </Button>
                <Button onClick={() => handleRemoveFavorite(favorite)} size="1" variant="outline" style={{ flex: 1 }}>
                  Remove
                </Button>
              </Flex>
            </Box>
          ))}
        </Flex>
      )}
      {currentlyPlaying && (
        <Box mt="4">
          <Text>Currently Playing: {currentlyPlaying.showTitle}</Text>
        </Box>
      )}
    </Box>
  );
}

export default Favorites;