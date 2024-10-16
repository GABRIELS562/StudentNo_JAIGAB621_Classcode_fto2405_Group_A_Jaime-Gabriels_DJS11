import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Text, Flex, Box, Card, ScrollArea } from '@radix-ui/themes';
import { StarFilledIcon, StarIcon, PlayIcon } from '@radix-ui/react-icons';

const API_URL = 'https://podcast-api.netlify.app/id/';

function ShowDetails({ playAudio, toggleFavorite, isFavorite, playbackPositions }) {
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchShowDetails();
  }, [id]);

  const fetchShowDetails = async () => {
    try {
      const response = await fetch(`${API_URL}${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const data = await response.json();
      setShow(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (episode, seasonNumber) => {
    toggleFavorite({
      ...episode,
      season: seasonNumber,
      showId: show.id,
      showTitle: show.title,
      image: show.image
    }, show);
  };

  const handlePlayAudio = (seasonNumber, episodeNumber) => {
    playAudio(show.id, seasonNumber, episodeNumber);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!show) return <div className="not-found">Show not found</div>;

  return (
    <Box className="show-details">
      <Text size="8" weight="bold" mb="4">{show.title}</Text>
      <img src={show.image} alt={show.title} className="show-image" style={{ maxWidth: '300px', marginBottom: '20px' }} />
      <Text size="3" mb="4">{show.description}</Text>
      
      <ScrollArea style={{ height: 'calc(100vh - 400px)', paddingRight: '16px' }}>
        {show.seasons.map((season) => (
          <Card key={season.season} style={{ marginBottom: '20px' }}>
            <Text size="4" weight="bold" mb="2">Season {season.season}</Text>
            <Text size="3" mb="4">{season.title}</Text>
            {season.episodes.map((episode) => {
              const episodeId = `${show.id}-S${season.season}E${episode.episode}`;
              const playbackPosition = playbackPositions[episodeId];
              const isFavorited = isFavorite(show.id, episode.title);
              return (
                <Card key={episode.episode} style={{ marginBottom: '15px', padding: '10px' }}>
                  <Text size="3" weight="bold" mb="2">
                    Episode {episode.episode}: {episode.title}
                  </Text>
                  <Text size="2" mb="2" style={{ color: 'gray' }}>
                    {episode.description}
                  </Text>
                  {playbackPosition && (
                    <Text size="2" mb="2" style={{ color: 'gray' }}>
                      Last played: {formatTime(playbackPosition)}
                    </Text>
                  )}
                  <Flex gap="2" mt="2">
                    <Button 
                      size="1"
                      variant="soft" 
                      onClick={() => handlePlayAudio(season.season, episode.episode)} 
                      style={{ 
                        backgroundColor: '#64748b', 
                        color: 'white',
                        flex: 1
                      }}
                    >
                      <PlayIcon /> Play
                    </Button>
                    <Button 
                      size="1"
                      variant="soft"
                      style={{ 
                        backgroundColor: '#64748b', 
                        color: 'white',
                        flex: 1
                      }}
                    >
                      View Details
                    </Button>
                    <Button 
                      onClick={() => handleToggleFavorite(episode, season.season)}
                      variant="ghost"
                      size="1"
                      style={{ flex: 0 }}
                    >
                      {isFavorited ? <StarFilledIcon color="orange" /> : <StarIcon />}
                    </Button>
                  </Flex>
                </Card>
              );
            })}
          </Card>
        ))}
      </ScrollArea>
      
      <Flex justify="center" mt="6">
        <Button 
          asChild 
          size="2" 
          variant="soft" 
          style={{ 
            backgroundColor: '#64748b', 
            color: 'white',
            padding: '0 20px'
          }}
        >
          <Link to="/shows">Back to Shows</Link>
        </Button>
      </Flex>
    </Box>
  );
}

export default ShowDetails;