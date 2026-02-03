import React, { ReactNode } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

// Исправляем импорт типа и расширяем его
interface ExtendedVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  fetchPriority?: 'high' | 'low' | 'auto';
}

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  iconSrc?: string;
  iconAlt?: string;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  subtitle,
  iconSrc,
  iconAlt = 'иконка',
  className,
  contentClassName,
  children,
}) => {
  // Проверяем, является ли иконка видеофайлом
  const isVideo = iconSrc?.endsWith('.webm') || iconSrc?.endsWith('.mp4');

  return (
    <section className={clsx(
      'bg-lightflow bg-slate-800 py-12 md:py-16 shadow-xl relative overflow-hidden',
      className
    )}>
      <div className='flex flex-col items-center mb-8 md:mb-10 space-y-4'>
        {iconSrc && (
          <div className="mb-2 relative">
            {isVideo ? (
              /* Рендерим видео, если это webm */
              <video
                src={iconSrc}
                autoPlay
                loop
                muted
                playsInline
                // Используем расширенный тип для поддержки fetchPriority
                {...({ fetchPriority: 'high' } as ExtendedVideoProps)}
                width={80}
                height={80}
                className="mx-auto transition-all duration-500 hover:scale-105"
              />
            ) : (
              /* Рендерим обычную картинку/гифку */
              <Image
                src={iconSrc}
                alt={iconAlt}
                className="mx-auto transition-all duration-500 hover:scale-105 animate-pulse"
                width={80}
                height={80}
                priority={true}
              />
            )}
          </div>
        )}
        <div className="text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-lg md:text-xl text-slate-200">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className={clsx(
        "container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-6xl",
        contentClassName
      )}>
        {children}
      </div>
    </section>
  );
};