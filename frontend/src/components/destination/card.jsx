import { Search, Heart, MapPin, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function TravelCard() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedItems, setLikedItems] = useState(new Set());

 const featuredGuides = [
    {
    id: 1,
    title: "Goa Beaches & Hidden Gems",
    location: "Goa, India",
    author: "wanderlustgoa",
    places: "65 places",
    image: "https://images.unsplash.com/photo-1589883661920-7c68c7cb7a34?w=400&h=300&fit=crop&q=80",
    type: "guide"
  },
  {
    id: 2,
    title: "Golden Triangle: 7-Day Cultural Journey",
    location: "Delhi – Agra – Jaipur, India",
    author: "incredibleindia",
    places: "120 places",
    image: "https://images.unsplash.com/photo-1596568353250-58d9e7a9b1d7?w=400&h=300&fit=crop&q=80",
    type: "itinerary"
  },
  
  {
    id: 3,
    title: "Himalayan Adventure: 10-Day Trekking Plan",
    location: "Manali – Leh – Ladakh, India",
    author: "mountainvibes",
    places: "40 places",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&h=300&fit=crop&q=80",
    type: "itinerary"
  },
  {
    id: 4,
    title: "Kerala Backwaters Escape: 5 Days of Serenity",
    location: "Alleppey – Kumarakom, Kerala, India",
    author: "southernsojourns",
    duration: "5 days",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&q=80",
    type: "itinerary"
  }
];


  const tabs = ['All', 'Itineraries'];

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Destination</h1>
        
        {/* Tabs */}
        <div className="flex gap-6 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab 
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
          
          <Link to={"/destination/detail"}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGuides.map((guide) => (
              <div key={guide.id} className="group cursor-pointer">
                <div className="relative rounded-xl overflow-hidden bg-gray-200 aspect-[4/3] mb-4">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay with info */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {guide.places || guide.duration}
                    </span>
                  </div>
                  
                  {/* Heart icon */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(guide.id);
                    }}
                    className="absolute top-4 right-4 p-1"
                  >
                    <Heart 
                      className={`w-6 h-6 ${
                        likedItems.has(guide.id) 
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
                    {guide.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{guide.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-xs">
                    <div className="w-4 h-4 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                      <User className="w-2 h-2" />
                    </div>
                    <span>{guide.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
}