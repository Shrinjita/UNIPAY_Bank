


import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-20">
        <div className="flex-1 space-y-6">
          <div className="inline-block">
            <span className="bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-sm font-medium">
              Digital Finance Hub
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Your Ultimate <span className="text-primary">Digital Payment</span> Platform
          </h1>
          <p className="text-lg text-gray-600 md:pr-10">
            UNI-PAY combines payments, chat, shopping, and analytics into one seamless digital experience. 
            Manage finances, connect with others, and shop all in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button size="lg" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/#learn-more">Learn More</Link>
            </Button>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            {/* <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="h-8 w-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center overflow-hidden"
                >
                  <span className="text-xs font-medium text-gray-700">{i}</span>
                </div>
              ))}
            </div> */}
            {/* <span className="text-sm text-gray-600">
              +5,000 users trust UNI-PAY for their digital payments
            </span> */}
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="relative">
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-200 rounded-full filter blur-xl opacity-60"></div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-300 rounded-full filter blur-xl opacity-70"></div>
            <div className="absolute right-10 top-20 w-24 h-24 bg-blue-400 rounded-full filter blur-lg opacity-60"></div>
            
            <div className="bg-white backdrop-blur-sm bg-opacity-70 rounded-2xl border border-gray-100 shadow-xl p-6 relative animate-float">
              <img 
                src="/landingPageImage.png" 
                alt="UNI-PAY Digital Platform Illustration" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
