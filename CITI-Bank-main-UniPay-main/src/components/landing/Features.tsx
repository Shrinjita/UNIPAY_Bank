



import React from 'react';
import FeatureCard from './FeatureCard';
import { MessageSquare, CreditCard, ShoppingBag, PieChart , ShieldCheck } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <CreditCard size={24} />,
      title: 'Digital Payments',
      description: 'Send and receive money instantly without any fees. Support for multiple currencies and payment methods.',
      className: 'animate-pulse-glow'
    },
    {
      icon: <MessageSquare size={24} />,
      title: 'Secure Chat',
      description: 'End-to-end encrypted messaging for secure communication about financial matters with other users.',
      className: 'animate-pulse-glow'
    },
    {
      icon: <ShoppingBag size={24} />,
      title: 'Integrated Shop',
      description: 'Browse and purchase products directly within the app with seamless payment integration.',
      className: 'animate-pulse-glow'
    },
    {
      // icon: <PieChart size={24} />,
      // title: 'Smart Analytics',
      // description: 'Track and analyze your spending habits with detailed charts and personalized insights.',
      // className: 'animate-pulse-glow'
      icon: <ShieldCheck size={24} />,
      title: 'Secure Payment',
      description: 'Experience safe and encrypted transactions with our trusted payment gateway.',
      className: 'animate-pulse-glow'
    },
  ];

  return (
    <section id="features" className="container py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-4">Powerful Features for Modern Finance</h2>
        <p className="text-gray-600">
          UNI-PAY brings together essential financial tools in one seamless platform,
          making it easier than ever to manage your digital finances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            className={feature.className}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
