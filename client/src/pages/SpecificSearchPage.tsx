import { ChevronRight, ChevronLeft } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { NavLink, useParams } from "react-router-dom";

// Types for the movie data structure
interface Movie {
  id: number;
  poster_path: string | null;
  title: string;
}

interface MovieResponse {
  page: number;
  total_pages: number;
  results: Movie[];
}

const SpecificSearchPage = () => {
  const { moviename } = useParams<{ moviename: string }>();
  const [movies, setMovies] = useState<MovieResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const debounceRef = useRef<number | null>(null);

  const fetchMovies = (movie: string, page: number) => {
    setLoading(true);
    fetch(`/api/search?name=${encodeURIComponent(movie)}&pageNumber=${page}`)
      .then((res) => res.json())
      .then((data: MovieResponse) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!moviename) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      fetchMovies(moviename, currentPage);
    }, 400); // Debounce to limit API calls
  }, [moviename, currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    const total = movies ? Math.min(movies.total_pages, 10) : 10;
    if (currentPage < total) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="px-4 md:px-12 pt-8">
        <h2 className="text-[4vw] md:text-[2.3vw] font-bold mb-4">
          Showing Results for &quot;{moviename}&quot;
        </h2>

        {loading ? (
          <p className="text-center text-lg">Loading movies...</p>
        ) : movies && movies.results.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-8">
            {movies.results.map((movie) =>
              movie.poster_path ? (
                <NavLink key={movie.id} to={`/${movie.id}`}>
                  <div className="transform transition-transform duration-200 hover:scale-105">
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                        alt={movie.title}
                        className="h-auto"
                      />
                    </div>
                  </div>
                </NavLink>
              ) : null
            )}
          </div>
        ) : (
          <p className="text-center text-lg">
            No results found for &quot;{moviename}&quot;.
          </p>
        )}
      </div>

      {movies && movies.total_pages > 1 && (
        <div className="flex flex-row justify-center pb-3">
          <ChevronLeft
            size={20}
            onClick={handlePrevious}
            className={`${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 cursor-pointer"
            }`}
          />
          <div className="flex space-x-1 py-2 px-2">
            {Array.from(
              {
                length: movies.total_pages > 10 ? 10 : movies.total_pages,
              },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-2 h-2 rounded-full ${
                  page === currentPage ? "bg-blue-600" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
          <ChevronRight
            size={20}
            onClick={handleNext}
            className={`${
              currentPage ===
              (movies.total_pages > 10 ? 10 : movies.total_pages)
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 cursor-pointer"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default SpecificSearchPage;
