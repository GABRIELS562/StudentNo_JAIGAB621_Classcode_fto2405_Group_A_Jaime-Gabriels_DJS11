import  { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import Home from './components/Home';
import ShowList from './components/Showlist';
import ShowDetails from './components/ShowDetails';
import Favorites from './components/Favorites';
import ThemeToggle from './components/ThemeToggle';
import AudioPlayer from './components/AudioPlayer';
import CompletedEpisodes from './components/CompletedEpisodes';
import SearchBar from './components/SearchBar';
import '@radix-ui/themes/styles.css';
import './App.css';

const API_BASE_URL = 'https://podcast-api.netlify.app';

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

function App() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null); // State variable and setter function (current set to null)
  const [favorites, setFavorites] = useState([]);
  const [listeningHistory, setListeningHistory] = useState([]);
  const [theme, setTheme] = useState('light'); //current state set to light 
  const [searchQuery, setSearchQuery] = useState('');//current state empty string 
  const [playbackPositions, setPlaybackPositions] = useState({}); //set to an empty object

  useEffect(() => { //initalise app state from local storage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');//gets favorites from local storgae, if it doesnt exist []. converts to a JS object 
    const storedListeningHistory = JSON.parse(localStorage.getItem('listeningHistory') || '[]');
    const storedTheme = localStorage.getItem('theme') || 'light';
    const storedPlaybackPositions = JSON.parse(localStorage.getItem('playbackPositions') || '{}');
    
    setFavorites(storedFavorites); 
    setListeningHistory(storedListeningHistory);
    setTheme(storedTheme);
    setPlaybackPositions(storedPlaybackPositions);
  }, []);// initialises application state from localstorage when component mounts 

  //show a warning to the user if they try to close or refressh the page while audio playing 
  useEffect(() => {
    const handleBeforeUnload = (event) => {//function is called when user tries to leave the page
    
      if (currentlyPlaying) {
        event.preventDefault(); //generic message shown
        event.returnValue = ''; //sets compatiblity with older browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentlyPlaying]);

  const getGenreTitle = (genreId) => genreMap[genreId] || "Unknown Genre";
  //This function is a concise way to safely get genre titles, ensuring that even if a genre ID is not recognized, the function still returns a meaningful string rather than undefined. used throughout the application to display genre information, handling cases where genre data might be missing or incorrect.

  const playAudio = async (showId, seasonNumber, episodeNumber) => { //async function allows function to run in the background
    try {
      console.log(`Playing audio: Show ${showId}, Season ${seasonNumber}, Episode ${episodeNumber}`); //logs to console
      const response = await fetch(`${API_BASE_URL}/id/${showId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details'); //Checks if response is successful
      }
      const showData = await response.json();
      const season = showData.seasons.find(s => s.season === parseInt(seasonNumber)); // specific show
      if (!season) {
        throw new Error('Season not found');
      }
      const episode = season.episodes.find(e => e.episode === parseInt(episodeNumber)); //specific episode
      if (!episode) {
        throw new Error('Episode not found');
      }
      //this finds specific season and episode from the data 
      
      const episodeId = `${showId}-S${seasonNumber}E${episodeNumber}`; //creates new episode object with various properties 
      const newEpisode = {
        id: episodeId,
        showId,
        showTitle: showData.title,
        seasonNumber,
        episodeNumber,
        title: episode.title,
        file: episode.file,
        image: showData.image,
        currentTime: playbackPositions[episodeId] || 0,
        completed: false,
        startDate: new Date().toISOString()
      };

      setCurrentlyPlaying(newEpisode);//Updates the currently playing episode
      updateListeningHistory(newEpisode);//Updates the listening history
      console.log("Now playing:", episodeId); // logs it to the console
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const updateListeningHistory = (episode) => {
    setListeningHistory(prevHistory => {
      const index = prevHistory.findIndex(e => e.id === episode.id);
      let newHistory;
      if (index > -1) {
        newHistory = [
          { ...prevHistory[index], ...episode },
          ...prevHistory.slice(0, index),
          ...prevHistory.slice(index + 1)
        ];
      } else {
        newHistory = [episode, ...prevHistory];
      }
      localStorage.setItem('listeningHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };
  //Overall, this function updates the listening history by either adding a new episode to the beginning of the histor
//y or moving an existing episode to the front if it's already in the history. It also updates the episode data if it already exists. Finally, it saves the updated history to localStorage for persistence across sessions
  const updatePlaybackPosition = (episodeId, currentTime) => {
    setPlaybackPositions(prev => {
      const updated = { ...prev, [episodeId]: currentTime };
      localStorage.setItem('playbackPositions', JSON.stringify(updated));
      return updated;
    });

    setListeningHistory(prevHistory => {
      const newHistory = prevHistory.map(episode => 
        episode.id === episodeId ? { ...episode, currentTime } : episode
      );
      localStorage.setItem('listeningHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };
  //Overall, this function does two main things:1. It updates the playback position for a specific episode in the `playbackPositions` state and localStorage.
//2. It updates the `currentTime` for the same episode in the listening history state and localStorage.
  const toggleFavorite = async (item, show = null) => {
    try {
      let favoriteItem;
      if (item.episode || (show && item.title)) {
        // It's an episode
        const showResponse = await fetch(`${API_BASE_URL}/id/${show ? show.id : item.showId}`);
        const showData = await showResponse.json();
        favoriteItem = {
          id: `${show ? show.id : item.showId}-${item.title}`,
          showId: show ? show.id : item.showId,
          showTitle: show ? show.title : item.showTitle,
          title: item.title,
          season: item.season,
          episode: item.episode,
          file: item.file,
          image: showData.image,
          genres: showData.genres, // This will be an array of genre IDs
          dateAdded: new Date().toISOString(),
          updated: showData.updated
        };
      } else {
        // It's a show if not an episode
        const showResponse = await fetch(`${API_BASE_URL}/id/${item.id}`);
        const showData = await showResponse.json();
        favoriteItem = {
          id: item.id,
          showId: item.id,
          showTitle: item.title,
          image: showData.image,
          genres: showData.genres, // This will be an array of genre IDs
          seasons: showData.seasons.length,
          dateAdded: new Date().toISOString(),
          updated: showData.updated
        };
      }

      setFavorites(prevFavorites => {
        const index = prevFavorites.findIndex(fav => fav.id === favoriteItem.id);
        let newFavorites;
        if (index > -1) {
          newFavorites = prevFavorites.filter(fav => fav.id !== favoriteItem.id);
        } else {
          newFavorites = [...prevFavorites, favoriteItem];
        }
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  /*
Overall, this function does the following:

Determines whether the item to be favorited is an episode or a show.
Fetches additional data about the item from an API.
Constructs a favoriteItem object with all necessary information.
Updates the favorites list by either adding the item (if it wasn't already a favorite) or removing it (if it was already a favorite).
Saves the updated favorites list to localStorage.
Handles any errors that might occur during this process.

This function provides a complete "toggle" functionality for adding or removing items from a favorites list, with error handling and persistence to localStorage.
  */

  const isFavorite = (showId, episodeTitle) => {
    if (episodeTitle) {
      return favorites.some(fav => fav.id === `${showId}-${episodeTitle}`);
    }
    return favorites.some(fav => fav.showId === showId);
  };
/*
Overall, this function does the following:

If an episodeTitle is provided, it checks if a specific episode is in the favorites list by looking for a favorite with an id that combines the showId and episodeTitle.
If no episodeTitle is provided, it checks if a show is in the favorites list by looking for a favorite with a matching showId.
It returns true if the item (either episode or show) is found in the favorites, and false otherwise.

This function is useful for quickly determining whether a particular show or episode is currently in the user's favorites list, which could be used, for example, to display a filled or unfilled heart icon next to items in a user interface

*/
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  /*
  This function is typically used in conjunction with a button or some other user interface element that allows the user to switch between light and dark modes in the application. When called, it will switch the current theme to its opposite and ensure this change is reflected both in the current state and in persistent storage.
  */

  const markEpisodeAsCompleted = (episode) => {
    const completedEpisode = { ...episode, completed: true, completedDate: new Date().toISOString() };
    updateListeningHistory(completedEpisode);
  };

  const resetListeningHistory = () => {
    setListeningHistory([]);//clears memory to emty array
    setPlaybackPositions({});//playback to empty object
    localStorage.removeItem('listeningHistory');
    localStorage.removeItem('playbackPositions');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Theme appearance={theme}>
      <Router>
        <div className={`app ${theme}`}>
          <nav className={`navbar ${theme}`}>
            <div className="navbar-content">
              <div className="navbar-center">
                <Link to="/">Home</Link>
                <Link to="/shows">Shows</Link>
                <Link to="/favorites">Favorites</Link>
                <Link to="/completed">Listening History</Link>
              </div>
              <div className="navbar-right">
                <SearchBar onSearch={handleSearch} />
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </div>
            </div>
          </nav>

          <main className="content">
            <Routes>
              <Route path="/" element={<Home playAudio={playAudio} />} />
              <Route 
                path="/shows" 
                element={
                  <ShowList 
                    playAudio={playAudio} 
                    toggleFavorite={toggleFavorite} 
                    isFavorite={isFavorite}
                    searchQuery={searchQuery}
                    playbackPositions={playbackPositions}
                    getGenreTitle={getGenreTitle}
                    genreMap={genreMap}
                  />
                } 
              />
              <Route 
                path="/show/:id" 
                element={
                  <ShowDetails 
                    playAudio={playAudio} 
                    toggleFavorite={toggleFavorite} 
                    isFavorite={isFavorite}
                    playbackPositions={playbackPositions}
                    getGenreTitle={getGenreTitle}
                  />
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <Favorites 
                    playAudio={playAudio} 
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    searchQuery={searchQuery}
                    playbackPositions={playbackPositions}
                    getGenreTitle={getGenreTitle}
                    genreMap={genreMap}
                  />
                } 
              />
              <Route 
                path="/completed" 
                element={
                  <CompletedEpisodes 
                    listeningHistory={listeningHistory}
                    playAudio={playAudio}
                    resetListeningHistory={resetListeningHistory}
                    searchQuery={searchQuery}
                    playbackPositions={playbackPositions}
                    getGenreTitle={getGenreTitle}
                  />
                } 
              />
            </Routes>
          </main>
 
          {currentlyPlaying && (
            <div className="fixed-audio-player">
              <AudioPlayer 
                currentEpisode={currentlyPlaying}
                onComplete={() => markEpisodeAsCompleted(currentlyPlaying)}
                updatePlaybackPosition={updatePlaybackPosition}
              />
            </div>
          )}
        </div>
      </Router>
    </Theme>
  );
}

export default App;
//audioplayer conditionally renderes when there is audio playing 