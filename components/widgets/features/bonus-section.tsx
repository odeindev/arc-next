// @components/widgets/features/bonus-section.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/shared/ui/button';

const BONUS_ITEMS = [
  'Набор из 10 ключей для всех 4 типов сундуков',
  'Стартовый капитал игровой валюты',
  'Бесплатный месячный абонемент титула «Ghost»',
  'Скидка 25% на все покупки в течение месяца'
];

export const BonusSection: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16 relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern.png')] bg-repeat opacity-5"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <motion.div 
            className="w-full lg:w-2/5 flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-yellow-400/20 blur-lg animate-pulse"></div>
              <Image 
                src="/images/promo.png" 
                alt="Бонусы для игроков" 
                width={450} 
                height={450}
                className="relative drop-shadow-[0_5px_15px_rgba(255,255,0,0.15)]"
                priority
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-3/5 space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                Эксклюзивные бонусы <br className="hidden md:block" />
                <span className="text-yellow-400">ждут тебя!</span>
              </h2>
              <div className="h-1 w-24 bg-yellow-400 rounded-full mx-auto lg:mx-0 mb-6"></div>
              <p className="text-lg xl:text-xl text-slate-200 mb-6 max-w-2xl">
                Зарегистрируйся сейчас и получи мощный старт в игре
              </p>
            </div>

            <div className="bg-slate-700/80 backdrop-blur-sm p-6 rounded-xl border border-slate-600/40 shadow-lg">
              <h3 className="text-2xl font-semibold text-yellow-300 mb-4">
                Твои награды:
              </h3>
              <ul className="space-y-4 text-left">
                {BONUS_ITEMS.map((benefit, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-green-400 text-2xl flex-shrink-0 leading-none" aria-hidden="true">♦</span>
                    <span className="text-white text-lg">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Button 
                  color="yellow" 
                  text="Получить бонусы" 
                  className="w-full sm:w-auto px-8 py-3 text-lg transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,0,0.4)] active:bg-black"
                  aria-label="Получить игровые бонусы"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
