import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import { MovieCard, type Movie } from "./MovieGrid";

interface MovieSliderProps {
  apilink: string;
  pagename: string;
  category: string; // url slug for view-all
  mediaType?: "movie" | "tv";
}

const MovieSlider: React.FC<MovieSliderProps> = ({
  apilink,
  pagename,
  category,
  mediaType = "movie",
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Fetch (Only Page 1)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const separator = apilink.includes("?") ? "&" : "?";
        const res = await fetch(`${apilink}${separator}page=1`);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();

        let results: Movie[] = [];
        if (Array.isArray(data)) {
          results = data;
        } else if (data.results) {
          results = data.results;
        } else if (data.id) {
          // @ts-ignore
          results = [data];
        }

        // Limit slider to 20 items max
        setMovies(results.slice(0, 20));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [apilink]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -500 : 500;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/slider">
     <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl md:text-2xl text-white font-semibold flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            {pagename}
        </h2>
        <Link 
            to={`/view-all/${category}`} 
            className="text-xs md:text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors group/link"
        >
            View All 
            <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
     </div>


      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 rounded-l-lg hidden md:flex"
        >
          <ChevronRight size={32} className="text-white rotate-180" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-8 pt-4 px-2 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-[160px] md:w-[200px] h-[240px] md:h-[300px] bg-gray-800 rounded-xl animate-pulse"
                ></div>
              ))
            : movies.map((movie) => (
                <div key={movie.id} className="flex-none w-[160px] md:w-[200px] snap-start">
                  <MovieCard movie={movie} mediaType={mediaType} />
                </div>
              ))}

            {/* View All Card at the End */}
             {!loading && (
                <div className="flex-none w-[160px] md:w-[200px] snap-start flex flex-col items-center justify-center">
                    <Link 
                        to={`/view-all/${category}`} 
                        className="group flex flex-col items-center justify-center h-full aspect-[2/3] w-full rounded-full border-2 border-gray-700 hover:border-gray-500 transition-colors"
                    >
                        <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                             <ArrowRight size={24} className="text-white" />
                        </div>
                        <span className="mt-4 text-sm font-medium text-gray-400 group-hover:text-white transition-colors">View All Movies</span>
                    </Link>
                </div>
             )}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 rounded-r-lg hidden md:flex"
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default MovieSlider;
