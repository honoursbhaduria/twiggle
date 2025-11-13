import { Sidebar } from 'lucide-react'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { SidebarProvider } from "@/components/ui/sidebar"

import TravelCard from './card'
import SidebarDemo from './sidebar'

const Destination = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  return (
    <div className='min-h-screen '>
      {/* Sidebar - Fixed positioned */}
      <SidebarDemo />

      {/* Main Content - With left padding to account for fixed sidebar */}
      <div className=' min-h-screen'>
        <div className=' '>
          <TravelCard initialSearchQuery={searchQuery} />
        </div>
      </div>
    </div>
  )
}

export default Destination




