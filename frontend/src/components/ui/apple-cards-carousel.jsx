"use client";;
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { MapPin, Star, Calendar } from "lucide-react";
import {category} from "../../data/category"

// Sample data for the carousel
const items = [
  {
    id: 2,
    title: "7 Days Rajasthan Royal Heritage",
    location: "Jaipur, Udaipur, Jodhpur",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop",
    highlights: [
      "Palace stays and royal dining",
      "Camel safari in Thar Desert",
      "Traditional Rajasthani folk performances"
    ],
    days: [
      { day: 1, title: "Jaipur: Amber Fort + City Palace" },
      { day: 2, title: "Jodhpur: Mehrangarh Fort exploration" },
      { day: 3, title: "Udaipur: Lake Pichola boat ride" }
    ]
  },
  {
    id: 3,
    title: "6 Days Himalayan Adventure",
    location: "Manali, Dharamshala, Shimla",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    highlights: [
      "Paragliding in Bir Billing",
      "Monastery visits and meditation",
      "Trek to Triund and camping"
    ],
    days: [
      { day: 1, title: "Manali: Arrival + Solang Valley" },
      { day: 2, title: "Dharamshala: McLeod Ganj temples" },
      { day: 3, title: "Shimla: Mall Road + Jakhu Temple" }
    ]
  },
  {
    id: 4,
    title: "4 Days Goa Beach & Nightlife",
    location: "North Goa, South Goa",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
    highlights: [
      "Beach hopping and water sports",
      "Portuguese heritage exploration",
      "Sunset cruises and beach parties"
    ],
    days: [
      { day: 1, title: "North Goa: Baga & Calangute beaches" },
      { day: 2, title: "Old Goa: Churches & Fort Aguada" },
      { day: 3, title: "South Goa: Palolem & Agonda beaches" },
      { day: 4, title: "Anjuna: Flea market & sunset cruise" }
    ]
  },
  {
    id: 5,
    title: "8 Days Ladakh Mountain Expedition",
    location: "Leh, Nubra Valley, Pangong",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1587693266968-8f8c9c2be593?w=800&h=600&fit=crop",
    highlights: [
      "High-altitude desert landscapes",
      "Monasteries and Buddhist culture",
      "Pangong Lake camping experience"
    ],
    days: [
      { day: 1, title: "Leh: Acclimatization + Local markets" },
      { day: 2, title: "Nubra Valley: Hunder sand dunes" },
      { day: 3, title: "Pangong Lake: Scenic drive & camping" },
      { day: 4, title: "Monasteries: Thiksey & Hemis visit" }
    ]
  },
  {
    id: 6,
    title: "5 Days Andaman Island Paradise",
    location: "Port Blair, Havelock, Neil Island",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    highlights: [
      "Scuba diving and snorkeling",
      "Pristine white sand beaches",
      "Cellular Jail light & sound show"
    ],
    days: [
      { day: 1, title: "Port Blair: Cellular Jail history" },
      { day: 2, title: "Havelock: Radhanagar Beach bliss" },
      { day: 3, title: "Neil Island: Natural rock formations" },
      { day: 4, title: "Water sports: Diving & kayaking" }
    ]
  }
];

export const CarouselContext = createContext({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({
  initialScroll = 0
}) => {
  const carouselRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
          ref={carouselRef}
          onScroll={checkScrollability}>
          <div
            className={cn("absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l")}></div>

          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              // remove max-w-4xl if you want the carousel to span the full width of its container
              "mx-auto max-w-7xl"
            )}>
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]">
                <Card card={item} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2">
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}>
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}>
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { onCardClose, currentIndex } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900">
              <button
                className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                onClick={handleClose}>
                <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium text-black dark:text-white">
                {card.title}
              </motion.p>
              <motion.p
                layoutId={layout ? `location-${card.title}` : undefined}
                className="mt-2 flex items-center gap-2 text-lg text-gray-600">
                <MapPin className="w-5 h-5" />
                {card.location}
              </motion.p>
              <div className="py-10">
                <h3 className="text-xl font-semibold mb-4">Trip Highlights</h3>
                <ul className="space-y-2 mb-6">
                  {card.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-black rounded-full mt-2"></span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Day-by-Day Highlights
                </h3>
                <div className="space-y-3">
                  {card.days.map((dayItem, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="bg-black text-white px-3 py-1 rounded text-sm font-medium whitespace-nowrap">
                        Day {dayItem.day}
                      </span>
                      <span className="text-gray-700 pt-1">{dayItem.title}</span>
                    </div>
                  ))}
                  {card.days.length > 3 && (
                    <p className="text-gray-500 text-center pt-2">+{card.days.length - 3} more days...</p>
                  )}
                </div>
                <button className="w-full mt-8 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                  View Full Itinerary
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="relative z-10 flex h-[500px] w-[340px] md:h-[600px] md:w-[420px] flex-col justify-end overflow-hidden rounded-3xl bg-white shadow-lg transition-shadow border border-gray-100">
        {/* Image Section */}
        <div className="absolute inset-x-0 top-0 h-[240px] md:h-[280px] p-3">
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
            <BlurImage
              src={card.image}
              alt={card.title}
              fill
              className="absolute inset-0 z-10 object-cover" />
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-40 bg-white p-6 md:p-8 mt-[240px] md:mt-[280px]">
          {/* Title and Rating */}
          <div className="mb-4">
            <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-2 leading-tight ">
              {card.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{card.location}</span>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-900">{card.rating}</span>
              </div>
            </div>
          </div>

          {/* Trip Highlights */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Trip Highlights</h4>
            <ul className="space-y-1.5">
              {card.highlights.slice(0, 3).map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span className="line-clamp-1">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Day by Day */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Day-by-Day Highlights
            </h4>
            <div className="space-y-2">
              {card.days.slice(0, 3).map((dayItem, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="bg-black text-white px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
                    Day {dayItem.day}
                  </span>
                  <span className="text-xs text-gray-600 line-clamp-1 pt-0.5">{dayItem.title}</span>
                </div>
              ))}
              {card.days.length > 3 && (
                <p className="text-xs text-gray-400 text-center pt-1">+{card.days.length - 3} more days...</p>
              )}
            </div>
          </div>

          {/* View Button */}
          <button className="w-full mt-4 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-sm">
            View Full Itinerary
          </button>
        </div>
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest} />
  );
};
