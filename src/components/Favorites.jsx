import React, { useState, useMemo } from 'react';
import { Button, Box, Text, Flex, Card, Select } from '@radix-ui/themes';
import { PlayIcon, Cross1Icon } from '@radix-ui/react-icons';
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

  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = favorites;
    
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(fav => 
        fav.showTitle.toLowerCase().includes(lowercaseQuery) ||
        (fav.title && fav.title.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(fav => {
        const favGenres = Array.isArray(fav.genres) ? fav.genres : [];
        return favGenres.some(genre => {
          if (typeof genre === 'number') {
            return genre === parseInt(selectedGenre);
          } else if (typeof genre === 'string') {
            return genre.toLowerCase() === genreMap[selectedGenre].toLowerCase();
          }
          return false;
        });
      });
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
  }, [favorites, searchQuery, sortOrder, selectedGenre, genreMap]);

  const handleRemoveFavorite = (favorite) => {
    toggleFavorite(favorite);
  };

  const handlePlayAudio = (favorite) => {
    if (favorite.episode) {
      playAudio(favorite.showId, favorite.season, favorite.episode);
    } else {
      playAudio(favorite.id, 1, 1);  // Play first episode of first season for show favorites
    }
  };

  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handleGenreChange = (value) => {
    setSelectedGenre(value);
  };

  const renderGenres = (favorite) => {
    if (!favorite.genres || favorite.genres.length === 0) {
      return 'No genres available';
    }
    return favorite.genres
      .filter(genre => genre !== 'All' && genre !== 'Featured')
      .map(genre => {
        if (typeof genre === 'number') {
          return getGenreTitle(genre);
        } else if (typeof genre === 'string') {
          return genre;
        }
        return 'Unknown Genre';
      })
      .join(', ');
  };

  return (
    <Box className="favorites" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Text size="8" weight="bold" mb="4">Your Favorites</Text>
      <Flex direction="column" gap="4" mb="4">
        <Flex gap="2" wrap="wrap">
          <Select.Root value={selectedGenre} onValueChange={handleGenreChange}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="All">All Genres</Select.Item><br />

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
                <Flex justify="between" align="center">
                  <Text size="5" weight="bold" mb="2">{favorite.showTitle}</Text>
                  <Button 
                    onClick={() => handleRemoveFavorite(favorite)}
                    variant="ghost"
                    size="1"
                    style={{ 
                      color: '#dc2626', 
                      fontWeight: 'bold',
                      fontSize: '1.2em'
                    }}
                  >
                    <Cross1Icon />
                  </Button>
                </Flex>
                <br />
                {favorite.episode ? (
                  <>
                    <Text size="3" mb="2">Episode: {favorite.title}</Text><br />

                    <Text size="2" mb="2">Season: {favorite.season}</Text><br />
                    <Text size="2" mb="2">Episode Number: {favorite.episode}</Text>
                  </>
                ) : (
                  <Text size="2" mb="2">Seasons: {favorite.seasons || 'N/A'}</Text> 
                )}<br />
                <Text size="2" mb="2">Last updated: {new Date(favorite.updated).toLocaleDateString()}</Text><br />
                <Text size="2" mb="2">Genres: {renderGenres(favorite)}</Text><br />
                <br />
                <Flex className="button-container" gap="2" mt="2">
                  <Button 
                    asChild 
                    className="full-width-button view-details-btn custom-button" 
                    size="2" 
                    variant="soft" 
                    style={{ 
                      flex: 1,
                      backgroundColor: '#64748b', 
                      color: 'white' 
                    }}
                  >
                    <Link to={`/show/${favorite.showId || favorite.id}`}>View Details</Link>
                  </Button>
                  <Button 
                    style={{ flex: 1, backgroundColor: '#64748b', color: 'white' }} 
                    onClick={() => handlePlayAudio(favorite)} 
                    className="full-width-button play-button custom-button" 
                    size="2"
                  >
                    <PlayIcon /> Play
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