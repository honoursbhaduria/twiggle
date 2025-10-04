import React, { useState } from 'react';
import { Star, MapPin, Calendar, Users, Heart, Play, CheckCircle } from 'lucide-react';

const TravelGurus = () => {
  const [hoveredGuru, setHoveredGuru] = useState(null);

  const gurus = [
    {
      id: 1,
      name: "Varun Vagish",
      specialty: "Adventure & Trekking",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Mountain enthusiast exploring India's majestic peaks and hidden trails",
      followers: "2.3M",
      rating: 4.9,
      trips: 150,
      gradient: "bg-gradient-to-r from-[#d63e3f] to-[#e86162]",
      bgPattern: "bg-gradient-to-br from-orange-50 to-red-50",
      verified: true
    },
    {
      id: 2,
      name: "Tyler durden",
      specialty: "Cultural & Heritage",
      image: "https://images.unsplash.com/photo-1516570161787-2fd917215a3d?w=300&h=300&fit=crop&crop=face",
      description: "Actress turned travel expert showcasing India's rich cultural heritage",
      followers: "1.8M",
      rating: 4.8,
      trips: 200,
      gradient: "bg-gradient-to-r from-[#d63e3f] to-[#e86162]",
      bgPattern: "bg-gradient-to-br from-purple-50 to-pink-50",
      verified: true
    },
    {
      id: 3,
      name: "Deepanshu Sangwan",
      specialty: "Budget Travel",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Expert in discovering incredible destinations on a shoestring budget",
      followers: "1.2M",
      rating: 4.9,
      trips: 180,
      gradient: "bg-gradient-to-r from-[#d63e3f] to-[#e86162]",
      bgPattern: "bg-gradient-to-br from-blue-50 to-cyan-50",
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br  py-20 px-4">
       
      {/* Header Section */}
      <div className="relative  max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg mb-6 border border-gray-100">
          <div className="w-2 h-2 bg-[#3E92D1] rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600">Featured Creators</span>
        </div>
        
        <h1 className="text-6xl font-bold mb-6">
          Meet Our{' '}
          <span className="bg-[#3E92D1] bg-clip-text text-transparent">
            Travel Gurus
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Learn from India's top travel creators and influencers who have contributed their 
          expertise to make <span className="font-semibold text-gray-800">TravelCo</span> the ultimate travel companion
        </p>
        
        {/* Floating Elements */}
         <div className="absolute top-20 left-10 opacity-20">
          <MapPin className="w-8 h-8 text-red-500 animate-bounce" />
        </div>
        <div className="absolute top-32 right-20 opacity-20">
          <Calendar className="w-6 h-6 text-blue-500 animate-pulse" />
        </div>
        
      </div>

      

      {/* Gurus Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {gurus.map((guru, index) => (
          <div
            key={guru.id}
            className={`group relative ${guru.bgPattern} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm`}
            onMouseEnter={() => setHoveredGuru(guru.id)}
            onMouseLeave={() => setHoveredGuru(null)}
            style={{
              animationDelay: `${index * 200}ms`
            }}
          >
            {/* Background Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${guru.gradient} opacity-5 rounded-3xl group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            {/* Verified Badge */}
            {guru.verified && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-700">Verified</span>
              </div>
            )}

            {/* Profile Image */}
            <div className="relative mb-6">
              <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${guru.gradient}  group-hover:scale-110 transition-transform duration-500`}>
                <img
                  src={guru.image}
                  alt={guru.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{guru.name}</h3>
              <div className={`inline-block bg-gradient-to-r ${guru.gradient} bg-clip-text text-transparent font-semibold text-sm mb-3`}>
                {guru.specialty}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{guru.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center group-hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-lg text-gray-800">{guru.followers}</span>
                </div>
                <span className="text-xs text-gray-500">Followers</span>
              </div>
              
              <div className="text-center group-hover:scale-105 transition-transform duration-300 delay-75">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-bold text-lg text-gray-800">{guru.rating}</span>
                </div>
                <span className="text-xs text-gray-500">Rating</span>
              </div>
              
              <div className="text-center group-hover:scale-105 transition-transform duration-300 delay-150">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="font-bold text-lg text-gray-800">{guru.trips}</span>
                </div>
                <span className="text-xs text-gray-500">Trips</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-white text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg group">
                <Heart className="w-4 h-4 group-hover:text-red-500 transition-colors duration-300" />
                Follow
              </button>
              
              <button className={`w-full bg-[#3E92D1] text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <Play className="w-4 h-4 relative z-10" />
                <span className="relative z-10">View Content</span>
              </button>
            </div>

            
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default TravelGurus;