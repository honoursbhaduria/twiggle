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

          <div className="">
            {/* Enhanced Main Content */}
            <div className="">
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

             
            </div>

            {/* sidebar */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;