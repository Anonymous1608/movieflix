import { Star, Clock, Calendar, Bookmark, Heart, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import CastInfo, { type CastMember } from "../components/CastInfo";
import EpisodeSelector from "../components/EpisodeSelector";
import ReviewsSection from "../components/ReviewsSection";
import { useAuth } from "../context/useAuth";
import { api } from "../utils/api";
import toast from "react-hot-toast";

type Genre = {
  id?: number;
  name?: string;
};

type SpokenLanguage = {
  name?: string;
};

type TVDetailsType = {
  id?: number;
  name?: string;
  original_name?: string;
  genres?: Genre[];
  episode_run_time?: number[];
  vote_average?: number;
  first_air_date?: string;
  spoken_languages?: SpokenLanguage[];
  overview?: string;
  popularity?: number;
  cast?: CastMember[];
  number_of_seasons?: number;
  seasons?: Array<{
    id: number;
    season_number: number;
    name: string;
    episode_count: number;
  }>;
  stream?: {
    rent?: Array<{
      provider_name?: string;
    }>;
  };
  production_companies?: Array<{
    name?: string;
  }>;
};

const TVShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useAuth();
  
  const [tvDetails, setTvDetails] = useState<TVDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [userWatchlist, setUserWatchlist] = useState<number[]>([]);
  const [userFavorites, setUserFavorites] = useState<number[]>([]);
  
  // Episode Selection State
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api.getTVDetails(parseInt(id))
      .then((data: TVDetailsType) => {
        setTvDetails(data);
        setLoading(false);
        // Reset to S1 E1 on new show load
        setCurrentSeason(1);
        setCurrentEpisode(1);
      })
      .catch((error) => {
        console.error("Error fetching TV details:", error);
        setLoading(false);
      });
  }, [id, location.key]);

  useEffect(() => {
    if (user) {
      api.getProfile()
        .then((data) => {
          setUserWatchlist(data.user.watchlistTV || []);
          setUserFavorites(data.user.favoritesTV || []);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, [user]);

  const handleWatchlist = async () => {
    if (!tvDetails?.id) return;
    try {
      if (userWatchlist.includes(tvDetails.id)) {
        await api.removeFromWatchlistTV(tvDetails.id);
        setUserWatchlist(prev => prev.filter(id => id !== tvDetails.id));
        toast.success("Removed from Watchlist");
      } else {
        await api.addToWatchlistTV(tvDetails.id);
        setUserWatchlist(prev => [...prev, tvDetails.id!]);
        toast.success("Added to Watchlist");
      }
    } catch (error) {
      toast.error("Failed to update watchlist");
    }
  };

  const handleFavorites = async () => {
    if (!tvDetails?.id) return;
    try {
      if (userFavorites.includes(tvDetails.id)) {
        await api.removeFromFavoritesTV(tvDetails.id);
        setUserFavorites(prev => prev.filter(id => id !== tvDetails.id));
        toast.success("Removed from Favorites");
      } else {
        await api.addToFavoritesTV(tvDetails.id);
        setUserFavorites(prev => [...prev, tvDetails.id!]);
        toast.success("Added to Favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );

  if (!tvDetails) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <p>TV Show not found.</p>
      </div>
    );
  }

  const runtime = tvDetails.episode_run_time?.[0] || 0;

  return (
    <div className="min-h-screen text-white pb-20">
      {/* Hero / Player Section */}
      <div className="relative w-full pt-[56.25%] bg-black">
        {/* Dynamic Embed URL for TV Shows: /embed/tv/{tmdbId}/{season}/{episode} */}
        <iframe
          src={`https://vidsrc.xyz/embed/tv/${id}/${currentSeason}/${currentEpisode}`}
          title={tvDetails.name || "Unknown Title"}
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-6">
            <div className="w-full">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-2 leading-tight">
                {tvDetails.name || "Unknown Title"}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-purple-400 mb-5">
                {(tvDetails.genres || []).map((g, i) => (
                  <span key={i} className="bg-purple-500/10 px-3 py-1 rounded-full text-sm">
                    {g.name || "Unknown Genre"}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 w-full md:w-auto flex-shrink-0">
                <button
                    onClick={handleWatchlist}
                    className={`flex-1 md:flex-none p-3 rounded-full transition-colors flex justify-center ${
                        userWatchlist.includes(tvDetails.id!) 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                    title="Watchlist"
                >
                    <Bookmark size={24} fill={userWatchlist.includes(tvDetails.id!) ? "currentColor" : "none"} />
                </button>
                <button
                    onClick={handleFavorites}
                    className={`flex-1 md:flex-none p-3 rounded-full transition-colors flex justify-center ${
                        userFavorites.includes(tvDetails.id!) 
                            ? "bg-red-600 text-white" 
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                    title="Favorites"
                >
                    <Heart size={24} fill={userFavorites.includes(tvDetails.id!) ? "currentColor" : "none"} />
                </button>
            </div>
        </div>

        <div className="flex flex-col gap-12">
          {/* Main Content */}
          <div className="w-full space-y-12">
            
            {/* Episode Selector */}
            {tvDetails.seasons && (
                <EpisodeSelector 
                    tvId={tvDetails.id!}
                    seasons={tvDetails.seasons}
                    currentSeason={currentSeason}
                    currentEpisode={currentEpisode}
                    onSeasonChange={setCurrentSeason}
                    onEpisodeSelect={(ep) => {
                        setCurrentEpisode(ep);
                        // Scroll to top to see player
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            )}

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 text-sm bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-purple-400" />
                <span>{runtime ? `${runtime} min` : "N/A"} / ep</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={18} className="text-purple-400" />
                <span>
                  {tvDetails.vote_average
                    ? `${tvDetails.vote_average.toFixed(1)}/10 TMDb`
                    : "Rating Unavailable"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-purple-400" />
                <span>{tvDetails.first_air_date || "Unknown Date"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Video size={18} className="text-purple-400" />
                <span>{tvDetails.number_of_seasons} Seasons</span>
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Synopsis</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {tvDetails.overview || "No synopsis available."}
              </p>
            </div>

            {/* Reuse existing CastInfo - mapped to match structure if needed, or update CastInfo to be generic */}
            {/* Note: CastInfo expects MovieDetailsType, but structures are similar enough or we can cast */}
             {/* @ts-ignore */}
            <CastInfo movieDetails={tvDetails} />

            {/* Reviews Section */}
            {tvDetails.id && <ReviewsSection movieId={tvDetails.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShowDetails;
