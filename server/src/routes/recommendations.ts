import express from "express";
import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import { authenticate, AuthRequest, optionalAuth } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";

const router = express.Router();

// Get personalized recommendations
router.get("/", optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const BASE_URL = process.env.BASE_URL || "https://api.themoviedb.org/3";
    const API_KEY = process.env.API_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    let recommendations: any[] = [];

    if (req.user) {
      // Personalized recommendations based on user preferences
      const user = await User.findById(req.user.id);
      if (user && user.preferences.favoriteGenres.length > 0) {
        const genreId = user.preferences.favoriteGenres[0];
        const response = await fetch(
          `${BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`,
          options
        );
        const data = await response.json();
        recommendations = data.results?.slice(0, 10) || [];
      }
    }

    // If no personalized recommendations, get trending
    if (recommendations.length === 0) {
      const response = await fetch(`${BASE_URL}/trending/movie/day`, options);
      const data = await response.json();
      recommendations = data.results?.slice(0, 10) || [];
    }

    res.json({ recommendations });
  } catch (error) {
    next(error);
  }
});

// Get recommendations based on similar movies
router.get("/similar/:movieId", async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.movieId);
    if (isNaN(movieId)) {
      throw new AppError("Invalid movie ID", 400);
    }

    const BASE_URL = process.env.BASE_URL || "https://api.themoviedb.org/3";
    const API_KEY = process.env.API_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/similar`,
      options
    );
    const data = await response.json();

    res.json({ recommendations: data.results?.slice(0, 10) || [] });
  } catch (error) {
    next(error);
  }
});

export default router;
