import React, { useState } from 'react';
import { Search, Home, Compass, Bookmark, MessageSquare, MapPin, User, Bell, Star, Calendar, Users, ChevronRight, Plus, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SidebarDemo from '../destination/sidebar';
import { useAllDestination } from '../../hooks/useTravelApi';
import Lottie from "lottie-react";
import animationData from "./animation.json"

export default function TravelDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const {data, error, loading} = useAllDestination()

  console.log('Dashboard data:', data);

  // Transform API data to match our component structure
  const mostVisitedSpots = data?.results ? data.results.slice(0, 3).map(destination => {
    const popularItinerary = destination.itineraries?.results?.[0];
    return {
      id: destination.id,
      name: destination.name,
      location: destination.description,
      rating: popularItinerary ? (popularItinerary.popularity_score / 20).toFixed(1) : '4.5', // Convert to 5-star scale
      image: destination.image,
      slug: destination.slug
    };
  }) : [];

  const recommendations = data?.results ? data.results
    .filter(destination => 
      searchQuery === '' || 
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(destination => ({
      id: destination.id,
      name: destination.name,
      location: destination.description,
      image: destination.image,
      slug: destination.slug,
      itineraryCount: destination.itineraries?.count || 0
    })) : [];

  // Transform recent trips from itineraries data
  const recentTrips = data?.results ? data.results.flatMap(destination => 
    destination.itineraries?.results?.map(itinerary => ({
      id: itinerary.id,
      name: itinerary.title,
      destination: destination.name,
      date: `${itinerary.duration_days}D ${itinerary.duration_nights}N`,
      budget: `₹${parseFloat(itinerary.total_budget).toLocaleString()}`,
      slug: itinerary.slug,
      destinationSlug: destination.slug
    })) || []
  ).slice(0, 3) : [];

  const friends = [
    { id: 1, name: 'Fakih', status: 'available', avatar: '👨' },
    { id: 2, name: 'Alesya', status: 'available', avatar: '👩' },
    { id: 3, name: 'Parisya', status: 'available', avatar: '👱‍♀️' },
    { id: 4, name: 'Maulana', status: 'busy', avatar: '👨‍💼' }
  ];

  const navItems = [
    { icon: Home, name: 'home' },
    { icon: Compass, name: 'explore' },
    { icon: Bookmark, name: 'saved' },
    { icon: MessageSquare, name: 'messages' },
    { icon: MapPin, name: 'locations' },
    { icon: User, name: 'profile' }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-full mx-auto flex gap-20">
          <div><SidebarDemo/></div>
          <div className='p-6 flex gap-10 w-full h-full'>
            <div className="flex-1 space-y-6 min-h-screen">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-full mx-auto flex gap-20">
          <div><SidebarDemo/></div>
          <div className='p-6 flex gap-10 w-full h-full'>
            <div className="flex-1 space-y-6 min-h-screen">
              <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
                <div className="text-center text-red-600">
                  <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
                  <p>{error.message || 'Something went wrong'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen ">
      <div className="max-w-full mx-auto flex gap-20">
        {/* Sidebar */}
        <div><SidebarDemo/></div>
        {/* Main Content */}
        <div className='p-6 flex gap-10 w-full h-full'>
          <div className="flex-1 space-y-6 min-h-screen">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <Lottie
                animationData={animationData}
                loop={true}
                className="absolute bottom-0 right-10 -mb-27"
                style={{ width: "300px", height: "500px" }}
              />
                <h1 className="text-2xl font-black text-black leading-none tracking-tight">Hello, Tejash!</h1>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search destination..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                    />
                  </div>
                  <button className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors border border-black">Domestic</button>
                  <button className="px-6 py-2 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors border border-gray-300">Overseas</button>
                </div>
              </div>
              {/* Most Visited Tourist Spots */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black">Most visited tourist spot</h2>
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
                
                {mostVisitedSpots.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No destinations available yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {mostVisitedSpots.map((spot) => (
                      <div 
                        key={spot.id} 
                        className="relative h-48 rounded-2xl bg-white border border-gray-200 p-4 text-black overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        onClick={() => navigate(`/destination/${spot.slug}`)}
                      >
                        {/* Background Image */}
                        {spot.image && (
                          <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ 
                              backgroundImage: `url(http://localhost:8000${spot.image})`,
                            }}
                          >
                            <div className="absolute inset-0 bg-black/40"></div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-white/80"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold">{spot.name}</h3>
                              <p className="text-sm opacity-90 flex items-center gap-1 text-gray-600">
                                <MapPin size={12} />
                                {spot.location}
                              </p>
                            </div>
                            <div className="bg-gray-100 px-2 py-1 rounded-lg flex items-center gap-1 border border-gray-300">
                              <Star size={14} className="text-black" fill="black" />
                              <span className="text-sm font-semibold">{spot.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gray-100 rounded-full transform translate-x-16 translate-y-16"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Recommendations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black">Recommendation for you</h2>
                  <button className="text-black text-sm hover:underline">See all</button>
                </div>
                <div className="space-y-3">
                  {recommendations.map((place) => (
                    <div 
                      key={place.id} 
                      className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/destination/${place.slug}`)}
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center text-2xl text-gray-500 overflow-hidden">
                        {place.image ? (
                          <img 
                            src={`http://localhost:8000${place.image}`} 
                            alt={place.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          '🏔️'
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">{place.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin size={12} />
                          {place.location}
                        </p>
                        <p className="text-xs text-gray-400">
                          {place.itineraryCount} itinerar{place.itineraryCount === 1 ? 'y' : 'ies'} available
                        </p>
                      </div>
                      <ChevronRight className="text-gray-400" size={20} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Right Sidebar - Profile Card */}
          <div className="w-96">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-sm text-gray-500 mb-2">Your Profile</h3>
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center text-gray-700 text-3xl">
                    <User size={48} />
                  </div>
                  
                </div>
                <h2 className="text-xl font-bold text-black">Tejash Rajput</h2>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <MapPin size={12} />
                 delhi, India
                </p>
                <button className="mt-4 px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors text-sm font-medium border border-black">
                  Edit Your Profile
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-black">Recent trip plan</h3>
                {recentTrips.map((trip) => (
                  <div 
                    key={trip.id} 
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/destination/${trip.destinationSlug}`)}
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-xl text-gray-500">⛰️</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-black text-sm">{trip.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {trip.date}
                        </span>
                        <span className="flex items-center gap-1">
                          💰 {trip.budget}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{trip.destination}</p>
                    </div>
                    <MoreVertical className="text-gray-400" size={16} />


               
                  </div>
                ))}
              </div>
            </div>

          </div>
         
        </div>
        
      </div>
    </div>
  );
}