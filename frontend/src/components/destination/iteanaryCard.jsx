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

  // Filter destinations based on search query
  const filteredDestinations = useMemo(() => {
    if (!data?.results || !Array.isArray(data.results)) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    return data.results.filter(destination => {
      if (!query) return true;
      return [destination.title, destination.description, destination.slug]
        .some((field) => field?.toLowerCase().includes(query));
    });
  }, [data, searchQuery]);

  if (loading) return <Lottie
                  animationData={animationData}
                  loop={true}
                  className="absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 "
                  style={{ width: "300px", height: "500px" }}
                />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white w-full">
      {/* Header */}
      
     <div><SidebarDemo/></div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">Itineraries</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Curated journeys tailored to {data?.title || 'your travel goals'}</h1>
            <p className="text-slate-500 mt-3 max-w-2xl">
              Scroll through the day-by-day breakdowns, signature experiences, and logistics we’ve already planned so you can focus on the memories.
            </p>
          
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-400" />
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
              value={searchQuery || slug}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-slate-500">
              Found {filteredDestinations.length} itinerary matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Featured Guides Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Featured itineraries</h2>
             <Button onClick={()=>navigate("/iteanary/create")} className={"bg-[#479FDC] uppercase hover:bg-[#479FD4] "}>Create your Itineraries</Button>
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
                  <Link to={isAuthenticated? `/destination/iteanary/${destination.slug}`:"/auth"} key={destination.id} className="block h-full">
                    <article className="group flex flex-col h-full rounded-3xl border border-slate-100 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
                      <div className="relative aspect-[4/3] bg-slate-200">
                        {destination.thumbnail ? (
                          <img
                            src={destination.thumbnail}
                            alt={destination.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-100 to-white flex items-center justify-center text-slate-400 text-sm font-medium">
                            Image coming soon
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

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
                          <span className="text-blue-500 group-hover:text-blue-600 transition-colors">View itinerary</span>
                          <span className="text-slate-400 text-xs">#{destination.slug}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-500">No itineraries found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}