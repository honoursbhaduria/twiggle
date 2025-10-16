"use client";;
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Bookmark, Heart } from "lucide-react";

export const Card = React.memo(({
  card,
  index,
  hovered,
  setHovered
}) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "rounded-2xl relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out shadow-md hover:shadow-xl",
      hovered !== null && hovered !== index && "scale-[0.98]"
    )}>
     
    <img 
      src={card.src} 
      alt={card.title} 
      className={cn(
        "object-cover absolute inset-0 w-full h-full transition-transform duration-500 ease-out",
        hovered === index && "scale-110"
      )} 
    />

     {/* Always visible top-right icons */}
    <div className="absolute top-3 right-3 flex gap-2">
      <button className="bg-white/90 p-2 rounded-full text-gray-800 hover:bg-white hover:scale-110 transition-all shadow-md">
        <Heart className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <button className="bg-white/90 p-2 rounded-full text-gray-800 hover:bg-white hover:scale-110 transition-all shadow-md">
        <Bookmark className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
    
     <div className={cn(
        "absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-t from-black/60 via-black/30 to-transparent text-white transition-opacity duration-300",
        hovered === index ? "opacity-0" : "opacity-100"
      )}>
      <div>
        <h3 className="text-sm md:text-base font-medium bg-white/20 p-2 px-3 rounded-xl shadow-sm">{card.location}</h3>
      </div>
    </div>
    <div
      className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end py-6 px-4 transition-opacity duration-300",
        hovered === index ? "opacity-100" : "opacity-0"
      )}>
      <div className="w-full space-y-2">
        <div className="text-lg md:text-xl lg:text-2xl font-semibold text-white">
          {card.title}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs md:text-sm text-white/90">{card.location}</div>
     
          <div className="flex items-center gap-2 md:gap-3">
            <span className="flex items-center gap-1 text-xs md:text-sm text-white">
              <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500 fill-red-500" /> {card.likes}
            </span>
            <span className="bg-white/20 px-2 py-1 rounded-lg text-xs text-white font-medium">
              {card.days} days
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
));

Card.displayName = "Card";

export function FocusCards({
  cards
}) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-4">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
