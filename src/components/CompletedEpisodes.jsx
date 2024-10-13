import React from 'react';
import { Button, Dialog, Flex, Box, Text, Card } from '@radix-ui/themes';
import { PlayIcon, TrashIcon } from '@radix-ui/react-icons';

function CompletedEpisodes({ completedEpisodes, playAudio, resetListeningHistory, searchQuery, playbackPositions }) {
  const filteredEpisodes = searchQuery && typeof searchQuery === 'string'
    ? completedEpisodes.filter(episode => 
        (episode.title && episode.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (episode.showTitle && episode.showTitle.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : completedEpisodes;

  const handlePlayAgain = (episode) => {
    playAudio(episode.showId, episode.seasonNumber, episode.episodeNumber);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box className="completed-episodes">
      <Text size="8" weight="bold" mb="4">Completed Episodes</Text>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button color="red">Reset Listening History</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Reset Listening History</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to reset your entire listening history? This action cannot be undone.
          </Dialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button color="red" onClick={resetListeningHistory}>
                Yes, Reset History
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
      {filteredEpisodes.length === 0 ? (
        <Text size="3" mt="4">
          {searchQuery ? "No completed episodes match your search." : "You haven't completed any episodes yet."}
        </Text>
      ) : (
        <Flex wrap="wrap" gap="4" mt="4">
          {filteredEpisodes.map((episode) => (
            <Card key={episode.id || `${episode.showId}-${episode.seasonNumber}-${episode.episodeNumber}`} style={{ width: '300px' }}>
              <Box p="3">
                {episode.image && (
                  <img src={episode.image} alt={episode.showTitle || 'Episode'} style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '10px' }} />
                )}
                <Text weight="bold" size="4" mb="2">{episode.title || 'Untitled Episode'}</Text>
                <Text size="2" mb="1">Show: {episode.showTitle || 'Unknown Show'}</Text>
                <Text size="2" mb="1">Season: {episode.seasonNumber || 'N/A'}</Text>
                <Text size="2" mb="1">Episode: {episode.episodeNumber || 'N/A'}</Text>
                <Text size="2" mb="2">Completed on: {episode.completedDate ? new Date(episode.completedDate).toLocaleString() : 'Unknown'}</Text>
                {playbackPositions[episode.id] && (
                  <Text size="2" mb="2">
                    Last played at: {formatTime(playbackPositions[episode.id])}
                  </Text>
                )}
                <Flex gap="2">
                  <Button onClick={() => handlePlayAgain(episode)} size="1" style={{ flex: 1 }}>
                    <PlayIcon /> Play Again
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

export default CompletedEpisodes;