import React, { useState } from "react";
import {
  Bookmark,
  CalendarRange,
  Clock,
  Facebook,
  Heart,
  Instagram,
  MapPin,
  Sparkles,
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
    gradient: "from-sky-100 via-blue-50 to-slate-50",
    icon: Sparkles,
  },
  {
    title: "Upcoming Collaborations",
    description: "Three boutique partners shortlisted your itineraries for luxury travellers.",
    cta: "Review briefs",
    gradient: "from-rose-100 via-pink-50 to-amber-50",
    icon: Users,
  },
];

const TravelGuruProfile = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const handleCardClick = (item) => {
    setSelectedItinerary(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
          className="relative overflow-hidden rounded-3xl border border-[#fe6d3c]/25 bg-linear-to-br from-white via-[#fff4ed] to-[#ffe8dc] p-8 md:p-10"
        >
          <div className="absolute inset-x-10 -top-32 h-56 rounded-full bg-linear-to-r from-[#fe6d3c]/25 via-[#fe6d3c]/20 to-transparent blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <img
                src={guru.avatar}
                alt={guru.name}
                className="h-24 w-24 rounded-2xl border-4 border-white object-cover"
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
              className="rounded-2xl border border-white/70 bg-white px-6 py-4"
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
              className="rounded-2xl border border-[#fe6d3c]/25 bg-white/85 p-4"
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
              className="rounded-2xl border border-[#fe6d3c]/25 bg-white/85 p-4"
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
              className="rounded-2xl border border-[#fe6d3c]/25 bg-white/85 p-4"
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
            className="rounded-3xl bg-white p-6 border border-[#fe6d3c]/25 lg:col-span-7"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#fe6d3c]">Latest drop</p>
                <h2 className="mt-1 text-2xl font-semibold">{latestVideo.title}</h2>
              </div>
              <button className="rounded-full border border-[#fe6d3c]/40 px-5 py-2 text-sm font-semibold text-[#fe6d3c] hover:bg-[#fe6d3c]/10">
                View on YouTube
              </button>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-5">
              <div className=" overflow-hidden rounded-2xl">
                <img src={latestVideo.thumbnail} alt={latestVideo.title} className="h-40 object-cover" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-4">
                <p className="text-sm text-slate-600 leading-relaxed">{latestVideo.summary}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-[#fe6d3c]/25 bg-[#fff4ed]/40 p-3 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#fe6d3c]">Views</p>
                    <p className="mt-2 text-lg font-semibold">{latestVideo.stats.views.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-[#fe6d3c]/25 bg-[#fff4ed]/40 p-3 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#fe6d3c]">Likes</p>
                    <p className="mt-2 text-lg font-semibold">{latestVideo.stats.likes.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-[#fe6d3c]/25 bg-[#fff4ed]/40 p-3 text-center">
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
           
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {itineraries.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
                className="group relative overflow-hidden rounded-3xl border border-[#fe6d3c]/20 bg-white transition-shadow hover:shadow-md cursor-pointer"
                onClick={() => handleCardClick(item)}
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/35 via-transparent to-transparent" />
                 
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
                      <span key={tag} className="rounded-full bg-[#fff4ed]/60 px-3 py-1 text-xs text-[#fe6d3c]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-2 font-semibold text-[#fe6d3c]">
                      <Heart className="h-4 w-4 text-[#fe6d3c]" /> {item.likes}
                    </span>
                   
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {modalOpen && selectedItinerary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#fe6d3c]/30">
            <button
              className="absolute right-4 top-4 text-2xl text-slate-400 hover:text-slate-600"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <div className="px-6 pt-8 pb-6">
              <h2 className="text-xl font-semibold text-slate-900 text-center">{selectedItinerary.title}</h2>
              <div className="relative mt-4 h-44 overflow-hidden rounded-xl border border-slate-100">
                <img src={selectedItinerary.image} alt={selectedItinerary.title} className="h-full w-full object-cover blur-sm scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-lg bg-slate-900/70 px-4 py-2 text-sm font-semibold text-white">Premium Content</span>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-slate-600">
                {selectedItinerary.destination}
              </div>
              <div className="mt-1 text-center text-xs text-slate-500">
                Duration: {selectedItinerary.duration}
              </div>
              <p className="mt-4 text-center text-xs text-slate-500 leading-relaxed">
                Unlock the full itinerary with day-wise plans, partner offers, and downloadable content by subscribing to the premium creator tier.
              </p>
              <button
                className="mt-5 w-full rounded-full bg-[#fe6d3c] py-3 text-sm font-semibold text-white hover:bg-[#fe6d3c] transition-colors"
                onClick={closeModal}
              >
                Go Premium
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelGuruProfile;





