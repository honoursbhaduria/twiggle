import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import SidebarDemo from '../destination/sidebar';
import Maps from '../detail/map';
import {Button} from "../ui/button"

const TravelDashboard = () => {
  const [checkedItems, setCheckedItems] = useState({
    apartment: true
  });

  const toggleCheck = (item) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const calendarDays = [
    { date: 1, day: 'Wed' },
    { date: 2, day: 'Thu' },
    { date: 3, day: 'Fri' },
    { date: 4, day: 'Sat', event: 'London-Tokyo', color: 'bg-purple-400' },
    { date: 5, day: 'Sun' },
    { date: 6, day: 'Mon' },
    { date: 7, day: 'Tue' },
    { date: 8, day: 'Wed' },
    { date: 9, day: 'Thu' },
    { date: 10, day: 'Fri' },
    { date: 11, day: 'Sat' },
    { date: 12, day: 'Sun' },
    { date: 13, day: 'Mon' },
    { date: 14, day: 'Tue' },
    { date: 15, day: 'Wed', event: 'Tokyo-Kyoto', color: 'bg-purple-400' },
    { date: 16, day: 'Thu', event: 'Kyoto', marker: true },
    { date: 17, day: 'Fri' },
    { date: 18, day: 'Sat' },
    { date: 19, day: 'Sun' },
    { date: 20, day: 'Mon' },
    { date: 21, day: 'Tue', event: 'Kyoto-Osaka', color: 'bg-purple-400' },
    { date: 22, day: 'Wed', event: 'Osaka', marker: true },
    { date: 23, day: 'Thu' },
    { date: 24, day: 'Fri' },
    { date: 25, day: 'Sat' },
    { date: 26, day: 'Sun', event: 'Osaka...', color: 'bg-purple-400' },
    { date: 27, day: 'Mon', event: 'Bangkok', marker: true },
    { date: 28, day: 'Tue' },
    { date: 29, day: 'Wed' },
    { date: 30, day: 'Thu' },
  ];

  const upcomingPayments = [
    { date: '15.11', name: 'Shinkansen train ticket', amount: '130$', color: 'bg-purple-400' },
    { date: '15.11', name: 'Yasumi Hotel in Kyoto', amount: '185$', color: 'bg-purple-400' },
    { date: '21.11', name: 'Mitsukawa Hostel in Osaka', amount: '130$', color: 'bg-purple-400' },
    { date: '23.11', name: 'Monthly insurance charge', amount: '130$', color: 'bg-purple-400' },
    { date: '30.11', name: 'Pay day', amount: '2600$', color: 'bg-lime-300' },
    { date: '06.12', name: 'Apartments in Hua Hin', amount: '200$', color: 'bg-purple-400' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarDemo/>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:ml-10 p-4 md:p-8   gap-4 md:gap-6">
        
          {/* Welcome Card - Fixed */}
        <div className=" lg:h-full ">
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm mb-8">
           <div className='flex justify-between'>
             <h1 className="text-2xl md:text-4xl font-poppins  font-bold mb-2">Welcome, Tejash!</h1>
              <Button className={"bg-[#479FDC] hover:bg-[#479FD4] "}>Explore Destination</Button>
           </div>

            <p className="text-sm text-gray-600 mb-6">So far you've been to</p>

            <div className="flex flex-wrap justify-center md:justify-between gap-4 md:gap-0 mb-6 md:mb-6">
              {/* Destinations Circle */}
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <svg className="w-20 h-20 md:w-24 md:h-24 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#e5e7eb" strokeWidth="6" fill="none" className="md:hidden" />
                  <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" className="hidden md:block" />
                  <circle cx="40" cy="40" r="32" stroke="#bef264" strokeWidth="6" fill="none" className="md:hidden"
                    strokeDasharray="201" strokeDashoffset="40" strokeLinecap="round" />
                  <circle cx="48" cy="48" r="40" stroke="#bef264" strokeWidth="8" fill="none" className="hidden md:block"
                    strokeDasharray="251.2" strokeDashoffset="50" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-lg md:text-2xl font-bold">125</div>
                  <div className="text-xs text-gray-500">Attractions</div>
                </div>
              </div>

              {/* Countries Circle */}
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <svg className="w-20 h-20 md:w-24 md:h-24 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#e5e7eb" strokeWidth="6" fill="none" className="md:cx-48 md:cy-48 md:r-40 md:stroke-8" />
                  <circle cx="40" cy="40" r="32" stroke="#c4b5fd" strokeWidth="6" fill="none" className="md:cx-48 md:cy-48 md:r-40 md:stroke-8"
                    strokeDasharray="201" strokeDashoffset="100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-lg md:text-2xl font-bold">21</div>
                  <div className="text-xs text-gray-500">itinary</div>
                </div>
              </div>

              {/* Continents Circle */}
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <svg className="w-20 h-20 md:w-24 md:h-24 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#e5e7eb" strokeWidth="6" fill="none" className="md:cx-48 md:cy-48 md:r-40 md:stroke-8" />
                  <circle cx="40" cy="40" r="32" stroke="#1f2937" strokeWidth="6" fill="none" className="md:cx-48 md:cy-48 md:r-40 md:stroke-8"
                    strokeDasharray="201" strokeDashoffset="150" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-lg md:text-2xl font-bold">4</div>
                  <div className="text-xs text-gray-500">Destination</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Which makes your travel goal completed by</span>
                <span className="text-sm font-bold text-lime-500">43%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-lime-300 h-2 rounded-full" style={{ width: '43%' }}></div>
              </div>
            </div>

      
          </div>

            {/* my trips */}
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-2">My Trips</h2>
           

            <div className="relative mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-purple-400 text-white px-3 py-1 rounded-full">60%</span>
                <span className="text-sm text-gray-600">2500$</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-400 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-center mt-2">
                <span className="text-xs text-gray-500">November 2023</span>
              </div>
            </div>

            
          </div>

            {/* To Do */}
          <div className="bg-lime-200 rounded-3xl p-4 md:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">To do</h2>
                <button className="text-gray-600">+</button>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    checked={checkedItems.hotel || false}
                    onChange={() => toggleCheck('hotel')}
                    className="mt-1 w-4 h-4 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Book a hotel in Bangkok</div>
                    <div className="text-xs text-gray-600">Budget limit – 25$/night</div>
                    <div className="text-xs text-gray-600">Dates 26-30 Nov</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    checked={checkedItems.train || false}
                    onChange={() => toggleCheck('train')}
                    className="mt-1 w-4 h-4 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Buy a train tickets to Hua Hin</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    checked={checkedItems.apartment}
                    onChange={() => toggleCheck('apartment')}
                    className="mt-1 w-4 h-4 rounded border-gray-300"
                  />
                  <div className="flex-1 opacity-50">
                    <div className="text-sm font-medium">Book an apartment in Hua Hin</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
       
          {/* Scrollable Content */}
        <div className=" lg:h-full ">
          <div className="space-y-4 md:space-y-6">
          {/* Calendar */}
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm mb-4 md:mb-7">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">November <span className="text-gray-400">2023</span></h2>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-gray-600">&lt;</button>
                <button className="text-gray-400 hover:text-gray-600">&gt;</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-xs mb-4">
              <div className="text-gray-500 font-medium">Mon</div>
              <div className="text-gray-500 font-medium">Tue</div>
              <div className="text-gray-500 font-medium">Wed</div>
              <div className="text-gray-500 font-medium">Thu</div>
              <div className="text-gray-500 font-medium">Fri</div>
              <div className="text-gray-500 font-medium">Sat</div>
              <div className="text-gray-500 font-medium">Sun</div>
            </div>

            <div className=" grid grid-cols-7 gap-1 md:gap-2">
              <div></div>
              <div></div>
              {calendarDays.map((day, index) => (
                <div key={index} className="relative">
                  {day.event ? (
                    <div className={`${day.color} rounded-lg p-2 text-white text-xs`}>
                      <div className="font-medium">{day.date}</div>
                      <div className="text-[10px] truncate">{day.event}</div>
                    </div>
                  ) : day.marker ? (
                    <div className="relative">
                      <div className="text-sm p-2">{day.date}</div>
                      <div className="absolute -right-1 top-2 flex items-center">
                        <MapPin className="w-3 h-3 text-gray-700" fill="currentColor" />
                        <span className="text-[10px] ml-1">{day.event}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm p-2 text-gray-700">{day.date}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommendation for you */}
          <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recommendation for you</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              <div className="relative rounded-2xl overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-purple-400 to-purple-600"></div>
                <button className="absolute top-2 right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-white">♡</span>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="text-white text-xs font-medium">Aix-en-Provence</div>
                  <div className="text-white/80 text-[10px]">◐ France</div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-indigo-900 to-purple-900"></div>
                <button className="absolute top-2 right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-white">♡</span>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="text-white text-xs font-medium">Lofoten</div>
                  <div className="text-white/80 text-[10px]">◐ Norway</div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-teal-400 to-blue-500"></div>
                <button className="absolute top-2 right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-white">♡</span>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="text-white text-xs font-medium">Gardens</div>
                  <div className="text-white/80 text-[10px]">◐ Singapore</div>
                </div>
              </div>
            </div>
          </div>

        

        

            {/* Wishlist */}
            <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Wishlist</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  <button className="absolute top-2 right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-white">♡</span>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="text-white text-xs font-medium">Aix-en-Provence</div>
                    <div className="text-white/80 text-[10px]">◐ France</div>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-indigo-900 to-purple-900"></div>
                  <button className="absolute top-2 right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-white">♡</span>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="text-white text-xs font-medium">Lofoten</div>
                    <div className="text-white/80 text-[10px]">◐ Norway</div>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-teal-400 to-blue-500"></div>
                  <button className="absolute top-2 right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-white">♡</span>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="text-white text-xs font-medium">Gardens</div>
                    <div className="text-white/80 text-[10px]">◐ Singapore</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TravelDashboard;