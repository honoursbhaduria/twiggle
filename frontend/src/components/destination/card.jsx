import { Search, Heart, MapPin, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAllDestination } from "../../hooks/useTravelApi";

export default function TravelCard() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedItems, setLikedItems] = useState(new Set());
  const { data, loading, error } = useAllDestination()


  const tabs = ['All', 'Itineraries'];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const toggleLike = (id) => {
    setLikedItems(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      return newLiked;
    });
  };

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Destination</h1>

        {/* Tabs */}
        <div className="flex gap-6 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for location or username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Featured Guides Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured destination</h2>

          {loading && (
            <div className="text-center py-8">
              <p>Loading destinations...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600">
              <p>Error loading destinations: {error.message}</p>
            </div>
          )}

          {!loading && !error && data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.isArray(data?.results) && data.results?.map((destination) => (
                <Link to={`/destination/${destination.slug}`} key={destination.id}>
                  <div className="group cursor-pointer">
                    <div className="relative rounded-xl overflow-hidden bg-gray-200 aspect-[4/3] mb-4">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Overlay with info
                      <div className="absolute top-4 left-4">
                        <span className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          12
                        </span>
                      </div> */}

                      {/* Heart icon */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(destination.id);
                        }}
                        className="absolute top-4 right-4 p-1"
                      >
                        <Heart
                          className={`w-6 h-6 ${likedItems.has(destination.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-white hover:text-red-500'
                            } transition-colors`}
                        />
                      </button>

                      {/* Info icon */}
                      <button className="absolute bottom-4 right-4 w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">i</span>
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                        {destination.description}
                      </h3>

                      <div className="flex items-center text-gray-600 text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{destination.slug}</span>
                      </div>

                      {/* <div className="flex items-center text-gray-600 text-xs">
                        <div className="w-4 h-4 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                          <User className="w-2 h-2" />
                        </div>
                        <span>{destination.description}</span>
                      </div> */}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}