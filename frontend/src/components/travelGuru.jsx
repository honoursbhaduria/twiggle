import React, { useState } from 'react';
import { Star, MapPin, Calendar, Users, Heart, Play, CheckCircle } from 'lucide-react';
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const TravelGurus = () => {
  const [hoveredGuru, setHoveredGuru] = useState(null);

  const gurus = [
    {
      id: 1,
      name: "Varun Vagish",
      designation: "Adventure & Trekking",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      quote: "Mountain enthusiast exploring India's majestic peaks and hidden trails",
      followers: "2.3M",
      rating: 4.9,
      trips: 150,
    },
    {
      id: 2,
      name: "Tyler durden",
      designation: "Cultural & Heritage",
      src: "https://images.unsplash.com/photo-1516570161787-2fd917215a3d?w=300&h=300&fit=crop&crop=face",
      quote: "Actress turned travel expert showcasing India's rich cultural heritage",
      followers: "1.8M",
      rating: 4.8,
      trips: 200,
    },
    {
      id: 3,
      name: "Deepanshu Sangwan",
      designation: "Budget Travel",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      quote: "Expert in discovering incredible destinations on a shoestring budget",
      followers: "1.2M",
      rating: 4.9,
      trips: 180,
    }
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2  bg-gradient-to-br  ">
       
      {/* Header Section */}
      <div className="relative items-center my-auto items  max-w-7xl mx-auto text-center ">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg mb-6 border border-gray-100">
          <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600">Featured Creators</span>
        </div>
        
        <h1 className="text-6xl font-semibold mb-6">
          Meet Our{' '}
          <span className="bg-black font-bold text-shadow-2xs bg-clip-text text-transparent">
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

      <div className='mx-auto my-auto'>
         <AnimatedTestimonials gurus={gurus} />;
      </div>

      

     

     
    </div>
  );
};

export default TravelGurus;