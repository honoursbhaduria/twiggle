import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeft, Heart, Share2, Settings, MapPin, Clock, Star, Users, Calendar, Coffee, Camera, DollarSign, Info, Utensils } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Detail = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [savedTrip, setSavedTrip] = useState(false);

  // Sample coordinates for Goa locations
  const mapCenter = [15.2993, 74.1240];
  const locations = [
    { id: 1, name: "Baga Beach", lat: 15.5559, lng: 73.7516, type: "beach" },
    { id: 2, name: "Basilica of Bom Jesus", lat: 15.5008, lng: 73.9115, type: "heritage" },
    { id: 3, name: "Fort Aguada", lat: 15.5166, lng: 73.7722, type: "fort" },
    { id: 4, name: "Fisherman's Wharf", lat: 15.2832, lng: 73.9685, type: "restaurant" }
  ];

  const days = [
    { day: 1, title: "Exploration & Experiences", locations: 4 },
    { day: 2, title: "Cultural Heritage", locations: 3 },
    { day: 3, title: "Beach Adventures", locations: 5 },
    { day: 4, title: "Local Markets", locations: 4 },
    { day: 5, title: "Water Sports", locations: 3 },
    { day: 6, title: "Farewell Goa", locations: 2 }
  ];

  const attractions = [
    {
      id: 1,
      name: "Baga Beach",
      time: "9:00 AM",
      duration: "4 hours",
      description: "Popular beach with water sports, shacks and vibrant nightlife",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop",
      price: "Free",
      difficulty: "easy"
    },
    {
      id: 2,
      name: "Basilica of Bom Jesus",
      time: "12:00 PM",
      duration: "1 hour",
      description: "UNESCO World Heritage site housing the mortal remains of St. Francis Xavier",
      image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=250&fit=crop",
      price: "Free",
      difficulty: "easy"
    },
    {
      id: 3,
      name: "Fort Aguada",
      time: "3:00 PM",
      duration: "1h 30m",
      description: "17th-century Portuguese fort with lighthouse and stunning ocean views",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      price: "₹25",
      difficulty: "moderate"
    }
  ];

  const restaurant = {
    name: "Fisherman's Wharf",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop",
    rating: 4.4,
    cuisine: "Goan, Seafood",
    priceRange: "₹₹₹"
  };

  const experience = {
    name: "Beach Hopping Adventure",
    description: "Explore multiple beaches from Baga to Anjuna with local guide",
    duration: "4h 0m",
    time: "9:00 AM - 1:00 PM",
    location: "North Goa Beaches",
    difficulty: "easy",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=300&fit=crop"
  };

  const budget = {
    attractions: 0,
    restaurants: 0,
    experiences: 1500,
    total: 1500
  };

  const handleSave = () => {
    setSavedTrip(!savedTrip);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">6 Days Goa Beach & Culture</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>6 days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>₹18,000</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>4.8 (127 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSave}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${savedTrip ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Heart className={`w-4 h-4 ${savedTrip ? 'fill-current' : ''}`} />
                <span>Save</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Customize</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Map Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-80 relative">
                <MapContainer
                  center={mapCenter}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-t-xl"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {locations.map((location) => (
                    <Marker key={location.id} position={[location.lat, location.lng]}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-gray-900">{location.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{location.type}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
                
                {/* Map Info Overlay */}
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                  <div>Day 1: 3 attractions, 1 restaurant</div>
                  <div className="text-xs opacity-90">Center: 15.2993, 74.1240</div>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">4 locations</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Day 1 Itinerary</div>
                </div>
              </div>
            </div>

            {/* Day Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex border-b border-gray-200">
                <button className="px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  Overview
                </button>
                {days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setActiveDay(day.day)}
                    className={`px-6 py-3 transition-colors relative ${
                      activeDay === day.day
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>

              {/* Day Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Day {activeDay} - Exploration & Experiences
                  </h2>
                </div>

                {/* Attractions */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Camera className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Attractions (3)</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {attractions.map((attraction) => (
                      <div key={attraction.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img 
                            src={attraction.image} 
                            alt={attraction.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                            {attraction.time}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{attraction.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{attraction.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{attraction.duration}</span>
                            </div>
                            <span className={`font-medium ${attraction.price === 'Free' ? 'text-green-600' : 'text-blue-600'}`}>
                              {attraction.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Restaurants */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Utensils className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Restaurants (1)</h3>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        className="w-full sm:w-48 h-32 sm:h-24 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{restaurant.cuisine}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{restaurant.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">{restaurant.priceRange}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Day 1 Experiences</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Unique activities and memorable moments for your locations</p>
                  
                  <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <img 
                      src={experience.image} 
                      alt={experience.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-900">{experience.name}</h4>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          {experience.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{experience.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{experience.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{experience.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Info className="w-4 h-4" />
                          <span>{experience.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Day 1 Budget</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Attractions, restaurants & experiences</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-700">Attractions</span>
                  </div>
                  <span className="font-medium">₹{budget.attractions}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Coffee className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700">Restaurants</span>
                  </div>
                  <span className="font-medium">₹{budget.restaurants}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700">Experiences</span>
                  </div>
                  <span className="font-medium">₹{budget.experiences}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total Day Cost:</span>
                    <span className="font-bold text-green-600 text-lg">₹{budget.total}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-xs text-yellow-800">Prices may vary by season and location</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Duration</span>
                  <span className="font-medium">6 Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Locations</span>
                  <span className="font-medium">18 Places</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trip Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Difficulty Level</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Easy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;