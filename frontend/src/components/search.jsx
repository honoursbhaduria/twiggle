import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() !== "") {
      // Navigate to destination page with search parameter
      navigate(`/destination?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-80  md:w-150">
      {/* Background blur for better glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20 rounded-full blur-xl transform scale-110 -z-10"></div>
      
      <div className="flex items-center bg-white/20 backdrop-blur-xl border-2 border-white/40 shadow-2xl shadow-black/20 rounded-full overflow-hidden h-20 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:via-white/10 before:to-transparent before:rounded-full">
        {/* Primary glossy overlay - top highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/60 via-white/30 to-transparent rounded-t-full pointer-events-none"></div>
        
        {/* Secondary glossy effect - left side highlight */}
        <div className="absolute top-2 left-2 w-1/3 h-3/4 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-sm pointer-events-none"></div>
        
        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 rounded-full shadow-inner shadow-black/5 pointer-events-none"></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse pointer-events-none"></div>
        
        {/* Input */}
        <input
          type="text"
          placeholder="Search destinations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-6 py-2 outline-none text-gray-800 bg-transparent placeholder-gray-600/80 relative z-10 font-medium"
        />

        {/* Button */}
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-gray-900 via-black to-gray-900 hover:from-black hover:via-gray-800 hover:to-black h-16 w-16 rounded-full text-white font-medium transition-all duration-300 shadow-xl shadow-black/30 relative z-10 mr-2 flex items-center justify-center group"
        >
          <Search className="group-hover:scale-110 transition-transform duration-200" />
          {/* Button highlight */}
          <div className="absolute top-1 left-1 w-6 h-6 bg-white/20 rounded-full blur-sm"></div>
        </button>
      </div>
    </div>
  );
}
