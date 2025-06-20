
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Cta = () => {
  return (
    <section className="py-20 bg-gradient-purple">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Digital Payment Experience?
          </h2>
          <p className="text-purple-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of users who trust UNI-PAY for their digital payment needs. 
            Create your account today and experience the future of financial technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
