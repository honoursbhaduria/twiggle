import React from 'react';
import { ArrowRight } from 'lucide-react';
import SearchBar from './search';

const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-5rem)] mx-4 md:mx-8 rounded-2xl bg-blue-100 flex items-center">
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="space-y-4 md:space-y-6">
              <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                Explore Incredible{' '}
                <span className="text-[#3E92D1] relative inline-block">
                  India
                  <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3" viewBox="0 0 200 12" fill="none">
                    <path d="M0 8C50 2 100 2 150 8C170 10 190 10 200 8" stroke="#3E92D1" strokeWidth="3" fill="none"/>
                  </svg>
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
                Plan and book your perfect trip with expert advice, travel tips, destination information and inspiration from us.
              </p>
            </div>

           <SearchBar className=""/>
          </div>

          {/* Right Content - Decorative Space */}
          <div className="relative order-first lg:order-last mb-8 lg:mb-0">
            <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center">
              {/* Central globe representation */}
             <img 
               className='hover:scale-105 transition-transform duration-500 max-w-full h-auto object-contain' 
               src='globe.png'
               alt='Globe representing travel destinations'
             />
            </div>
          </div>

        </div>
       
      </div>
    </section>
  );
};

export default HeroSection;