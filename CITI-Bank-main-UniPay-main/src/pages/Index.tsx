
import React from 'react';
import Navbar from '@/components/common/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Cta from '@/components/landing/Cta';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Features />
      <Cta />
      
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-md bg-gradient-purple flex items-center justify-center">
                <span className="text-white font-bold">U</span>
              </div>
              <span className="font-bold text-xl">UNI-PAY</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
          
          <div className="mt-6 text-center md:text-left text-sm text-gray-500">
            © {new Date().getFullYear()} UNI-PAY. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
