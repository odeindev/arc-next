// @app/components/shared/ui/scroll-top-button.tsx
'use client'

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollTopButtonProps {
  show: boolean;
  onClick: () => void;
}

export const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({ show, onClick }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 bg-orange-400 text-slate-900 p-3 rounded-full shadow-lg shadow-orange-400/20 hover:bg-orange-500 transition-colors"
          onClick={onClick}
          aria-label="Прокрутить вверх"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};