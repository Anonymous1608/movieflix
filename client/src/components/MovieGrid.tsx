import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

interface ApiResponse {
  results: Movie[];
}

interface MovieGridProps {
  apilink: string;
  pagename: string;
}

const SkeletonCard = () => {
  return (
    <div className="animate-pulse rounded-lg overflow-hidden bg-gray-800 h-[250px] w-full">
      <div className="h-full w-full bg-gray-700"></div>
    </div>
  );
};

const MovieGrid: React.FC<MovieGridProps> = ({ apilink, pagename }) => {
  const [movies, setMoviesData] = useState<ApiResponse>({ results: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(apilink)
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        setMoviesData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      });
  }, [apilink]);

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 px-4 md:px-12 pt-8">
        <h2 className="text-[4vw] md:text-[2.3vw] text-white font-bold mb-4 md:p-3">
          {pagename}
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-8">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.results.map((movie) => (
                <NavLink key={movie.id} to={`/${movie.id}`}>
                  <div className="transform transition-transform duration-200 hover:scale-105">
                    <div className="rounded-lg overflow-hidden">
                      {movie.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                          alt={movie.title}
                          className="h-auto"
                        />
                      )}
                    </div>
                  </div>
                </NavLink>
              ))}
        </div>
      </div>
    </div>
  );
};

export default MovieGrid;
