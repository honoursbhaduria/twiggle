import { Search, Heart, MapPin, Clock, Wallet, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useAllDestination } from "../../hooks/useTravelApi";
import Lottie from "lottie-react";
import animationData from "./animation.json"

export default function TravelCard({ initialSearchQuery = '' }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [likedItems, setLikedItems] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const { data, loading, error } = useAllDestination()
  const hoverIntervals = useRef({});

  // Update search query when initialSearchQuery changes (from URL)
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  console.log('Data structure:', data);
  console.log('Search query:', searchQuery);
  console.log('Initial search query from URL:', initialSearchQuery);

  const tabs = ['All', 'Itineraries','Adventure', 'Beaches', 'Cultural', 'Family', 'Romantic', 'Wildlife'];

  const toggleLike = (id) => {
    setLikedItems(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      return newLiked;
    });
  };

  // Image carousel functions
  const changeImage = (destinationId, totalImages, direction = 1) => {
    if (totalImages <= 1) return;

    setCurrentImageIndex(prev => {
      const current = prev[destinationId] || 0;
      const nextIndex = (current + direction + totalImages) % totalImages;

      return {
        ...prev,
        [destinationId]: nextIndex,
      };
    });
  };

  const handleImageClick = (destinationId, totalImages) => {
    changeImage(destinationId, totalImages, 1);
  };

  const handleNextImage = (destinationId, totalImages) => {
    changeImage(destinationId, totalImages, 1);
  };

  const handlePrevImage = (destinationId, totalImages) => {
    changeImage(destinationId, totalImages, -1);
  };

  const handleDotClick = (destinationId, imageIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => ({
      ...prev,
      [destinationId]: imageIndex
    }));
  };

  // Filter destinations based on search query & category tab
  const filteredDestinations = useMemo(() => {
    if (!data?.results || !Array.isArray(data.results)) {
      return [];
    }

    const baseList = data.results;
    const query = searchQuery.toLowerCase().trim();
    const tab = activeTab.toLowerCase();

    return baseList.filter((destination) => {
      const matchesSearch = !query || [
        destination.name,
        destination.description,
        destination.short_description,
        destination.slug
      ].some((field) => field?.toLowerCase().includes(query));

      const matchesTab = activeTab === 'All' ||
        destination?.categories?.some((category) => category?.name?.toLowerCase() === tab || category?.slug?.toLowerCase() === tab) ||
        destination?.tags?.some((tag) => tag?.name?.toLowerCase() === tab || tag?.toLowerCase?.() === tab);

      return matchesSearch && matchesTab;
    });
  }, [data, searchQuery, activeTab]);

  useEffect(() => {
    return () => {
      Object.values(hoverIntervals.current).forEach(intervalId => {
        if (intervalId) clearInterval(intervalId);
      });
      hoverIntervals.current = {};
    };
  }, []);

  if (loading) return   <Lottie
                animationData={animationData}
                loop={true}
                className="absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 "
                style={{ width: "300px", height: "500px" }}
              />
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white w-full">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-500">Destinations</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Find your next story-worthy escape</h1>
            <p className="text-slate-500 mt-3 max-w-2xl">
              Browse hand-crafted itineraries with the right balance of experiences, food, and downtime. Filter, shortlist, and dive deeper into the journeys that resonate with you.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-400" />
            {filteredDestinations.length} destination{filteredDestinations.length === 1 ? '' : 's'} curated for you
          </div>
        </div>

        

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search destinations, experiences, or keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-slate-500">
              Found {filteredDestinations.length} destination(s) matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Featured Guides Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Featured destinations</h2>
            <div className="text-sm text-slate-500">
              {activeTab === 'All' ? 'Explore everything in our catalogue.' : `Curated picks for “${activeTab}” getaways.`}
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p>Loading destinations...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600">
              <p>Error loading destinations: {error.message}</p>
            </div>
          )}

          {!loading && !error && data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((destination) => (
                  <Link to={`/destination/${destination.slug}`} key={destination.id} className="block h-full">
                    <article className="group flex flex-col h-full rounded-3xl border border-slate-100 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
                      <div 
                        className="relative h-64 md:h-60 lg:h-56 bg-slate-200 overflow-hidden"
                        onMouseEnter={() => {
                          const totalImages = destination.images?.length || 0;
                          if (totalImages <= 1) return;

                          if (hoverIntervals.current[destination.id]) {
                            clearInterval(hoverIntervals.current[destination.id]);
                          }

                          hoverIntervals.current[destination.id] = setInterval(() => {
                            changeImage(destination.id, totalImages, 1);
                          }, 2000);
                        }}
                        onMouseLeave={() => {
                          if (hoverIntervals.current[destination.id]) {
                            clearInterval(hoverIntervals.current[destination.id]);
                            delete hoverIntervals.current[destination.id];
                          }
                        }}
                      >
                        {destination.images?.length ? (
                          <img
                            src={destination.images?.[currentImageIndex[destination.id] || 0] || destination.images?.[0]}
                            alt={destination.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (destination.images?.length > 1) {
                                handleImageClick(destination.id, destination.images.length);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-100 to-white flex items-center justify-center text-slate-400 text-sm font-medium">
                            Image coming soon
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-900/10 to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

                        {destination.images && destination.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePrevImage(destination.id, destination.images.length);
                              }}
                              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white opacity-0 pointer-events-none backdrop-blur transition hover:bg-white/60 group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto"
                              aria-label="Previous photo"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleNextImage(destination.id, destination.images.length);
                              }}
                              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white opacity-0 pointer-events-none backdrop-blur transition hover:bg-white/60 group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto"
                              aria-label="Next photo"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </>
                        )}

                        {/* Image dots indicator */}
                        {destination.images && destination.images.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {destination.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => handleDotClick(destination.id, index, e)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 border border-white/60 ${
                                  (currentImageIndex[destination.id] || 0) === index
                                    ? 'bg-white scale-125'
                                    : 'bg-white/30 hover:bg-white/60'
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Heart icon */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleLike(destination.id);
                          }}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white/25 backdrop-blur hover:bg-white/40 transition-colors"
                        >
                          <Heart
                            className={`w-6 h-6 ${likedItems.has(destination.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-white hover:text-red-400'
                              } transition-colors`}
                          />
                        </button>

                        {/* Title overlay */}
                        <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow-lg">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wider mb-1">
                            <MapPin className="w-4 h-4" />
                            <span className="text-base">{destination.highlighted_places || destination.name}</span>
                          </div>
                        </div>

                      </div>

                      {/* Card Content */}
                      <div className="flex-1 flex flex-col gap-4 p-5">
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {destination.short_description || destination.description || 'Discover curated experiences, local favorites, and thoughtful downtime built into this itinerary.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                          {(destination.duration_days || destination.duration_nights) && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                              <Clock className="w-3 h-3" />
                              {destination.duration_days || 0}D{destination.duration_nights ? `/${destination.duration_nights}N` : ''}
                            </span>
                          )}
                          {destination.total_budget && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
                              <Wallet className="w-3 h-3" />
                              ₹{destination.total_budget.toLocaleString('en-IN')}
                            </span>
                          )}
                          {destination.tags?.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600">
                              <Tag className="w-3 h-3" />
                              {tag?.name || tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 text-sm font-semibold">
                          <span className="text-blue-600 group-hover:text-blue-700 transition-colors">View itinerary</span>
                          <span className="text-slate-400 text-xs">#{destination.slug}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-500">No destinations found matching your filters. Try another keyword or category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}