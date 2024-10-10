import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { blackA, mauve, violet } from '@radix-ui/colors';
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import './App.css';

// ... (RadixColors and other components remain the same)

function App() {
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
          <Route path="/" element={<Home />} />
          <Route path="/shows" element={<ShowList />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;