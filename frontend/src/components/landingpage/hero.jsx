import React from 'react';
import { motion } from 'motion/react';
import SearchBar from './search';
import AnimatedSection from '../motion/animation';
import Comet from './cometCard';

const HeroSection = () => {
  return (
    <section 
      className="bg-cover bg-center bg-no-repeat h-[105vh]  mx-0 lg:mx-8 rounded-b-2xl lg:rounded-2xl flex items-center min-h-screen lg:mt-20 p-4 "
      style={{ backgroundImage: "url('/bg4.jpg')" }}
    >
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-10 md:py-0">
     
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-0 lg:gap-12">
          
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 items-center text-center lg:text-left  mt-10 lg:mt-0">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-poppins font-bold text-[#FFFDF7] leading-tight text-shadow-lg ">
                Explore 
                <div className="mt-2"> 
                   <span className=''>Incredible</span> India
                </div>
              </h1>
              <p className="font-inter text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-relaxed text-[#FFFDF7] tracking-widest max-w-xl mx-auto lg:mx-0">
                Premium itineraries designed by our travel experts. Each journey is carefully curated for the perfect blend of adventure, culture, and luxury.
              </p>
            </div>

            <div className="w-full max-w-xl mx-auto lg:mx-0">
              <SearchBar className=""/>
            </div>
          </div>

        
          <div className="lg:flex hidden z-10 justify-center lg:justify-end  ">
           <Comet/>
          </div>

        </div>
     
      </div>
    </section>
  );
};

export default HeroSection;




