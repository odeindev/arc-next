// @components/widgets/features/feature-card.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { FeatureItemProps } from '@/public/data/content/features';

type FeatureCardProps = FeatureItemProps & {
  index: number;
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  imgURL,
  title,
  description,
  index
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
    >
      <div className="group flex items-start p-6 bg-gradient-to-b from-slate-600/70 to-transparent hover:bg-slate-500/40 transition-all duration-300 ease-out rounded-lg hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)] h-full hover:scale-105">
        <div className="flex-shrink-0 mr-5">
          <Image 
            src={imgURL} 
            alt={title} 
            className="w-12 h-12 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,220,0,0.6)]" 
            width={48} 
            height={48}
            loading="lazy"
          />
        </div>
        <div className="flex-1 transition-all duration-300 group-hover:translate-y-[-2px]">
          <h3 className="text-yellow-400 font-bold text-xl mb-3 group-hover:text-yellow-300">
            {title}
          </h3>
          <p className="text-white font-base text-base leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
