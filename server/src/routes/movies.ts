import express from "express";
import { optionalAuth } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";

const router = express.Router();

import { getApiOptions } from "../utils/tmdb.js";

// Search movies
router.get("/search", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const movieName = req.query.name as string;
    const pageNumber = (req.query.page as string) || "1";

    if (!movieName) {
      throw new AppError("Movie name is required", 400);
    }

    const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(
      movieName
    )}&page=${pageNumber}`;

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new AppError("Failed to fetch movies", response.status);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get trending movies
router.get("/trending", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const page = (req.query.page as string) || "1";
    const response = await fetch(
      `${BASE_URL}/trending/movie/day?page=${page}`,
      options
    );
    if (!response.ok) {
      throw new AppError("Failed to fetch trending movies", response.status);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get popular movies
router.get("/popular", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const page = (req.query.page as string) || "1";
    const response = await fetch(
      `${BASE_URL}/movie/popular?language=en-US&page=${page}`,
      options
    );
    if (!response.ok) {
      throw new AppError("Failed to fetch popular movies", response.status);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get top rated movies
router.get("/top-rated", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const page = (req.query.page as string) || "1";
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?language=en-US&page=${page}`,
      options
    );
    if (!response.ok) {
      throw new AppError("Failed to fetch top rated movies", response.status);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get Indian movies
router.get("/indian", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const page = (req.query.page as string) || "1";
    // Discover movies from India, sorted by popularity
    const response = await fetch(
      `${BASE_URL}/discover/movie?with_origin_country=IN&sort_by=popularity.desc&page=${page}`,
      options
    );
    if (!response.ok) {
      throw new AppError("Failed to fetch Indian movies", response.status);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get random movie
router.get("/random", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const trendingRes = await fetch(`${BASE_URL}/trending/movie/day`, options);
    if (!trendingRes.ok) {
      throw new AppError("Failed to fetch trending movies", trendingRes.status);
    }
    const trendingData = await trendingRes.json();
    const movies = trendingData.results;
    if (!movies || movies.length === 0) {
      throw new AppError("No trending movies found", 404);
    }

    const randomMovie = movies[Math.floor(Math.random() * movies.length)];

    const movieDetailsRes = await fetch(
      `${BASE_URL}/movie/${randomMovie.id}?language=en-US`,
      options
    );
    if (!movieDetailsRes.ok) {
      throw new AppError(
        "Failed to fetch movie details",
        movieDetailsRes.status
      );
    }
    const movieDetails = await movieDetailsRes.json();

    const creditsResponse = await fetch(
      `${BASE_URL}/movie/${randomMovie.id}/credits`,
      options
    );
    const credits = creditsResponse.ok
      ? await creditsResponse.json()
      : { cast: [] };

    const transformedCast = credits.cast.slice(0, 4).map((member: any) => ({
      id: member.id,
      name: member.name,
      profile_path: member.profile_path,
      character: member.character || "Unknown Role",
    }));

    const streamingResponse = await fetch(
      `${BASE_URL}/movie/${randomMovie.id}/watch/providers`,
      options
    );
    const streamingData = streamingResponse.ok
      ? await streamingResponse.json()
      : { results: {} };

    movieDetails.cast = transformedCast;
    movieDetails.stream = streamingData.results?.US ?? {};

    res.json(movieDetails);
  } catch (error) {
    next(error);
  }
});

// Get movies with cast info (live endpoint)
router.get("/live", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const response = await fetch(`${BASE_URL}/trending/movie/day`, options);
    if (!response.ok) {
      throw new AppError("Failed to fetch trending movies", response.status);
    }
    const data = await response.json();

    const movieWithCast = await Promise.all(
      data.results.slice(0, 10).map(async (movie: any) => {
        try {
          const data_response = await fetch(
            `${BASE_URL}/movie/${movie.id}/credits`,
            options
          );
          const moviedata = data_response.ok
            ? await data_response.json()
            : { cast: [] };

          const transformedCast = moviedata.cast
            .slice(0, 4)
            .map((member: any) => ({
              id: member.id,
              name: member.name,
              profile_path: member.profile_path,
              character: member.character || "Unknown Role",
            }));

          movie["cast"] = transformedCast;
          return movie;
        } catch (error) {
          movie["cast"] = [];
          return movie;
        }
      })
    );

    res.json(movieWithCast);
  } catch (error) {
    next(error);
  }
});

// Get movie details
router.get("/:movieId", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const movieId = req.params.movieId;
    if (!movieId) {
      throw new AppError("Movie ID is required", 400);
    }

    const response = await fetch(`${BASE_URL}/movie/${movieId}`, options);
    if (!response.ok) {
      throw new AppError("Movie not found", response.status);
    }
    const movieDetails = await response.json();

    // Fetch credits
    const creditsResponse = await fetch(
      `${BASE_URL}/movie/${movieId}/credits`,
      options
    );
    const credits = creditsResponse.ok
      ? await creditsResponse.json()
      : { cast: [] };

    const transformedCast = credits.cast.slice(0, 4).map((member: any) => ({
      id: member.id,
      name: member.name,
      profile_path: member.profile_path,
      character: member.character || "Unknown Role",
    }));

    movieDetails.cast = transformedCast;

    // Fetch streaming providers
    const streamingResponse = await fetch(
      `${BASE_URL}/movie/${movieId}/watch/providers`,
      options
    );
    if (streamingResponse.ok) {
      const streamingData = await streamingResponse.json();
      movieDetails.stream = streamingData.results?.US ?? {};
    }

    res.json(movieDetails);
  } catch (error) {
    next(error);
  }
});

// Get movie hover data (trailer + details)
router.get("/:movieId/hover", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const movieId = req.params.movieId;

    const [videosRes, detailsRes] = await Promise.all([
      fetch(`${BASE_URL}/movie/${movieId}/videos?language=en-US`, options),
      fetch(`${BASE_URL}/movie/${movieId}`, options),
    ]);

    let key = null;
    if (videosRes.ok) {
      const data = await videosRes.json();
      const results = data.results || [];
      const trailer = results.find(
        (v: any) => v.site === "YouTube" && v.type === "Trailer"
      );
      const fallback = results.find((v: any) => v.site === "YouTube");
      key = trailer?.key || fallback?.key || null;
    }

    let runtime = 0;
    let release_date = "";
    let genres: { id: number; name: string }[] = [];
    if (detailsRes.ok) {
      const details = await detailsRes.json();
      runtime = details.runtime || 0;
      release_date = details.release_date || "";
      genres = details.genres || [];
    }

    res.json({ key, runtime, release_date, genres });
  } catch (error) {
    next(error);
  }
});

// Get movie trailer
router.get("/:movieId/trailer", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const movieId = req.params.movieId;

    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?language=en-US`,
      options
    );

    if (!response.ok) {
        // If we can't find videos, just return null instead of erroring, 
        // effectively saying "no trailer available"
        res.json({ key: null });
        return;
    }

    const data = await response.json();
    const results = data.results || [];
    
    // Find the best trailer: type="Trailer" and site="YouTube"
    const trailer = results.find(
      (v: any) => v.site === "YouTube" && v.type === "Trailer"
    );
    // Fallback to any YouTube video if no specific "Trailer" found
    const fallback = results.find((v: any) => v.site === "YouTube");

    res.json({ key: trailer?.key || fallback?.key || null });
  } catch (error) {
    next(error);
  }
});

export default router;
