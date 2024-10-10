import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { blackA, mauve, violet } from '@radix-ui/colors';
import Home from './components/Home';
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import Favorites from './components/Favorites';
import './App.css';

const DEMO_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

function RadixColors() {
  // ... (keep existing RadixColors component)
}

function App() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const playAudio = (showId, showTitle) => {
    if (currentlyPlaying && currentlyPlaying.id === showId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying({ id: showId, title: showTitle });
    }
  };

  return (
    <Router>
      <RadixColors />
      <div className="app">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shows">Shows</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home playAudio={playAudio} />} />
          <Route path="/shows" element={<ShowList playAudio={playAudio} />} />
          <Route path="/show/:id" element={<ShowDetails playAudio={playAudio} />} />
          <Route path="/favorites" element={<Favorites playAudio={playAudio} />} />
        </Routes>

        {currentlyPlaying && (
          <div className="audio-player">
            <p>Now Playing: {currentlyPlaying.title}</p>
            <audio src={DEMO_AUDIO_URL} autoPlay controls />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;