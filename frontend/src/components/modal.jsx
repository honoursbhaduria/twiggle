import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const travelerTypes = [
  {
    id: 1,
    emoji: "🏕",
    title: "Adventurous Traveler",
    description: "Loves thrill and adrenaline; seeks hiking, rafting, trekking, or exploring offbeat paths.",
    color: "from-orange-400 to-red-500",
    src:"/adventure.png"
  },
  {
    id: 2,
    emoji: "🏖",
    title: "Leisure Traveler",
    description: "Travels to relax, unwind, and escape daily stress; prefers beaches, resorts, or peaceful spots.",
    color: "from-blue-400 to-cyan-500",
    src:"/leisure.png"
  },
  {
    id: 3,
    emoji: "🏙",
    title: "Cultural Explorer",
    description: "Interested in local traditions, food, festivals, and historical sites; loves learning about new cultures.",
    color: "from-purple-400 to-pink-500",
    src:"/culture.png"
  },
  {
    id: 4,
    emoji: "📸",
    title: "Social Media Traveler",
    description: "Travels for aesthetic spots, trendy cafés, and picture-perfect moments to post online.",
    color: "from-pink-400 to-rose-500",
    src:"/social.png"
  },
  {
    id: 5,
    emoji: "🌍",
    title: "Budget Backpacker",
    description: "Focuses on affordable travel, hostels, local transport, and experiencing more with less money.",
    color: "from-green-400 to-emerald-500",
    src:"/budget.png"
  },
  {
    id: 6,
    emoji: "🧘‍♂️",
    title: "Spiritual or Wellness Traveler",
    description: "Seeks inner peace through meditation, yoga retreats, spiritual destinations, and wellness experiences.",
    color: "from-indigo-400 to-purple-500",
    src:"/spritual.png"
  }
];

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    // Check if user has already selected a traveler type
    const savedType = localStorage.getItem('travelerType');
    if (!savedType) {
      // Show modal after a short delay for better UX
      setTimeout(() => setIsOpen(true), 500);
    }
  }, []);

  const handleSelectType = (type) => {
    setSelectedType(type.id);
    localStorage.setItem('travelerType', JSON.stringify(type));
    // Close modal after a short delay to show selection
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleSkip = () => {
    localStorage.setItem('travelerType', JSON.stringify({ skipped: true }));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-6 px-6 border-b border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            What Kind of Traveler Are You?
          </h2>
          
        </div>

        {/* Traveler Types Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {travelerTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelectType(type)}
                className={`relative group p-6 rounded-2xl  transition-all duration-300 text-left
                  ${selectedType === type.id 
                    ? ' bg-blue-50 scale-105 shadow-lg' 
                    : 'border-gray-200  hover:shadow-md hover:scale-105'
                  }`}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative">
                  {/* Emoji */}
                  <img className='w-30 items-center justify-center flex mx-auto ' src={type.src} alt={type.title} />
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                    {type.title}
                  </h3>
                
                  {/* <p className="text-sm text-gray-600 leading-relaxed">
                    {type.description}
                  </p> */}

                  {/* Selected Indicator */}
                  {selectedType === type.id && (
                    <div className="absolute -top-2 -right-2 bg-[#3E92D1] text-white rounded-full p-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-3xl">
          <button
            onClick={handleSkip}
            className="w-full text-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;