import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Sparkles, TrendingUp } from "lucide-react";

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
  const [form, setForm] = useState(() => cloneEmptyItinerary());
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [activeDayIndex, setActiveDayIndex] = useState(0);

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
    const nextIndex = form.days.length;
    setForm((prev) => {
      const newDayNumber = prev.days.length + 1;
      const updatedDays = [...prev.days, createBlankDay(newDayNumber)];
      return { ...prev, days: updatedDays, duration_days: updatedDays.length };
    });
    setActiveDayIndex(nextIndex);
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

  const plannerSummaryCards = [
    {
      title: "Total stops",
      value: `${totalDaysPlanned} day${totalDaysPlanned === 1 ? "" : "s"}`,
      description: "Days mapped in this itinerary",
      accent: "bg-gradient-to-r from-gray-900 to-gray-700 text-white",
    },
    {
      title: "Average spend / day",
      value: formatCurrency(Math.round(averageDailySpend)),
      description: "Balanced mix of activities and downtime",
      accent: "bg-gradient-to-r from-gray-900 to-gray-700 text-white",
    },
    {
      title: "Total experiences",
      value: totalAttractions + totalRestaurants + totalExperiences,
      description: "Attractions, dining, and signature moments",
      accent: "bg-gradient-to-r from-gray-900 to-gray-700 text-white",
    },
  ];

  const highlightTiles = [
    {
      label: "Attractions",
      value: totalAttractions,
      helper: "Curated highlights to explore",
      className: "bg-gradient-to-br from-indigo-100 to-indigo-50 border border-indigo-100 text-indigo-700",
    },
    {
      label: "Dining",
      value: totalRestaurants,
      helper: "Handpicked food experiences",
      className: "bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-100 text-emerald-700",
    },
    {
      label: "Experiences",
      value: totalExperiences,
      helper: "Memorable moments planned",
      className: "bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 border border-fuchsia-100 text-fuchsia-700",
    },
  ];

  const activeAttractionCount = activeDay?.attractions?.length || 0;
  const activeRestaurantCount = activeDay?.restaurants?.length || 0;
  const activeExperienceCount = activeDay?.experiences?.length || 0;
  const activeDayBadges = [
    { label: "Attractions", value: activeAttractionCount, className: "bg-indigo-50 border border-indigo-100 text-indigo-700" },
    { label: "Restaurants", value: activeRestaurantCount, className: "bg-emerald-50 border border-emerald-100 text-emerald-700" },
    { label: "Experiences", value: activeExperienceCount, className: "bg-fuchsia-50 border border-fuchsia-100 text-fuchsia-700" },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center">
    
        <div className=" max-w-6xl w-full shadow-xl  bg-white rounded-[32px] overflow-hidden">
          <div className="px-6 sm:px-10 bg-gradient-to-r from-gray-900 to-gray-700 space-y-10 py-4">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-10">
              <div className="flex-1 space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-[0.3em]">
                  Planner mode
                </span>
                <div className="space-y-4">
                  <CardTitle className="text-3xl sm:text-4xl font-semibold text-gray-300">Craft a signature escape</CardTitle>
                  <p className="text-base text-gray-400 max-w-2xl">
                    Build an unforgettable itinerary from scratch. Capture the vibe, balance the budget, and keep every stop organised before you share it with travellers.
                  </p>
                </div>
              
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4 w-full xl:max-w-xs">
               
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               
              {/* {plannerSummaryCards.map((card) => (
                <div key={card.title} className={`rounded-3xl relative px-5 py-6 border shadow-sm ${card.accent}`}>
                  <p className="text-xs uppercase tracking-[0.25em] text-current/70">{card.title}</p>
                   
                  <p className="mt-4 text-2xl font-semibold text-current">{card.value}</p>
                  <p className="mt-2 text-sm text-current/70">{card.description}</p>
                </div>
              ))} */}

                {highlightTiles.map((tile) => (
                  <div key={tile.label} className={`rounded-3xl px-5 py-6 shadow-sm ${tile.className}`}>
                    <p className="text-xs uppercase tracking-[0.3em] opacity-70">{tile.label}</p>
                    
                    <p className="text-3xl font-semibold mt-4">{tile.value}</p>
                    <p className="text-sm mt-2 opacity-80">{tile.helper}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className="px-6 sm:px-10 pt-8 pb-4 space-y-6 bg-gray-100 ">
            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Itinerary overview</h2>
                    <p className="text-sm text-slate-500 mt-1">Set the essentials that define this journey for travellers.</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">Step 01</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-slate-700">Title</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => handleTopChange("title", e.target.value)}
                      placeholder="Trip title"
                      className={fieldInputClasses}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-sm font-medium text-slate-700">Slug</Label>
                    <Input id="slug" value={form.slug} onChange={(e) => handleTopChange("slug", e.target.value)} className={fieldInputClasses} />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shortDesc" className="text-sm font-medium text-slate-700">Short description</Label>
                    <Textarea
                      id="shortDesc"
                      value={form.short_description}
                      onChange={(e) => handleTopChange("short_description", e.target.value)}
                      rows={4}
                      className={`${fieldTextareaClasses} min-h-[150px]`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Thumbnail</Label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
                      <label className="relative inline-flex items-center justify-center px-5 py-2 rounded-full bg-white text-slate-700 text-sm font-semibold shadow-sm cursor-pointer hover:bg-slate-100">
                        <span>Upload image</span>
                        <input type="file" accept="image/*" onChange={handleThumbnail} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </label>
                      {thumbnailPreview ? (
                        <img
                          src={typeof form.thumbnail === "string" ? form.thumbnail : thumbnailPreview}
                          alt="preview"
                          className="w-32 h-24 object-cover rounded-2xl shadow"
                        />
                      ) : (
                        <div className="w-full sm:w-40 h-24 rounded-2xl border border-slate-200 bg-white/60 flex items-center justify-center text-sm text-slate-400">
                          No image selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Budget & logistics</h2>
                    <p className="text-sm text-slate-500 mt-1">Keep totals in check to deliver the right mix of comfort and adventure.</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">Step 02</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Total budget (₹)</Label>
                    <Input type="number" value={form.total_budget} onChange={(e) => handleTopChange("total_budget", Number(e.target.value))} className={fieldInputClasses} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Duration (days)</Label>
                    <Input type="number" value={form.duration_days} onChange={(e) => handleTopChange("duration_days", Number(e.target.value))} className={fieldInputClasses} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Duration (nights)</Label>
                    <Input type="number" value={form.duration_nights} onChange={(e) => handleTopChange("duration_nights", Number(e.target.value))} className={fieldInputClasses} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Popularity</Label>
                    <Input type="number" value={form.popularity_score} onChange={(e) => handleTopChange("popularity_score", Number(e.target.value))} className={fieldInputClasses} />
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Day-by-day blueprint</h2>
                    <p className="text-sm text-slate-500 mt-1">Organise every stop, meal, and experience with clarity.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button type="button" onClick={addDay} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full shadow">
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
                                ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white "
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
                    <div className="rounded-3xl border border-slate-200 bg-white shadow-inner p-6 sm:p-8 space-y-6">
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Day title</Label>
                          <Input value={activeDay.title} onChange={(e) => updateDay(activeDayIndex, { ...activeDay, title: e.target.value })} className={fieldInputClasses} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Locations (comma separated)</Label>
                          <Input value={activeDay.locations} onChange={(e) => updateDay(activeDayIndex, { ...activeDay, locations: e.target.value })} className={fieldInputClasses} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Overview for the day</Label>
                        <Textarea value={activeDay.description} onChange={(e) => updateDay(activeDayIndex, { ...activeDay, description: e.target.value })} rows={3} className={fieldTextareaClasses} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Total cost (₹)</Label>
                          <Input
                            type="number"
                            value={activeDay.budget?.total_cost || 0}
                            onChange={(e) => updateDay(activeDayIndex, { ...activeDay, budget: { ...activeDay.budget, total_cost: Number(e.target.value) } })}
                            className={fieldInputClasses}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Estimated cost (₹)</Label>
                          <Input
                            type="number"
                            value={activeDay.budget?.estimated_cost || 0}
                            onChange={(e) => updateDay(activeDayIndex, { ...activeDay, budget: { ...activeDay.budget, estimated_cost: Number(e.target.value) } })}
                            className={fieldInputClasses}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Attractions cost (₹)</Label>
                          <Input
                            type="number"
                            value={activeDay.budget?.attractions_cost || 0}
                            onChange={(e) => updateDay(activeDayIndex, { ...activeDay, budget: { ...activeDay.budget, attractions_cost: Number(e.target.value) } })}
                            className={fieldInputClasses}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Restaurants cost (₹)</Label>
                          <Input
                            type="number"
                            value={activeDay.budget?.restaurants_cost || 0}
                            onChange={(e) => updateDay(activeDayIndex, { ...activeDay, budget: { ...activeDay.budget, restaurants_cost: Number(e.target.value) } })}
                            className={fieldInputClasses}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-slate-900">Attractions</h4>
                          <Button type="button" variant="ghost" onClick={() => addNested(activeDayIndex, "attractions")} className="text-indigo-600 hover:text-indigo-800">
                            + Add attraction
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {(activeDay.attractions || []).map((a, aIdx) => (
                            <div key={aIdx} className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50 grid grid-cols-1 md:grid-cols-6 gap-3">
                              <div className="md:col-span-2 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Name</Label>
                                <Input value={a.name} onChange={(e) => updateNested(activeDayIndex, "attractions", aIdx, "name", e.target.value)} className={fieldInputClasses} />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Address</Label>
                                <Input value={a.address} onChange={(e) => updateNested(activeDayIndex, "attractions", aIdx, "address", e.target.value)} className={fieldInputClasses} />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Cost</Label>
                                <Input
                                  type="number"
                                  value={a.estimated_cost}
                                  onChange={(e) => updateNested(activeDayIndex, "attractions", aIdx, "estimated_cost", Number(e.target.value))}
                                  className={fieldInputClasses}
                                />
                              </div>
                              <div className="flex items-end justify-end">
                                <Button type="button" variant="ghost" onClick={() => removeNested(activeDayIndex, "attractions", aIdx)} className="text-slate-500 hover:text-red-500">
                                  Remove
                                </Button>
                              </div>
                              <div className="md:col-span-6 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Description</Label>
                                <Textarea value={a.description} onChange={(e) => updateNested(activeDayIndex, "attractions", aIdx, "description", e.target.value)} rows={2} className={fieldTextareaClasses} />
                              </div>
                            </div>
                          ))}
                          {activeDay.attractions?.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 p-6 text-center text-sm text-indigo-600">
                              No attractions yet — add your first stop above.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-slate-900">Restaurants</h4>
                          <Button type="button" variant="ghost" onClick={() => addNested(activeDayIndex, "restaurants")} className="text-emerald-600 hover:text-emerald-800">
                            + Add restaurant
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {(activeDay.restaurants || []).map((r, rIdx) => (
                            <div key={rIdx} className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50 grid grid-cols-1 md:grid-cols-6 gap-3">
                              <div className="md:col-span-2 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Name</Label>
                                <Input value={r.name} onChange={(e) => updateNested(activeDayIndex, "restaurants", rIdx, "name", e.target.value)} className={fieldInputClasses} />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Cuisine</Label>
                                <Input value={r.cuisine} onChange={(e) => updateNested(activeDayIndex, "restaurants", rIdx, "cuisine", e.target.value)} className={fieldInputClasses} />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Cost</Label>
                                <Input
                                  type="number"
                                  value={r.estimated_cost}
                                  onChange={(e) => updateNested(activeDayIndex, "restaurants", rIdx, "estimated_cost", Number(e.target.value))}
                                  className={fieldInputClasses}
                                />
                              </div>
                              <div className="flex items-end justify-end">
                                <Button type="button" variant="ghost" onClick={() => removeNested(activeDayIndex, "restaurants", rIdx)} className="text-slate-500 hover:text-red-500">
                                  Remove
                                </Button>
                              </div>
                              <div className="md:col-span-6 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Description</Label>
                                <Textarea value={r.description} onChange={(e) => updateNested(activeDayIndex, "restaurants", rIdx, "description", e.target.value)} rows={2} className={fieldTextareaClasses} />
                              </div>
                            </div>
                          ))}
                          {activeDay.restaurants?.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center text-sm text-emerald-600">
                              Add dining recommendations to complete the experience.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-slate-900">Experiences</h4>
                          <Button type="button" variant="ghost" onClick={() => addNested(activeDayIndex, "experiences")} className="text-fuchsia-600 hover:text-fuchsia-800">
                            + Add experience
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {(activeDay.experiences || []).map((x, xIdx) => (
                            <div key={xIdx} className="p-4 rounded-2xl border border-fuchsia-100 bg-fuchsia-50 grid grid-cols-1 md:grid-cols-6 gap-3">
                              <div className="md:col-span-3 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Title</Label>
                                <Input value={x.name || x.title || ""} onChange={(e) => updateNested(activeDayIndex, "experiences", xIdx, "name", e.target.value)} className={fieldInputClasses} />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Cost</Label>
                                <Input
                                  type="number"
                                  value={x.estimated_cost || 0}
                                  onChange={(e) => updateNested(activeDayIndex, "experiences", xIdx, "estimated_cost", Number(e.target.value))}
                                  className={fieldInputClasses}
                                />
                              </div>
                              <div className="flex items-end justify-end">
                                <Button type="button" variant="ghost" onClick={() => removeNested(activeDayIndex, "experiences", xIdx)} className="text-slate-500 hover:text-red-500">
                                  Remove
                                </Button>
                              </div>
                              <div className="md:col-span-6 space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Description</Label>
                                <Textarea value={x.description || ""} onChange={(e) => updateNested(activeDayIndex, "experiences", xIdx, "description", e.target.value)} rows={2} className={fieldTextareaClasses} />
                              </div>
                            </div>
                          ))}
                          {activeDay.experiences?.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-fuchsia-200 bg-fuchsia-50/60 p-6 text-center text-sm text-fuchsia-600">
                              Layer in workshops, tours, or signature moments to elevate the day.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="button bg-gradient-to-r from-red-500 to-red-400" variant="" onClick={() => removeDay(activeDayIndex)} className="rounded-full px-6 bg-red-100 hover:bg-red-200 text-red-500 font-light">
                          Remove this day
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
                      Add a day to start building your itinerary.
                    </div>
                  )}
                </div>
              </section>

              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <label className="flex items-start gap-4">
                  <Checkbox checked={false} onCheckedChange={() => {}} className="mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Public itinerary</p>
                    <p className="text-xs text-slate-500">Toggle to make this itinerary visible on the site.</p>
                  </div>
                </label>
                <div className="flex flex-wrap gap-3 justify-end">
                  <Button type="button" variant="ghost" onClick={loadEmptyItinerary} className="text-slate-500 hover:text-slate-700">
                    Reset
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-gray-900 to-gray-700  text-white px-6 py-2 rounded-full shadow-lg">
                    Save itinerary
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      
    </div>
  );
}
