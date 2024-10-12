import React, { useState, useEffect, useMemo } from 'react';
import { Button, Box, Text, Flex } from '@radix-ui/themes';
import * as Accordion from '@radix-ui/react-accordion';

function Favorites({ playAudio, favorites, toggleFavorite, searchQuery }) {
  const [sortOrder, setSortOrder] = useState('dateAdded');
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  useEffect(() => {
    console.log('Favorites received:', favorites.map(f => ({
      id: f.id,
      title: f.title,
      showTitle: f.showTitle,
      dateAdded: f.dateAdded,
      updated: f.updated
    })));
    filterFavorites(favorites);
  }, [favorites, searchQuery]);

  const filterFavorites = (favs) => {
    let filtered = favs;
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = favs.filter(fav =>
        fav.showTitle.toLowerCase().includes(lowercaseQuery) ||
        (fav.title && fav.title.toLowerCase().includes(lowercaseQuery))
      );
    }
    console.log('Filtered favorites:', filtered.map(f => ({
      id: f.id,
      title: f.title,
      showTitle: f.showTitle,
      dateAdded: f.dateAdded,
      updated: f.updated
    })));
    setFilteredFavorites(filtered);
  };

  const sortedFavorites = useMemo(() => {
    console.log('Sorting favorites. Current sort order:', sortOrder);
    console.log('Favorites before sorting:', filteredFavorites.map(f => ({
      id: f.id,
      title: f.title,
      showTitle: f.showTitle,
      dateAdded: f.dateAdded,
      updated: f.updated
    })));
    
    let sorted = [...filteredFavorites];
    
    sorted.sort((a, b) => {
      switch (sortOrder) {
        case 'dateAdded':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'mostRecentlyUpdated':
          return new Date(b.updated) - new Date(a.updated);
        case 'leastRecentlyUpdated':
          return new Date(a.updated) - new Date(b.updated);
        case 'titleAZ':
          return a.title.localeCompare(b.title);
        case 'titleZA':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    console.log('Favorites after sorting:', sorted.map(f => ({
      id: f.id,
      title: f.title,
      showTitle: f.showTitle,
      dateAdded: f.dateAdded,
      updated: f.updated
    })));
    return sorted;
  }, [filteredFavorites, sortOrder]);

  const groupedFavorites = useMemo(() => {
    const grouped = sortedFavorites.reduce((acc, fav) => {
      if (!acc[fav.showId]) {
        acc[fav.showId] = { 
          showTitle: fav.showTitle, 
          image: fav.image, 
          episodes: []
        };
      }
      acc[fav.showId].episodes.push(fav);
      return acc;
    }, {});

    console.log('Grouped favorites:', Object.entries(grouped).map(([showId, show]) => ({
      showId,
      showTitle: show.showTitle,
      episodeCount: show.episodes.length,
      episodes: show.episodes.map(e => ({
        id: e.id,
        title: e.title,
        dateAdded: e.dateAdded,
        updated: e.updated
      }))
    })));
    return grouped;
  }, [sortedFavorites]);

  const handlePlayAudio = (favorite) => {
    console.log('Playing audio:', favorite);
    playAudio(favorite.showId, favorite.title, favorite.file);
  };

  const handleRemoveFavorite = (favorite) => {
    console.log('Removing favorite:', favorite);
    toggleFavorite(favorite);
  };

  const handleSortChange = (newSortOrder) => {
    console.log('Changing sort order to:', newSortOrder);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="favorites">
      <h1>Your Favorites</h1>
      <Flex gap="2" wrap="wrap" className="sort-controls">
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
      {sortedFavorites.length === 0 ? (
        <Text size="3">No favorites found. {searchQuery ? 'Try a different search term.' : ''}</Text>
      ) : (
        <Accordion.Root type="multiple" className="favorites-list">
          {Object.entries(groupedFavorites).map(([showId, show]) => (
            <Accordion.Item key={showId} value={showId}>
              <Accordion.Trigger>
                <Flex align="center" gap="2">
                  <img src={show.image} alt={show.showTitle} style={{width: '50px', height: '50px', borderRadius: '4px'}} />
                  <Text size="5" weight="bold">{show.showTitle}</Text>
                </Flex>
              </Accordion.Trigger>
              <Accordion.Content>
                {show.episodes.map(episode => (
                  <Box key={episode.id} className="favorite-item" mb="3">
                    <Text as="h4" size="3" weight="bold">{episode.title}</Text>
                    <Text size="2">Season: {episode.season || 'Unknown'}</Text>
                    <Text size="2">Added on: {episode.dateAdded ? new Date(episode.dateAdded).toLocaleDateString() : 'Unknown'}</Text>
                    <Text size="2">Last updated: {episode.updated ? new Date(episode.updated).toLocaleDateString() : 'Unknown'}</Text>
                    <Flex gap="2" mt="2">
                      <Button onClick={() => handlePlayAudio(episode)} className="play-button">
                        Play
                      </Button>
                      <Button onClick={() => handleRemoveFavorite(episode)} className="remove-favorite-button">
                        Remove from Favorites
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      )}
    </div>
  );
}

export default Favorites;