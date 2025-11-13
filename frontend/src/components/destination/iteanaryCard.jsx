import { Search, Heart, MapPin, Clock, Wallet, Tag } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth, useDestination } from "../../hooks/useTravelApi";
import Lottie from "lottie-react";
import animationData from "./animation.json"
import { Sidebar } from "../ui/sidebar";
import SidebarDemo from "./sidebar";
import { Button } from "../ui/button";


export default function ItearnaryCard({ initialSearchQuery = '' }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [likedItems, setLikedItems] = useState(new Set());
  const {slug}=useParams()
  console.log(slug);

  const tabs = ['All', 'Popular Destinations' ,'Proximity' , 'Hidden gems','Luxury Travel', 'Adventure Seekers', 'Budget Travel', 'Solo Traveler', 'Offbeat Adventures', 'Photography Tours','Relaxing Getaways'];
  
    const {isAuthenticated}=useAuth()
    console.log(isAuthenticated);
    

  const navigate=useNavigate()
  
  const { destination:data, loading, error } = useDestination(slug)
  console.log("test:",data);
  

  // Update search query when initialSearchQuery changes (from URL)
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  console.log('Data structure:', data);
  console.log('Search query:', searchQuery);
  console.log('Initial search query from URL:', initialSearchQuery);


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

  // Filter destinations based on search query and active tab
  const filteredDestinations = useMemo(() => {
    if (!data?.results || !Array.isArray(data.results)) {
      return [];
    }

    let filtered = data.results;

    // Filter by active tab
    if (activeTab !== 'All') {
      filtered = filtered.filter(destination => {
        // Check if the destination has tags that match the active tab
        const tags = destination.tags || [];
        const title = destination.title || '';
        const description = destination.description || '';
        
        const tabLower = activeTab.toLowerCase();
        
        // Check tags array
        const hasMatchingTag = tags.some(tag => {
          const tagName = typeof tag === 'string' ? tag : tag?.name || '';
          return tagName.toLowerCase().includes(tabLower) || 
                 tabLower.includes(tagName.toLowerCase());
        });
        
        // Also check title and description for tab keywords
        const matchesContent = title.toLowerCase().includes(tabLower) || 
                              description.toLowerCase().includes(tabLower);
        
        return hasMatchingTag || matchesContent;
      });
    }

    // Filter by search query
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(destination => {
        return [destination.title, destination.description, destination.slug]
          .some((field) => field?.toLowerCase().includes(query));
      });
    }

    return filtered;
  }, [data, searchQuery, activeTab]);

  if (loading) return <Lottie
                  animationData={animationData}
                  loop={true}
                  className="absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 "
                  style={{ width: "300px", height: "500px" }}
                />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      
     <div><SidebarDemo/></div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#fe6d3c]">Itineraries - {slug}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Curated journeys tailored to {data?.title || 'your travel goals'}</h1>
            <p className="text-slate-600 mt-3 max-w-2xl">
              Scroll through the day-by-day breakdowns, signature experiences, and logistics we’ve already planned so you can focus on the memories.
            </p>
          
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-white border border-[#fe6d3c]/30 rounded-full px-4 py-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#fe6d3c]" />
            {filteredDestinations.length} itinerary{filteredDestinations.length === 1 ? '' : 'ies'} available
          </div>
        </div>

      

        {/* Search Bar */}
        <div className="relative mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search itineraries, experiences, or keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur border border-[#fe6d3c]/25 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#fe6d3c]/30 focus:border-[#fe6d3c] transition-all "
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-slate-500">
              Found {filteredDestinations.length} itinerary matching "{searchQuery}"
            </div>
          )}
        </div>

         {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide">
          {tabs.map((tab) => {
            // Count items for each tab
            const tabCount = tab === 'All' 
              ? data?.results?.length || 0
              : (data?.results || []).filter(destination => {
                  const tags = destination.tags || [];
                  const title = destination.title || '';
                  const description = destination.description || '';
                  const tabLower = tab.toLowerCase();
                  
                  const hasMatchingTag = tags.some(t => {
                    const tagName = typeof t === 'string' ? t : t?.name || '';
                    return tagName.toLowerCase().includes(tabLower) || 
                           tabLower.includes(tagName.toLowerCase());
                  });
                  
                  const matchesContent = title.toLowerCase().includes(tabLower) || 
                                        description.toLowerCase().includes(tabLower);
                  
                  return hasMatchingTag || matchesContent;
                }).length;
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 whitespace-nowrap  ${
                  activeTab === tab
                    ? 'bg-[#fe6d3c] text-white border-[#fe6d3c]'
                    : 'bg-white text-slate-600 border-[#fe6d3c]/30 hover:border-[#fe6d3c]/60 hover:text-slate-900'
                }`}
              >
                {tab}
                {tabCount > 0 && (
                  <span className={`ml-2 text-xs ${
                    activeTab === tab ? 'text-black/70' : 'text-slate-400'
                  }`}>
                    ({tabCount})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Featured Guides Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                {activeTab === 'All' ? 'Featured itineraries' : `${activeTab} itineraries`}
              </h2>
              {activeTab !== 'All' && (
                <p className="text-sm text-slate-500 mt-1">
                  Showing {filteredDestinations.length} {filteredDestinations.length === 1 ? 'itinerary' : 'itineraries'}
                </p>
              )}
            </div>
            <Button
              onClick={()=>navigate("/iteanary/create")}
              className="bg-[#fe6d3c] text-white font-normal tracking-widest uppercase hover:bg-[#fe6d3c]"
            >
              Create your Itineraries
            </Button>
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
                filteredDestinations.map((destination) => {
                  const handleCardClick = (e) => {
                    if (!isAuthenticated) {
                      localStorage.setItem('intendedDestination', `/destination/iteanary/${destination.slug}`)
                    }
                  }
                  
                  return (
                    <Link to={isAuthenticated? `/destination/iteanary/${destination.slug}`:"/auth"} onClick={handleCardClick} key={destination.id} className="block h-full">
                      <article className="group flex flex-col h-full rounded-3xl border border-[#fe6d3c]/20 bg-white transition-transform duration-300 hover:-translate-y-1  overflow-hidden">
                      <div className="relative aspect-4/3 bg-slate-200">
                        {destination.thumbnail ? (
                          <img
                            src={destination.thumbnail}
                            alt={destination.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-slate-200 via-slate-100 to-white flex items-center justify-center text-slate-400 text-sm font-medium">
                            Image coming soon
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-slate-900/10 to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

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

                        <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow-lg">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wider mb-1">
                            <MapPin className="w-3 h-3" />
                            <span className="text-base">{destination.highlighted_places || destination.title}</span>
                          </div>
                         
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-4 p-5">
                        <p className="text-sm text-slate-600 leading-relaxed font-sp line-clamp-3">
                          {destination.short_description || destination.description || 'This itinerary balances must-see highlights with local discoveries and built-in breathing space.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                          {(destination.duration_days || destination.duration_nights) && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fe6d3c]/20 border border-[#fe6d3c]/40 text-slate-700">
                              <Clock className="w-3 h-3" />
                              {destination.duration_days || 0}D{destination.duration_nights ? `/${destination.duration_nights}N` : ''}
                            </span>
                          )}
                          {destination.total_budget && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fe6d3c]/15 border border-[#fe6d3c]/40 text-[#fe6d3c]">
                              <Wallet className="w-3 h-3" />
                              ₹{destination.total_budget.toLocaleString('en-IN')}
                            </span>
                          )}
                          {destination.tags?.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fe6d3c]/15 border border-[#fe6d3c]/30 text-[#fe6d3c]">
                              <Tag className="w-3 h-3" />
                              {tag?.name || tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#fe6d3c]/25 text-sm font-semibold">
                          <span className="text-[#fe6d3c] group-hover:text-[#fe6d3c] transition-colors">View itinerary</span>
                          <span className="text-slate-400 text-xs">#{destination.slug}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="text-5xl mb-4">🔍</div>
                    {searchQuery ? (
                      <>
                        <p className="text-slate-700 font-semibold mb-2">No itineraries found</p>
                        <p className="text-slate-500 text-sm">
                          No matches for "{searchQuery}" in {activeTab === 'All' ? 'any category' : activeTab}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-700 font-semibold mb-2">No itineraries available</p>
                        <p className="text-slate-500 text-sm">
                          There are no itineraries in the {activeTab} category yet.
                        </p>
                      </>
                    )}
                    {activeTab !== 'All' && (
                      <button
                        onClick={() => setActiveTab('All')}
                        className="mt-4 px-4 py-2 text-sm font-semibold text-black bg-[#fe6d3c] hover:bg-[#fe6d3c] transition-colors rounded-full"
                      >
                        View all itineraries
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




