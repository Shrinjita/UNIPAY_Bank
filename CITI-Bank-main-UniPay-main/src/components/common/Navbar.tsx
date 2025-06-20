


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full py-4 border-b border-gray-200">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-gradient-purple flex items-center justify-center">
            <span className="text-white font-bold">U</span>
          </div>
          <span className="font-bold text-xl">UNI-PAY</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/#features" className="text-gray-600 hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="/#About Us" className="text-gray-600 hover:text-primary transition-colors">
            About Us
          </Link>
          <Link to="/#contact" className="text-gray-600 hover:text-primary transition-colors">
            Contact Us
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md z-50 md:hidden">
          <div className="container py-4 flex flex-col space-y-4">
            <Link to="/#features" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Features
            </Link>
            <Link to="/#About Us" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              About Us
            </Link>
            <Link to="/#contact" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Contact Us
            </Link>
            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
              <Button variant="ghost" asChild className="w-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
