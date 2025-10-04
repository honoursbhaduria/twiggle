import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, FileText, Save, Plus, MapPin, Plane, Building2, Calendar, Trash2, Edit3, Search, Tag, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDestination } from '../../hooks/useTravelApi';

const TravelItineraryForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { destination: data, error, loading } = useDestination(slug);
  
  // All hooks must be declared at the top, before any conditional returns
  const [activeTab, setActiveTab] = useState('day1');
  const [selectedItinerary, setSelectedItinerary] = useState(0);
  const [flightDetails, setFlightDetails] = useState({
    transportMode: 'flight',
    arrivalAirport: '',
    arrivalDate: '',
    arrivalTime: '',
    flightNumber: '',
    airline: ''
  });
  const [budgetSummary, setBudgetSummary] = useState({ attractions: 0, restaurants: 0, experiences: 0, total: 0 });
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    startTime: '',
    duration: '',
    cost: '',
    tags: []
  });
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Update budget summary when data changes - must be at top with other hooks
  useEffect(() => {
    if (data?.results?.itineraries?.length) {
      const itineraries = data.results.itineraries;
      const currentItinerary = itineraries[0]; // Use first itinerary by default
      const days = currentItinerary?.days || [];
      const currentDay = days.find(day => day.day_number === parseInt(activeTab.replace('day', '')));
      
      if (currentDay?.budget) {
        setBudgetSummary({
          attractions: parseFloat(currentDay.budget.attractions_cost || 0),
          restaurants: parseFloat(currentDay.budget.restaurants_cost || 0),
          experiences: parseFloat(currentDay.budget.experiences_cost || 0),
          total: parseFloat(currentDay.budget.total_cost || 0)
        });
      }
    }
  }, [data, activeTab]);

  console.log('Edit page data:', data);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading itinerary...</h2>
          <p className="text-muted-foreground">Please wait while we load your travel details</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error Loading Itinerary</h2>
          <p className="text-muted-foreground mb-4">{error.message || 'Something went wrong'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Handle no data state
  if (!data?.results?.itineraries?.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Itinerary Found</h2>
          <p className="text-muted-foreground mb-4">No itinerary data available for this destination</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Process API data
  const itineraries = data?.results?.itineraries || [];
  const currentItinerary = itineraries[selectedItinerary];
  const days = currentItinerary?.days || [];
  
  // Generate tabs from actual day data
  const tabs = days.map(day => ({
    id: `day${day.day_number}`,
    label: `Day ${day.day_number}`
  }));

  // Get current day data
  const currentDay = days.find(day => day.day_number === parseInt(activeTab.replace('day', '')));
  
  // Combine all activities for current day
  const allActivities = currentDay ? [
    ...(currentDay.attractions || []).map(item => ({ ...item, type: 'attraction' })),
    ...(currentDay.restaurants || []).map(item => ({ ...item, type: 'restaurant' })),
    ...(currentDay.experiences || []).map(item => ({ ...item, type: 'experience' }))
  ] : [];

  // Helper functions
  const handleFlightDetailsChange = (field, value) => {
    setFlightDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFlightChange = (field, value) => {
    setFlightDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addActivity = () => {
    // TODO: Implement API call to add activity
    console.log('Add activity functionality will be implemented with API integration');
    /*
    if (newActivity.name && newActivity.description && newActivity.startTime) {
      const activity = {
        ...newActivity,
        id: Date.now(),
        distance: '0km from hotel',
        coordinates: '0.0000, 0.0000'
      };
      // This would be an API call to update the itinerary
      setNewActivity({
        name: '',
        description: '',
        startTime: '',
        duration: '',
        cost: '',
        tags: []
      });
      setShowAddActivity(false);
    }
    */
  };

  const removeActivity = (id) => {
    // TODO: Implement API call to remove activity
    console.log('Remove activity functionality will be implemented with API integration');
  };

  const addTag = (activityId, tag) => {
    // TODO: Implement API call to add tag
    console.log('Add tag functionality will be implemented with API integration');
  };

  const removeTag = (activityId, tagToRemove) => {
    // TODO: Implement API call to remove tag
    console.log('Remove tag functionality will be implemented with API integration');
  };

  const addNewActivityTag = () => {
    if (newTag.trim()) {
      setNewActivity(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Preview
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Edit Itinerary</h1>
              <p className="text-sm text-black">{data.results.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
            <button className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button className="flex items-center px-4 py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Travel Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Plane className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Travel Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transportation Mode</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={flightDetails.transportMode}
                  onChange={(e) => handleFlightChange('transportMode', e.target.value)}
                >
                  <option value="flight">Flight</option>
                  <option value="train">Train</option>
                  <option value="bus">Bus</option>
                  <option value="car">Car</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Airport</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    value={flightDetails.arrivalAirport}
                    onChange={(e) => handleFlightChange('arrivalAirport', e.target.value)}
                  >
                    <option value="">Select airport</option>
                    <option value="DEL">Delhi (DEL)</option>
                    <option value="BOM">Mumbai (BOM)</option>
                    <option value="BLR">Bangalore (BLR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={flightDetails.arrivalDate}
                    onChange={(e) => handleFlightChange('arrivalDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Time</label>
                  <input 
                    type="time" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={flightDetails.arrivalTime}
                    onChange={(e) => handleFlightChange('arrivalTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flight Number (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 6E-395"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={flightDetails.flightNumber}
                    onChange={(e) => handleFlightChange('flightNumber', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Airline (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., IndiGo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={flightDetails.airline}
                    onChange={(e) => handleFlightChange('airline', e.target.value)}
                  />
                </div>
              </div>

              <button className="flex items-center px-4 py-2 text-sm text-black border border-black rounded-md hover:bg-gray-100">
                <Search className="w-4 h-4 mr-2" />
                Search Flights
              </button>
            </div>
          </div>

          {/* Accommodations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">Accommodations (0 hotels)</h2>
              </div>
              <button className="flex items-center px-4 py-2 text-sm text-white bg-black hover:bg-gray-900 rounded-md ">
                <Plus className="w-4 h-4 mr-2" />
                Add Hotel
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                <div className="flex items-start">
                  <Building2 className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-orange-800">No accommodation for Day 1</h3>
                    <p className="text-sm text-orange-600 mt-1">Add a hotel to cover this day</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <Building2 className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Missing Accommodation</h3>
                      <p className="text-sm text-red-600 mt-1">Days 1, 2, 3, 4 need accommodation</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md">
                      AI Suggest
                    </button>
                    <button className="px-3 py-1 text-xs text-white bg-black hover:bg-gray-800 rounded-md">
                      Add Manually
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3 mt-0.5">💡</div>
                  <div>
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Smart Tip:</span> Our AI can suggest hotels based on your travel pattern and destination. For longer stays, we recommend considering multiple hotels in different areas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Day Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Day 1 Activities */}
            {activeTab === 'day1' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Day 1 Activities</h3>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setShowAddActivity(true)}
                      className="flex items-center px-4 py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Activity
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Optimize Route
                    </button>
                    <span className="text-sm text-gray-500">{allActivities.length} activities</span>
                  </div>
                </div>

                {/* Add Activity Form */}
                {showAddActivity && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Add New Activity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Activity name"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity(prev => ({...prev, name: e.target.value}))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="time"
                        value={newActivity.startTime}
                        onChange={(e) => setNewActivity(prev => ({...prev, startTime: e.target.value}))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 1h 30m)"
                        value={newActivity.duration}
                        onChange={(e) => setNewActivity(prev => ({...prev, duration: e.target.value}))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Cost (e.g., ₹150)"
                        value={newActivity.cost}
                        onChange={(e) => setNewActivity(prev => ({...prev, cost: e.target.value}))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity(prev => ({...prev, description: e.target.value}))}
                      className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                    <div className="flex items-center space-x-2 mt-4">
                      <input
                        type="text"
                        placeholder="Add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addNewActivityTag()}
                      />
                      <button
                        onClick={addNewActivityTag}
                        className="px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                      >
                        Add Tag
                      </button>
                    </div>
                    {(newActivity.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(newActivity.tags || []).map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-md">
                            {tag}
                            <button
                              onClick={() => setNewActivity(prev => ({
                                ...prev,
                                tags: prev.tags.filter((_, i) => i !== index)
                              }))}
                              className="ml-1 text-purple-500 hover:text-purple-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => setShowAddActivity(false)}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addActivity}
                        className="px-4 py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md"
                      >
                        Add Activity
                      </button>
                    </div>
                  </div>
                )}

                {/* Activities List */}
                <div className="space-y-4">
                  {allActivities.map((activity, index) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                              #{index + 1}
                            </div>
                            <div className="w-px h-16 bg-gray-200 mt-2"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{activity.name}</h4>
                              <span className="text-sm text-gray-500">{activity.distance}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {(activity.tags || []).map((tag) => (
                                <span key={tag} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-md">
                                  {tag}
                                  <button
                                    onClick={() => removeTag(activity.id, tag)}
                                    className="ml-1 text-purple-500 hover:text-purple-700"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                              <button
                                onClick={() => {
                                  const tag = prompt('Enter tag name:');
                                  if (tag) addTag(activity.id, tag);
                                }}
                                className="flex items-center px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                Add Tag
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {activity.startTime} AM
                          </div>
                          <div className="text-sm text-gray-500 mb-1">{activity.duration}</div>
                          <div className="font-medium text-gray-900 mb-2">{activity.cost}</div>
                          <div className="text-xs text-gray-500 mb-3">{activity.coordinates}</div>
                          <button
                            onClick={() => removeActivity(activity.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Day 1 Activities */}
            {activeTab === 'day2' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Day 2 Activities</h3>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setShowAddActivity(true)}
                      className="flex items-center px-4 py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Activity
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Optimize Route
                    </button>
                    <span className="text-sm text-gray-500">{allActivities.length} activities</span>
                  </div>
                </div>

                {/* Add Activity Form */}
                {showAddActivity && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Add New Activity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Activity name"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity(prev => ({...prev, name: e.target.value}))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="time"
                        value={newActivity.startTime}
                        onChange={(e) => setNewActivity(prev => ({...prev, startTime: e.target.value}))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 1h 30m)"
                        value={newActivity.duration}
                        onChange={(e) => setNewActivity(prev => ({...prev, duration: e.target.value}))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Cost (e.g., ₹150)"
                        value={newActivity.cost}
                        onChange={(e) => setNewActivity(prev => ({...prev, cost: e.target.value}))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity(prev => ({...prev, description: e.target.value}))}
                      className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                    <div className="flex items-center space-x-2 mt-4">
                      <input
                        type="text"
                        placeholder="Add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addNewActivityTag()}
                      />
                      <button
                        onClick={addNewActivityTag}
                        className="px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                      >
                        Add Tag
                      </button>
                    </div>
                    {(newActivity.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(newActivity.tags || []).map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-md">
                            {tag}
                            <button
                              onClick={() => setNewActivity(prev => ({
                                ...prev,
                                tags: prev.tags.filter((_, i) => i !== index)
                              }))}
                              className="ml-1 text-purple-500 hover:text-purple-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => setShowAddActivity(false)}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addActivity}
                        className="px-4 py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md"
                      >
                        Add Activity
                      </button>
                    </div>
                  </div>
                )}

                {/* Activities List */}
                <div className="space-y-4">
                  {allActivities.map((activity, index) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                              #{index + 1}
                            </div>
                            <div className="w-px h-16 bg-gray-200 mt-2"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{activity.name}</h4>
                              <span className="text-sm text-gray-500">{activity.distance}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {(activity.tags || []).map((tag) => (
                                <span key={tag} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-md">
                                  {tag}
                                  <button
                                    onClick={() => removeTag(activity.id, tag)}
                                    className="ml-1 text-purple-500 hover:text-purple-700"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                              <button
                                onClick={() => {
                                  const tag = prompt('Enter tag name:');
                                  if (tag) addTag(activity.id, tag);
                                }}
                                className="flex items-center px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                Add Tag
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {activity.startTime} AM
                          </div>
                          <div className="text-sm text-gray-500 mb-1">{activity.duration}</div>
                          <div className="font-medium text-gray-900 mb-2">{activity.cost}</div>
                          <div className="text-xs text-gray-500 mb-3">{activity.coordinates}</div>
                          <button
                            onClick={() => removeActivity(activity.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-6 space-y-6">
          {/* AI Suggestions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-4">● AI Suggestions for Day 1</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 text-sm">
                <div className="font-medium">Morning Yoga Session</div>
                <div className="text-gray-500">Start your day with peaceful yoga by the Ganges</div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 text-sm">
                <div className="font-medium">Ganga Aarti Ceremony</div>
                <div className="text-gray-500">Evening spiritual ceremony at Parmarth Niketan</div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 text-sm">
                <div className="font-medium">Local Food Tour</div>
                <div className="text-gray-500">Experience authentic North Indian cuisine</div>
              </button>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-4">Live Budget Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Attractions:</span>
                <span className="font-medium">₹{budgetSummary.attractions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Food:</span>
                <span className="font-medium">₹{budgetSummary.food}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Est. Transport:</span>
                <span className="font-medium">₹{budgetSummary.transport}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Day 1 Total:</span>
                <span className="font-medium text-black">₹{budgetSummary.total}</span>
              </div>
              <div className="text-xs text-gray-500">
                Total Distance: 5067.6km from hotel
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelItineraryForm;