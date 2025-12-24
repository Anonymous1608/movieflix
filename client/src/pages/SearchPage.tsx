import {
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import MovieGrid from "../components/MovieGrid";

const Searchpage = () => {
  const [movieName, setMovieName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>(""); // Actively displayed matches
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMovieName(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
        setSearchQuery(value.trim()); // Update query triggers MovieGrid to re-fetch
    }, 500);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchQuery(movieName.trim());
  };

  return (
    <div className="bg-gradient-to-b from-black to-slate-950 min-h-screen pt-24 text-white">
      <div className="flex flex-col items-center p-10 space-y-8">
        <h1 className="text-3xl font-bold text-white">Search Movies</h1>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Search movies or tv shows"
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

      <div className="px-4 md:px-12">
        <div className="space-y-12">
          {searchQuery ? (
             <MovieGrid 
                apilink={`${API_BASE}/api/search/multi?query=${encodeURIComponent(searchQuery)}`}
                pagename={`Results for: ${searchQuery}`}
                enableInfiniteScroll={true}
                // No explicit mediaType, let the grid handle it from results
            />
          ) : (
            <div className="space-y-12">
                <MovieGrid 
                    apilink={`${API_BASE}/api/movies/top-rated`}
                    pagename="Trending Movies"
                    enableInfiniteScroll={false}
                    mediaType="movie"
                />
                 <MovieGrid 
                    apilink="/api/tv/top-rated"
                    pagename="Trending TV Shows" 
                    enableInfiniteScroll={false}
                    mediaType="tv"
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Searchpage;
