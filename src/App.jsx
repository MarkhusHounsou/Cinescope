import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import TopRated from './pages/TopRated';
import NowPlaying from './pages/NowPlaying';
import Upcoming from './pages/Upcoming';
import Random from './pages/Random';
import { FiltersProvider } from './context/FiltersContext';

function App() {
  return (
    <FiltersProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route path="/now-playing" element={<NowPlaying />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/random" element={<Random />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </FiltersProvider>
  );
}

export default App;
