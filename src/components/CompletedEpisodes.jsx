import React from 'react';
import { Button } from '@radix-ui/themes';

function CompletedEpisodes({ completedEpisodes, playAudio }) {
  return (
    <div className="completed-episodes">
      <h1>Completed Episodes</h1>
      {completedEpisodes.length === 0 ? (
        <p>You haven't completed any episodes yet.</p>
      ) : (
        <ul>
          {completedEpisodes.map((episode, index) => (
            <li key={index}>
              <h3>{episode.title}</h3>
              <p>{episode.show}</p>
              <Button onClick={() => playAudio(episode)}>Play Again</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CompletedEpisodes;