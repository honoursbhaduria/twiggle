import React from "react";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import SidebarDemo from "../destination/sidebar";
import { Button } from "../ui/button";

export default function Dashboard() {
  return (
    <div className="w-full">
      <SidebarDemo />
      
      {/* Custom Bento Grid Layout */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* Card 1 - Spans 2 columns */}
          <div className=" relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 hover:shadow-xl transition-all duration-300 md:col-span-2">
            <div className="mb-4 flex justify-between">
              <h1 className="text-4xl font-poppins font-normal">Hi Tejash</h1>
              <Button className={""}>Explore desitination</Button>
            </div>
          
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
          </div>

          {/* Card 2 - Spans 1 column */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 hover:shadow-xl transition-all duration-300 md:col-span-1">
            <div className="mb-4">
              <Skeleton />
            </div>
           
          
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
          </div>

          {/* Card 3 - Spans 1 column */}
          <div className="hq
           relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 hover:shadow-xl transition-all duration-300 md:col-span-1">
            <div className="mb-4">
           <h1 className="text-2xl font-semibold font-poppins tracking-wide">  My Wishlist</h1>
           
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              
            </p>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
          </div>

          {/* Card 4 - Spans 2 columns */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 hover:shadow-xl transition-all duration-300 md:col-span-2">
           <div className="mb-4 flex justify-between">
             <h1 className="text-2xl font-semibold font-poppins tracking-wide ">  My Trips</h1>
                <Button className={""}>Crete Trip</Button>
           </div>

           
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
          </div>

        </div>
      </div>
    </div>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[200px] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700"></div>
);
