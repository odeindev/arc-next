// /src/widgets/hero/ui/image-carousel.tsx

'use client';

import { memo } from 'react';
import Image from 'next/image';
import { cn } from '@/components/shared/lib/utils';
import { CarouselState } from '../model/types';
import { getImagePath, getImageAlt } from '../model/constants';

interface ImageCarouselProps {
  parallaxStyles: React.CSSProperties;
  carouselState: CarouselState;
}

export const ImageCarousel = memo(function ImageCarousel({ 
  parallaxStyles, 
  carouselState 
}: ImageCarouselProps) {
  const currentImagePath = getImagePath(carouselState.currentImageIndex);
  const currentImageAlt = getImageAlt(carouselState.currentImageIndex);
  const isPriority = carouselState.currentImageIndex === 1;

  return (
    <>
      <div 
        className="absolute inset-0 w-full h-full"
        style={parallaxStyles}
        aria-hidden="true"
      >
        <div className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%]">
          <div className={cn(
            "relative w-full h-full transition-opacity duration-300",
            carouselState.isTransitioning ? "opacity-0" : "opacity-100"
          )}>
            <Image
              src={currentImagePath}
              alt={currentImageAlt}
              fill
              priority={isPriority}
              loading={isPriority ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, 120vw"
              className="object-cover object-center"
              style={{ filter: 'brightness(0.7)' }}
              quality={85}
              onError={(e) => {
                console.error(`Failed to load: ${currentImagePath}`);
                e.currentTarget.style.opacity = '0.1';
              }}
            />
          </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
});