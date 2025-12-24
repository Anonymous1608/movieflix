import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

interface CastMember {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  cast?: CastMember[];
}

interface HeroCarouselProps {
  movies: Movie[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);

    return () => clearInterval(interval);
  }, [currentIndex, movies.length]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
      setIsTransitioning(false);
    }, 500);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
      setIsTransitioning(false);
    }, 500);
  };

  if (!movies.length) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden group">
      {/* Background Image with Transition */}
      <div 
        className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
          isTransitioning ? "scale-105 opacity-50" : "scale-100 opacity-100"
        }`}
      >
        <img
          src={`https://image.tmdb.org/t/p/original${currentMovie.poster_path}`}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center"
        />
        
        {/* Gradients for text readability and blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 pb-20 md:pb-32 z-10 flex flex-col items-start gap-4 md:gap-6 animate-fade-in-up">
        {/* Rating Badge */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white font-medium text-sm">
            {currentMovie.vote_average?.toFixed(1)} Rating
          </span>
          <span className="text-gray-400 text-xs px-1">•</span>
          <span className="text-gray-300 text-sm">Trending Now</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight max-w-4xl tracking-tight drop-shadow-xl">
          {currentMovie.title}
        </h1>

        {/* Overview */}
        <p className="text-gray-300 text-sm md:text-lg max-w-xl line-clamp-3 md:line-clamp-4 leading-relaxed drop-shadow-md">
          {currentMovie.overview}
        </p>

        {/* Cast */}
        {currentMovie.cast && (
          <div className="flex flex-wrap gap-2 text-sm text-gray-400 font-medium">
            {currentMovie.cast.slice(0, 3).map((actor) => (
              <span key={actor.id} className="hover:text-white transition-colors">
                {actor.name}
              </span>
            )).reduce((prev, curr) => [prev, <span key="sep" className="opacity-50">•</span>, curr] as any)}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-2">
          <NavLink 
            to={`/${currentMovie.id}`}
            className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
          >
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1"></div>
            Watch Now
          </NavLink>

          <NavLink 
            to={`/${currentMovie.id}`}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/10 hover:border-white/20"
          >
            More Info
          </NavLink>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all duration-300 -translate-x-4 group-hover:translate-x-0"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all duration-300 translate-x-4 group-hover:translate-x-0"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
               if(!isTransitioning) {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsTransitioning(false);
                  }, 500);
               }
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? "bg-white w-8 opacity-100" 
                : "bg-white/30 w-2 hover:w-4 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-0 pointer-events-none" />
    </div>
  );
};

export default HeroCarousel;
