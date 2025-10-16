import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export default function SearchBar() {
    const placeholders = [
    "Goa budget Travel",
    "Adventuros place",
    "manali iteanary",
    "xyz meuseum",
    "spritual places"
  ];
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() !== "") {
      // Navigate to destination page with search parameter
      navigate(`/destination?search=${encodeURIComponent(query.trim())}`);
    }
  };

   const handleChange = (e) => {
    console.log(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
     <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={handleSearch}
      />
  );
}
