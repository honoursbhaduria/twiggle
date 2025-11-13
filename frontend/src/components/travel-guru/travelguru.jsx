import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Send, X, ChevronLeft, ChevronRight, MapPin, Calendar, Users, Search } from 'lucide-react';
import SidebarDemo from '../destination/sidebar';
import { Input } from '../ui/input';
import { Link } from 'react-router-dom';

export default function TravelGuruPage() {
  const [activeStory, setActiveStory] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [selectedGuru, setSelectedGuru] = useState(null);

  const travelGurus = [
    {
      id: 1,
      name: "Sarah Mitchell",
      username: "@sarahtravels",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      followers: "125K",
      destinations: 45,
      hasStory: true,
      bio: "Adventure seeker | Beach lover | Culture enthusiast 🌴",
      stories: [
        { id: 1, image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=1200&fit=crop", location: "Bali, Indonesia" },
        { id: 2, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=1200&fit=crop", location: "Santorini, Greece" },
        { id: 3, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=1200&fit=crop", location: "Iceland" }
      ]
    },
    {
      id: 2,
      name: "Alex Kumar",
      username: "@alexexplores",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      followers: "89K",
      destinations: 32,
      hasStory: true,
      bio: "Mountain lover | Photography | Travel blogger ⛰️",
      stories: [
        { id: 1, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop", location: "Swiss Alps" },
        { id: 2, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1200&fit=crop", location: "New Zealand" }
      ]
    },
    {
      id: 3,
      name: "Maya Rodriguez",
      username: "@mayawanders",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      followers: "156K",
      destinations: 58,
      hasStory: true,
      bio: "Food & Travel | Cultural explorer | Digital nomad 🌍",
      stories: [
        { id: 1, image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=1200&fit=crop", location: "Thailand" },
        { id: 2, image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=1200&fit=crop", location: "Dubai" },
        { id: 3, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=1200&fit=crop", location: "Maldives" }
      ]
    },
    {
      id: 4,
      name: "David Chen",
      username: "@davidroams",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      followers: "92K",
      destinations: 41,
      hasStory: false,
      bio: "Urban explorer | Architecture lover | Street food enthusiast 🏙️"
    },
    {
      id: 5,
      name: "Emma Wilson",
      username: "@emmawanderlust",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      followers: "178K",
      destinations: 62,
      hasStory: true,
      bio: "Solo traveler | Nature photographer | Yoga instructor 🧘‍♀️",
      stories: [
        { id: 1, image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=1200&fit=crop", location: "Norway" }
      ]
    }
  ];

  const posts = [
    {
      id: 1,
      guruId: 1,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=600&fit=crop",
      likes: 2341,
      caption: "Sunsets in Bali never get old 🌅 #BaliVibes #TravelDiaries",
      location: "Bali, Indonesia",
      date: "2 days ago"
    },
    {
      id: 2,
      guruId: 2,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
      likes: 1823,
      caption: "The mountains are calling and I must go 🏔️",
      location: "Swiss Alps",
      date: "3 days ago"
    },
    {
      id: 3,
      guruId: 3,
      image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&h=600&fit=crop",
      likes: 3102,
      caption: "Street food adventures in Bangkok! 🍜 Best pad thai ever!",
      location: "Bangkok, Thailand",
      date: "5 days ago"
    }
  ];

  const openStory = (guru) => {
    if (guru.hasStory && guru.stories) {
      setActiveStory(guru);
      setStoryIndex(0);
    }
  };

  const closeStory = () => {
    setActiveStory(null);
    setStoryIndex(0);
  };

  const nextStory = () => {
    if (activeStory && storyIndex < activeStory.stories.length - 1) {
      setStoryIndex(storyIndex + 1);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SidebarDemo/>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-sm font-semibold text-[#fe6d3c] uppercase tracking-wider mb-3">TRAVEL-GURUS</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our Travel Gurus
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
        Learn from India's top travel creators and influencers who have contributed their expertise to make TravelCo the ultimate travel companion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
         <div className="relative mb-10">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="search..."
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur border border-[#fe6d3c]/25 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#fe6d3c]/30 focus:border-[#fe6d3c] transition-all"
            />
          </div>

      

        {/* Gurus Grid */}
        <Link to={"/travelguru/sarah"}>
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Discover Travel Experts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {travelGurus.map((guru) => (
              <div
                key={guru.id}
                className="group bg-white rounded-3xl border border-[#fe6d3c]/20 hover:shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedGuru(guru)}
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  <img
                    src={guru.avatar}
                    alt={guru.name}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white object-cover"
                  />
                  {guru.hasStory && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-[#fe6d3c]/40">
                      <span className="text-xs font-semibold text-[#fe6d3c]">Verified</span>
                    </div>
                  )}
                </div>
                <div className="p-5 pt-8 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{guru.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{guru.username}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">{guru.bio}</p>
                  <div className="flex justify-center gap-8 mb-4 py-3 border-t border-b border-[#fe6d3c]/20">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{guru.followers}</p>
                      <p className="text-xs text-gray-500">Followers</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{guru.destinations}</p>
                      <p className="text-xs text-gray-500">Places</p>
                    </div>
                  </div>
                
                </div>
              </div>
            ))}
          </div>
        </div>
            </Link>
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={closeStory}
            className="absolute top-4 right-4 text-white z-10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Story Progress Bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
            {activeStory.stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    idx === storyIndex ? 'w-full' : idx < storyIndex ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Story Header */}
          <div className="absolute top-8 left-4 flex items-center gap-3 z-10 mt-6">
            <img
              src={activeStory.avatar}
              alt={activeStory.name}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
            <div>
              <p className="text-white font-semibold">{activeStory.name}</p>
              <p className="text-white/80 text-sm">2h ago</p>
            </div>
          </div>

          {/* Story Content */}
          <div className="relative w-full max-w-lg h-full flex items-center">
            <img
              src={activeStory.stories[storyIndex].image}
              alt="Story"
              className="w-full h-full object-contain"
            />
            
            {/* Location Tag */}
            <div className="absolute bottom-20 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{activeStory.stories[storyIndex].location}</span>
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prevStory}
            className="absolute left-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            disabled={storyIndex === 0}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={nextStory}
            className="absolute right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Click Areas for Navigation */}
          <div className="absolute inset-0 flex">
            <div className="w-1/3 h-full cursor-pointer" onClick={prevStory} />
            <div className="w-1/3 h-full" />
            <div className="w-1/3 h-full cursor-pointer" onClick={nextStory} />
          </div>
        </div>
      )}
    </div>
  );
}




