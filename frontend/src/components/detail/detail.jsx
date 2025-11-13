import React, { useState } from 'react';
import { ArrowLeft, Heart, MapPin, DollarSign } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Maps from './map';
import ItineraryComponent from './Itinerary';
import SidebarDemo from '../destination/sidebar';
import { useAuth, useItinerary } from '../../hooks/useTravelApi';
import Lottie from 'lottie-react';
import animationData from "../destination/animation.json";

const Detail = () => {
  const [savedTrip, setSavedTrip] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data, error, loading } = useItinerary(slug);

  const handleSave = () => setSavedTrip((prev) => !prev);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#fe6d3c]/15 via-white to-white">
        <Lottie animationData={animationData} loop className="h-64 w-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#fe6d3c]/10 via-white to-white px-6">
  <div className="max-w-md rounded-2xl border border-[#fe6d3c]/30 bg-white p-6 text-center">
          <p className="text-base font-semibold text-[#fe6d3c]">We couldn't load this trip.</p>
          <p className="mt-2 text-sm text-gray-600">{error.message}</p>
          <button
            onClick={() => navigate('/destination')}
            className="mt-5 w-full rounded-full bg-[#fe6d3c] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#df5b2c]"
          >
            Back to explorer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen gap-0 bg-linear-to-br from-[#fe6d3c]/12 via-white to-white md:gap-20">
      <div className="text-white">
        <SidebarDemo />
      </div>
      <div className="flex-1 min-w-0 items-center overflow-hidden">
        {data && (
          <div className="relative h-150 flex-col items-center overflow-hidden rounded-b-3xl bg-slate-900 md:h-110">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${data?.thumbnail ? `http://localhost:8000${data?.thumbnail}` : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop'})`
              }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-black/80 via-[#fe6d3c]/25 to-black/75" />
            </div>

            {/* Navigation Bar */}
            <div className="relative z-10 mx-5 flex items-center justify-between p-3">
              <button
                onClick={() => navigate('/destination')}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fe6d3c] text-white transition-all hover:bg-[#df5b2c]"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSave}
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                      savedTrip ? 'bg-white text-[#fe6d3c]' : 'bg-[#fe6d3c] text-white hover:bg-[#df5b2c]'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${savedTrip ? 'fill-current' : ''}`} />
                  </button>
                  <button className="flex items-center justify-center rounded-full bg-[#fe6d3c] px-6 py-3 font-medium text-white transition-all hover:bg-[#df5b2c]">
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => navigate(`/destination/iteanary/edit/${slug}`)}
                    className="flex h-12 w-29 items-center justify-center rounded-full bg-white/20 px-5 font-medium text-white transition-all hover:bg-white/30"
                  >
                    Customize
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="flex h-12 w-20 items-center justify-center rounded-full bg-[#fe6d3c] font-medium text-white transition-all hover:bg-[#df5b2c]"
                >
                  Login
                </button>
              )}
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex h-full items-center justify-center px-6">
              <div className="max-w-4xl text-center text-white">
                {/* Main Itinerary Title */}
                <div className="mb-6">
                  <h1 className="mb-4 text-6xl font-black leading-none tracking-tight text-white lg:text-8xl">
                    {data?.title || 'Travel Itinerary'}
                  </h1>

                  {/* Author and Duration Info */}
                  <div className="flex items-center justify-center space-x-6 text-lg md:text-xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fe6d3c]">
                        <span className="text-sm font-bold text-white">T</span>
                      </div>
                      <span>Travel Guide</span>
                    </div>
                    <span className="text-white/60">|</span>
                    <span>{data?.duration_days || 0} days</span>
                    <span className="text-white/60">|</span>
                    <span>{data?.duration_nights || 0} nights</span>
                  </div>
                </div>

                {/* Location and highlights */}
                <div className="mb-4 flex items-center justify-center space-x-3 text-lg md:text-xl">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span className="tracking-wide text-white/80">{data?.highlighted_places || 'Goa'}</span>
                </div>

                {/* Total Budget */}
                {data?.total_budget && (
                  <div className="mt-6 flex items-center justify-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <DollarSign className="h-6 w-6" />
                    <span className="text-2xl font-bold">₹{data.total_budget.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Enhanced Maps Section */}
          <div className="mb-8 overflow-hidden rounded-3xl border border-[#fe6d3c]/20 bg-white/90 backdrop-blur">
            <Maps data={data} />
          </div>

          <div>
            {/* Enhanced Main Content */}
            <div>
              {/* Itinerary Overview Card */}
              <div className="rounded-full bg-white">
                <ItineraryComponent data={data} />
              </div>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="flex items-center justify-center py-4">
            <div className="flex w-6xl items-center justify-center gap-20 rounded-2xl border border-[#fe6d3c]/30 bg-linear-to-r from-[#fe6d3c]/18 via-white to-[#fe6d3c]/12 px-10 py-4 text-center">
              <p className="font-medium text-gray-800">One step away! Log in to explore more</p>
              <button
                onClick={() => navigate('/auth')}
                className="rounded-lg bg-[#fe6d3c] px-6 py-2 text-white transition-colors hover:bg-[#df5b2c]"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;

