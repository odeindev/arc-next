// @components/widgets/features/features-section.tsx

'use client';

import React, { memo } from 'react';
import { cn } from '@/components/shared/lib/utils';
import { ServerFeaturesData } from '@/public/data/content/features';
import { FeatureCard } from './feature-card';
import { BonusSection } from './bonus-section';

interface FeaturesSectionProps {
  className?: string;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = memo(({ className }) => {
  return (
    <section id="features" className={cn('w-full', className)} aria-labelledby="features-heading">
      <div className="bg-gradient-to-b from-slate-800 to-slate-700">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-16">
            <h2 
              id="features-heading"
              className="text-white font-bold text-3xl md:text-4xl relative inline-block"
            >
              Что делает наш сервер особенным?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-amber-400 rounded-full mt-2"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {ServerFeaturesData.map((feature, index) => (
              <FeatureCard 
                key={`feature-${index}`}
                {...feature} 
                index={index} 
              />
            ))}
          </div>
        </div>
        {/* Декоративная линия */}
        <div className="m-auto h-0.5 w-4/5 bg-gradient-to-r from-cyan-200 via-blue-400 to-cyan-600 rounded-full"></div>
        <BonusSection />
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';