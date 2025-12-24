import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Volume2, VolumeX, Trash2 } from "lucide-react";

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  media_type?: "movie" | "tv";
}



interface MovieGridProps {
  apilink: string;
  pagename: string;
  enableInfiniteScroll?: boolean;
  mediaType?: "movie" | "tv";
}

const SkeletonCard = () => {
  return (
    <div className="animate-pulse rounded-lg overflow-hidden bg-gray-800 h-[250px] w-full">
      <div className="h-full w-full bg-gray-700"></div>
    </div>
  );
};

export const MovieCard = ({ movie, onRemove, mediaType = "movie" }: { movie: Movie; onRemove?: (id: number) => void, mediaType?: "movie" | "tv" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [extraInfo, setExtraInfo] = useState<{ runtime: number; year: string; genres: string[]; seasons?: number } | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsHovered(true);
      fetchHoverData();
    }, 800); // Slightly faster than 1s for snappier feel
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  const fetchHoverData = async () => {
    if (trailerKey || extraInfo) return; // Already fetched
    // Use movie.media_type if available (from multi-search), otherwise fall back to prop
    const effectiveMediaType = movie.media_type || mediaType;
    try {
      const endpoint = effectiveMediaType === "tv" ? "tv" : "movies";
      const res = await fetch(`/api/${endpoint}/${movie.id}/hover`);
      if (res.ok) {
        const data = await res.json();
        setTrailerKey(data.key);
        setExtraInfo({
          runtime: data.runtime,
          year: data.release_date ? data.release_date.split('-')[0] : (data.first_air_date ? data.first_air_date.split('-')[0] : ''),
          genres: (data.genres || []).slice(0, 3).map((g: any) => g.name),
          seasons: data.seasons 
        });
      }
    } catch (err) {
      console.error("Failed to fetch hover data", err);
    }
  };

  const effectiveMediaType = movie.media_type || mediaType;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-xl bg-gray-900 transition-all duration-500 ease-in-out ${
        isHovered ? "z-50 scale-125 shadow-2xl lg:scale-125 translate-y-[-10px]" : "z-10 hover:scale-105"
      }`}
    >
        <NavLink to={effectiveMediaType === 'tv' ? `/tv/${movie.id}` : `/${movie.id}`} className="block h-full w-full">
          <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-800 relative">
            {/* Show Trailer if hovered and key exists */}
            {isHovered && trailerKey ? (
            <div className="absolute inset-0 bg-black">
                <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&loop=1&playlist=${trailerKey}`}
                title={movie.title || movie.name}
                className="h-full w-full object-cover scale-150" // Scale up to hide black bars
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{ pointerEvents: "none" }} // Pass clicks through to NavLink
                />
                 {/* Mute Toggle */}
                 <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                    }}
                    className="absolute top-2 right-2 z-30 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors cursor-pointer pointer-events-auto"
                 >
                    {isMuted ? <VolumeX size={14} className="text-white" /> : <Volume2 size={14} className="text-white" />}
                 </button>
            </div>
            ) : (
                // Standard Poster
                <>
                {movie.poster_path ? (
                    <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    className="h-full w-full object-cover transition-transform duration-500"
                    loading="lazy"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-500 p-4 text-center text-sm">
                    No Image
                    </div>
                )}
                </>
            )}

            {/* Remove Button (Only if onRemove provided) */}
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(movie.id);
                    }}
                    className="absolute top-2 right-2 z-40 p-2 bg-red-600/80 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Remove"
                >
                    <Trash2 size={16} />
                </button>
            )}

            {/* Expanded Info Overlay on Hover */}
            {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent flex flex-col justify-end p-4 pointer-events-none">
                    <h3 className="text-white text-sm font-bold truncate mb-1 text-shadow-md">
                        {movie.title || movie.name}
                    </h3>
                    
                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-300 font-medium mb-1">
                        <span className="text-green-400 font-bold">
                            {movie.vote_average ? `${Math.round(movie.vote_average * 10)}% Match` : 'New'}
                        </span>
                        {extraInfo?.year && <span>{extraInfo.year}</span>}
                        {extraInfo?.runtime ? <span>{extraInfo.runtime}m</span> : null}
                        {extraInfo?.seasons ? <span>{extraInfo.seasons} Seasons</span> : null}
                        <span className="border border-gray-500 px-1 rounded text-[9px]">HD</span>
                    </div>

                    {/* Genres Row */}
                    {extraInfo?.genres && extraInfo.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                            {extraInfo.genres.map((genre, i) => (
                                <span key={i} className="text-[9px] text-gray-400">
                                    {genre}{i < extraInfo.genres.length - 1 ? " • " : ""}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Genres (Implicitly from overview or similar style) or Synopsis */}
                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                        {movie.overview || "No details available."}
                    </p>
                </div>
            )}
           </div>

          {/* Standard Title Bar (Hidden on hover) */}
          <div className={`p-2 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100 absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-3'}`}>
            <p className="text-white text-xs font-medium truncate">{movie.title || movie.name}</p>
          </div>
      </NavLink>
    </div>
  );
};

const MovieGrid: React.FC<MovieGridProps> = ({ apilink, pagename, enableInfiniteScroll = false, mediaType = "movie" }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  // Initial Fetch
  useEffect(() => {
    const fetchInitialMovies = async () => {
      try {
        setLoading(true);
        // If apilink includes 'random', it likely returns a single object and doesn't support pagination in the same way,
        // but let's just append page=1 to be safe for others.
        // NOTE: The random endpoint ignores page param anyway.
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
            // Handle single movie response (e.g. Random route)
             // @ts-ignore
            results = [data];
        }

        setMovies(results);
        setHasMore(!!(data.total_pages && data.total_pages > 1));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMovies();
    setPage(1); // Reset page on new apilink
  }, [apilink]);

  // Infinite Scroll Fetch
  const loadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const separator = apilink.includes("?") ? "&" : "?";
      const res = await fetch(`${apilink}${separator}page=${nextPage}`);
      
      if (!res.ok) {
         if (res.status === 429) {
             console.warn("Rate limited, slowing down...");
             // Optionally wait or just stop
             setHasMore(false); // Stop trying for now
         }
         throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      const newMovies = data.results || [];

      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        // Filter out duplicates to be safe
        setMovies((prev) => {
            const existingKeys = new Set(prev.map(m => `${m.id}-${m.media_type || 'movie'}`));
            const uniqueNew = newMovies.filter((m: Movie) => !existingKeys.has(`${m.id}-${m.media_type || 'movie'}`));
            return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
      }
    } catch (err) {
        console.error("Failed to load more", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
            loadMore();
        }
      },
      { threshold: 0.1 } // Trigger when even slightly visible
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [enableInfiniteScroll, hasMore, page, loading]); 

  return (
    <div className="relative z-10">
      <h2 className="text-xl md:text-2xl text-white font-semibold mb-6 px-1 flex items-center gap-2">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        {pagename}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
        {movies.map((movie) => (
            <MovieCard key={`${movie.id}-${movie.media_type || 'movie'}`} movie={movie} mediaType={mediaType} />
        ))}
        {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>

     {/* Infinite Scroll Trigger */}
     {enableInfiniteScroll && hasMore && (
        <div ref={observerTarget} className="h-20 w-full flex items-center justify-center p-4">
             {!loading && <div className="text-gray-500 text-sm">Loading more...</div>}
        </div>
     )}
    </div>
  );
};

export default MovieGrid;
