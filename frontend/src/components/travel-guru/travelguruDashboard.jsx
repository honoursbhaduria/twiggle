import React, { useState } from "react";
import {
  CalendarRange,
  Clock,
  Facebook,
  Heart,
  Instagram,
  MapPin,
  Sparkles,
  Upload,
  Users,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";
import SidebarDemo from "../destination/sidebar";

const guru = {
  name: "Sarah Mitchell",
  handle: "@mayatravels",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  headline: "Adventure storyteller crafting immersive journeys across the globe.",
  bio: "Adventure seeker & culture enthusiast. Helping you discover hidden gems with mindful, premium travel experiences.",
  reach: {
    instagram: 45200,
    youtube: 15400,
    facebook: 8920,
  },
};

const latestVideo = {
  title: "Hidden Gems of Goa You Must Visit",
  thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop",
  stats: {
    views: 45200,
    likes: 3400,
    comments: 567,
  },
  summary: "A 72-hour itinerary diving into Goa's coastal culinary scene, serene backwaters, and high-energy nightlife for first timers.",
};

const itineraries = [
  {
    id: 1,
    title: "Ultimate Goa Beach Paradise",
    destination: "Goa, India",
    duration: "7 Days",
    price: "$899",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
    likes: 1243,
    saves: 456,
    tags: ["Sunset cruises", "Premium stays", "Wellness"],
  },
  {
    id: 2,
    title: "Hidden Gems of North Goa",
    destination: "North Goa, India",
    duration: "5 Days",
    price: "$649",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop",
    likes: 892,
    saves: 234,
    tags: ["Heritage cafes", "Beach hopping", "Solo friendly"],
  },
  {
    id: 3,
    title: "Cultural Heritage Trail",
    destination: "Old Goa, India",
    duration: "4 Days",
    price: "$499",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop",
    likes: 678,
    saves: 189,
    tags: ["Architecture", "Local artisans", "Food walks"],
  },
  {
    id: 4,
    title: "Adventure Seeker's Paradise",
    destination: "South Goa, India",
    duration: "6 Days",
    price: "$799",
    image: "https://images.unsplash.com/photo-1580837119756-563d608dd119?w=800&h=600&fit=crop",
    likes: 1456,
    saves: 567,
    tags: ["Cliff diving", "Kayaking", "Night treks"],
  },
];

const spotlightCards = [
  {
    title: "Creator Rewards",
    description: "Earn up to 18% more by sharing premium storyboards for the upcoming festive season.",
    cta: "View incentive program",
    gradient: "from-[#fe6d3c]/20 via-[#fff1e7] to-white",
    icon: Sparkles,
  },
  {
    title: "Upcoming Collaborations",
    description: "Three boutique partners shortlisted your itineraries for luxury travellers.",
    cta: "Review briefs",
    gradient: "from-[#fe6d3c]/15 via-[#ffd4c1] to-white",
    icon: Users,
  },
];

const TravelGuruDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openItineraryDetail = (itinerary) => {
    setSelectedItinerary(itinerary);
  };

  const closeItineraryDetail = () => {
    setSelectedItinerary(null);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      <SidebarDemo />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white via-[#fff4ed] to-[#ffe8dc] p-8 md:p-10"
        >
          <div className="absolute inset-x-10 -top-32 h-56 rounded-full bg-linear-to-r from-[#fe6d3c]/25 via-[#fe6d3c]/12 to-transparent blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <img
                src={guru.avatar}
                alt={guru.name}
                className="h-24 w-24 rounded-2xl object-cover"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#fe6d3c]">Travel Guru Spotlight</p>
                <h1 className="mt-2 text-3xl font-semibold sm:text-4xl font-poppins text-slate-900">{guru.name}</h1>
                <p className="mt-1 text-sm text-[#fe6d3c]">{guru.handle}</p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="rounded-2xl border border-[#fe6d3c]/20 bg-white/90 px-6 py-4"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-[#fe6d3c]">This week</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">"{guru.headline}"</p>
              <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                <CalendarRange className="h-4 w-4 text-[#fe6d3c]" />
                Hosting a live session on mindful slow travel
              </div>
            </motion.div>
          </div>
          <p className="mt-6 max-w-3xl text-sm text-slate-600 md:text-base">{guru.bio}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="rounded-2xl border border-[#fe6d3c]/20 bg-white/85 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.25em] text-[#fe6d3c]">Instagram</p>
                <Instagram className="h-6 w-6 text-[#fe6d3c]" />
              </div>
              <p className="mt-3 text-3xl font-semibold">{guru.reach.instagram.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Community</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="rounded-2xl border border-[#fe6d3c]/20 bg-white/85 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.25em] text-[#fe6d3c]">YouTube</p>
                <Youtube className="h-6 w-6 text-[#fe6d3c]" />
              </div>
              <p className="mt-3 text-3xl font-semibold">{guru.reach.youtube.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Subscribers</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="rounded-2xl border border-[#fe6d3c]/20 bg-white/85 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.25em] text-[#fe6d3c]">Facebook</p>
                <Facebook className="h-6 w-6 text-[#fe6d3c]" />
              </div>
              <p className="mt-3 text-3xl font-semibold">{guru.reach.facebook.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Followers</p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 "
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="rounded-3xl border border-[#fe6d3c]/20 bg-white/95 p-6 lg:col-span-7"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#fe6d3c]">Latest drop</p>
                <h2 className="mt-1 text-2xl font-semibold">{latestVideo.title}</h2>
              </div>
              <button className="rounded-full border border-[#fe6d3c]/40 px-5 py-2 text-sm font-semibold text-[#fe6d3c] transition hover:bg-[#fe6d3c]/10">
                View on YouTube
              </button>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-5">
              <div className="md:col-span-3 overflow-hidden rounded-2xl">
                <img src={latestVideo.thumbnail} alt={latestVideo.title} className="w-60 object-cover" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-4">
                <p className="text-sm text-slate-600 leading-relaxed">{latestVideo.summary}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-[#fe6d3c]/20 bg-[#fff4ed]/60 p-3 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#fe6d3c]">Views</p>
                    <p className="mt-2 text-lg font-semibold">{latestVideo.stats.views.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-[#fe6d3c]/20 bg-[#fff4ed]/60 p-3 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#fe6d3c]">Likes</p>
                    <p className="mt-2 text-lg font-semibold">{latestVideo.stats.likes.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-[#fe6d3c]/20 bg-[#fff4ed]/60 p-3 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#fe6d3c]">Comments</p>
                    <p className="mt-2 text-lg font-semibold">{latestVideo.stats.comments.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-10"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#fe6d3c]">Signature itineraries</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Curated for premium explorers</h2>
            </div>
            <button 
              onClick={openModal}
              className="flex gap-3 rounded-xl bg-linear-to-r from-[#fe6d3c] to-rose-500 px-6 py-2 text-sm font-semibold text-white transition-all hover:from-[#df5b2c] hover:to-[#fe6d3c]"
            >
             <Upload className="w-4"/> Upload Itinerary
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {itineraries.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
                className="group relative overflow-hidden rounded-3xl border border-[#fe6d3c]/20 bg-white transition-shadow hover:shadow-lg cursor-pointer"
                onClick={() => openItineraryDetail(item)}
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">{item.title}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-[#fe6d3c]" /> {item.destination}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-[#fe6d3c]" /> {item.duration}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#fff4ed] px-3 py-1 text-xs text-[#fe6d3c]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-2 font-semibold text-[#fe6d3c]">
                      <Heart className="h-4 w-4 text-[#fe6d3c]" /> {item.likes}
                    </span>
                    <span className="rounded-full bg-[#fff4ed] px-3 py-1 text-xs font-semibold text-[#fe6d3c]">
                      Saved {item.saves}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl bg-white"
          >
            <button
              className="absolute right-4 top-4 text-2xl text-slate-400 hover:text-slate-600 transition-colors"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            
            <div className="px-6 pt-6 pb-6">
              <h2 className="text-lg font-semibold text-slate-900">Upload New Itinerary</h2>
              
              {/* Tabs */}
              <div className="mt-4 flex gap-2 border-b border-slate-200">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-900 border-b-2 border-slate-900">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Link
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Excel File
                </button>
              </div>

              {/* Form Content */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Itinerary Link
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/itinerary"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe6d3c] focus:border-transparent transition-all"
                />
              </div>

              {/* Upload Button */}
              <button className="mt-6 w-full flex items-center justify-center gap-2 bg-[#fe6d3c] hover:bg-[#df5b2c] text-white font-semibold py-3 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Link
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Itinerary Detail Modal */}
      {selectedItinerary && (
        <div className="fixed scrollbar-hide inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="min-h-screen px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto max-w-3xl rounded-3xl bg-white overflow-hidden"
            >
              <button
                className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                onClick={closeItineraryDetail}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Hero Image */}
              <div className="relative h-64 overflow-hidden">
                <img src={selectedItinerary.image} alt={selectedItinerary.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{selectedItinerary.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedItinerary.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedItinerary.duration}
                    </span>
                   
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Description */}
                <section className="mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3">Description</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Experience the breathtaking beauty of {selectedItinerary.destination.split(',')[0]} with guided treks and camping.
                  </p>
                </section>

                {/* Tags */}
                <section className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedItinerary.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-sm text-blue-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Day-by-Day Itinerary */}
                <section>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Day-by-Day Itinerary</h2>
                  <div className="space-y-4">
                    {/* Day 1 */}
                    <div className="rounded border border-slate-200 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center justify-center w-14 h-10 rounded-2xl bg-[#fe6d3c] text-white text-sm font-semibold">
                          Day 1
                        </span>
                        <h3 className="font-semibold text-slate-900">Arrival and Acclimatization</h3>
                      </div>
                      <div className="ml-12 space-y-2 text-sm text-slate-600">
                        <p className="font-semibold text-slate-700">Activities:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Arrival at {selectedItinerary.destination.split(',')[0]}</li>
                          <li>Check-in to hotel</li>
                          <li>Evening walk at Mall Road</li>
                          <li>Welcome dinner and briefing</li>
                        </ul>
                        <p className="pt-2"><span className="font-semibold text-slate-700">Accommodation:</span> Mountain View Resort</p>
                        <p><span className="font-semibold text-slate-700">Meals:</span> Dinner</p>
                      </div>
                    </div>

                    {/* Day 2 */}
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center justify-center w-14 h-10 rounded-2xl bg-[#fe6d3c] text-white text-sm font-semibold">
                          Day 2
                        </span>
                        <h3 className="font-semibold text-slate-900">Exploration Day</h3>
                      </div>
                      <div className="ml-12 space-y-2 text-sm text-slate-600">
                        <p className="font-semibold text-slate-700">Activities:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Early morning breakfast</li>
                          <li>Trek to scenic viewpoint (4-5 hours)</li>
                          <li>Adventure activities - {selectedItinerary.tags[0]?.toLowerCase()}</li>
                          <li>Camping setup and bonfire</li>
                        </ul>
                        <p className="pt-2"><span className="font-semibold text-slate-700">Accommodation:</span> Campsite</p>
                        <p><span className="font-semibold text-slate-700">Meals:</span> Breakfast, Lunch, Dinner</p>
                      </div>
                    </div>

                    {/* Day 3 */}
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center justify-center w-14 h-10 rounded-2xl bg-[#fe6d3c] text-white text-sm font-semibold">
                          Day 3
                        </span>
                        <h3 className="font-semibold text-slate-900">Peak Expedition</h3>
                      </div>
                      <div className="ml-12 space-y-2 text-sm text-slate-600">
                        <p className="font-semibold text-slate-700">Activities:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Summit attempt to nearby peak</li>
                          <li>Photography session</li>
                          <li>Return to base camp</li>
                          <li>Cultural evening with locals</li>
                        </ul>
                        <p className="pt-2"><span className="font-semibold text-slate-700">Accommodation:</span> Mountain Lodge</p>
                        <p><span className="font-semibold text-slate-700">Meals:</span> Breakfast, Lunch, Dinner</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Stats */}
                <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-6 text-sm text-slate-600">
                    <span className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-[#fe6d3c]" />
                      <span className="font-semibold text-slate-900">{selectedItinerary.likes.toLocaleString()}</span> likes
                    </span>
                    <span className="rounded-full bg-[#fff4ed] px-3 py-1 text-xs font-semibold text-[#fe6d3c]">
                      {selectedItinerary.saves.toLocaleString()} saves
                    </span>
                  </div>
                  
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelGuruDashboard





