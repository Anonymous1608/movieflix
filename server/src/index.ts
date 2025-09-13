import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const API_KEY = process.env.API_KEY;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/api/search", async (req: Request, res: Response) => {
  try {
    const movieName = req.query.name as string;
    const pageNumber = req.query.pageNumber;

    if (!movieName) {
      res.status(400).json({ error: "Movie name is required" });
      return;
    }

    const url = pageNumber
      ? `${BASE_URL}/search/movie?query=${encodeURIComponent(
          movieName
        )}&page=${pageNumber}`
      : `${BASE_URL}/search/movie?query=${encodeURIComponent(movieName)}`;

    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

app.get("/api/trending", async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/day`, options);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
});

app.get(
  "/api/moviedetails",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const movieid = req.query.movieid as string;
      if (!movieid) {
        res.status(400).json({ error: "Movie ID is required" });
        return;
      }

      const response = await fetch(`${BASE_URL}/movie/${movieid}`, options);
      if (!response.ok) throw new Error("Movie not found");
      const movieDetails = await response.json();

      const creditsResponse = await fetch(
        `${BASE_URL}/movie/${movieid}/credits`,
        options
      );
      const credits = await creditsResponse.json();

      const transformedCast = credits.cast.slice(0, 4).map((member: any) => ({
        id: member.id,
        name: member.name,
        profile_path: member.profile_path,
        character: member.character || "Unknown Role",
      }));

      movieDetails.cast = transformedCast;

      const streamingResponse = await fetch(
        `${BASE_URL}/movie/${movieid}/watch/providers`,
        options
      );
      if (!streamingResponse.ok)
        throw new Error("Streaming services not found");
      const streamingData = await streamingResponse.json();

      movieDetails.cast = credits.cast.slice(0, 3);
      movieDetails.stream = streamingData.results?.US ?? {};
      res.json(movieDetails);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      res.status(500).json({ error: "Failed to fetch movie details" });
    }
  }
);

app.get("/api/live", async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/day`, options);
    const data = await response.json();

    const movieWithCast = await Promise.all(
      data.results.map(async (movie: any) => {
        const data_response = await fetch(
          `${BASE_URL}/movie/${movie.id}/credits`,
          options
        );
        const moviedata = await data_response.json();

        const transformedCast = moviedata.cast
          .slice(0, 4)
          .map((member: any) => ({
            id: member.id,
            name: member.name,
            profile_path: member.profile_path,
            character: member.character || "Unknown Role", // 👈 Added role here
          }));

        movie["cast"] = transformedCast;
        return movie;
      })
    );

    res.json(movieWithCast);
  } catch (error) {
    console.error("Error in live endpoint:", error);
    res.status(500).json({ error: "Failed to fetch live data" });
  }
});

app.get("/api/top_rated", async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?language=en-US&page=1`,
      options
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    res.status(500).json({ error: "Failed to fetch top rated movies" });
  }
});

app.get("/api/popular", async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?language=en-US&page=1`,
      options
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
});

// fetch random movie
app.get("/api/random", async (req: Request, res: Response) => {
  try {
    const trendingRes = await fetch(`${BASE_URL}/trending/movie/day`, options);
    if (!trendingRes.ok) throw new Error("Failed to fetch trending movies");
    const trendingData = await trendingRes.json();
    const movies = trendingData.results;
    if (!movies || movies.length === 0)
      throw new Error("No trending movies found");

    const randomMovie = movies[Math.floor(Math.random() * movies.length)];

    const movieDetailsRes = await fetch(
      `${BASE_URL}/movie/${randomMovie.id}?language=en-US`,
      options
    );
    if (!movieDetailsRes.ok) throw new Error("Failed to fetch movie details");
    const movieDetails = await movieDetailsRes.json();

    const creditsResponse = await fetch(
      `${BASE_URL}/movie/${randomMovie.id}/credits`,
      options
    );
    const credits = await creditsResponse.json();

    const transformedCast = credits.cast.slice(0, 4).map((member: any) => ({
      id: member.id,
      name: member.name,
      profile_path: member.profile_path,
      character: member.character || "Unknown Role", // 👈 Added role here
    }));

    const streamingResponse = await fetch(
      `${BASE_URL}/movie/${randomMovie.id}/watch/providers`,
      options
    );
    const streamingData = await streamingResponse.json();

    movieDetails.cast = transformedCast;
    movieDetails.stream = streamingData.results?.US ?? {};

    res.json(movieDetails);
  } catch (error) {
    console.error("Error in /api/random:", error);
    res.status(500).json({ error: "Failed to fetch random movie" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
