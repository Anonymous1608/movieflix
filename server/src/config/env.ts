import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),
  BASE_URL: z.string().url().default("https://api.themoviedb.org/3"),
  API_KEY: z.string().min(1, "TMDB API key is required"),
  MONGODB_URI: z.string().url().default("mongodb://localhost:27017/movieflix"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT secret must be at least 32 characters")
    .default("your-secret-key-change-in-production"),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
});

export const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Environment validation failed:");
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join(".")}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};
