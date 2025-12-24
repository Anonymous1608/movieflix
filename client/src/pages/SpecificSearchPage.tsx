import { useParams } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";

const SpecificSearchPage = () => {
  const { moviename } = useParams<{ moviename: string }>();
  const API_BASE = import.meta.env.VITE_API_URL;

  return (
    <div className="min-h-screen text-white bg-black pt-20">
      <div className="px-4 md:px-12 pt-8">
        <div className="space-y-12">
          <MovieGrid 
              apilink={`${API_BASE}/api/search/multi?query=${encodeURIComponent(moviename || "")}`}
              pagename={`Results for: ${moviename}`} 
              enableInfiniteScroll={true}
              // No explicit mediaType, let the grid handle it from results
          />
        </div>
      </div>
    </div>
  );
};

export default SpecificSearchPage;
