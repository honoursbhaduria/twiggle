import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './components/landingPage.jsx'
import Auth from './components/auth/auth.jsx'
import Destination from './components/destination/destination.jsx'
import Detail from './components/detail/detail.jsx'
import Dashboard from './components/dashboard/dashboard.jsx'

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/auth", element: <Auth /> },
  { path: "/destination/", element: <Destination /> },
  { path: "/destination/:slug", element: <Detail /> },
  {path: "/dashboard",element : <Dashboard/>}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
