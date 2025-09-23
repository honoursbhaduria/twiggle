import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Settings, MapPin, Clock, Star, Users, Calendar, Coffee, Camera, DollarSign, Info, Utensils, Bookmark, Download, Eye, ThumbsUp, ArrowBigDown } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Maps from './map';
import ItineraryComponent from './Itinerary';
import SidebarDemo from '../destination/sidebar';
import { useDestination } from '../../hooks/useTravelApi';




const Detail = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [savedTrip, setSavedTrip] = useState(false);
  const { slug } = useParams();
  console.log(slug);

  const { destination: data, error, loading } = useDestination(slug)
  console.log(data);


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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className='flex-shrink-0'><SidebarDemo /></div>
      <div className='flex-1 min-w-0 overflow-hidden'>
        {data && data.results && (
          <div className="relative h-110 items-center rounded-b-3xl flex-col bg-gray-900 overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${data.results.image ? `http://localhost:8000${data.results.image}` : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop'})`
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>


            {/* Navigation Bar */}
            <div className="relative z-10 flex items-center justify-between p-3">
              <button className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-black hover:bg-opacity-30 transition-all ml-15">
                <ArrowLeft className="w-6 h-6 text-black " />
              </button>

              <div className="flex items-center space-x-3">
                <button className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-black hover:bg-opacity-30 transition-all">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="flex items-center justify-center px-6 py-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full text-gray-900 font-medium hover:bg-opacity-100 transition-all">
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex items-center justify-center h-full px-6 ">
              <div className="text-center text-white max-w-4xl">
                {/* Main Itinerary Title */}
                {data.results.itineraries && data.results.itineraries.length > 0 && (
                  <div className="mb-6">
                    <h1 className="text-6xl lg:text-8xl font-black text-white mb-4 leading-none tracking-tight">
                      {data.results.itineraries[0].title}
                    </h1>

                    {/* Author and Duration Info */}
                    <div className="flex items-center justify-center space-x-6 text-lg md:text-xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">C</span>
                        </div>
                        <span>cavernsaga</span>
                      </div>
                      <span>|</span>
                      <span>{data.results.itineraries[0].duration_days} days</span>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-center justify-center space-x-2 text-lg md:text-xl mb-8">
                  <MapPin className="w-6 h-6" />
                  <span>{data.results.name}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Header with Details */}


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Enhanced Maps Section */}
          <div className="mb-8">
            <Maps />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Enhanced Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Itinerary Overview Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 ">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-black leading-none tracking-tight mb-1">Daily Itinerary</h2>
                      <p className="text-gray-600 mt-1">Detailed day-by-day activities and experiences</p>
                    </div>
                  </div>
                </div>

                <ItineraryComponent data={data} />
              </div>

              {/* Additional Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* What's Included Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Bookmark className="w-5 h-5 text-green-500 mr-2" />
                    What's Included
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Detailed daily itinerary
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Restaurant recommendations
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Local experience suggestions
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Budget breakdown per day
                    </li>
                  </ul>
                </div>

                {/* Travel Tips Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Info className="w-5 h-5 text-blue-500 mr-2" />
                    Travel Tips
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Best time: October to March
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Book accommodations early
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Carry sun protection
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Try local seafood specialties
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Enhanced Budget Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Day 1 Budget</h3>
                      <p className="text-sm text-gray-600">Per person estimate</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                          <Camera className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Attractions</span>
                          <p className="text-xs text-gray-500">Entry fees & tickets</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">₹{budget.attractions}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <Utensils className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Restaurants</span>
                          <p className="text-xs text-gray-500">Meals & beverages</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">₹{budget.restaurants}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Users className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Experiences</span>
                          <p className="text-xs text-gray-500">Tours & activities</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">₹{budget.experiences}</span>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">Total Day Cost:</span>
                        <span className="font-bold text-green-600 text-xl">₹{budget.total}</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">Excellent value for money</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Price Note</p>
                        <p className="text-xs text-yellow-700 mt-1">Prices may vary by season, location, and current market rates. Budget includes moderate-tier options.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather & Best Time Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  Best Time to Visit
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Peak Season</span>
                    <span className="font-medium text-gray-900">Dec - Feb</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Good Weather</span>
                    <span className="font-medium text-gray-900">Oct - Mar</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Monsoon</span>
                    <span className="font-medium text-gray-900">Jun - Sep</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    <Download className="w-4 h-4" />
                    <span>Download Itinerary</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium">
                    <Share2 className="w-4 h-4" />
                    <span>Share with Friends</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium">
                    <Bookmark className="w-4 h-4" />
                    <span>Add to Wishlist</span>
                  </button>
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