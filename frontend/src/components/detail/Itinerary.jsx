import React, { useState } from 'react';
import { Clock, MapPin, X, Plus, Route, GripVertical } from 'lucide-react';

const ItineraryComponent = ({ data }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedItinerary, setSelectedItinerary] = useState(0);

  // Get the current itinerary and day data
  const currentItinerary = data?.results?.itineraries?.[selectedItinerary];
  const currentDay = currentItinerary?.days?.find(day => day.day_number === selectedDay);
  const allActivities = [
    ...(currentDay?.attractions || []),
    ...(currentDay?.restaurants || []),
    ...(currentDay?.experiences || [])
  ];

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    
    const cardElement = e.target.closest('.activity-card');
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      e.dataTransfer.setDragImage(cardElement, rect.width / 2, rect.height / 2);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null) return;
    // Handle reordering logic here
    setDraggedItem(null);
  };

  const getItemType = (item) => {
    if (item.cuisine) return 'restaurant';
    if (currentDay?.experiences?.includes(item)) return 'experience';
    return 'attraction';
  };

  const getTagColor = (tag) => {
    const colors = {
      restaurant: 'bg-green-100 text-green-700',
      attraction: 'bg-blue-100 text-blue-700',
      experience: 'bg-purple-100 text-purple-700',
      seafood: 'bg-orange-100 text-orange-700',
      beach: 'bg-cyan-100 text-cyan-700',
      fort: 'bg-red-100 text-red-700',
      cruise: 'bg-indigo-100 text-indigo-700'
    };
    return colors[tag] || 'bg-gray-100 text-gray-700';
  };

  if (!data?.results?.itineraries?.length) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="text-center text-gray-500">No itinerary data available</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header with Itinerary Selection */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {data.results.name} - {currentItinerary?.title}
        </h1>
        
        {/* Itinerary Tabs */}
        <div className="flex space-x-4 mb-4 border-b">
          {data.results.itineraries.map((itinerary, index) => (
            <button
              key={itinerary.id}
              onClick={() => setSelectedItinerary(index)}
              className={`pb-2 px-1 font-medium text-sm ${
                selectedItinerary === index
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {itinerary.title}
            </button>
          ))}
        </div>

        {/* Day Navigation */}
        <div className="flex space-x-8">
          <span className="text-gray-900 font-bold">Overview</span>
          {currentItinerary?.days?.map((day) => (
            <button
              key={day.day_number}
              onClick={() => setSelectedDay(day.day_number)}
              className={`font-bold pb-1 ${
                selectedDay === day.day_number
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-900 hover:text-black'
              }`}
            >
              Day {day.day_number}
            </button>
          ))}
        </div>
      </div>

      {/* Day Activities Header */}
      {currentDay && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Day {currentDay.day_number}: {currentDay.title}
              </h2>
              <p className="text-gray-600 text-sm mt-1">{currentDay.description}</p>
              <p className="text-gray-500 text-sm">Locations: {currentDay.locations}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600">
                <Plus size={16} />
                <span>Add Activity</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <Route size={16} />
                <span>Optimize Route</span>
              </button>
              <span className="text-gray-500">{allActivities.length} activities</span>
            </div>
          </div>

          {/* Budget Summary */}
          {currentDay.budget && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-500">Attractions</div>
                  <div className="font-semibold">₹{parseFloat(currentDay.budget.attractions_cost).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Restaurants</div>
                  <div className="font-semibold">₹{parseFloat(currentDay.budget.restaurants_cost).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Experiences</div>
                  <div className="font-semibold">₹{parseFloat(currentDay.budget.experiences_cost).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Budget</div>
                  <div className="font-bold text-green-600">₹{parseFloat(currentDay.budget.total_cost).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Activities List */}
          <div className="space-y-6">
            {allActivities.map((activity, index) => {
              const itemType = getItemType(activity);
              
              return (
                <div key={`${itemType}-${activity.id}`}>
                  {/* Activity Card */}
                  <div
                    className={`flex bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow activity-card ${
                      draggedItem === index ? 'opacity-50' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {/* Drag Handle */}
                    <div 
                      className="flex items-center mr-4 cursor-move hover:bg-gray-50 rounded-lg px-2 py-1 -ml-2"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GripVertical className="text-gray-400 mr-2" size={20} />
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        {index < allActivities.length - 1 && (
                          <div className="w-px h-12 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                    </div>

                    {/* Activity Content */}
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        console.log(`Clicked on ${activity.name}`);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {activity.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {activity.description}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${getTagColor(itemType)}`}>
                              {itemType}
                            </span>
                            {activity.cuisine && (
                              <span className={`px-2 py-1 rounded-full text-xs ${getTagColor('seafood')}`}>
                                {activity.cuisine}
                              </span>
                            )}
                            <button className="text-gray-500 text-xs flex items-center space-x-1 hover:text-gray-700">
                              <Plus size={12} />
                              <span>Add Tag</span>
                            </button>
                          </div>
                          
                          {/* Address info */}
                          {activity.address && (
                            <p className="text-gray-500 text-xs">{activity.address}</p>
                          )}
                        </div>

                        {/* Cost and Details */}
                        <div className="ml-6 text-right">
                          {activity.estimated_cost && parseFloat(activity.estimated_cost) > 0 && (
                            <div className="mb-4">
                              <div className="text-sm text-gray-500 mb-1">Cost</div>
                              <div className="text-lg font-semibold text-green-600">
                                ₹{parseFloat(activity.estimated_cost).toLocaleString()}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-right space-y-1">
                            <div className="text-sm text-gray-500">Location</div>
                            {activity.latitude && activity.longitude && (
                              <div className="flex items-center justify-end space-x-1 text-xs text-gray-500">
                                <MapPin size={12} />
                                <span>{parseFloat(activity.latitude).toFixed(3)}, {parseFloat(activity.longitude).toFixed(3)}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Remove button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(`Remove ${activity.name}`);
                            }}
                            className="mt-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {allActivities.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No activities planned for this day
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ItineraryComponent