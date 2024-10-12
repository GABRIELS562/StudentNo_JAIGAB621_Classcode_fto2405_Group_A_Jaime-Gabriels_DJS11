import React from 'react';
import { Button, Dialog, Flex } from '@radix-ui/themes';

function CompletedEpisodes({ completedEpisodes, playAudio, resetListeningHistory, searchQuery }) {
  const filteredEpisodes = searchQuery
    ? completedEpisodes.filter(episode => 
        episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        episode.show.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : completedEpisodes;

  return (
    <div className="completed-episodes">
      <h1>Completed Episodes</h1>
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
        <p>You haven't completed any episodes yet.</p>
      ) : (
        <ul>
          {filteredEpisodes.map((episode, index) => (
            <li key={index}>
              <h3>{episode.title}</h3>
              <p>Show: {episode.show}</p>
              <Button onClick={() => playAudio(episode.id, episode.title, episode.file)}>
                Play Again
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CompletedEpisodes;