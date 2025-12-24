import { useParams } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";

const ViewAllPage = () => {
  const { category } = useParams<{ category: string }>();
  const API_BASE = import.meta.env.VITE_API_URL;

  let apilink = "";
  let pagename = "";
  let mediaType: "movie" | "tv" = "movie";

  switch (category) {
    // Movies
    case "trending":
      apilink = `${API_BASE}/api/movies/trending`;
      pagename = "Trending Movies";
      break;
    case "popular":
      apilink = `${API_BASE}/api/movies/popular`;
      pagename = "Popular Movies";
      break;
    case "top-rated":
      apilink = `${API_BASE}/api/movies/top-rated`;
      pagename = "Top Rated Movies";
      break;
    case "indian":
      apilink = `${API_BASE}/api/movies/indian`;
      pagename = "Indian Movies";
      break;
    case "random":
        apilink = `${API_BASE}/api/movies/random`;
        pagename = "Recommendations";
        break;

    // TV Shows
    case "tv-popular":
      apilink = `${API_BASE}/api/tv/popular`;
      pagename = "Popular TV Shows";
      mediaType = "tv";
      break;
    case "tv-top-rated":
      apilink = `${API_BASE}/api/tv/top-rated`;
      pagename = "Top Rated TV Shows";
      mediaType = "tv";
      break;
      
    default:
      apilink = `${API_BASE}/api/movies/popular`;
      pagename = "Most Popular";
  }

  return (
    <div className="min-h-screen pb-20 pt-24 px-4 md:px-8 bg-black">
      <MovieGrid
        apilink={apilink}
        pagename={pagename}
        enableInfiniteScroll={true}
        mediaType={mediaType}
      />
    </div>
  );
};

export default ViewAllPage;
