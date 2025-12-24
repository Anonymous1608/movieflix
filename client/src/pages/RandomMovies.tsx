import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

type Genre = {
  id?: number;
  name?: string;
};

type Movie = {
  id: number;
  original_title?: string;
  poster_path?: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  genres?: Genre[];
};

const RandomMovies = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomMovie = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setMovie(null);

      const response = await fetch("/api/movies/random");
      if (!response.ok) throw new Error("Failed to fetch random movie");
      const data = await response.json();

      setMovie(data);
    } catch (error) {
      console.error("Error fetching random movie:", error);
      setError("Unable to fetch a movie. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomMovie();
  }, [fetchRandomMovie]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 p-4 md:p-8 pt-24 md:pt-32 grid grid-cols-1 md:grid-cols-2">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12 md:pl-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 tracking-tight pt-4">
          Random Movie Discovery
        </h2>
        <p className="text-md md:text-lg text-gray-200 mb-10 text-wrap">
          Feeling lucky? Discover a random movie you might have never found
          otherwise.
        </p>
        <button
          onClick={fetchRandomMovie}
          disabled={loading}
          className={`group relative inline-flex items-center justify-center
            px-8 py-4 md:text-lg text-md font-medium tracking-wide text-white
            rounded-full transition duration-300 ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25"
            }`}
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>Finding your movie...</span>
            </div>
          ) : (
            <span className="relative z-10">Roll The Dice</span>
          )}
        </button>
      </div>

      {/* Movie Display */}
      <div className="max-w-7xl mx-auto flex justify-center">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center mb-8">
            {error}
          </div>
        )}

        {!loading && !error && movie && (
          <div className="w-full max-w-sm">
            <NavLink key={movie.id} to={`/${movie.id}`}>
              <div className="relative group rounded-2xl overflow-hidden transform transition duration-300 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl" />
                <div className="relative flex flex-col h-full">
                  {/* Poster */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                        alt={`${movie.original_title || "Movie"} poster`}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/api/placeholder/300/450";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                        No Poster Available
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {movie.original_title || "Unknown Title"}
                    </h2>

                    <div className="flex gap-3 mb-4">
                      {movie.release_date && (
                        <span className="px-3 py-1 bg-black/30 rounded-full text-sm text-gray-300">
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                      )}
                      {movie.vote_average !== undefined && (
                        <span className="px-3 py-1 bg-black/30 rounded-full text-sm text-yellow-400 flex items-center gap-1">
                          ★ {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {movie.overview && (
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {movie.overview}
                      </p>
                    )}

                    {movie.genres && movie.genres.length > 0 && (
                      <div className="mt-auto flex flex-wrap gap-2">
                        {movie.genres.slice(0, 3).map((genre, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-500/10 rounded-full text-sm text-blue-400"
                          >
                            {genre.name || "Unknown Genre"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomMovies;
