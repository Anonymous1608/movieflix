import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import SpecificSearchPage from "./pages/SpecificSearchPage";
import MovieDetails from "./pages/MovieDetails";
import RandomMovies from "./pages/RandomMovies";
import LatestMovies from "./pages/LatestMovies";
import ErrorPage from "./pages/ErrorPage";
import Navigation from "./components/Navigation";
const App = () => {
  return (
    <div className="bg-gradient-to-b from-black to-slate-950 min-h-screen">
      <div className="blackdrop-blur-md">
        <Router>
          <Navigation />
          <Routes>
            <Route index element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search/:moviename" element={<SpecificSearchPage />} />
            <Route path="/:movieid" element={<MovieDetails />} />
            <Route path="/movies" element={<RandomMovies />} />
            <Route path="/popular" element={<LatestMovies />} />
            <Route path="/*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
