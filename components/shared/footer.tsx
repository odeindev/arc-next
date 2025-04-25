import React from 'react';
import { cn } from '@/components/shared/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { socialLinks } from '@/public/data/links';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn('font-[Mulish] bg-gradient-to-b from-gray-900 to-slate-800 text-white py-12 md:py-16 shadow-lg', className)}>
      <div className='w-full max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12'>
        <div className='flex flex-col sm:flex-row items-center justify-between mb-10'>
          <div className='flex items-center space-x-3 mb-8 sm:mb-0'>
            <Link href='/' className='flex items-center gap-2 group'>
              <div className='relative overflow-hidden'>
                <Image 
                  src='/icons/logo.svg' 
                  width={48} 
                  height={48} 
                  alt='Logo' 
                  className='transition-all duration-500 group-hover:rotate-12 group-hover:scale-110'
                />
              </div>
              <span className='font-[Chakra_Petch] text-white font-semibold text-xl md:text-2xl transition-all duration-300 group-hover:text-teal-400'>
                Arcadia Craft
              </span>
            </Link>
          </div>
          <ul className='flex flex-wrap justify-center sm:justify-end gap-6 md:gap-8'>
            {socialLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.href} 
                  className='text-gray-200 font-medium text-sm md:text-base relative group flex items-center gap-2 transition-all duration-300 hover:text-teal-400'
                >
                  {/* Предполагаем, что у нас есть иконки для социальных сетей */}
                  {link.icon && (
                    <span className='text-teal-500 group-hover:scale-110 transition-transform duration-300'>
                      {link.icon}
                    </span>
                  )}
                  <span className='relative after:absolute after:right-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-teal-500 after:transition-[width,left] after:duration-500 group-hover:after:w-full group-hover:after:left-0'>
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Стилизованный разделитель */}
        <div className='relative h-px w-full my-10'>
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent'></div>
        </div>
        
        <div className='flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4'>
          <p className='text-gray-300 text-sm'>
            © {new Date().getFullYear()} 
            <Link href='/' className='inline-block ml-1 text-white font-medium hover:text-teal-400 transition-colors duration-300'>
              Arcadia Craft™.
            </Link> 
            <span className='text-gray-400'> Все права защищены.</span>
          </p>
          <p className='text-gray-300 text-sm font-medium tracking-wide'>
            Ваша история начинается здесь. 
            <span className='ml-1 relative inline-block group'>
              <span className='transition-colors duration-300 group-hover:text-white'>Присоединяйтесь!</span>
              <span className='absolute bottom-0 left-0 w-0 h-px bg-teal-400 transition-all duration-500 group-hover:w-full'></span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};