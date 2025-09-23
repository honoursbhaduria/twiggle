import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== "") {
      console.log("Searching for:", query);
      // You can replace this with navigation or API call
    }
  };

  return (
    <div className="flex items-center bg-transparent shadow-md rounded-full overflow-hidden h-20 w-80 ">
      {/* Input */}
      <input
        type="text"
        placeholder="Search destinations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-2 outline-none text-gray-700"
      />

      {/* Button */}
      <button
        onClick={handleSearch}
        className="bg-black hover:bg-gray-900 h-full rounded-full text-white px-5  py-2 font-medium"
      >
        <Search/>
      </button>
    </div>
  );
}
