import React from 'react';
import { motion } from 'motion/react';
import SearchBar from './search';
import AnimatedSection from './motion/animation';
import Comet from './cometCard';
// 

const HeroSection = () => {
  return (
    <section className="bg-[url('/bg4.jpg')]   bg-cover bg-center bg-no-repeat relative h-[90vh] mx-0 md:mx-4 lg:mx-8 rounded-none md:rounded-2xl flex items-center mt-20">
      <img className='absolute bottom-20 left-150 w-70 rotate-20'  src="arrow.png" alt="arrow" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-10 md:py-0">
     
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">
          
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-poppins font-semibold text-white/90 leading-tight text-shadow-lg ">
                Explore 
                <div className="mt-2"> 
                   <span className=''>Incredible</span> India
                </div>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-relaxed text-gray-100 tracking-widest max-w-xl mx-auto lg:mx-0">
                Premium itineraries designed by our travel experts. Each journey is carefully curated for the perfect blend of adventure, culture, and luxury.
              </p>
            </div>

            <div className="w-full max-w-xl mx-auto lg:mx-0">
              <SearchBar className=""/>
            </div>
          </div>

          {/* Right Content - Globe Image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2 ">
           <Comet/>
          </div>

        </div>
     
      </div>
    </section>
  );
};

export default HeroSection;