export const getApiOptions = () => {
  const BASE_URL = process.env.BASE_URL || "https://api.themoviedb.org/3";
  const API_KEY = process.env.API_KEY;
  return {
    BASE_URL,
    options: {
      method: "GET" as const,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    },
  };
};
