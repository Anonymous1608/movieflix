import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

const BASE_URL = process.env.BASE_URL || "https://api.themoviedb.org/3";
const API_KEY = process.env.API_KEY;

console.log("Testing TMDB API...");
console.log("API_KEY:", API_KEY ? `${API_KEY.substring(0, 30)}...` : "MISSING");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const url = `${BASE_URL}/trending/movie/day?page=1`;
console.log("URL:", url);

try {
  const response = await fetch(url, options);
  console.log("Response status:", response.status);
  console.log("Response headers:", Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    const errorText = await response.text();
    console.log("Error response:", errorText);
  } else {
    const data = await response.json();
    console.log("Success! Got", data.results?.length, "movies");
  }
} catch (error) {
  console.error("Fetch error:", error);
}
