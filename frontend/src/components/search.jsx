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
    <div className="relative w-80">
      <div className="flex items-center bg-white shadow-md rounded-full overflow-hidden h-20">
        {/* Input */}
        <input
          type="text"
          placeholder="Search destinations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 outline-none text-gray-700"
        />

        {/* Button */}
        <button
          onClick={handleSearch}
          className="bg-black hover:bg-gray-900 h-full rounded-full text-white px-5 py-2 font-medium"
        >
          <Search />
        </button>
      </div>
    </div>
  );
}
