import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { api } from "../utils/api";
import { Star, Heart, Bookmark } from "lucide-react";

import { MovieCard } from "../components/MovieGrid";
import type { Movie } from "../components/MovieGrid";
// Remove duplicate import line if present from previous failed/partial edits or just clean up


interface ProfileData {
  user: {
    id: string;
    username: string;
    email: string;
    watchlist: Movie[];
    favorites: Movie[];
    watchlistTV: Movie[];
    favoritesTV: Movie[];
    reviewCount: number;
    createdAt: string;
  };
  recentReviews: Array<{
    movieId: number;
    rating: number;
    comment: string;
  }>;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchProfile();
  }, []);

  const handleRemoveWatchlist = async (movieId: number) => {
    try {
      await api.removeFromWatchlist(movieId);
      setProfileData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          user: {
            ...prev.user,
            watchlist: prev.user.watchlist.filter((m) => m.id !== movieId),
          },
        };
      });
      toast.success("Removed from watchlist");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove from watchlist");
    }
  };

  const handleRemoveWatchlistTV = async (tvId: number) => {
    try {
      await api.removeFromWatchlistTV(tvId);
      setProfileData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          user: {
            ...prev.user,
            watchlistTV: prev.user.watchlistTV.filter((m) => m.id !== tvId),
          },
        };
      });
      toast.success("Removed from TV watchlist");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove from TV watchlist");
    }
  };

  const handleRemoveFavorites = async (movieId: number) => {
    try {
      await api.removeFromFavorites(movieId);
      setProfileData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          user: {
            ...prev.user,
            favorites: prev.user.favorites.filter((m) => m.id !== movieId),
          },
        };
      });
      toast.success("Removed from favorites");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove from favorites");
    }
  };

  const handleRemoveFavoritesTV = async (tvId: number) => {
    try {
      await api.removeFromFavoritesTV(tvId);
      setProfileData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          user: {
            ...prev.user,
            favoritesTV: prev.user.favoritesTV.filter((m) => m.id !== tvId),
          },
        };
      });
      toast.success("Removed from TV favorites");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove from TV favorites");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-white max-w-6xl mx-auto px-8 py-18">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">Welcome back, {user?.username}!</p>
        </div>

        {profileData && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Bookmark className="h-6 w-6 text-blue-400" />
                  <h3 className="text-xl font-semibold">Watchlist</h3>
                </div>
                <p className="text-3xl font-bold">
                  {(profileData.user.watchlist?.length || 0) + (profileData.user.watchlistTV?.length || 0)}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-6 w-6 text-red-400" />
                  <h3 className="text-xl font-semibold">Favorites</h3>
                </div>
                <p className="text-3xl font-bold">
                  {(profileData.user.favorites?.length || 0) + (profileData.user.favoritesTV?.length || 0)}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold">Reviews</h3>
                </div>
                <p className="text-3xl font-bold">
                  {profileData.user.reviewCount}
                </p>
              </div>
            </div>

            {/* Watchlist & Favorites */}
            <div className="space-y-8">
              {/* Watchlist */}
              {/* Watchlist */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Bookmark className="text-blue-400" /> Watchlist
                </h2>
                
                {/* Movies */}
                <h3 className="text-xl font-medium mb-3 text-gray-300">Movies</h3>
                {profileData.user.watchlist.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                    {profileData.user.watchlist.map((movie) => (
                      <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        onRemove={handleRemoveWatchlist}
                        mediaType="movie"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 mb-6">No movies in watchlist</p>
                )}

                {/* TV Shows */}
                <h3 className="text-xl font-medium mb-3 text-gray-300">TV Shows</h3>
                {profileData.user.watchlistTV && profileData.user.watchlistTV.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {profileData.user.watchlistTV.map((tv) => (
                      <MovieCard 
                        key={tv.id} 
                        movie={tv} 
                        onRemove={handleRemoveWatchlistTV}
                        mediaType="tv"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No TV shows in watchlist</p>
                )}
              </div>

              {/* Favorites */}
              {/* Favorites */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="text-red-400" /> Favorites
                </h2>

                {/* Movies */}
                <h3 className="text-xl font-medium mb-3 text-gray-300">Movies</h3>
                {profileData.user.favorites.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                    {profileData.user.favorites.map((movie) => (
                      <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        onRemove={handleRemoveFavorites}
                        mediaType="movie"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 mb-6">No favorite movies</p>
                )}

                {/* TV Shows */}
                <h3 className="text-xl font-medium mb-3 text-gray-300">TV Shows</h3>
                {profileData.user.favoritesTV && profileData.user.favoritesTV.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {profileData.user.favoritesTV.map((tv) => (
                      <MovieCard 
                        key={tv.id} 
                        movie={tv} 
                        onRemove={handleRemoveFavoritesTV}
                        mediaType="tv"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No favorite TV shows</p>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Account Information
              </h2>
              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {profileData.user.email}
                </p>
                <p>
                  <span className="font-semibold">Member since:</span>{" "}
                  {new Date(profileData.user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={logout}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
