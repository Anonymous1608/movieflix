const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  // User
  getProfile: async () => {
    const response = await fetch(`${API_BASE}/users/profile`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
  },

  addToWatchlist: async (movieId: number) => {
    const response = await fetch(`${API_BASE}/users/watchlist/${movieId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to add to watchlist");
    return response.json();
  },

  removeFromWatchlist: async (movieId: number) => {
    const response = await fetch(`${API_BASE}/users/watchlist/${movieId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to remove from watchlist");
    return response.json();
  },

  addToFavorites: async (movieId: number) => {
    const response = await fetch(`${API_BASE}/users/favorites/${movieId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to add to favorites");
    return response.json();
  },

  removeFromFavorites: async (movieId: number) => {
    const response = await fetch(`${API_BASE}/users/favorites/${movieId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to remove from favorites");
    return response.json();
  },

  // Reviews
  getReviews: async (movieId: number, page = 1) => {
    const response = await fetch(
      `${API_BASE}/reviews/${movieId}?page=${page}&limit=10`
    );
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
  },

  createReview: async (movieId: number, rating: number, comment?: string) => {
    const response = await fetch(`${API_BASE}/reviews/${movieId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, comment }),
    });
    if (!response.ok) throw new Error("Failed to create review");
    return response.json();
  },

  deleteReview: async (movieId: number) => {
    const response = await fetch(`${API_BASE}/reviews/${movieId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete review");
    return response.json();
  },

  // TV Shows
  searchTV: async (query: string, page = 1) => {
    const response = await fetch(
      `${API_BASE}/tv/search?name=${encodeURIComponent(query)}&page=${page}`
    );
    if (!response.ok) throw new Error("Failed to search TV shows");
    return response.json();
  },

  getTVPopular: async (page = 1) => {
    const response = await fetch(`${API_BASE}/tv/popular?page=${page}`);
    if (!response.ok) throw new Error("Failed to fetch popular TV shows");
    return response.json();
  },

  getTVTopRated: async (page = 1) => {
    const response = await fetch(`${API_BASE}/tv/top-rated?page=${page}`);
    if (!response.ok) throw new Error("Failed to fetch top rated TV shows");
    return response.json();
  },

  getTVDetails: async (id: number) => {
    const response = await fetch(`${API_BASE}/tv/${id}`);
    if (!response.ok) throw new Error("Failed to fetch TV show details");
    return response.json();
  },

  getTVSeason: async (id: number, seasonNumber: number) => {
    const response = await fetch(`${API_BASE}/tv/${id}/season/${seasonNumber}`);
    if (!response.ok) throw new Error("Failed to fetch TV season details");
    return response.json();
  },

  addToWatchlistTV: async (tvId: number) => {
    const response = await fetch(`${API_BASE}/users/watchlist/tv/${tvId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to add to TV watchlist");
    return response.json();
  },

  removeFromWatchlistTV: async (tvId: number) => {
    const response = await fetch(`${API_BASE}/users/watchlist/tv/${tvId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to remove from TV watchlist");
    return response.json();
  },

  addToFavoritesTV: async (tvId: number) => {
    const response = await fetch(`${API_BASE}/users/favorites/tv/${tvId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to add to TV favorites");
    return response.json();
  },

  removeFromFavoritesTV: async (tvId: number) => {
    const response = await fetch(`${API_BASE}/users/favorites/tv/${tvId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to remove from TV favorites");
    return response.json();
  },

  // Recommendations
  getRecommendations: async () => {
    const response = await fetch(`${API_BASE}/recommendations`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch recommendations");
    return response.json();
  },
};

