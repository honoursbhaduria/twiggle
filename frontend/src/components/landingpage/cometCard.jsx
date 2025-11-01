import React from 'react'
import { CometCard } from '../ui/comet-card'
import { Calendar, MapPin, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Comet = () => {
    const navigate=useNavigate()
  return (
    <div className='relative'>
         <CometCard className="w-full max-w-xl  h-full mt-27 ">
              <button
                type="button"
                className="my-4 md:my-6 flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border-0 md:p-3"
                aria-label="View invite F7RA"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "none",
                  opacity: 1,
                }}
              >
                <div className="mx-2 flex-1">
                  <div className="relative  h-20 md:h-28 w-full">
                    <img
                      loading="lazy"
                      className="absolute inset-0 h-full w-full rounded-[16px] object-cover"
                      alt="Invite background"
                      src="/bg1.jpg"
                      style={{
                        boxShadow: "",
                        opacity: 1,
                      }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex flex-shrink-0 items-center justify-between p-3 md:p-3 font-mono text-white">
                  <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header with rating */}
                    <div className="flex items-center justify-between p-3 md:p-4 pb-2 gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm md:text-lg font-semibold text-gray-800">5 Days Kerala Backwaters & Spices</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs md:text-sm font-medium text-black">4.8</span>
                      </div>
                    </div>

                    

                    {/* Location and Price */}
                    <div className="px-3 md:px-4 flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-black" />
                        <span className="text-xs md:text-sm">Alleppey, Munnar, Kochi</span>
                      </div>
                     
                    </div>

                    {/* Trip Highlights */}
                    <div className="px-3 md:px-4 mb-3">
                      <h3 className="font-semibold text-gray-800 mb-2 text-xs md:text-sm">Trip Highlights</h3>
                      <ul className="space-y-1.5">
                        <li className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                          <div className="w-2 h-2 bg-black/90 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Houseboat stay in backwaters</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                          <div className="w-2 h-2 bg-black/90 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Tea plantation tours in Munnar</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                          <div className="w-2 h-2 bg-black/90 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Traditional Kathakali performances</span>
                        </li>
                      </ul>
                    </div>

                    {/* Day-by-Day Highlights */}
                    <div className="px-3 md:px-4 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 text-black/90" />
                        <h3 className="font-semibold text-gray-800 text-xs md:text-sm">Day-by-Day Highlights</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="bg-black/90 text-white text-xs px-2 py-1 rounded font-medium">Day 1</div>
                          <span className="text-xs md:text-sm text-gray-700">Kochi: Arrival + Chinese fishing nets</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-black/90 text-white text-xs px-2 py-1 rounded font-medium">Day 2</div>
                          <span className="text-xs md:text-sm text-gray-700">Alleppey: Houseboat cruise</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-black/90 text-white text-xs px-2 py-1 rounded font-medium">Day 3</div>
                          <span className="text-xs md:text-sm text-gray-700">Munnar: Tea gardens + Mattupetty Dam</span>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500 mt-2">+2 more days...</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-3 md:p-4 flex gap-2">
                      <button onClick={()=>navigate("/auth")} className="flex-1 bg-black/90 hover:bg-black/80 cursor-pointer text-white py-1.5 px-3 rounded-lg font-medium text-xs md:text-sm transition-colors">
                        View Full Itinerary
                      </button>
                    </div>
                  </div>
                </div>
              </button>
            </CometCard>
    </div>
  )
}

export default Comet