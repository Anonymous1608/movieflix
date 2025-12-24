import { Menu, Search, X, User, LogOut, Film } from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query)}`);
      setQuery("");
      setIsSearchFocused(false);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Popular", path: "/popular" },
    { name: "TV Shows", path: "/tv-shows" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? "bg-black/90 backdrop-blur-md shadow-lg py-3"
            : "bg-gradient-to-b from-black/80 to-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group relative z-50">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
              <Film className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide drop-shadow-md">
              MOVIEFLIX
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10 p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-300 hover:text-white px-2 relative group ${
                    isActive ? "text-white" : "text-gray-300"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <span 
                      className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 rounded-full transition-transform duration-300 origin-left ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`} 
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 relative z-50">
            {/* Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className={`relative flex items-center transition-all duration-300 ${
                isSearchFocused ? "w-48 md:w-64" : "w-10 md:w-64"
              }`}
            >
              <div
                className={`absolute inset-0 bg-white/10 rounded-full transition-opacity ${
                  isSearchFocused || isDesktop
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
              <input
                type="text"
                value={query}
                onChange={handleInput}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search movies/tv..."
                className={`w-full bg-transparent border-none text-sm text-white placeholder-gray-400 px-4 py-2 focus:outline-none relative z-10 ${
                  isSearchFocused || isDesktop
                    ? "opacity-100 cursor-text"
                    : "opacity-0 cursor-pointer pointer-events-none md:pointer-events-auto md:opacity-100"
                }`}
              />
              <button
                type="button" 
                onClick={(e) => {
                  if (!isSearchFocused && !isDesktop) {
                    e.preventDefault(); 
                    setIsSearchFocused(true);
                  } else {
                    if (!query.trim()) {
                       e.preventDefault();
                       return;
                    }
                    handleSearch();
                  }
                }}
                className="absolute right-2 p-1.5 hover:bg-white/20 rounded-full transition-colors text-gray-300 hover:text-white z-20"
              >
                <Search size={16} />
              </button>
            </form>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 hover:bg-white/10 py-1.5 px-3 rounded-full transition-all"
                  >
                    <div className="bg-gradient-to-tr from-blue-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                      {user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.username}</span>
                  </NavLink>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <NavLink
                    to="/login"
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all shadow-lg hover:shadow-blue-600/20"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transition-transform duration-300 md:hidden pt-24 ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center gap-8 p-6">
          <div className="flex flex-col gap-4 w-full max-w-xs text-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="text-2xl font-medium text-gray-300 hover:text-white transition-colors py-2"
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="w-16 h-1 bg-white/10 rounded-full" />

          <div className="flex flex-col gap-4 w-full max-w-xs text-center">
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className="flex items-center justify-center gap-3 text-xl font-medium text-white py-2"
                >
                  <User size={24} />
                  Profile
                </NavLink>
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-3 text-xl font-medium text-red-400 py-2"
                >
                  <LogOut size={24} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <NavLink
                  to="/login"
                  className="text-xl font-medium text-white py-2"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="text-xl font-medium bg-blue-600 text-white py-3 rounded-xl shadow-lg"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
