import { useEffect, useState } from "react";
import HeroCarousel from "../components/HeroCarousel";
import MovieSlider from "../components/MovieSlider";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  cast?: Array<{ id: number; name: string }>;
  [key: string]: unknown;
}

const Home = () => {
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/movies/live")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        return response.json();
      })
      .then((data) => {
        setMoviesData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching live movies:", error);
        setMoviesData([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Immersive Hero Section */}
      {moviesData.length > 0 && (
        <HeroCarousel movies={moviesData.slice(0, 5)} />
      )}

      {/* Content Sections - offset to pull up slightly over hero */}
      <div className="relative z-20 -mt-10 md:-mt-20 space-y-12 px-4 md:px-12 bg-gradient-to-t from-black via-black to-transparent pt-12">
        <MovieSlider 
          apilink="/api/movies/trending" 
          pagename="Trending Now" 
          category="trending"
        />
        
        <MovieSlider 
          apilink="/api/movies/top-rated" 
          pagename="Top Rated Masterpieces" 
          category="top-rated"
        />
        
        <MovieSlider 
          apilink="/api/movies/popular" 
          pagename="Popular on MovieFlix" 
          category="popular"
        />

        <MovieSlider 
          apilink="/api/movies/indian" 
          pagename="Best of India" 
          category="indian"
        />
        
        <MovieSlider 
          apilink="/api/movies/random" 
          pagename="Because You Watched..." 
          category="random"
        />
      </div>
    </div>
  );
};

export default Home;
