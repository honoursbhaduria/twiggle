import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Sparkles, X } from 'lucide-react';

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
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    // Check if user has already selected a traveler type
    const savedType = localStorage.getItem('travelerType');
    if (!savedType) {
      // Show modal after a short delay for better UX
      setTimeout(() => setIsOpen(true), 500);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
    return undefined;
  }, [isOpen]);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setIsConfirming(false);
  };

  const handleConfirm = () => {
    if (!selectedType || isConfirming) return;
    setIsConfirming(true);
    localStorage.setItem('travelerType', JSON.stringify(selectedType));
    setTimeout(() => {
      setIsConfirming(false);
      setIsOpen(false);
      setSelectedType(null);
    }, 200);
  };

  const handleSkip = () => {
    localStorage.setItem('travelerType', JSON.stringify({ skipped: true }));
    setIsOpen(false);
    setIsConfirming(false);
    setSelectedType(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 scrollbar-hide">
  <div className="relative mx-4 mt-3 w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl max-h-[80vh]">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,140,255,0.15),transparent_60%)] scrollbar-hide" />

        <button
          onClick={handleSkip}
          className="absolute right-5 top-5 z-20 rounded-full border border-slate-200 bg-white/80 p-2 text-slate-500 transition-all hover:border-slate-300 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative flex max-h-[85vh] flex-col divide-y divide-slate-100 overflow-y-auto">
          <header className="space-y-4 px-8 pt-14 md:pt-16 pb-8 text-center">
            <div className="mx-auto flex w-max items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              <Sparkles className="h-3 w-3" /> Match experience
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              What kind of traveler fits you best?
            </h2>
            {/* <p className="mx-auto max-w-3xl text-sm text-slate-600 md:text-base">
              Select the profile that resonates with your style and we’ll personalize destination ideas, itineraries, and insider tips that feel tailor-made.
            </p> */}
          </header>

          <section className="relative px-6 pb-8 pt-4 md:px-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 scrollbar-hide">
              {travelerTypes.map((type) => {
                const isSelected = selectedType?.id === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() => handleSelectType(type)}
                    className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 text-left shadow-sm hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 ${
                      isSelected ? 'border-transparent shadow-xl ring-2 ring-sky-300/70' : 'border-slate-100'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-linear-to-br ${type.color} opacity-0 transition-opacity duration-300 group-hover:opacity-20 ${
                      isSelected ? 'opacity-20' : ''
                    }`} />
                    <div className="relative flex h-full flex-col gap-4 p-6">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          #{type.id.toString().padStart(2, '0')}
                        </span>
                        {isSelected ? (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg">
                            <Check className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors group-hover:border-slate-300 group-hover:text-slate-600">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex justify-center">
                          <img
                            src={type.src}
                            alt={type.title}
                            className="h-28 w-auto drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="space-y-2 text-center">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {type.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-600">
                            {type.description}
                          </p>
                        </div>
                        <div className="mt-auto flex items-center justify-between rounded-2xl border border-slate-100 bg-white/70 px-4 py-2 text-xs font-medium text-slate-500">
                          <span>Tap to personalise</span>
                          <span className="font-semibold text-sky-500">View matches</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <footer className="flex flex-col gap-3 bg-slate-50/90 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div className="text-sm text-slate-500">
              Prefer to explore on your own pace?
              <button onClick={handleSkip} className="ml-2 font-semibold text-slate-700 underline-offset-2 hover:underline">
                Skip for now
              </button>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedType}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all md:w-auto ${
                selectedType
                  ? 'bg-linear-to-r from-sky-500 to-blue-600 text-white shadow-lg hover:from-sky-600 hover:to-blue-700'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isConfirming ? 'Saving preference…' : selectedType ? `Continue as ${selectedType.title}` : 'Choose a traveler type'}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Modal;