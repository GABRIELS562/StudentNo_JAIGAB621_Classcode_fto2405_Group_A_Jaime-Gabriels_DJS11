import React, { useState, useEffect } from 'react';
import { Button, Dialog, Flex, Box, Text, Card, Tabs, Badge, ScrollArea } from '@radix-ui/themes';
import { PlayIcon, TrashIcon, ClockIcon, CheckCircledIcon } from '@radix-ui/react-icons';

function CompletedEpisodes({ 
  listeningHistory, // Array of episodes user has listened to
  playAudio, // Function to play an episode
  resetListeningHistory,  // Function to clear history
  searchQuery, // Text user is searching for
  playbackPositions 
}) {
  const [filteredHistory, setFilteredHistory] = useState([]);  // State for filtered episodes

  useEffect(() => {
    const filtered = searchQuery
      ? listeningHistory.filter(episode =>   // Search in episode title
          (episode.title && episode.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (episode.showTitle && episode.showTitle.toLowerCase().includes(searchQuery.toLowerCase()))// Search in show title
        )
      : listeningHistory;// If no search, use full history
    setFilteredHistory(filtered);
  }, [listeningHistory, searchQuery]);

  const startedEpisodes = filteredHistory.filter(episode => !episode.completed);// Split episodes into started and completed
  const completedEpisodes = filteredHistory.filter(episode => episode.completed);

  const handlePlayAudio = (episode) => {
    playAudio(episode.showId, episode.seasonNumber, episode.episodeNumber);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderEpisodeCard = (episode) => (
    <Card key={episode.id} style={{ width: '100%', marginBottom: '15px' }}>
      <Flex>
        <Box style={{ width: '120px', height: '120px', flexShrink: 0 }}>
          <img 
            src={episode.image} 
            alt={episode.showTitle} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
          />
        </Box>
        <Box pl="3" style={{ flex: 1 }}>
          <Text weight="bold" size="3">{episode.showTitle}</Text>
          <Text size="2">
            {episode.title} (S{episode.seasonNumber} E{episode.episodeNumber})
          </Text>
          {episode.completed ? (
            <Flex align="center" mt="1">
              <CheckCircledIcon color="green" />
              <Text size="1" ml="1">Completed on: {new Date(episode.completedDate).toLocaleDateString()}</Text>
            </Flex>
          ) : (
            <Flex align="center" mt="1">
              <ClockIcon color="orange" />
              <Text size="1" ml="1">Last played: {formatTime(playbackPositions[episode.id] || 0)}</Text>
            </Flex>
          )}
          <Flex mt="2" gap="2">
            <Button 
              onClick={() => handlePlayAudio(episode)} 
              size="1"
              style={{ 
                backgroundColor: '#64748b', 
                color: 'white',
                whiteSpace: 'nowrap'
              }}
            >
              <PlayIcon /> {episode.completed ? 'Play Again' : 'Resume'}
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );

  return (
    <Box className="listening-history" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Flex justify="between" align="center" mb="4">
        <Text size="8" weight="bold">Listening History</Text>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button color="red" variant="soft">
              <TrashIcon /> Reset History
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Reset Listening History</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Are you sure you want to reset your entire listening history? This action cannot be undone.
            </Dialog.Description>
            <Flex gap="3" justify="end">
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
      </Flex>

      <Tabs.Root defaultValue="started">
        <Tabs.List>
          <Tabs.Trigger value="started">In Progress ({startedEpisodes.length})</Tabs.Trigger>
          <Tabs.Trigger value="completed">Completed ({completedEpisodes.length})</Tabs.Trigger>
        </Tabs.List>

        <Box mt="4">
          <Tabs.Content value="started">
            <ScrollArea style={{ height: '600px' }}>
              {startedEpisodes.length === 0 ? (
                <Text size="3" style={{ textAlign: 'center', marginTop: '20px' }}>
                  {searchQuery ? "No in-progress episodes match your search." : "You haven't started any episodes yet."}
                </Text>
              ) : (
                startedEpisodes.map(renderEpisodeCard)
              )}
            </ScrollArea>
          </Tabs.Content>

          <Tabs.Content value="completed">
            <ScrollArea style={{ height: '600px' }}>
              {completedEpisodes.length === 0 ? (
                <Text size="3" style={{ textAlign: 'center', marginTop: '20px' }}>
                  {searchQuery ? "No completed episodes match your search." : "You haven't completed any episodes yet."}
                </Text>
              ) : (
                completedEpisodes.map(renderEpisodeCard)
              )}
            </ScrollArea>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}

export default CompletedEpisodes;