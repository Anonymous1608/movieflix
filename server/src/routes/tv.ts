import express from "express";
import { optionalAuth } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { getApiOptions } from "../utils/tmdb.js";

const router = express.Router();

// Search TV shows
router.get("/search", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const query = req.query.name as string;
    const pageNumber = (req.query.page as string) || "1";

    if (!query) {
      throw new AppError("Query is required", 400);
    }

    const url = `${BASE_URL}/search/tv?query=${encodeURIComponent(
      query
    )}&page=${pageNumber}`;

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new AppError("Failed to fetch tv shows", response.status);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get popular TV shows
router.get("/popular", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const page = (req.query.page as string) || "1";
    const response = await fetch(
      `${BASE_URL}/tv/popular?language=en-US&page=${page}`,
      options
    );
    if (!response.ok) {
      throw new AppError("Failed to fetch popular tv shows", response.status);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get top rated TV shows
router.get("/top-rated", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const page = (req.query.page as string) || "1";
    const response = await fetch(
      `${BASE_URL}/tv/top_rated?language=en-US&page=${page}`,
      options
    );
    if (!response.ok) {
      throw new AppError("Failed to fetch top rated tv shows", response.status);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get TV show details
router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const id = req.params.id;
    if (!id) {
      throw new AppError("ID is required", 400);
    }

    const response = await fetch(`${BASE_URL}/tv/${id}`, options);
    if (!response.ok) {
      throw new AppError("TV show not found", response.status);
    }
    const details = await response.json();

    // Fetch credits
    const creditsResponse = await fetch(
      `${BASE_URL}/tv/${id}/credits`,
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

    details.cast = transformedCast;

    // Fetch streaming providers
    const streamingResponse = await fetch(
      `${BASE_URL}/tv/${id}/watch/providers`,
      options
    );
    if (streamingResponse.ok) {
      const streamingData = await streamingResponse.json();
      details.stream = streamingData.results?.US ?? {};
    }

    res.json(details);
  } catch (error) {
    next(error);
  }
});

// Get TV Season Details (Episodes)
router.get("/:id/season/:seasonNumber", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const { id, seasonNumber } = req.params;

    const response = await fetch(
      `${BASE_URL}/tv/${id}/season/${seasonNumber}`,
      options
    );
    
    if (!response.ok) {
      throw new AppError("Season not found", response.status);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get tv hover data
router.get("/:id/hover", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const id = req.params.id;

    const [videosRes, detailsRes] = await Promise.all([
      fetch(`${BASE_URL}/tv/${id}/videos?language=en-US`, options),
      fetch(`${BASE_URL}/tv/${id}`, options),
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
    let first_air_date = "";
    let genres: { id: number; name: string }[] = [];
    let seasons = 0;
    
    if (detailsRes.ok) {
      const details = await detailsRes.json();
      runtime = details.episode_run_time?.[0] || 0;
      first_air_date = details.first_air_date || "";
      genres = details.genres || [];
      seasons = details.number_of_seasons || 0;
    }

    res.json({ key, runtime, first_air_date, genres, seasons });
  } catch (error) {
    next(error);
  }
});

// Get TV show trailer
router.get("/:id/trailer", optionalAuth, async (req, res, next) => {
  try {
    const { BASE_URL, options } = getApiOptions();
    const id = req.params.id;

    const response = await fetch(
      `${BASE_URL}/tv/${id}/videos?language=en-US`,
      options
    );

    if (!response.ok) {
        res.json({ key: null });
        return;
    }

    const data = await response.json();
    const results = data.results || [];
    
    const trailer = results.find(
      (v: any) => v.site === "YouTube" && v.type === "Trailer"
    );
    const fallback = results.find((v: any) => v.site === "YouTube");

    res.json({ key: trailer?.key || fallback?.key || null });
  } catch (error) {
    next(error);
  }
});

export default router;
