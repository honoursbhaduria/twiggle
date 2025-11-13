import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, MapPin, Sparkles, TrendingUp, X } from "lucide-react";
import Modal from "./modal";
import SidebarDemo from "./sidebar";

// NOTE: This component is intentionally feature-rich and mirrors the JSON structure you provided.
// It's JavaScript (no TypeScript) and uses shadcn/ui + Tailwind utility classes.

const createBlankDay = (dayNumber = 1) => ({
  title: "",
  day_number: dayNumber,
  locations: "",
  budget: {
    start_time: null,
    end_time: null,
    total_cost: 0,
    estimated_cost: 0,
    attractions_cost: 0,
    duration_minutes: 0,
    experiences_cost: 0,
    restaurants_cost: 0,
  },
  attractions: [],
  experiences: [],
  restaurants: [],
  description: "",
});



const emptyItinerary = {
  id: null,
  slug: "",
  title: "",
  short_description: "",
  highlighted_places: "",
  thumbnail: "",
  categories: [],
  tags: [],
  total_budget: 0,
  duration_days: 1,
  duration_nights: 0,
  popularity_score: 0,
  days: [createBlankDay(1)],
};


const cloneEmptyItinerary = () => JSON.parse(JSON.stringify(emptyItinerary));

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, "")
    .replace(/\s+/g, "-");
}

export default function ItineraryForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => cloneEmptyItinerary());
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [showPlanModal, setShowPlanModal] = useState(true);

  useEffect(() => {
    // keep slug in sync with title by default
    setForm((prev) => ({ ...prev, slug: slugify(prev.title || "") }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTopChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title") {
      setForm((prev) => ({ ...prev, slug: slugify(value) }));
    }
  };

  const updateDay = (index, newDay) => {
    const days = [...form.days];
    days[index] = newDay;
    setForm((prev) => ({ ...prev, days }));
  };

  const addDay = () => {
    // Open modal to add day with places selection
    setShowPlanModal(true);
  };

  const removeDay = (index) => {
    const days = form.days
      .filter((_, i) => i !== index)
      .map((d, i) => ({ ...d, day_number: i + 1 }));
    setForm((prev) => ({ ...prev, days, duration_days: days.length }));
    setActiveDayIndex((prevActive) => {
      if (days.length === 0) return 0;
      if (prevActive === index) return Math.min(index, days.length - 1);
      if (prevActive > index) return prevActive - 1;
      return prevActive;
    });
  };

  // attractions/restaurants helpers
  const addNested = (dayIndex, key) => {
    const daysCopy = [...form.days];
    const newItem = { id: Date.now(), name: "", image: "", address: "", latitude: "", longitude: "", description: "", estimated_cost: 0 };
    daysCopy[dayIndex][key] = [...(daysCopy[dayIndex][key] || []), newItem];
    setForm((prev) => ({ ...prev, days: daysCopy }));
  };

  const updateNested = (dayIndex, key, itemIndex, field, value) => {
    const daysCopy = [...form.days];
    const arr = [...(daysCopy[dayIndex][key] || [])];
    arr[itemIndex] = { ...arr[itemIndex], [field]: value };
    daysCopy[dayIndex][key] = arr;
    setForm((prev) => ({ ...prev, days: daysCopy }));
  };

  const removeNested = (dayIndex, key, itemIndex) => {
    const daysCopy = [...form.days];
    daysCopy[dayIndex][key] = daysCopy[dayIndex][key].filter((_, i) => i !== itemIndex);
    setForm((prev) => ({ ...prev, days: daysCopy }));
  };

  

  const loadEmptyItinerary = () => {
    const blankClone = cloneEmptyItinerary();
    setForm(blankClone);
    setThumbnailPreview(blankClone.thumbnail || "");
    setActiveDayIndex(0);
  };

  const handleThumbnail = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setThumbnailPreview(url);
    setForm((prev) => ({ ...prev, thumbnail: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production you'd send `form` to your API here (FormData if thumbnail is a File)
    console.log("SUBMIT ITINERARY", form);
    alert("Itinerary data logged to console (replace with API call)");
  };

  useEffect(() => {
    if (activeDayIndex >= form.days.length) {
      setActiveDayIndex(Math.max(0, form.days.length - 1));
    }
  }, [form.days.length, activeDayIndex]);

  const activeDay = form.days[activeDayIndex];
  const totalDaysPlanned = form.days?.length || 0;
  const totalAttractions = form.days.reduce((sum, day) => sum + (day.attractions?.length || 0), 0);
  const totalRestaurants = form.days.reduce((sum, day) => sum + (day.restaurants?.length || 0), 0);
  const totalExperiences = form.days.reduce((sum, day) => sum + (day.experiences?.length || 0), 0);
  const totalEstimatedCost = form.days.reduce((sum, day) => sum + (day.budget?.estimated_cost || 0), 0);
  const averageDailySpend = totalDaysPlanned ? totalEstimatedCost / totalDaysPlanned : 0;
  const formatCurrency = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);
  const fieldInputClasses = "bg-white border-slate-200 focus-visible:ring-slate-500 focus-visible:ring-offset-1";
  const fieldTextareaClasses = "bg-white border-slate-200 focus-visible:ring-slate-500 focus-visible:ring-offset-1";

  // Provided Goa trip data (could come from API)
  const goaTrip = {
    id: 14,
    days: [
      {
        title: "Day 1 in Goa",
        budget: {
          end_time: null,
          start_time: null,
          total_cost: 800.0,
          estimated_cost: 880.0,
          attractions_cost: 800.0,
          duration_minutes: 0,
          experiences_cost: 0.0,
          restaurants_cost: 0.0,
        },
        locations:
          "Milsim Goa PaintBall, Colva Beach, Memorial For Goan Victims of 1918 Spanish Flu",
        day_number: 1,
        attractions: [
          {
            id: 361,
            name: "Colva Beach",
            image: "",
            address: "Colva Beach, Colva, Goa, India",
            latitude: 15.275651,
            longitude: 73.913727,
            description:
              "Colva Beach is a beach in South Goa in Goa, India near Colva.",
            estimated_cost: 250.0,
            google_place_id: null,
          },
          {
            id: 412,
            name: "Milsim Goa PaintBall",
            image: "",
            address: "Milsim Goa PaintBall, Majorda, Goa, India",
            latitude: 15.32193,
            longitude: 73.939759,
            description:
              "Milsim Goa PaintBall is a place of interest in South Goa in Goa, India near Majorda.",
            estimated_cost: 250.0,
            google_place_id: null,
          },
          {
            id: 490,
            name: "Memorial For Goan Victims of 1918 Spanish Flu",
            image: "",
            address:
              "Memorial For Goan Victims of 1918 Spanish Flu, Margao, Goa, India",
            latitude: 15.312981,
            longitude: 73.983962,
            description:
              "Memorial For Goan Victims of 1918 Spanish Flu is a place of interest in South Goa in Goa, India near Margao.",
            estimated_cost: 300.0,
            google_place_id: null,
          },
        ],
        description: "Explore nearby attractions and restaurants",
        experiences: [],
        restaurants: [
          {
            id: 751,
            name: "Tato",
            image: "",
            address: "",
            cuisine: "",
            latitude: 15.291411,
            longitude: 73.953951,
            description: "Tato in Goa.",
            estimated_cost: 0.0,
            google_place_id: null,
          },
          {
            id: 1644,
            name: "Karishma",
            image: "",
            address: "",
            cuisine: "",
            latitude: 15.288591,
            longitude: 73.953454,
            description: "Karishma in Goa.",
            estimated_cost: 0.0,
            google_place_id: null,
          },
          {
            id: 2349,
            name: "Cafe Zelo",
            image: "",
            address: "",
            cuisine: "",
            latitude: 15.28995,
            longitude: 73.955077,
            description: "Cafe Zelo in Goa.",
            estimated_cost: 0.0,
            google_place_id: null,
          },
        ],
      },
      {
        title: "Day 2 in Goa",
        budget: {
          end_time: null,
          start_time: null,
          total_cost: 1000.0,
          estimated_cost: 1100.0,
          attractions_cost: 1000.0,
          duration_minutes: 0,
          experiences_cost: 0.0,
          restaurants_cost: 0.0,
        },
        locations: "Mapusa Town Viewpoint, Peacock Hill, Anjuna Valley Viewpoint",
        day_number: 2,
        attractions: [
          {
            id: 511,
            name: "Peacock Hill",
            image: "",
            address: "Peacock Hill, Vagator, Goa, India",
            latitude: 15.593398,
            longitude: 73.747287,
            description:
              "Peacock Hill is a place of interest in North Goa in Goa, India near Vagator.",
            estimated_cost: 600.0,
            google_place_id: null,
          },
          {
            id: 516,
            name: "Anjuna Valley Viewpoint",
            image: "",
            address: "Anjuna Valley Viewpoint, Anjuna, Goa, India",
            latitude: 15.593475,
            longitude: 73.747333,
            description:
              "Anjuna Valley Viewpoint is a scenic viewpoint in North Goa in Goa, India near Anjuna.",
            estimated_cost: 300.0,
            google_place_id: null,
          },
          {
            id: 530,
            name: "Mapusa Town Viewpoint",
            image: "image/upload/v1758651651/s3ihz0tmbwizwpndz4qg.jpg",
            address: "Mapusa Town Viewpoint, Mapusa, Goa, India",
            latitude: 15.595717,
            longitude: 73.798183,
            description:
              "Mapusa Town Viewpoint is a scenic viewpoint in North Goa in Goa, India near Mapusa.",
            estimated_cost: 100.0,
            google_place_id: null,
          },
        ],
        description: "Explore nearby attractions and restaurants",
        experiences: [],
        restaurants: [
          {
            id: 1605,
            name: "Morjim 100",
            image: "",
            address: "",
            cuisine: "",
            latitude: 15.566595,
            longitude: 73.764862,
            description: "Morjim 100 in Goa.",
            estimated_cost: 0.0,
            google_place_id: null,
          },
          {
            id: 1927,
            name: "Blue Flame",
            image: "",
            address: "",
            cuisine: "",
            latitude: 15.576559,
            longitude: 73.761474,
            description: "Blue Flame in Goa.",
            estimated_cost: 0.0,
            google_place_id: null,
          },
          {
            id: 2188,
            name: "Fish Deck",
            image: "",
            address: "",
            cuisine: "",
            latitude: 15.566606,
            longitude: 73.764932,
            description: "Fish Deck in Goa.",
            estimated_cost: 0.0,
            google_place_id: null,
          },
        ],
      },
      {
        title: "Day 3 in Goa",
        budget: {
          end_time: null,
          start_time: null,
          total_cost: 800.0,
          estimated_cost: 880.0,
          attractions_cost: 800.0,
          duration_minutes: 0,
          experiences_cost: 0.0,
          restaurants_cost: 0.0,
        },
        locations: "Damna hill, Banyan Tree, Cape Rama",
        day_number: 3,
        attractions: [
          {
            id: 441,
            name: "Banyan Tree",
            image: "",
            address: "Banyan Tree, Galgibaga, Goa, India",
            latitude: 14.995161,
            longitude: 74.106444,
            description:
              "Banyan Tree is a place of interest in South Goa in Goa, India near Galgibaga.",
            estimated_cost: 450.0,
            google_place_id: null,
          },
          {
            id: 472,
            name: "Cape Rama",
            image: "",
            address: "Cape Rama, Cola, Goa, India",
            latitude: 15.089368,
            longitude: 73.923212,
            description: "Cape Rama is a place of interest in South Goa in Goa, India near Cola.",
            estimated_cost: 300.0,
            google_place_id: null,
          },
          {
            id: 475,
            name: "Damna hill",
            image: "",
            address: "Damna hill, Galgibaga, Goa, India",
            latitude: 15.051909,
            longitude: 74.080957,
            description:
              "Damna hill is a place of interest in South Goa in Goa, India near Galgibaga.",
            estimated_cost: 50.0,
            google_place_id: null,
          },
        ],
        description: "Explore nearby attractions and restaurants",
        experiences: [],
        restaurants: [
          {
            id: 92,
            name: "Fernandes",
            image: "",
            address: "",
            cuisine: "",
            latitude: 15.012469,
            longitude: 74.018703,
            description: "Fernandes in Goa.",
            estimated_cost: 0.0,
            google_place_id: null,
          },
          {
            id: 192,
            name: "Banyan Tree",
            image: "",
            address: "",
            cuisine: "",
            latitude: 15.012579,
            longitude: 74.017812,
            description: "Banyan Tree in Goa.",
            estimated_cost: 0.0,
            google_place_id: null,
          },
          {
            id: 203,
            name: "Rockit Cafe",
            image: "",
            address: "",
            cuisine: "",
            latitude: 15.012618,
            longitude: 74.017584,
            description: "Rockit Cafe in Goa.",
            estimated_cost: 0.0,
            google_place_id: null,
          },
        ],
      },
    ],
    slug: "goa-3d-2n-goa-proximity-trip-4",
    tags: [],
    title: "3D 2N Goa Proximity Trip",
    thumbnail: "/media/demo.jpg",
    categories: [
      {
        id: 4,
        name: "Budget Travel",
        slug: "budget-travel",
      },
    ],
    total_budget: 2600.0,
    duration_days: 3,
    duration_nights: 2,
    budget_breakdown: null,
    popularity_score: 85,
    short_description:
      "Escape to the vibrant state of Goa for a thrilling 3D/2N adventure! Get ready to paintball through Milsim's adrenaline-pumping arena, soak up sun on stunning Colva Beach, and explore historic landmarks like the Memorial for Goan victims of the Spanish Flu. Discover the natural beauty of Goa with breathtaking views at Mapusa Town Viewpoint, Peacock Hill, and beyond!",
    highlighted_places:
      "Milsim Goa PaintBall, Colva Beach, Memorial For Goan Victims of 1918 Spanish Flu, Mapusa Town Viewpoint, Peacock Hill",
  };
  // Initialize form with Goa trip title/slug
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      title: goaTrip.title,
      slug: slugify(goaTrip.slug),
      duration_days: goaTrip.duration_days,
      duration_nights: goaTrip.duration_nights,
    }));
  }, []);

  const applyModalSelection = (selectedDays) => {
    // Merge selection into form.days, preserving length and re-numbering
    const merged = selectedDays.map((d, i) => ({
      title: d.title || form.days[i]?.title || "",
      day_number: i + 1,
      locations: d.locations || form.days[i]?.locations || "",
      budget: form.days[i]?.budget || { start_time: null, end_time: null, total_cost: 0, estimated_cost: 0, attractions_cost: 0, duration_minutes: 0, experiences_cost: 0, restaurants_cost: 0 },
      attractions: d.attractions || [],
      restaurants: d.restaurants || [],
      experiences: d.experiences || [],
      description: form.days[i]?.description || "",
    }));
    setForm((prev) => ({ ...prev, days: merged, duration_days: merged.length }));
    setActiveDayIndex(0);
    setShowPlanModal(false);
  };

  const plannerSummaryCards = [
    {
      title: "Total stops",
      value: `${totalDaysPlanned} day${totalDaysPlanned === 1 ? "" : "s"}`,
      description: "Days mapped in this itinerary",
  accent: "bg-linear-to-r from-orange-500 to-red-500 text-white",
    },
    {
      title: "Average spend / day",
      value: formatCurrency(Math.round(averageDailySpend)),
      description: "Balanced mix of activities and downtime",
  accent: "bg-linear-to-r from-orange-500 to-red-500 text-white",
    },
    {
      title: "Total experiences",
      value: totalAttractions + totalRestaurants + totalExperiences,
      description: "Attractions, dining, and signature moments",
  accent: "bg-linear-to-r from-orange-500 to-red-500 text-white",
    },
  ];

  const highlightTiles = [
    {
      label: "Attractions",
      value: totalAttractions,
      helper: "Curated highlights to explore",
  className: "bg-linear-to-br from-orange-100 to-orange-50 border border-orange-200 text-orange-700",
    },
    {
      label: "Dining",
      value: totalRestaurants,
      helper: "Handpicked food experiences",
  className: "bg-linear-to-br from-amber-100 to-amber-50 border border-amber-200 text-amber-700",
    },
    {
      label: "Experiences",
      value: totalExperiences,
      helper: "Memorable moments planned",
  className: "bg-linear-to-br from-rose-100 to-rose-50 border border-rose-200 text-rose-700",
    },
  ];

  const activeAttractionCount = activeDay?.attractions?.length || 0;
  const activeRestaurantCount = activeDay?.restaurants?.length || 0;
  const activeExperienceCount = activeDay?.experiences?.length || 0;
  const activeDayBadges = [
    { label: "Attractions", value: activeAttractionCount, className: "bg-orange-50 border border-orange-200 text-orange-700" },
    { label: "Restaurants", value: activeRestaurantCount, className: "bg-amber-50 border border-amber-200 text-amber-700" },
    { label: "Experiences", value: activeExperienceCount, className: "bg-rose-50 border border-rose-200 text-rose-700" },
  ];

  return (
    <>
      <Modal
        open={showPlanModal}
        initialDays={form.days.length > 0 ? form.days : goaTrip.days}
        places={{
          attractions: Array.from(new Map(goaTrip.days.flatMap((d)=> d.attractions || []).map((x)=>[x.id,x])).values()),
          restaurants: Array.from(new Map(goaTrip.days.flatMap((d)=> d.restaurants || []).map((x)=>[x.id,x])).values()),
          experiences: Array.from(new Map(goaTrip.days.flatMap((d)=> d.experiences || []).map((x)=>[x.id,x])).values()),
        }}
        onCancel={() => setShowPlanModal(false)}
        onApply={applyModalSelection}
        onNavigateBack={() => navigate('/destination/')}
      />

      <SidebarDemo/>
      
      <div className="bg-linear-to-br from-orange-50 via-amber-50 to-rose-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className=" max-w-6xl w-full  bg-white rounded-4xl overflow-hidden shadow-2xl">
          <div className="px-6 sm:px-10 bg-[#fe6d3c] space-y-10 py-4">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-10">
              <div className="flex-1 space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-[0.3em]">
                  Planner mode
                </span>
                <div className="space-y-4">
                  <CardTitle className="text-3xl sm:text-4xl font-semibold text-white">Craft a signature escape</CardTitle>
                  <p className="text-base text-white/90 max-w-2xl">
                    Build an unforgettable itinerary from scratch. Capture the vibe, balance the budget, and keep every stop organised before you share it with travellers.
                  </p>
                </div>
              
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4 w-full xl:max-w-xs">
               
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               
             

                {highlightTiles.map((tile) => (
                  <div key={tile.label} className={`rounded-3xl px-5 py-6 ${tile.className}`}>
                    <p className="text-xs uppercase tracking-[0.3em] opacity-70">{tile.label}</p>
                    
                    <p className="text-3xl font-semibold mt-4">{tile.value}</p>
                    <p className="text-sm mt-2 opacity-80">{tile.helper}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className="px-6 sm:px-10 pt-8 pb-4 space-y-6 bg-linear-to-br from-orange-50/50 via-amber-50/50 to-rose-50/50">
            {/* Info banner */}
            <div className="rounded-2xl bg-linear-to-r from-orange-100 to-amber-100 border border-orange-200 p-4 flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900 text-sm">Plan via Modal</h4>
                <p className="text-xs text-orange-800 mt-1">
                  Click "Add day" to open the planning modal where you can select attractions, restaurants, and experiences. All fields below are read-only and automatically populated from your selections.
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              

            

              <section className="rounded-3xl border border-orange-100 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Day-by-day blueprint</h2>
                    <p className="text-sm text-slate-500 mt-1">Organise every stop, meal, and experience with clarity.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button type="button" onClick={addDay} className="bg-[#fe6d3c] hover:bg-[#e55a2a] text-white px-5 py-2 rounded-full shadow">
                      + Add day
                    </Button>
                   
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="relative overflow-x-auto">
                    <div className="inline-flex gap-2 rounded-full bg-slate-100/70 p-1">
                      {form.days.map((day, idx) => {
                        const isActive = idx === activeDayIndex;
                        return (
                          <button
                            key={day.day_number}
                            type="button"
                            onClick={() => setActiveDayIndex(idx)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-[#fe6d3c] text-white shadow-md"
                                : "bg-white text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {`Day ${day.day_number}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {activeDay ? (
                    <div className="rounded-3xl border border-orange-100 bg-linear-to-br from-white to-orange-50/20 p-6 sm:p-8 space-y-6 shadow-sm relative">
                      {/* Remove Day Button - Top Right Border */}
                      {form.days.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDay(activeDayIndex)}
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#fe6d3c] hover:bg-[#e55a2a] text-white flex items-center justify-center shadow-lg transition-all duration-200 z-10"
                          title="Remove this day"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{`Day ${activeDay.day_number}: ${activeDay.title || "Untitled"}`}</h3>
                          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                            {activeDay.description || "Outline the focus for this day to help travellers understand the vibe."}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-medium">
                          {activeDayBadges.map((badge) => (
                            <span key={badge.label} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badge.className}`}>
                              {badge.value} {badge.label.toLowerCase()}
                            </span>
                          ))}
                        </div>
                      </div>

                     

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-slate-900">Attractions</h4>
                          <p className="text-sm text-orange-600 font-medium">Managed via modal</p>
                        </div>
                        <div className="space-y-3">
                          {(activeDay.attractions || []).map((a, aIdx) => (
                            <div
                              key={aIdx}
                              className="group relative rounded-2xl border border-orange-200/70 bg-white shadow-sm transition-all duration-200 hover:border-orange-300 hover:shadow-lg"
                            >
                             

                              {/* Remove Attraction Button */}
                              <button
                                type="button"
                                onClick={() => removeNested(activeDayIndex, "attractions", aIdx)}
                                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#fe6d3c] hover:bg-[#e55a2a] text-white flex items-center justify-center shadow-md transition-all duration-200 z-10"
                                title="Remove attraction"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-4">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                                    <MapPin className="h-5 w-5" />
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-base font-semibold leading-tight text-slate-900">
                                        {a.name || "Unnamed attraction"}
                                      </p>
                                      <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-orange-600">
                                        #{aIdx + 1}
                                      </span>
                                    </div>
                                    <p className="max-w-xl text-sm text-slate-600">
                                      {a.address || "Address coming soon"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 text-right">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600">
                                    {formatCurrency(a.estimated_cost)}
                                  </span>
                                  <span className="text-[11px] uppercase tracking-[0.28em] text-orange-400">Via modal</span>
                                </div>
                              </div>

                              {a.description ? (
                                <div className="border-t border-orange-100 bg-orange-50/50 px-5 py-4 text-sm leading-relaxed text-orange-900/80">
                                  {a.description}
                                </div>
                              ) : (
                                <div className="border-t border-orange-100 px-5 py-3 text-sm italic text-slate-400">
                                  No description provided yet.
                                </div>
                              )}
                            </div>
                          ))}
                          {activeDay.attractions?.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-6 text-center text-sm text-orange-600">
                              No attractions selected — add them from the modal above.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-slate-900">Restaurants</h4>
                          <p className="text-sm text-amber-600 font-medium">Managed via modal</p>
                        </div>
                        <div className="space-y-3">
                          {(activeDay.restaurants || []).map((r, rIdx) => (
                            <div key={rIdx} className="p-4 rounded-2xl border border-amber-200 bg-amber-50 grid grid-cols-1 md:grid-cols-6 gap-3 relative">
                              {/* Remove Restaurant Button */}
                              <button
                                type="button"
                                onClick={() => removeNested(activeDayIndex, "restaurants", rIdx)}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#fe6d3c] hover:bg-[#e55a2a] text-white flex items-center justify-center shadow-md transition-all duration-200 z-10"
                                title="Remove restaurant"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              
                              <div className="md:col-span-2 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Name</Label>
                                <Input 
                                  value={r.name} 
                                  readOnly
                                  disabled
                                  className="bg-white/50 border-amber-100 text-slate-500 cursor-not-allowed" 
                                />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Cuisine</Label>
                                <Input 
                                  value={r.cuisine} 
                                  readOnly
                                  disabled
                                  className="bg-white/50 border-amber-100 text-slate-500 cursor-not-allowed" 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Cost</Label>
                                <Input
                                  type="number"
                                  value={r.estimated_cost}
                                  readOnly
                                  disabled
                                  className="bg-white/50 border-amber-100 text-slate-500 cursor-not-allowed"
                                />
                              </div>
                              <div className="md:col-span-6 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Description</Label>
                                <Textarea 
                                  value={r.description} 
                                  readOnly
                                  disabled
                                  rows={2} 
                                  className="bg-white/50 border-amber-100 text-slate-500 cursor-not-allowed" 
                                />
                              </div>
                            </div>
                          ))}
                          {activeDay.restaurants?.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-6 text-center text-sm text-amber-600">
                              No dining recommendations selected — add them from the modal above.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-slate-900">Experiences</h4>
                          <p className="text-sm text-rose-600 font-medium">Managed via modal</p>
                        </div>
                        <div className="space-y-3">
                          {(activeDay.experiences || []).map((x, xIdx) => (
                            <div key={xIdx} className="p-4 rounded-2xl border border-rose-200 bg-rose-50 grid grid-cols-1 md:grid-cols-6 gap-3 relative">
                              {/* Remove Experience Button */}
                              <button
                                type="button"
                                onClick={() => removeNested(activeDayIndex, "experiences", xIdx)}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#fe6d3c] hover:bg-[#e55a2a] text-white flex items-center justify-center shadow-md transition-all duration-200 z-10"
                                title="Remove experience"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              
                              <div className="md:col-span-3 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Title</Label>
                                <Input 
                                  value={x.name || x.title || ""} 
                                  readOnly
                                  disabled
                                  className="bg-white/50 border-rose-100 text-slate-500 cursor-not-allowed" 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Cost</Label>
                                <Input
                                  type="number"
                                  value={x.estimated_cost || 0}
                                  readOnly
                                  disabled
                                  className="bg-white/50 border-rose-100 text-slate-500 cursor-not-allowed"
                                />
                              </div>
                              <div className="md:col-span-6 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Description</Label>
                                <Textarea 
                                  value={x.description || ""} 
                                  readOnly
                                  disabled
                                  rows={2} 
                                  className="bg-white/50 border-rose-100 text-slate-500 cursor-not-allowed" 
                                />
                              </div>
                            </div>
                          ))}
                          {activeDay.experiences?.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-6 text-center text-sm text-rose-600">
                              No experiences selected — add workshops, tours, or signature moments from the modal above.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
                      Add a day to start building your itinerary.
                    </div>
                  )}
                </div>
              </section>

              <div className="rounded-3xl border border-orange-100 bg-white p-6 sm:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between shadow-sm">
                <label className="flex items-start gap-4">
              
                 
                </label>
                <div className="flex flex-wrap gap-3 justify-end">
                  <Button type="button" variant="ghost" onClick={loadEmptyItinerary} className="text-slate-500 hover:text-slate-700">
                    Reset
                  </Button>
                  <Button type="submit" className="bg-[#fe6d3c] hover:bg-[#e55a2a] text-white px-6 py-2 rounded-full shadow-lg">
                    Save itinerary
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}





