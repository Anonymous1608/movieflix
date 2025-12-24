import express from "express";
import { optionalAuth } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { getApiOptions } from "../utils/tmdb.js";

const router = express.Router();

// Search Multi (Movies + TV)
router.get("/multi", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const query = req.query.query as string;
    const pageNumber = (req.query.page as string) || "1";

    if (!query) {
      throw new AppError("Query is required", 400);
    }

    const url = `${BASE_URL}/search/multi?query=${encodeURIComponent(
      query
    )}&page=${pageNumber}&include_adult=false`;

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new AppError("Failed to search", response.status);
    }
    const data = await response.json();
    
    // Filter out 'person' results
    const results = (data.results || [])
        .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
        .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));
    
    res.json({
        ...data,
        results
    });
  } catch (error) {
    next(error);
  }
});

export default router;
