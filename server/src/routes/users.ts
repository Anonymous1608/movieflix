import express from "express";
import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { getApiOptions } from "../utils/tmdb.js";

const router = express.Router();

// Get user profile
router.get("/profile", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user!.id).select("-password");
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const reviews = await Review.find({ userId: user._id }).limit(10);
    const reviewCount = await Review.countDocuments({ userId: user._id });

    // Helper to fetch movie details
    const { BASE_URL, options } = getApiOptions();
    
    const fetchMovieDetails = async (ids: number[]) => {
      return Promise.all(
        ids.map(async (id) => {
          try {
            const res = await fetch(`${BASE_URL}/movie/${id}`, options);
            if (!res.ok) return null;
            const data = await res.json();
            return {
              id: data.id,
              title: data.title,
              poster_path: data.poster_path,
            };
          } catch {
            return null;
          }
        })
      ).then((results) => results.filter((m) => m !== null));
    };

    const fetchTVDetails = async (ids: number[]) => {
      return Promise.all(
        ids.map(async (id) => {
          try {
            const res = await fetch(`${BASE_URL}/tv/${id}`, options);
            if (!res.ok) return null;
            const data = await res.json();
            return {
              id: data.id,
              title: data.name, // Display name as title for consistency in frontend
              poster_path: data.poster_path,
            };
          } catch {
            return null;
          }
        })
      ).then((results) => results.filter((m) => m !== null));
    };

    const [watchlistMovies, favoritesMovies, watchlistTV, favoritesTV] = await Promise.all([
      fetchMovieDetails(user.watchlist),
      fetchMovieDetails(user.favorites),
      fetchTVDetails(user.watchlistTV || []),
      fetchTVDetails(user.favoritesTV || []),
    ]);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        watchlist: watchlistMovies,
        favorites: favoritesMovies,
        watchlistTV: watchlistTV,
        favoritesTV: favoritesTV,
        preferences: user.preferences,
        reviewCount,
        createdAt: user.createdAt,
      },
      recentReviews: reviews,
    });
  } catch (error) {
    next(error);
  }
});

// Add to watchlist
router.post(
  "/watchlist/:movieId",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const movieId = parseInt(req.params.movieId);
      if (isNaN(movieId)) {
        throw new AppError("Invalid movie ID", 400);
      }

      const user = await User.findById(req.user!.id);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (!user.watchlist.includes(movieId)) {
        user.watchlist.push(movieId);
        await user.save();
      }

      res.json({ message: "Added to watchlist", watchlist: user.watchlist });
    } catch (error) {
      next(error);
    }
  }
);

// Remove from watchlist
router.delete(
  "/watchlist/:movieId",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const movieId = parseInt(req.params.movieId);
      if (isNaN(movieId)) {
        throw new AppError("Invalid movie ID", 400);
      }

      const user = await User.findById(req.user!.id);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      user.watchlist = user.watchlist.filter((id) => id !== movieId);
      await user.save();

      res.json({
        message: "Removed from watchlist",
        watchlist: user.watchlist,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Add to favorites
router.post(
  "/favorites/:movieId",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const movieId = parseInt(req.params.movieId);
      if (isNaN(movieId)) {
        throw new AppError("Invalid movie ID", 400);
      }

      const user = await User.findById(req.user!.id);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (!user.favorites.includes(movieId)) {
        user.favorites.push(movieId);
        await user.save();
      }

      res.json({ message: "Added to favorites", favorites: user.favorites });
    } catch (error) {
      next(error);
    }
  }
);

// Remove from favorites
router.delete(
  "/favorites/:movieId",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const movieId = parseInt(req.params.movieId);
      if (isNaN(movieId)) {
        throw new AppError("Invalid movie ID", 400);
      }

      const user = await User.findById(req.user!.id);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      user.favorites = user.favorites.filter((id) => id !== movieId);
      await user.save();

      res.json({
        message: "Removed from favorites",
        favorites: user.favorites,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Add to watchlist TV
router.post(
  "/watchlist/tv/:tvId",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const tvId = parseInt(req.params.tvId);
      if (isNaN(tvId)) {
        throw new AppError("Invalid TV ID", 400);
      }

      const user = await User.findById(req.user!.id);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (!user.watchlistTV.includes(tvId)) {
        user.watchlistTV.push(tvId);
        await user.save();
      }

      res.json({ message: "Added to TV watchlist", watchlistTV: user.watchlistTV });
    } catch (error) {
      next(error);
    }
  }
);

// Remove from watchlist TV
router.delete(
  "/watchlist/tv/:tvId",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const tvId = parseInt(req.params.tvId);
      if (isNaN(tvId)) {
        throw new AppError("Invalid TV ID", 400);
      }

      const user = await User.findById(req.user!.id);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      user.watchlistTV = user.watchlistTV.filter((id) => id !== tvId);
      await user.save();

      res.json({
        message: "Removed from TV watchlist",
        watchlistTV: user.watchlistTV,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Add to favorites TV
router.post(
  "/favorites/tv/:tvId",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const tvId = parseInt(req.params.tvId);
      if (isNaN(tvId)) {
        throw new AppError("Invalid TV ID", 400);
      }

      const user = await User.findById(req.user!.id);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (!user.favoritesTV.includes(tvId)) {
        user.favoritesTV.push(tvId);
        await user.save();
      }

      res.json({ message: "Added to TV favorites", favoritesTV: user.favoritesTV });
    } catch (error) {
      next(error);
    }
  }
);

// Remove from favorites TV
router.delete(
  "/favorites/tv/:tvId",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const tvId = parseInt(req.params.tvId);
      if (isNaN(tvId)) {
        throw new AppError("Invalid TV ID", 400);
      }

      const user = await User.findById(req.user!.id);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      user.favoritesTV = user.favoritesTV.filter((id) => id !== tvId);
      await user.save();

      res.json({
        message: "Removed from TV favorites",
        favoritesTV: user.favoritesTV,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update preferences
router.put(
  "/preferences",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { favoriteGenres, favoriteActors } = req.body;

      const user = await User.findById(req.user!.id);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (favoriteGenres) {
        user.preferences.favoriteGenres = favoriteGenres;
      }
      if (favoriteActors) {
        user.preferences.favoriteActors = favoriteActors;
      }

      await user.save();

      res.json({
        message: "Preferences updated",
        preferences: user.preferences,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
