import { Sidebar } from 'lucide-react'
import React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import Header from '../header'
import TravelCard from './card'
import SidebarDemo from './sidebar'

const Destination = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Sidebar - Fixed positioned */}
      <SidebarDemo />
      
      {/* Main Content - With left padding to account for fixed sidebar */}
      <div className=' min-h-screen'>
        <div className='p-6 bg-white'>
          <TravelCard />
        </div>
      </div>
    </div>
  )
}

export default Destination