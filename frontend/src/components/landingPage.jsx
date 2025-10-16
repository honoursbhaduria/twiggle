import { Button } from "@/components/ui/button"
import { useEffect, useState, lazy, Suspense } from "react"
import Header from "./header"
import { ArrowRight, Calendar, MapPin, Star, Users } from "lucide-react"
import { FocusCards } from "@/components/ui/focus-cards";

import { CometCard } from "@/components/ui/comet-card";
import Hero from "./hero";
import AnimatedSection from "./motion/animation";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import Modal from "./modal";
import Comet from "./cometCard";

// Lazy load heavy components
const TravelGurus = lazy(() => import("./travelGuru"));
const Footer = lazy(() => import("./footer"));

 
const data = [
  {
    category: "Popular Destinations",
    title: "Most loved travel routes by Indian travelers",
    src: "https://images.unsplash.com/photo-1585506942812-e72b29cef752?q=60&w=600&auto=format&fit=crop",
  },
  {
    category: "Luxury Travel",
    title: "Premium experiences and luxury stays",
    src: "https://images.unsplash.com/photo-1623815616454-f4de13de2634?q=60&w=600&auto=format&fit=crop",
  },
  {
    category: "Adventure Seekers",
    title: "Thrilling experiences and adrenaline rush",
    src: "https://images.unsplash.com/photo-1634742193353-49a7d1667e1c?q=60&w=600&auto=format&fit=crop",
  },
  {
    category: "Budget Travel",
    title: "Affordable trips without compromising experience",
    src: "https://images.unsplash.com/photo-1620766165457-a8025baa82e0?q=60&w=600&auto=format&fit=crop",
  },
  {
    category: "Solo Traveler",
    title: "Safe and exciting trips for solo explorers",
    src: "https://images.unsplash.com/photo-1658974997408-40627c89cb55?q=60&w=600&auto=format&fit=crop",
  },
  {
    category: "Offbeat Adventures",
    title: "Hidden gems and unexplored destinations",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=60&w=600&auto=format&fit=crop",
  },
  {
    category: "Photography Tours",
    title: "Instagram-worthy spots and scenic routes",
    src: "https://images.unsplash.com/photo-1625745184494-0edbf8269938?q=60&w=600&auto=format&fit=crop",
  },
  {
    category: "Relaxing Getaways",
    title: "Perfect escapes for peace and wellness",
    src: "https://images.unsplash.com/premium_photo-1684379150377-ef2e3e5dc7ce?q=60&w=600&auto=format&fit=crop",
  },
];

// cosnt {isauthen}=useAuth()

 const cards = [
  {
    title: "Goa Beaches",
    location: "Goa",
    likes: 1243,
    days: 5,
    src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=60&w=800&auto=format&fit=crop",
  },
  {
    title: "Valley of Flowers",
    location: "Uttarakhand",
    likes: 987,
    days: 6,
    src: "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=60&w=800&auto=format&fit=crop",
  },
  {
    title: "Baga Beach",
    location: "Goa",
    likes: 1567,
    days: 4,
    src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=60&w=800&auto=format&fit=crop",
  },
  {
    title: "Camping in Manali",
    location: "Himachal Pradesh",
    likes: 742,
    days: 3,
    src: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=60&w=800&auto=format&fit=crop",
  },
  {
    title: "Leh–Ladakh",
    location: "Ladakh",
    likes: 1832,
    days: 7,
    src: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=60&w=800&auto=format&fit=crop",
  },
  {
    title: "Jaipur Palace",
    location: "Rajasthan",
    likes: 2104,
    days: 4,
    src: "https://assets.aceternity.com/the-first-rule.png",
  },
];



  const datas = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));




function LandingPage() {

  return (
    <div className="bg-cover relative bg-center min-h-screen overflow-hidden">
      <Modal/>
    
    <div className="min-h-screen bg-cover bg-center overflow-hidden rounded-none md:rounded-b-2xl">
      <Header />
      <Hero/>
    </div>   


      
      <div className="w-full py-10 md:py-16 px-4 md:px-8">
        <div className="text-2xl md:text-4xl lg:text-6xl font-bold font-sans text-center mb-4 md:mb-8">
          Travel Categories
        </div>
        <h1 className="text-sm md:text-lg lg:text-xl text-center text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto">
          Find the perfect itinerary type that matches your travel style and interests
        </h1>

        <div className="w-full">
          <Carousel items={datas} />
        </div>
      </div> 
     

      {/* 3rd comp */}

        <div className="w-full py-10 md:py-16 px-4 md:px-8">
          <div className="text-2xl md:text-4xl lg:text-6xl font-bold font-sans text-center mb-4 md:mb-8">
            Trending Now
          </div>
          <h1 className="text-sm md:text-lg lg:text-xl text-center text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto">
            Discover what's capturing hearts across India. From serene beaches to majestic mountains.
          </h1>

          <div className="mt-6 md:mt-10">
            <FocusCards cards={cards} />
          </div>
        </div>


       {/* 3rd componet */}
      

        <div className="py-10 md:py-16 lg:min-h-screen grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 px-4 md:px-8">

           {/* left column */}
          <div className="flex items-center justify-center col-span-3 order-2 lg:order-1 p-10">
            <video autoPlay loop muted playsInline className="w-full max-w-md md:max-w-lg lg:max-w-full rounded-2xl shadow-xl">
              <source src="/video.mp4" type="video/mp4"/>
            </video>
          </div>
          {/* right column */}
          <div className="flex items-center justify-center order-1 lg:order-2 col-span-2">
            <div className="max-w-md text-center lg:text-left">
               <h1 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl  font-poppins font-semibold text-gray-900 leading-tight tracking-tight mb-4 md:mb-6">
                    How it Works?
                </h1>
                 <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed">
               Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae perferendis fugiat esse, blanditiis voluptate ipsam.
              </p>
            </div>
          </div>

         
        </div>



  
    
        <div className="py-10 md:py-16 lg:min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 md:px-8">
          {/* Left column */}
          <div className="flex items-center justify-center order-1 lg:order-1">
            <div className="max-w-md text-center lg:text-left">
               <h1 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl  text-gray-900 font-poppins font-semibold  tracking-tight mb-4 md:mb-6">
                  Handcrafted journeys
                </h1>
              <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed">
                Premium itineraries designed by our travel experts. Each journey is
                carefully curated for the perfect blend of adventure, culture, and
                luxury.
              </p>
            </div>
          </div>

          {/* Right column */}

          <div className="flex items-center justify-center order-2 lg:order-2">
            <Comet/>
          </div>
        </div>
    
    

      {/* 5th component */}
   
    

      {/* 6th component */}
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>}>

          <TravelGurus/>

      </Suspense>
      
      <Suspense fallback={<div className="h-32"></div>}>
        <Footer/>
      </Suspense>

    </div>

  )
}

export default LandingPage

