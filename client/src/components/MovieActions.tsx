import { useState, useEffect } from "react";
import { Heart, Bookmark } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { api } from "../utils/api";

interface MovieActionsProps {
  movieId: number;
  userWatchlist?: number[];
  userFavorites?: number[];
}

const MovieActions = ({
  movieId,
  userWatchlist = [],
  userFavorites = [],
}: MovieActionsProps) => {
  const { user } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(
    userWatchlist.includes(movieId)
  );
  const [isInFavorites, setIsInFavorites] = useState(
    userFavorites.includes(movieId)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsInWatchlist(userWatchlist.includes(movieId));
    setIsInFavorites(userFavorites.includes(movieId));
  }, [movieId, userWatchlist, userFavorites]);

  const handleWatchlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isInWatchlist) {
        await api.removeFromWatchlist(movieId);
        setIsInWatchlist(false);
      } else {
        await api.addToWatchlist(movieId);
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error("Failed to update watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isInFavorites) {
        await api.removeFromFavorites(movieId);
        setIsInFavorites(false);
      } else {
        await api.addToFavorites(movieId);
        setIsInFavorites(true);
      }
    } catch (error) {
      console.error("Failed to update favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={handleWatchlist}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isInWatchlist
            ? "bg-blue-600 text-white"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        <Bookmark size={20} fill={isInWatchlist ? "currentColor" : "none"} />
        {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
      </button>

      <button
        onClick={handleFavorites}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isInFavorites
            ? "bg-red-600 text-white"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        <Heart size={20} fill={isInFavorites ? "currentColor" : "none"} />
        {isInFavorites ? "Favorited" : "Add to Favorites"}
      </button>
    </div>
  );
};

export default MovieActions;
