// components/shared/ContentSection.tsx
import React, { ReactNode } from 'react';
import Image from 'next/image';

interface ContentSectionProps {
  title: string;
  iconSrc?: string;
  iconAlt?: string;
  className?: string;
  children: ReactNode;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  iconSrc,
  iconAlt,
  className,
  children
}) => {
  return (
    <div className={`bg-slate-700 pb-16 ${className}`}>
      <div className='flex flex-col items-center pt-8 pb-6 space-y-4'>
        {iconSrc && (
          <Image
            src={iconSrc}
            alt={iconAlt ?? 'иконка'}
            className='mx-auto animate-pulse'
            width={80}
            height={80}
            priority={true}
          />
        )}
        <h1 className="text-3xl font-bold text-white text-center">{title}</h1>
      </div>
      <div className="container mx-auto sm:px-6 md:px-32 px-4">
        {children}
      </div>
    </div>
  );
};