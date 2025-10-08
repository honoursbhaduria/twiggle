import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Settings, MapPin, Clock, Star, Users, Calendar, Coffee, Camera, DollarSign, Info, Utensils, Bookmark, Download, Eye, ThumbsUp, ArrowBigDown } from 'lucide-react';
import { useNavigate, useParams, useRouteError } from 'react-router-dom';
import Maps from './map';
import ItineraryComponent from './Itinerary';
import SidebarDemo from '../destination/sidebar';
import { useAuth, useItinerary } from '../../hooks/useTravelApi';
import Lottie from 'lottie-react';
import animationData from "../destination/animation.json"




const Detail = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [savedTrip, setSavedTrip] = useState(false);
  const { slug } = useParams();
  console.log(slug);
 

  const navigate=useNavigate()

  const {isAuthenticated}=useAuth()
  console.log(isAuthenticated);
  

  const {  data, error, loading } = useItinerary(slug)
  console.log(data);


  const handleSave = () => {
    setSavedTrip(!savedTrip);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lottie
                  animationData={animationData}
                  loop={true}
                  className="absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 "
                  style={{ width: "300px", height: "500px" }}
                />;
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading itinerary: {error.message}</p>
          <button 
            onClick={() => navigate('/destination')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gap-0 md:gap-20 bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className=' text-white'><SidebarDemo/></div>
      <div className='flex-1 min-w-0 overflow-hidden items-center '>
        {data  && (
          <div className="relative h-150 md:h-110 items-center rounded-b-3xl flex-col bg-gray-900 overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${data?.thumbnail ? `http://localhost:8000${data?.thumbnail}` : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop'})`
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>


            {/* Navigation Bar */}
            <div className="relative z-10 flex items-center justify-between p-3 mx-5">
              <button onClick={()=>navigate("/destination")} className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full md:ml-0 ml-5 text-black hover:bg-opacity-30 transition-all ">
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
                <button onClick={()=>navigate(`/destination/iteanary/edit/${slug}`)} className="flex items-center justify-center w-29 font-medium h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-black hover:bg-opacity-30 transition-all">
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
                <div className="mb-6">
                  <h1 className="text-6xl lg:text-8xl font-black text-white mb-4 leading-none tracking-tight">
                    {data?.title || 'Travel Itinerary'}
                  </h1>

                  {/* Author and Duration Info */}
                  <div className="flex items-center justify-center space-x-6 text-lg md:text-xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">T</span>
                      </div>
                      <span>Travel Guide</span>
                    </div>
                    <span>|</span>
                    <span>{data?.duration_days || 0} days</span>
                    <span>|</span>
                    <span>{data?.duration_nights || 0} nights</span>
                  </div>
                </div>

                {/* Location and highlights */}
                <div className="flex items-center justify-center space-x-2 text-lg md:text-xl mb-4">
                  <MapPin className="w-6 h-6 mb-7" />
                  <span>{data?.highlighted_places || 'Goa'}</span>
                </div>

                

                {/* Total Budget */}
                {data?.total_budget && (
                  <div className="mt-6 flex items-center justify-center space-x-2">
                    <DollarSign className="w-6 h-6" />
                    <span className="text-2xl font-bold">₹{data.total_budget.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Header with Details */}

        

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Enhanced Maps Section */}
          <div className="mb-8">
            <Maps  data={data}/>
          </div>

          <div className="">
            {/* Enhanced Main Content */}
            <div className="">
              {/* Itinerary Overview Card */}
              <div className=" rounded-2xl shadow-lg overflow-hidden">
              

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