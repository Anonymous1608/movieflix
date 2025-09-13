import {
  useEffect,
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { NavLink } from "react-router-dom";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
};

const Searchpage = () => {
  const [movieName, setMovieName] = useState<string>("");
  const [movies, setMoviesData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Load trending by default
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = () => {
    setLoading(true);
    fetch("/api/top_rated")
      .then((res) => res.json())
      .then((data) => {
        setMoviesData(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trending movies:", error);
        setLoading(false);
      });
  };

  const fetchMovies = (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    fetch(`/api/search/?name=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setMoviesData(data.results || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMovieName(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (value.trim()) fetchMovies(value);
      else fetchTrendingMovies(); // fallback to trending if cleared
    }, 500);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchMovies(movieName);
  };

  return (
    <div className="bg-gradient-to-b from-black to-slate-950 min-h-screen">
      <div className="flex flex-col items-center p-10 space-y-8">
        <h1 className="text-3xl font-bold text-white">Search Movies</h1>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter Movie Name"
            onChange={handleInputChange}
            value={movieName}
            className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 pr-10 
            placeholder-gray-400 text-white focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="text-lg text-gray-300 animate-pulse">
            Loading movies...
          </div>
        </div>
      ) : movies.length === 0 ? (
        <div className="flex justify-center p-10">
          <div className="text-lg text-gray-400">No movies found</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pb-8 p-4">
          {movies.map((movie) => (
            <NavLink key={movie.id} to={`/${movie.id}`}>
              <div className="transform transition-transform duration-200 hover:scale-105">
                <div className="rounded-lg overflow-hidden">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="h-auto"
                    />
                  ) : (
                    <div className="bg-gray-700 text-gray-400 h-64 flex items-center justify-center text-center text-sm rounded-lg">
                      No Image
                    </div>
                  )}
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default Searchpage;
