import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Utensils,
  Camera,
  Star,
  Trash2,
  Plus,
  GripVertical,
  Menu,
  Calendar,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const colorMapping = {
  attraction: {
    bg: 'bg-gradient-to-br from-blue-50 via-white to-blue-50',
    text: 'text-blue-700',
    borderAccent: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    icon: 'bg-blue-100 text-blue-600',
    accentBar: 'bg-gradient-to-b from-blue-500 to-blue-700'
  },
  restaurant: {
    bg: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50',
    text: 'text-emerald-700',
    borderAccent: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: 'bg-emerald-100 text-emerald-600',
    accentBar: 'bg-gradient-to-b from-emerald-500 to-emerald-700'
  },
  experience: {
    bg: 'bg-gradient-to-br from-purple-50 via-white to-purple-50',
    text: 'text-purple-700',
    borderAccent: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    icon: 'bg-purple-100 text-purple-600',
    accentBar: 'bg-gradient-to-b from-purple-500 to-purple-700'
  }
};

const ItineraryComponent = ({ data }) => {
  const [selectedDay, setSelectedDay] = useState('overview');
  const [draggedItem, setDraggedItem] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Get the current day data from the direct data structure
  const currentDay = selectedDay === 'overview' ? null : data?.days?.find(day => day.day_number === selectedDay);
  const allActivities = selectedDay === 'overview' ? [] : [
    ...(currentDay?.attractions || []).map(item => ({ ...item, type: 'attraction' })),
    ...(currentDay?.restaurants || []).map(item => ({ ...item, type: 'restaurant' })),
    ...(currentDay?.experiences || []).map(item => ({ ...item, type: 'experience' }))
  ];

  const handleDragStart = (e, activity) => {
    setDraggedItem(activity);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedItem) return;

    const currentIndex = allActivities.findIndex(item => item.id === draggedItem.id);
    if (currentIndex === -1 || currentIndex === targetIndex) return;

    // Here you would typically update the order in your state/backend
    console.log(`Moving ${draggedItem.name} from position ${currentIndex} to ${targetIndex}`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const openActivityModal = (activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

  if (!data?.days?.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-lg font-semibold text-gray-600">No itinerary data available</p>
          <p className="text-sm text-gray-400">Generate a plan to see your day-by-day schedule here</p>
        </div>
      </div>
    );
  }

  const totalAttractions = data?.days?.reduce((total, day) => total + (day.attractions?.length || 0), 0);
  const totalRestaurants = data?.days?.reduce((total, day) => total + (day.restaurants?.length || 0), 0);
  const totalExperiences = data?.days?.reduce((total, day) => total + (day.experiences?.length || 0), 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header with Itinerary Info */}

        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                               <div>
                                 <h2 className="text-3xl font-black text-black leading-none tracking-tight mb-1">Daily Itinerary</h2>
                                 <p className="text-gray-600 mt-1">Detailed day-by-day activities and experiences</p>
                               </div>
                               {/* Trip Stats */}
                               <div className="flex items-center space-x-6 text-sm text-gray-600">
                                 <div className="flex items-center space-x-1">
                                   <Calendar className="w-4 h-4" />
                                   <span>{data?.duration_days} Days</span>
                                 </div>
                                 <div className="flex items-center space-x-1">
                                   <Star className="w-4 h-4 text-yellow-500" />
                                   <span>{((data?.popularity_score || 85) / 20).toFixed(1)}</span>
                                 </div>
                                 {data?.categories && data.categories.length > 0 && (
                                   <div className="flex items-center space-x-1">
                                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                       {data.categories[0].name}
                                     </span>
                                   </div>
                                 )}
                               </div>
                             </div>
            <div className="inline-flex items-center space-x-3 rounded-2xl bg-white/80 backdrop-blur shadow-md px-4 py-2 text-sm font-medium text-gray-600">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Curated just for you</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem]">
                  {data?.title || 'Your Travel Itinerary'}
                </h1>
                <p className="mt-2 text-sm text-gray-500">Track activities, dining, and experiences across every day of your journey.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center space-x-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-gray-700">{data?.duration_days} days / {data?.duration_nights} nights</span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span className="font-medium text-gray-700">{data?.highlighted_places}</span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-gray-800">₹{data?.total_budget?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="grid w-full gap-4 rounded-3xl bg-white/80 backdrop-blur p-5 shadow-lg ring-1 ring-gray-100 sm:grid-cols-3 lg:w-auto lg:min-w-[420px]">
            <div className="rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-blue-100">Attractions</span>
                <MapPin className="h-4 w-4 text-blue-100" />
              </div>
              <p className="mt-3 text-3xl font-semibold">{totalAttractions}</p>
              <p className="mt-1 text-xs text-blue-100/80">Curated highlights to explore</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-emerald-100">Dining</span>
                <Utensils className="h-4 w-4 text-emerald-100" />
              </div>
              <p className="mt-3 text-3xl font-semibold">{totalRestaurants}</p>
              <p className="mt-1 text-xs text-emerald-100/80">Handpicked food experiences</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-purple-100">Experiences</span>
                <Camera className="h-4 w-4 text-purple-100" />
              </div>
              <p className="mt-3 text-3xl font-semibold">{totalExperiences}</p>
              <p className="mt-1 text-xs text-purple-100/80">Memorable moments planned</p>
            </div>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="mb-10">
          <div className="flex overflow-x-auto rounded-2xl bg-white p-2 shadow-inner shadow-gray-200/40 ring-1 ring-gray-100 backdrop-blur">
            <button
              onClick={() => setSelectedDay('overview')}
              className={`mr-2 flex items-center space-x-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                selectedDay === 'overview'
                  ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg shadow-gray-300/40'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Overview</span>
            </button>
            {data?.days?.map((day) => (
              <button
                key={day.day_number}
                onClick={() => setSelectedDay(day.day_number)}
                className={`mr-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                  selectedDay === day.day_number
                    ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg shadow-purple-200/40'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Day {day.day_number}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {selectedDay === 'overview' ? (
          <div className="space-y-12">
            <section className="grid gap-6 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-100 opacity-40" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-500">Total Stops</span>
                    <div className="rounded-xl bg-blue-50 p-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="mt-6 text-4xl font-semibold text-gray-900">{data?.days?.length || 0}</p>
                  <p className="mt-1 text-sm text-gray-500">Days packed with curated experiences</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100 opacity-40" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Average Spend / Day</span>
                    <div className="rounded-xl bg-emerald-50 p-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                  <p className="mt-6 text-4xl font-semibold text-gray-900">
                    ₹{Math.round((data?.total_budget || 0) / (data?.days?.length || 1)).toLocaleString('en-IN')}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">Balanced mix of activities and downtime</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-100 opacity-40" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-purple-500">Total Experiences</span>
                    <div className="rounded-xl bg-purple-50 p-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <p className="mt-6 text-4xl font-semibold text-gray-900">{totalAttractions + totalRestaurants + totalExperiences}</p>
                  <p className="mt-1 text-sm text-gray-500">Attractions, dining, and signature moments</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Daily Highlights</h2>
                  <p className="mt-1 text-sm text-gray-500">A quick look at what to expect each day</p>
                </div>
                <div className="hidden items-center space-x-2 rounded-full bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 sm:flex">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Drag to reorder plans anytime</span>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {data?.days?.map((day) => (
                  <div key={day.day_number} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 via-white to-gray-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 text-lg font-semibold text-white shadow-md">
                        {day.day_number}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Day {day.day_number}</h3>
                        <p className="text-sm text-gray-500">{day.theme || 'Balanced mix of activities'}</p>
                      </div>
                    </div>
                    <div className="grid gap-4 text-sm sm:grid-cols-3">
                      <div className="flex items-center space-x-2 rounded-xl bg-blue-50 px-4 py-2 text-blue-700">
                        <MapPin className="h-4 w-4" />
                        <span>{day.attractions?.length || 0} attractions</span>
                      </div>
                      <div className="flex items-center space-x-2 rounded-xl bg-emerald-50 px-4 py-2 text-emerald-700">
                        <Utensils className="h-4 w-4" />
                        <span>{day.restaurants?.length || 0} dining spots</span>
                      </div>
                      <div className="flex items-center space-x-2 rounded-xl bg-purple-50 px-4 py-2 text-purple-700">
                        <Camera className="h-4 w-4" />
                        <span>{day.experiences?.length || 0} experiences</span>
                      </div>
                    </div>
                    <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-100">
                      Budget ₹{(day.budget?.total_cost || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-white shadow-xl">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
              <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-purple-500/20" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">Need to shuffle plans?</h3>
                  <p className="mt-2 text-sm text-gray-300">Drag and drop activities within each day or tap an item to edit the details. Your changes are saved instantly.</p>
                </div>
                <button className="inline-flex items-center space-x-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                  <GripVertical className="h-4 w-4" />
                  <span>Manage Activities</span>
                </button>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-10">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 text-lg font-semibold text-white shadow-md">
                    {selectedDay}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Day {selectedDay}</h2>
                    <p className="text-sm text-gray-500">Fine-tune the schedule by reordering or editing activities.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600 ring-1 ring-amber-200">
                    Total ₹{(currentDay?.budget?.total_cost || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700 ring-1 ring-blue-200">
                  <span className="font-medium">Attractions</span>
                  <span>₹{(currentDay?.budget?.attractions_cost || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
                  <span className="font-medium">Restaurants</span>
                  <span>₹{(currentDay?.budget?.restaurants_cost || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-purple-50 px-4 py-3 text-sm text-purple-700 ring-1 ring-purple-200">
                  <span className="font-medium">Experiences</span>
                  <span>₹{(currentDay?.budget?.experiences_cost || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Activities</h3>
                  <p className="text-sm text-gray-500">Drag an activity to reorder, or tap the menu for more options.</p>
                </div>
                <button className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                  <Plus className="h-4 w-4" />
                  <span>Add Activity</span>
                </button>
              </div>

              {allActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-3 rounded-3xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
                  <div className="rounded-full bg-gray-100 p-4">
                    <Calendar className="h-7 w-7 text-gray-400" />
                  </div>
                  <p className="text-base font-semibold text-gray-600">No activities planned yet</p>
                  <p className="text-sm text-gray-400">Use the button above to curate your perfect day.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allActivities.map((activity, index) => {
                    const colors = colorMapping[activity.type] || colorMapping.attraction;
                    const Icon = activity.type === 'restaurant' ? Utensils : activity.type === 'experience' ? Camera : MapPin;

                    return (
                      <div
                        key={`${activity.type}-${activity.id || index}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, activity)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={handleDragOver}
                        className={`group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
                      >
                        <div className={`absolute left-0 top-0 h-full w-1.5`} />
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-1 items-start gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="rounded-xl bg-gray-100 p-2 text-gray-400 transition group-hover:text-gray-600">
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <div className={`rounded-2xl p-3 shadow-inner ${colors.icon}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3">
                                <h4 className="text-lg font-semibold text-gray-900">{activity.name}</h4>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${colors.badge}`}>
                                  {activity.type}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-relaxed text-gray-600">{activity.description}</p>
                              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                                {activity.rating && (
                                  <div className="flex items-center space-x-1 rounded-full bg-yellow-50 px-3 py-1 font-semibold text-yellow-700 ring-1 ring-yellow-200">
                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                    <span>{activity.rating}</span>
                                  </div>
                                )}
                                {activity.estimated_cost && (
                                  <div className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                    ₹{activity.estimated_cost}
                                  </div>
                                )}
                                {activity.duration && (
                                  <div className="flex items-center space-x-1 rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700 ring-1 ring-blue-200">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{activity.duration}</span>
                                  </div>
                                )}
                                {activity.location && (
                                  <div className="flex items-center space-x-1 rounded-full bg-purple-50 px-3 py-1 font-medium text-purple-700 ring-1 ring-purple-200">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{activity.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openActivityModal(activity)}
                              className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                            >
                              <Menu className="h-4 w-4" />
                            </button>
                            <button className="rounded-xl p-2 text-gray-300 transition hover:bg-red-50 hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Activity Modal */}
        {showActivityModal && selectedActivity && (
          <div className="fixed z-500 inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-5 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-300">Activity Detail</p>
                    <h2 className="mt-2 text-2xl font-semibold">{selectedActivity.name}</h2>
                  </div>
                  <button
                    onClick={() => setShowActivityModal(false)}
                    className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="space-y-6 px-6 py-6">
                <p className="text-sm leading-relaxed text-gray-600">{selectedActivity.description}</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {selectedActivity.rating && (
                    <div className="rounded-2xl border border-yellow-100 bg-yellow-50 px-4 py-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Rating</span>
                      <div className="mt-2 flex items-center space-x-2 text-lg font-semibold text-gray-900">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span>{selectedActivity.rating}</span>
                      </div>
                    </div>
                  )}

                  {selectedActivity.estimated_cost && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Cost</span>
                      <p className="mt-2 text-lg font-semibold text-gray-900">₹{selectedActivity.estimated_cost}</p>
                    </div>
                  )}

                  {selectedActivity.duration && (
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">Duration</span>
                      <p className="mt-2 flex items-center space-x-2 text-sm font-medium text-gray-800">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{selectedActivity.duration}</span>
                      </p>
                    </div>
                  )}

                  {selectedActivity.location && (
                    <div className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-purple-700">Location</span>
                      <p className="mt-2 flex items-center space-x-2 text-sm font-medium text-gray-800">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        <span>{selectedActivity.location}</span>
                      </p>
                    </div>
                  )}
                </div>

                {selectedActivity.highlights && selectedActivity.highlights.length > 0 && (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <div className="mb-3 flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <span className="text-sm font-semibold text-gray-800">Highlights</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {selectedActivity.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    onClick={() => setShowActivityModal(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                  >
                    Close
                  </button>
                  <button className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                    Edit Activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryComponent;