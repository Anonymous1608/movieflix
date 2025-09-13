import { useEffect, useState } from "react";
import HeroCarousel from "../components/HeroCarousel";
import MovieGrid from "../components/MovieGrid";

const Home = () => {
  const [moviesData, setMoviesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //const BASE_URL =  "http://localhost:5000";
    fetch("/api/live")
      .then((response) => response.json())
      .then((data) => {
        setMoviesData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching live movies:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }
  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <HeroCarousel movies={moviesData.slice(0, 4)} />
        <MovieGrid apilink={"/api/trending"} pagename={"Trending Now"} />
      </div>
    </div>
  );
};

export default Home;
