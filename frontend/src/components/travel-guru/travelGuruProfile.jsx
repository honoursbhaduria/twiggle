import React, { useState } from "react";
import {
  Youtube,
  Instagram,
  Facebook,
  MapPin,
  Clock,
  Wallet,
  Tag,
  Users,
  Heart,
  Bookmark,
} from "lucide-react";
import { Link } from "react-router-dom";
import SidebarDemo from "../destination/sidebar";

const TravelGuruProfile = () => {
  const guru = {
    name: "Sarah Mitchell",
    username: "@mayatravels",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Adventure seeker & culture enthusiast 🌍 | Helping you discover hidden gems | 150+ countries explored",
    social: {
      instagram: 45200,
      facebook: 8920,
      youtube: 15400,
    },
  };

  const latestVideo = {
    title: "Hidden Gems of Goa You Must Visit",
    thumbnail:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop",
    views: 45200,
    likes: 3400,
    comments: 567,
  };

  const itineraries = [
    {
      id: 1,
      title: "Ultimate Goa Beach Paradise",
      destination: "Goa, India",
      duration: "7 Days",
      price: "$899",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
      likes: 1243,
      saves: 456,
      difficulty: "Easy",
      group: "Family Friendly",
    },
    {
      id: 2,
      title: "Hidden Gems of North Goa",
      destination: "North Goa, India",
      duration: "5 Days",
      price: "$649",
      image:
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop",
      likes: 892,
      saves: 234,
      difficulty: "Moderate",
      group: "Solo Travel",
    },
    {
      id: 3,
      title: "Cultural Heritage Trail",
      destination: "Old Goa, India",
      duration: "4 Days",
      price: "$499",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop",
      likes: 678,
      saves: 189,
      difficulty: "Easy",
      group: "Couples",
    },
    {
      id: 4,
      title: "Adventure Seeker's Paradise",
      destination: "South Goa, India",
      duration: "6 Days",
      price: "$799",
      image:
        "https://images.unsplash.com/photo-1580837119756-563d608dd119?w=800&h=600&fit=crop",
      likes: 1456,
      saves: 567,
      difficulty: "Challenging",
      group: "Adventure",
    },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const handleCardClick = (item) => {
    setSelectedItinerary(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItinerary(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarDemo />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Profile Section */}
        <div className="flex items-center gap-6 mb-10">
          <img
            src={guru.avatar}
            alt={guru.name}
            className="w-24 h-24 rounded-full object-cover shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{guru.name}</h1>
            <p className="text-gray-600">{guru.bio}</p>
          </div>
        </div>

        {/* Social Media Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Instagram</p>
              <h3 className="text-2xl font-bold">{guru.social.instagram.toLocaleString()}</h3>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <Instagram className="text-pink-500 w-8 h-8" />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Facebook</p>
              <h3 className="text-2xl font-bold">{guru.social.facebook.toLocaleString()}</h3>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <Facebook className="text-blue-600 w-8 h-8" />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">YouTube</p>
              <h3 className="text-2xl font-bold">{guru.social.youtube.toLocaleString()}</h3>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <Youtube className="text-red-500 w-8 h-8" />
          </div>
        </div>

        {/* Latest YouTube Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Latest YouTube Activity</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <img
              src={latestVideo.thumbnail}
              alt={latestVideo.title}
              className="w-full md:w-1/2 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{latestVideo.title}</h3>
              <div className="flex gap-6 text-gray-600 text-sm">
                <p>👁 {latestVideo.views.toLocaleString()} views</p>
                <p>❤️ {latestVideo.likes.toLocaleString()} likes</p>
                <p>💬 {latestVideo.comments.toLocaleString()} comments</p>
              </div>
              <button className="mt-4 px-5 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-all">
                View on YouTube
              </button>
            </div>
          </div>
        </div>

        {/* Curated Itineraries */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Curated Itineraries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itineraries.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer"
                onClick={() => handleCardClick(item)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {item.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wallet className="w-3 h-3" /> {item.price}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" /> {item.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark className="w-4 h-4 text-purple-500" /> {item.saves}
                      </span>
                    </div>
                    <span className="text-blue-600 font-semibold">View</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {modalOpen && selectedItinerary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-0 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <div className="px-6 pt-8 pb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{selectedItinerary.title}</h2>
              <div className="w-full h-40 rounded-xl overflow-hidden mb-4 relative">
                <img
                  src={selectedItinerary.image}
                  alt={selectedItinerary.title}
                  className="w-full h-full object-cover blur-sm scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold bg-black/40 px-4 py-2 rounded-lg">Premium Content</span>
                </div>
              </div>
              <div className="text-center text-gray-700 mb-2">
                {selectedItinerary.destination}
              </div>
              <div className="text-center text-gray-500 mb-4">
                Duration: {selectedItinerary.duration}
              </div>
              <div className="text-center text-gray-400 text-xs mb-4">
                Handcrafted journey curated by expert travel gurus. Unlock premium details and exclusive content by upgrading your plan.
              </div>
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-base hover:bg-blue-600 transition-all"
                onClick={closeModal}
              >
                Go Premium
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelGuruProfile;
