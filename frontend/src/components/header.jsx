import React, { useEffect, useState } from 'react'
import { Menu, X ,Search} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
         const [scrolled,setScrolled]=useState(false)
         const [selected,setSelected]=useState('')
         
          const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() !== "") {
      // Navigate to destination page with search parameter
      navigate(`/destination?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  

  useEffect(()=>{
    const handleScroll=()=>{
      setScrolled(window.scrollY>10)
    }
    window.addEventListener("scroll",handleScroll);
    return()=>window.removeEventListener("scroll",handleScroll);
  })
  return (
    <div
     className={`fixed w-full top-0 z-50 ${
    scrolled
      ? "transition-all duration-300 backdrop-blur-md rounded-b-2xl "
      : "transition-all duration-300 bg-transparent"
  }`}
    >
        <header className="relative z-50 px-6 py-5 lg:px-12 ">
                <nav className="flex items-center justify-between">
                  {/* Logo */}
                  <div className="text-2xl font-bold text-gray-900 tracking-tight">
                    TRIVISTA
                  </div>
        
                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center space-x-12">
                    <a href="/destination" onClick={()=>setSelected('destination')}  className={` hover:text-gray-900 transition-colors duration-200 font-medium ${selected=='destination'?'text-gray-950':'text-gray-700'}`}>
                      DESTINATION
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                      MY TRIPS
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                      PREMIUM
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                      CONTACT
                    </a>
                    <div>
                       <div className="flex items-center">
      {/* Collapsible search box */}
      <div
        className={`flex items-center   bg-transparent overflow-hidden transition-all duration-300 ${
          open ? "w-64 px-2 shadow-md rounded-full " : "w-10"
        }`}
      >
        {/* Search input (hidden when closed) */}
        {open && (
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-2 py-1 text-sm outline-none"
            autoFocus
          />
        )}

        {/* Search icon button */}
        <button
          onClick={() => {
            if (open && query.trim()) {
              handleSearch()
            }
            setOpen(!open);
          }}
          className="p-2 text-gray-600 font-bold hover:text-gray-900"
        >
          <Search size={18} />
        </button>
      </div>
    </div>
                    </div>
                  </div>
        
                  {/* Donate Button & Mobile Menu */}
                  <div className="flex items-center space-x-4">
                    <Link to={"/auth"}>
                    <button className="bg-black text-white px-8 py-3 font-semibold hover:bg-gray-800 transition-colors duration-200 rounded-full">
                      LOGIN
                    </button>
                    </Link>
                    
                    {/* Mobile Menu Button */}
                    <button 
                      className="md:hidden"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                  </div>
                </nav>
        
                {/* Mobile Navigation */}
                {isMenuOpen && (
                  <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
                    <div className="flex flex-col space-y-4 px-6 py-6">
                      <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                         DESTINATION
                      </a>
                      <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                        
                      </a>
                      <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                        RESOURCE
                      </a>
                      <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                        CONTACT
                      </a>
                    </div>
                  </div>
                )}
              </header>
    </div>
  )
}

export default Header