import MovieSlider from "../components/MovieSlider";

const TVShows = () => {
  return (
    <div className="min-h-screen pb-20 pt-24 px-4 md:px-8 space-y-12">
      {/* Popular TV Shows Section */}
      <section>
        <MovieSlider
          apilink="/api/tv/popular"
          pagename="Popular TV Shows"
          category="tv-popular"
          mediaType="tv"
        />
      </section>

      {/* Top Rated TV Shows Section */}
      <section>
        <MovieSlider
          apilink="/api/tv/top-rated"
          pagename="Top Rated TV Shows"
          category="tv-top-rated"
          mediaType="tv"
        />
      </section>
    </div>
  );
};

export default TVShows;
