import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import SpecificSearchPage from "./pages/SpecificSearchPage";
import MovieDetails from "./pages/MovieDetails";
import RandomMovies from "./pages/RandomMovies";
import LatestMovies from "./pages/LatestMovies";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";
import Navigation from "./components/Navigation";
import TVShows from "./pages/TVShows";
import TVShowDetails from "./pages/TVShowDetails";
import ViewAllPage from "./pages/ViewAllPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-center" />
        <div className="bg-gradient-to-b from-black to-slate-950 min-h-screen">
          <div className="blackdrop-blur-md">
            <Router>
              <Navigation />
              <Routes>
                <Route index element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route
                  path="/search/:moviename"
                  element={<SpecificSearchPage />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/movies" element={<RandomMovies />} />
                <Route path="/popular" element={<LatestMovies />} />
                <Route path="/tv-shows" element={<TVShows />} />
                <Route path="/tv/:id" element={<TVShowDetails />} />
                <Route path="/:movieid" element={<MovieDetails />} />
                <Route path="/view-all/:category" element={<ViewAllPage />} />
                <Route path="/*" element={<ErrorPage />} />
              </Routes>
            </Router>
          </div>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
