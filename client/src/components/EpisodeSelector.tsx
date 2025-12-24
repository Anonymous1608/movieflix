import { useState, useEffect } from "react";
import { ChevronDown, Play } from "lucide-react";
import { api } from "../utils/api";

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number;
}

interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
}

interface EpisodeSelectorProps {
  tvId: number;
  seasons: Season[];
  currentSeason: number;
  currentEpisode: number;
  onSeasonChange: (season: number) => void;
  onEpisodeSelect: (episode: number) => void;
}

const EpisodeSelector = ({
  tvId,
  seasons,
  currentSeason,
  currentEpisode,
  onSeasonChange,
  onEpisodeSelect,
}: EpisodeSelectorProps) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter out Season 0 (Specials) if desired, or keep them. Usually Season 1 is default.
  // We can sort seasons by number just in case
  const sortedSeasons = [...seasons].sort((a, b) => a.season_number - b.season_number).filter(s => s.season_number > 0);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const data = await api.getTVSeason(tvId, currentSeason);
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error("Failed to fetch episodes", error);
      } finally {
        setLoading(false);
      }
    };

    if (tvId && currentSeason) {
      fetchEpisodes();
    }
  }, [tvId, currentSeason]);

  const activeSeasonName = seasons.find(s => s.season_number === currentSeason)?.name || `Season ${currentSeason}`;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4 relative">
        <h3 className="text-2xl font-bold text-white">Episodes</h3>
        
        {/* Season Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 hover:bg-gray-700 transition"
          >
            <span className="font-semibold">{activeSeasonName}</span>
            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 border border-gray-700 rounded shadow-xl z-50 max-h-60 overflow-y-auto">
              {sortedSeasons.map((season) => (
                <button
                  key={season.id}
                  onClick={() => {
                    onSeasonChange(season.season_number);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-800 transition ${
                    currentSeason === season.season_number ? "bg-gray-800 font-bold text-blue-400" : "text-gray-300"
                  }`}
                >
                  {season.name}
                  <span className="block text-xs text-gray-500">
                    {season.episode_count} Episodes
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-4">
        {loading ? (
             <div className="text-gray-400 py-10 text-center">Loading episodes...</div>
        ) : (
            episodes.map((episode) => (
                <div 
                    key={episode.id}
                    className={`group flex flex-col md:flex-row gap-4 p-4 rounded-lg cursor-pointer transition-all border border-transparent ${
                        currentEpisode === episode.episode_number 
                            ? "bg-gray-800/80 border-blue-500/50" 
                            : "hover:bg-gray-800/50 border-gray-800"
                    }`}
                    onClick={() => onEpisodeSelect(episode.episode_number)}
                >
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-full md:w-64 aspect-video rounded-md overflow-hidden bg-gray-900">
                        {episode.still_path ? (
                            <img 
                                src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                                alt={episode.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No Image</div>
                        )}
                        {/* Play Overlay */}
                        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity ${currentEpisode === episode.episode_number ? 'opacity-100' : ''}`}>
                             <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/50">
                                <Play size={20} className="text-white fill-white ml-1" />
                             </div>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs text-white font-medium">
                            Ep {episode.episode_number}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                             <h4 className={`text-lg font-bold ${currentEpisode === episode.episode_number ? "text-blue-400" : "text-gray-100 group-hover:text-white"}`}>
                                {episode.episode_number}. {episode.name}
                             </h4>
                             <span className="text-sm text-gray-500">{episode.runtime ? `${episode.runtime}m` : ''}</span>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2 md:line-clamp-3">
                            {episode.overview || "No overview available for this episode."}
                        </p>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default EpisodeSelector;
