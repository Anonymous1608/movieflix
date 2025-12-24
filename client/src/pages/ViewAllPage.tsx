import { useParams } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";

const ViewAllPage = () => {
  const { category } = useParams<{ category: string }>();

  let apilink = "";
  let pagename = "";
  let mediaType: "movie" | "tv" = "movie";

  switch (category) {
    // Movies
    case "trending":
      apilink = "/api/movies/trending";
      pagename = "Trending Movies";
      break;
    case "popular":
      apilink = "/api/movies/popular";
      pagename = "Popular Movies";
      break;
    case "top-rated":
      apilink = "/api/movies/top-rated";
      pagename = "Top Rated Movies";
      break;
    case "indian":
      apilink = "/api/movies/indian";
      pagename = "Indian Movies";
      break;
    case "random":
        apilink = "/api/movies/random";
        pagename = "Recommendations";
        break;

    // TV Shows
    case "tv-popular":
      apilink = "/api/tv/popular";
      pagename = "Popular TV Shows";
      mediaType = "tv";
      break;
    case "tv-top-rated":
      apilink = "/api/tv/top-rated";
      pagename = "Top Rated TV Shows";
      mediaType = "tv";
      break;
      
    default:
      apilink = "/api/movies/popular";
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
