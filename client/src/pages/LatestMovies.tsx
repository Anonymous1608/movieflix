import MovieGrid from "../components/MovieGrid";

const LatestMovies = () => {
  return (
    <div className="pt-24 min-h-screen px-4 md:px-12 bg-black">
      <MovieGrid apilink={`/api/movies/popular`} pagename={"Popular Now"} />
    </div>
  );
};

export default LatestMovies;
