import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Settings, MapPin, Clock, Star, Users, Calendar, Coffee, Camera, DollarSign, Info, Utensils, Bookmark, Download, Eye, ThumbsUp, ArrowBigDown } from 'lucide-react';
import { useNavigate, useParams, useRouteError } from 'react-router-dom';
import Maps from './map';
import ItineraryComponent from './Itinerary';
import SidebarDemo from '../destination/sidebar';
import { useAuth, useDestination } from '../../hooks/useTravelApi';




const Detail = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [savedTrip, setSavedTrip] = useState(false);
  const { slug } = useParams();
  console.log(slug);

  const navigate=useNavigate()

  const {isAuthenticated}=useAuth()
  console.log(isAuthenticated);
  

  const { destination: data, error, loading } = useDestination(slug)
  console.log(data);


  const handleSave = () => {
    setSavedTrip(!savedTrip);
  };

  return (
    <div className="min-h-screen gap-20 bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className=''><SidebarDemo/></div>
      <div className='flex-1 min-w-0 overflow-hidden items-center '>
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
            <div className="relative z-10 flex items-center justify-between p-3 mx-5">
              <button onClick={()=>navigate("/destination")} className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-black hover:bg-opacity-30 transition-all ">
                <ArrowLeft className="w-6 h-6 text-black " />
              </button>

              {
                isAuthenticated ?  <div className="flex items-center space-x-3">
                <button className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-black hover:bg-opacity-30 transition-all">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="flex items-center justify-center px-6 py-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full text-gray-900 font-medium hover:bg-opacity-100 transition-all">
                  <span>Save</span>
                </button>
                <button onClick={()=>navigate(`/destination/${slug}/edit`)} className="flex items-center justify-center w-29 font-medium h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-black hover:bg-opacity-30 transition-all">
                  Customize
                </button>
              </div> :
               <button onClick={()=>navigate("/auth")} className="flex items-center justify-center w-20 font-medium h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-black hover:bg-opacity-30 transition-all">
                  Login
                </button>

              }

             
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

          </div>
        </div>

       {!isAuthenticated &&  <div className='flex items-center justify-center  py-4'>
          <div className='text-center flex w-6xl bg-gray-200 items-center justify-center px-10 gap-20 p-2 rounded-2xl'>
            <p className='text-black'>One step away! Log in to explore more</p>
            <button onClick={()=>navigate("/auth")} className='bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors'>Login</button>
          </div>
        </div>}
      </div>

      
    </div>
  );
};

export default Detail;