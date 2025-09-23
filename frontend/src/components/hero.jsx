import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import SearchBar from './search';

function Hero() {
  

  return (
    <div className="  mt-10  overflow-hidden">
     

      {/* Main Content */}
      <main className="relative px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="relative">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-50 to-transparent opacity-30 transform translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-50 to-transparent opacity-40 transform -translate-x-1/2"></div>
            </div>

            {/* Sea Turtle Section */}
            <div className="relative flex flex-col lg:flex-row  ">
              <div className="  ">
                <div className="relative inline-block">
                  <div className="w-80 h-40 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full relative overflow-hidden shadow-2xl ">
                    <img 
                      src="https://plus.unsplash.com/premium_photo-1661962542692-4fe7a4ad6b54?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-400"
                    />
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 lg:pl-12">
                <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-none tracking-tight ">
                  explore the
                </h1>
              </div>
              <SearchBar/>
            </div>

            {/* For The Ocean Section */}
            <div className="relative flex flex-col lg:flex-row items-center  mb-10 gap-10">
              <div className="">
                <h2 className="text-6xl lg:text-8xl text-gray-900 leading-none tracking-tight mb-8 font-semibold">
                  Incerdible
                </h2>
              </div>
              
              <div className="lg:w-1/2 order-1 lg:order-2  lg:mb-0">
                <div className="relative">
                  <div className="w-210 h-45 bg-gradient-to-r from-blue-600 to-cyan-500  rounded-tl-full rounded-bl-full rounded-br-full relative overflow-hidden shadow-2xl ">
                    <img 
                      src="https://images.unsplash.com/photo-1751566609738-e1ed580bcb33?q=80&w=1352&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ocean Section with Coral Reef */}
            <div className="relative flex flex-col lg:flex-row items-center  gap-70 ">
              <div className="lg:w-1/2 mb-8 lg:mb-0 relative">
                <div className="w-220 h-45 bg-gradient-to-r from-teal-500 to-blue-600  rounded-tr-full rounded-bl-full rounded-br-full relative overflow-hidden shadow-2xl ">
                  <img 
                    src="https://images.unsplash.com/photo-1595433306946-233f47e4af3a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Coral reef with tropical fish"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-400"
                  />
                </div>
                
                {/* Watch Our Story Circle */}
                {/* <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black rounded-full flex items-center justify-center text-white text-sm font-semibold transform hover:scale-110 transition-transform duration-300 cursor-pointer shadow-xl">
                  <div className="text-center">
                    <div className="text-xs leading-tight">WATCH OUR</div>
                    <div className="text-xs leading-tight">STORY</div>
                  </div>
                </div> */}
              </div>
              
              <div className="lg:w-1/2 lg:pl-12">
                <h2 className="text-6xl lg:text-8xl font-black text-gray-900 leading-none tracking-tight">
                  India
                </h2>
              </div>
            </div>

            {/* Additional Decorative Elements */}
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-cyan-300 rounded-full opacity-40"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-500 rounded-full opacity-80"></div>
          </div>
        </div>
      </main>

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-blue-200 rounded-full"></div>
          <div className="absolute top-1/3 right-20 w-48 h-48 border border-cyan-200 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 border border-blue-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default Hero;