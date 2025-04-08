import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { socialLinks } from '@/public/data/links'; // Обновленный импорт

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn('font-[Mulish] bg-gradient-to-b from-gray-900 to-slate-800 text-white py-10 shadow-lg', className)}>
      <div className='w-full max-w-screen-xl mx-auto px-4 md:px-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between'>
          <div className='flex items-center space-x-3 mb-6 sm:mb-0'>
            <Link href='/' className='flex items-center gap-0.5 group'>
              <Image 
                src='/icons/logo.svg' 
                width={48} 
                height={48} 
                alt='Logo' 
                className='transition-transform duration-300 group-hover:rotate-16' 
              />
              <span className='font-[Chakra_Petch] text-white font-semibold text-xl transition-colors duration-300'>
                Arcadia Craft
              </span>
            </Link>
          </div>
          <ul className='flex flex-wrap justify-center sm:justify-end space-x-6 text-sm'>
            {socialLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.href} 
                  className='text-white font-semibold relative after:absolute after:right-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-teal-500 after:transition-[width,left] after:duration-500 after:ease-in-out hover:after:w-full hover:after:left-0'
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <hr className='my-8 border-gray-700' />
        <div className='text-center text-gray-400 text-sm'>
          <p>© {new Date().getFullYear()} <Link href='/' className='text-white hover:text-teal-500 transition-colors duration-300'>Arcadia Craft™</Link>. Все права защищены.</p>
          <p className='mt-2'>Ваша история начинается здесь. Присоединяйтесь!</p>
        </div>
      </div>
    </footer>
  );
};