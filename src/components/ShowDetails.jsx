import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Text, Flex, Box } from '@radix-ui/themes';
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!show) return <div className="not-found">Show not found</div>;

  return (
    <div className="show-details">
      <h1>{show.title}</h1>
      <img src={show.image} alt={show.title} className="show-image" />
      <p>{show.description}</p>
      
      <h2>Seasons</h2>
      {show.seasons.map((season) => (
        <div key={season.season} className="season">
          <h3>Season {season.season}</h3>
          <ul className="episode-list">
            {season.episodes.map((episode) => {
              const episodeId = `${show.id}-${episode.title}`;
              const playbackPosition = playbackPositions[episodeId];
              return (
                <li key={episode.episode} className="episode-item">
                  <Flex justify="between" align="center">
                    <Box>
                      <Text as="h4" size="3" weight="bold">Episode {episode.episode}: {episode.title}</Text>
                      <Text size="2">{episode.description}</Text>
                      {playbackPosition && (
                        <Text size="2" color="gray">
                          Last played: {formatTime(playbackPosition)}
                        </Text>
                      )}
                    </Box>
                    <Flex gap="2">
                      <Button onClick={() => playAudio(show.id, episode.title, episode.file)}>
                        <PlayIcon /> Play
                      </Button>
                      <Button 
                        onClick={() => handleToggleFavorite(episode, season.season)}
                        variant="ghost"
                      >
                        {isFavorite(show.id, episode.title) ? <StarFilledIcon /> : <StarIcon />}
                      </Button>
                    </Flex>
                  </Flex>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      
      <Link to="/shows" className="back-link">
        <Button variant="outline">Back to Shows</Button>
      </Link>
    </div>
  );
}

export default ShowDetails;