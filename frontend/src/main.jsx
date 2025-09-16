import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './components/landingPage.jsx'
import Auth from './components/auth/auth.jsx'
import Destination from './components/destination/destination.jsx'
import Detail from './components/destination/detail.jsx'

const router = createBrowserRouter([
  {path : "/",element:<LandingPage/>},
  {path : "/auth",element:<Auth/>},
  {path : "/destination",element:<Destination/>},
    {path : "/destination/detail",element:<Detail/>}

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <RouterProvider router={router}/>
  </StrictMode>,
)
