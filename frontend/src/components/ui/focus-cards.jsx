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
      "rounded-2xl right-5 relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-70 w-90 transition-all duration-300 ease-out",
      hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
    )}>

      
     
    <img src={card.src} alt={card.title} className="object-cover absolute inset-0" />

     {/* Always visible top-right icons */}
    <div className="absolute top-4 right-4 flex gap-3">
      <button className="backdrop-blur-md bg-black/30 p-2 rounded-full text-white hover:bg-black/50 transition">
        <Heart className="w-5 h-5" />
      </button>
      <button className="backdrop-blur-md bg-black/30 p-2 rounded-full text-white hover:bg-black/50 transition">
        <Bookmark className="w-5 h-5" />
      </button>
    </div>
    
     <div className={cn(
        "absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent text-white transition-opacity duration-300",
        hovered === index ? "opacity-0" : "opacity-100"
      )}>
      <div>
        <h3 className="hover:hidden text md:text font-normal  backdrop-blur-md p-1 px-3 rounded-2xl ">{card.location}</h3>
        
      </div>
    </div>
    <div
      className={cn(
        "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
        hovered === index ? "opacity-100" : "opacity-0"
      )}>
      <div
        className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
        <div>{card.title}</div>
        <div className="flex justify-between gap-30">
          <div className="text-sm op">{card.location}</div>
     
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-sm">
          <Heart fill="true" color="red" className="w-4 h-4 text-red-500 fill-current" /> {card.likes}
        </span>
        <span className="bg-black/50 px-2 py-1 rounded-md text-xs">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-4">
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
