import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './components/auth/auth.jsx'
import Destination from './components/destination/destination.jsx'
import Detail from './components/detail/detail.jsx'
import TravelDashboard from './components/dashboard/dashboard.jsx'
import TravelItineraryForm from './components/detail/edit.jsx'
import ItineraryComponent from './components/detail/Itinerary.jsx'
import ItearnaryCard from './components/destination/iteanaryCard.jsx'
import ItineraryForm from './components/destination/createItinary.jsx'
import EditItineraryForm from './components/detail/edit.jsx'
import TravelGuruProfile from './components/travel-guru/travelGuruProfile.jsx'
import TravelGuruPage from './components/travel-guru/travelGuru.jsx'
import LandingPage from './components/landingpage/landingPage.jsx'

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/auth", element: <Auth /> },
  { path: "/destination/", element: <Destination /> },
  { path: "/destination/:slug", element: <ItearnaryCard /> },
  {path: "/dashboard",element : <TravelDashboard/>},
  {path: "/destination/:slug/edit", element : <TravelItineraryForm/>},
  {path: "/destination/iteanary/:slug", element : <Detail/>},
   {path: "/iteanary/create", element : <ItineraryForm/>},
    {path: "/destination/iteanary/edit/:slug", element : <EditItineraryForm/>},
    {path: "/travelguru/:slug", element: <TravelGuruProfile/>},
    {path: "/travelguru", element: <TravelGuruPage/>}

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
