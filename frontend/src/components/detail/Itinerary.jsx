import React, { useState } from 'react';
import { Clock, MapPin, X, Plus, Route, GripVertical } from 'lucide-react';

const ItineraryComponent = ({ data }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedDay, setSelectedDay] = useState('overview');
  const [selectedItinerary, setSelectedItinerary] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the current itinerary and day data
  const currentItinerary = data?.results?.itineraries?.[selectedItinerary];
  const currentDay = selectedDay === 'overview' ? null : currentItinerary?.days?.find(day => day.day_number === selectedDay);
  const allActivities = selectedDay === 'overview' ? [] : [
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

  const openModal = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedActivity(null);
    setIsModalOpen(false);
  };

  if (!data?.results?.itineraries?.length) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="text-center text-gray-500">No itinerary data available</div>
      </div>
    );
  }

  return (
    <div className="w-full  p-6 bg-white">
      {/* Header with Itinerary Selection */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {data.results.name} - {currentItinerary?.title}
        </h1>
        
        {/* Itinerary Tabs */}
        <div className="flex space-x-4 mb-4">
          {data.results.itineraries.map((itinerary, index) => (
            <button
              key={itinerary.id}
              onClick={() => setSelectedItinerary(index)}
              className={`p-2 text-sm ${
                selectedItinerary === index
                  ? 'bg-black font-medium   border rounded-lg text-white border-black'
                  : 'text-black font-medium hover:text-gray-800'
              }`}
            >
              {itinerary.title}
            </button>
          ))}
        </div>

        {/* Day Navigation */}
        <div className="flex space-x-8">
          <button
            onClick={() => setSelectedDay('overview')}
            className={`pb-1 ${
              selectedDay === 'overview'
                ? 'text-black font-bold  border-black'
                : 'text-gray-900 font-normal hover:text-black'
            }`}
          >
            Overview
          </button>
          {currentItinerary?.days?.map((day) => (
            <button
              key={day.day_number}
              onClick={() => setSelectedDay(day.day_number)}
              className={` pb-1 ${
                selectedDay === day.day_number
                  ? 'text-black  font-bold border-black'
                  : 'text-gray-900 font-normal hover:text-black'
              }`}
            >
              Day {day.day_number}
            </button>
          ))}
        </div>
      </div>

      {/* Day Activities Header */}
      {selectedDay === 'overview' ? (
        /* Overview Content */
        <div className="space-y-6">
          {/* Itinerary Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Itinerary Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Duration</div>
                <div className="font-semibold">{currentItinerary?.days?.length || 0} Days</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Activities</div>
                <div className="font-semibold">
                  {currentItinerary?.days?.reduce((total, day) => 
                    total + (day.attractions?.length || 0) + (day.restaurants?.length || 0) + (day.experiences?.length || 0), 0
                  ) || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Budget</div>
                <div className="font-bold text-green-600">
                  ₹{currentItinerary?.days?.reduce((total, day) => 
                    total + parseFloat(day.budget?.total_cost || 0), 0
                  ).toLocaleString() || '0'}
                </div>
              </div>
            </div>
          </div>

          {/* Day-by-Day Overview */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Day-by-Day Overview</h2>
            <div className="space-y-4">
              {currentItinerary?.days?.map((day) => (
                <div key={day.day_number} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Day {day.day_number}: {day.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{day.description}</p>
                      <p className="text-gray-500 text-xs mt-1">Locations: {day.locations}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        ₹{parseFloat(day.budget?.total_cost || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(day.attractions?.length || 0) + (day.restaurants?.length || 0) + (day.experiences?.length || 0)} activities
                      </div>
                    </div>
                  </div>
                  
                  {/* Activity breakdown */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Attractions</div>
                      <div className="font-medium">{day.attractions?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Restaurants</div>
                      <div className="font-medium">{day.restaurants?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Experiences</div>
                      <div className="font-medium">{day.experiences?.length || 0}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedDay(day.day_number)}
                    className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Breakdown */}
          {currentItinerary?.days?.some(day => day.budget) && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Breakdown</h2>
              <div className="space-y-3">
                {currentItinerary.days.map((day) => (
                  day.budget && (
                    <div key={day.day_number} className="flex justify-between items-center py-2">
                      <span className="font-medium">Day {day.day_number}</span>
                      <div className="flex space-x-6 text-sm">
                        <span>Attractions: ₹{parseFloat(day.budget.attractions_cost).toLocaleString()}</span>
                        <span>Restaurants: ₹{parseFloat(day.budget.restaurants_cost).toLocaleString()}</span>
                        <span>Experiences: ₹{parseFloat(day.budget.experiences_cost).toLocaleString()}</span>
                        <span className="font-semibold text-green-600">
                          Total: ₹{parseFloat(day.budget.total_cost).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      ) : currentDay && (
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
              <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-900">
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
                      onClick={() => openModal(activity)}
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

      {/* Activity Detail Modal */}
      {isModalOpen && selectedActivity && (
        <div className="fixed inset-1   flex items-center justify-center z-999" onClick={closeModal}>
          <div 
            className="shadow-2xl bg-white rounded-lg  h-[80vh] w-200  p-6 m-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            {/* Modal content */}
            <div className="pr-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTagColor(getItemType(selectedActivity))}`}>
                    {getItemType(selectedActivity)}
                  </span>
                  {selectedActivity.cuisine && (
                    <span className={`px-2 py-1 rounded-full text-xs ${getTagColor('seafood')}`}>
                      {selectedActivity.cuisine}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedActivity.name}
                </h2>
                <p className="text-gray-600">
                  {selectedActivity.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Location Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Location Details</h3>
                  
                  {selectedActivity.address && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Address</div>
                      <div className="text-gray-800">{selectedActivity.address}</div>
                    </div>
                  )}
                  
                  {selectedActivity.latitude && selectedActivity.longitude && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Coordinates</div>
                      <div className="flex items-center space-x-1 text-gray-800">
                        <MapPin size={16} />
                        <span>{parseFloat(selectedActivity.latitude).toFixed(6)}, {parseFloat(selectedActivity.longitude).toFixed(6)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cost Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Cost Information</h3>
                  
                  {selectedActivity.estimated_cost && parseFloat(selectedActivity.estimated_cost) > 0 ? (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Estimated Cost</div>
                      <div className="text-2xl font-bold text-green-600">
                        ₹{parseFloat(selectedActivity.estimated_cost).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Estimated Cost</div>
                      <div className="text-gray-600">Free / Not specified</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              {(selectedActivity.opening_hours || selectedActivity.contact || selectedActivity.website) && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                  <div className="space-y-3">
                    {selectedActivity.opening_hours && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Opening Hours</div>
                        <div className="text-gray-800">{selectedActivity.opening_hours}</div>
                      </div>
                    )}
                    
                    {selectedActivity.contact && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Contact</div>
                        <div className="text-gray-800">{selectedActivity.contact}</div>
                      </div>
                    )}
                    
                    {selectedActivity.website && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Website</div>
                        <a 
                          href={selectedActivity.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-100 hover:text-blue-800 underline"
                        >
                          {selectedActivity.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Handle edit action
                    console.log('Edit activity:', selectedActivity.name);
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  Edit Activity
                </button>
                <button
                  onClick={() => {
                    // Handle remove action
                    console.log('Remove activity:', selectedActivity.name);
                    closeModal();
                  }}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryComponent