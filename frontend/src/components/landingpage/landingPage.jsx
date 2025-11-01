import { useEffect, useState, lazy, Suspense } from "react"
import Header from "./header"
import { ArrowRight, Calendar, MapPin, Star, Users } from "lucide-react"
import { FocusCards } from "@/components/ui/focus-cards";

import Hero from "./hero";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import Modal from "./modal";
import {category} from "../../data/category"

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
    
    <div className="min-h-screen  bg-cover bg-center overflow-hidden rounded-none md:rounded-b-2xl">
      <Header />
      <Hero/>
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

   

    <div className="w-full py-10 md:py-16 px-4 md:px-8">
        <div className="text-2xl md:text-4xl lg:text-6xl font-bold font-sans text-center mb-4 md:mb-8">
          Travel Categories
        </div>
        <h1 className="text-sm md:text-lg lg:text-xl text-center text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto">
          Find the perfect itinerary type that matches your travel style and interests
        </h1>

      <div className="mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto px-4">
  {category.map((item, index) => (
    <div
      key={index}
      className="rounded-2xl w-full max-w-sm mx-auto shadow hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative w-full h-[340px] md:h-[380px] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-end">
        {/* Background image (replace with a real image if available) */}
        <img
          src={item.src}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover z-0 hover:scale-105 transition-transform duration-300"
        />
       
        {/* Bottom blur overlay for text */}
        <div className="absolute bottom-0 left-0 w-full h-[46%] z-10" style={{backdropFilter: 'blur(1px)'}}>
          <div className="absolute inset-0 bg-black/40 rounded-b-2xl" />
        </div>
        {/* Title, subtitle, routes, button - all inside blur */}
       <div
  className="w-full z-20 flex flex-col items-center justify-center px-4"
  style={{ height: '46%', paddingBottom: '1.25rem' }}
>
  <div className="relative bg-center rounded-2xl flex flex-col items-center justify-center text-white">
    <h2 className="text-white text-[1.3rem] md:text-[1.6rem] font-normal drop-shadow-lg text-center leading-tight">
      {item.name}
    </h2>

    <p className="text-gray-100 font-light text-center mt-1">{item.description}</p>

    <button
      className="bg-gray-100/80 text-black font-normal rounded-full px-6 py-2 shadow-lg mb-2 text-[1.05rem] md:text-[1.1rem] hover:bg-gray-200 transition-all mt-4"
      style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
    >
      View Experiences
    </button>
  </div>
</div>

      </div>
    </div>
  ))}
</div>
         
      
      </div> 


      
      <div className="w-full py-10 md:py-16 px-4 md:px-8">

       <div className="grid grid-cols-1 md:grid-cols-3 gap-25">
          <div className="flex items-center justify-center md:items-center mx-auto ml-10">
            <div className="max-w-md text-center lg:text-left">
               <h1 className="text-2xl md:text-4xl lg:text-6xl xl:text-6xl  text-gray-900 font-poppins font-semibold  tracking-tight mb-4 md:mb-6">
                  Handcrafted journeys
                </h1>
              <p className="text-sm md:text-base lg:text-lg xl:text-lg text-gray-600 leading-relaxed">
                Premium itineraries designed by our travel experts. Each journey is
                carefully curated for the perfect blend of adventure, culture, and
                luxury.
              </p>
            </div>
          </div>


  <div className="col-span-2">
            <Carousel className=""/>
        </div>
       </div>
         
      
      </div> 
      
{/* kkdsfj */}
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

