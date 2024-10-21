import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Text, Flex, Box, Card, ScrollArea, Select } from '@radix-ui/themes';
import { StarFilledIcon, StarIcon, PlayIcon } from '@radix-ui/react-icons';

const API_URL = 'https://podcast-api.netlify.app/id/';

const genreMap = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family"
};

function ShowDetails({ playAudio, toggleFavorite, isFavorite, playbackPositions }) { //destructures these props 
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);//while loading 
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);//keeps track of which season they viewing 
  const { id } = useParams();//use Params s a hook from react-router that extracts the id parameter from the URL to fetch specific show details

  useEffect(() => {//runs when component mounts 
    fetchShowDetails();
  }, [id]);

  const fetchShowDetails = async () => {
    try {
      const response = await fetch(`${API_URL}${id}`);//await fetch option to complete befor moving to next line
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
  //This function is a crucial part of the ShowDetails component, responsible for fetching the data that will be displayed to the user. Its asynchronous nature and error handling make it robust and user-friendly,

  const handleToggleFavorite = (episode) => {
    if (show) {
      toggleFavorite({
        ...episode,
        season: selectedSeason,
        showId: show.id,
        showTitle: show.title,
        image: show.image
      }, show);
    }
  };
  /*
Combining Data: This function combines data from the individual episode, the current show, and the component's state (selectedSeason) to create a comprehensive favorite object.
Flexible Favoriting: By including both episode-specific and show-specific data, this function allows for favoriting either entire shows or specific episodes.
  */

  const handlePlayAudio = (episodeNumber) => {
    if (show) {
      playAudio(show.id, selectedSeason, episodeNumber);
    }
  };
//By using show.id and selectedSeason, the function ensures that the correct show and season context is provided when playing an episode.
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
//This function iused in the context of displaying playback times for podcast episodes, such as current play time or episode duration.
  const getGenreTitle = (genre) => {
    if (typeof genre === 'number') {
      return genreMap[genre] || `Unknown (${genre})`;
    }
    return genre; // If it's already a string, return it as is
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!show) return <div className="not-found">Show not found</div>;

  const genres = show.genres ? show.genres.map(getGenreTitle) : [];
  const seasons = show.seasons || [];
  const currentSeason = seasons[selectedSeason - 1] || {};
  const seasonImage = currentSeason.image || show.image || ''; // Fallback to show image if season image is not available

  return (
    <Box className="show-details">
      <Text size="8" weight="bold" mb="4">{show.title}</Text>
      {show.image && <img src={show.image} alt={show.title} className="show-image" style={{ maxWidth: '300px', marginBottom: '20px' }} />}
      <Text size="3" mb="4">{show.description}</Text>
      
      <Flex direction="column" mb="4">
        <Flex align="center" justify="space-between" mb="2">
          <Text size="5" weight="bold">Season {selectedSeason}</Text>
          <Select.Root value={selectedSeason.toString()} onValueChange={(value) => setSelectedSeason(Number(value))}>
            <Select.Trigger />
            <Select.Content>
              {seasons.map((season, index) => (
                <Select.Item key={index} value={(index + 1).toString()}>
                  Season {index + 1}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        {seasonImage && (
          <img 
            src={seasonImage} 
            alt={`Season ${selectedSeason}`} 
            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '10px', borderRadius: '8px' }} 
          />
        )}
        {genres.length > 0 && (
          <Text size="2" mt="2" mb="4">
            Genre: {genres.map((genre, index) => (
              <React.Fragment key={index}>
                {index > 0 && ', '}
                <Text style={{ color: 'gray' }}>{genre}</Text>
              </React.Fragment>
            ))}
          </Text>
        )}
      </Flex>
      
      <ScrollArea style={{ height: 'calc(100vh - 400px)', paddingRight: '16px' }}>
        <Card>
          {currentSeason.episodes && currentSeason.episodes.map((episode) => {
            const episodeId = `${show.id}-S${selectedSeason}E${episode.episode}`;
            const playbackPosition = playbackPositions[episodeId];
            const isFavorited = isFavorite(show.id, episode.title);
            return (
              <Card key={episode.episode} style={{ marginBottom: '15px', padding: '10px' }}>
                <Text size="3" weight="bold" mb="1">
                  Episode {episode.episode}: {episode.title}
                </Text>
                <br />
                <Text size="2" mb="2" style={{ color: 'gray' }}>
                  {episode.description}
                </Text>
                <br />
                {playbackPosition && (
                  <Text size="2" mb="2" style={{ color: 'gray' }}>
                    Last played: {formatTime(playbackPosition)}
                  </Text>
                )}
                <Flex gap="2" mt="2">
                  <Button 
                    size="1"
                    variant="soft" 
                    onClick={() => handlePlayAudio(episode.episode)} 
                    style={{ 
                      backgroundColor: '#64748b', 
                      color: 'white',
                      flex: 1
                    }}
                  >
                    <PlayIcon /> Play
                  </Button>
                  <Button 
                    onClick={() => handleToggleFavorite(episode)}
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