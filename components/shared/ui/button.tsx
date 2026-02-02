"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface ButtonProps {
  color: 'green' | 'blue' | 'orange' | 'amber' | 'purple' | 'turquoise' | 'red';
  text?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  icon?: ReactNode;
}

const colorClasses = {
  green: {
    gradient: 'from-[rgba(34,197,94,0.3)] to-[rgba(21,128,61,0.3)] hover:from-[rgba(34,197,94,0.4)] hover:to-[rgba(21,128,61,0.4)]',
    border: 'border-[rgba(34,197,94,0.5)]',
    boxShadow: 'hover:shadow-[0_4px_12px_-1px_rgba(34,197,94,0.3)]',
    glowColor: 'rgba(34, 197, 94, 0.6)'
  },
  blue: {
    gradient: 'from-[rgba(59,130,246,0.3)] to-[rgba(37,99,235,0.3)] hover:from-[rgba(59,130,246,0.4)] hover:to-[rgba(37,99,235,0.4)]',
    border: 'border-[rgba(59,130,246,0.5)]',
    boxShadow: 'hover:shadow-[0_4px_12px_-1px_rgba(59,130,246,0.3)]',
    glowColor: 'rgba(59, 130, 246, 0.6)'
  },
  orange: {
    gradient: 'from-[rgba(249,115,22,0.3)] to-[rgba(234,88,12,0.3)] hover:from-[rgba(249,115,22,0.4)] hover:to-[rgba(234,88,12,0.4)]',
    border: 'border-[rgba(249,115,22,0.5)]',
    boxShadow: 'hover:shadow-[0_4px_12px_-1px_rgba(249,115,22,0.3)]',
    glowColor: 'rgba(249, 115, 22, 0.6)'
  },
  amber: {
    gradient: 'from-[rgba(234,179,8,0.3)] to-[rgba(202,138,4,0.3)] hover:from-[rgba(234,179,8,0.4)] hover:to-[rgba(202,138,4,0.4)]',
    border: 'border-[rgba(234,179,8,0.5)]',
    boxShadow: 'hover:shadow-[0_4px_12px_-1px_rgba(234,179,8,0.3)]',
    glowColor: 'rgba(234, 179, 8, 0.6)'
  },
  purple: {
    gradient: 'from-[rgba(168,85,247,0.3)] to-[rgba(147,51,234,0.3)] hover:from-[rgba(168,85,247,0.4)] hover:to-[rgba(147,51,234,0.4)]',
    border: 'border-[rgba(168,85,247,0.5)]',
    boxShadow: 'hover:shadow-[0_4px_12px_-1px_rgba(168,85,247,0.3)]',
    glowColor: 'rgba(168, 85, 247, 0.6)'
  },
  turquoise: {
    gradient: 'from-[rgba(45,164,170,0.3)] to-[rgba(36,131,136,0.3)] hover:from-[rgba(45,164,170,0.4)] hover:to-[rgba(36,131,136,0.4)]',
    border: 'border-[rgba(45,164,170,0.5)]',
    boxShadow: 'hover:shadow-[0_4px_12px_-1px_rgba(45,164,170,0.3)]',
    glowColor: 'rgba(45, 164, 170, 0.6)'
  },
  red: {
    gradient: 'from-[rgba(239,68,68,0.3)] to-[rgba(220,38,38,0.3)] hover:from-[rgba(239,68,68,0.4)] hover:to-[rgba(220,38,38,0.4)]',
    border: 'border-[rgba(239,68,68,0.5)]',
    boxShadow: 'hover:shadow-[0_4px_12px_-1px_rgba(239,68,68,0.3)]',
    glowColor: 'rgba(239, 68, 68, 0.6)'
  }
} as const;

export const Button: React.FC<ButtonProps> = ({
  color,
  text,
  href,
  onClick,
  className = '',
  disabled = false,
  children,
  icon
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    if (isHovered && !disabled) {
      window.addEventListener('mousemove', updateMousePosition);
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [isHovered, disabled]);

  const colorConfig = colorClasses[color];

  const renderContent = () => {
    if (children) return children;
    
    const textContent = text || '';
    const contentWithIcon = (
      <div className="flex items-center justify-center">
        {icon && <span className="inline-flex items-center">{icon}</span>}
        {textContent && <span className={icon ? "ml-2" : ""}>{textContent}</span>}
      </div>
    );
    
    if (href) {
      return (
        <a
          href={disabled ? undefined : href}
          className="relative z-10 text-shadow-sm pointer-events-none w-full inline-flex items-center justify-center"
        >
          {contentWithIcon}
        </a>
      );
    }
    
    return (
      <span className="relative z-10 text-shadow-sm w-full inline-flex items-center justify-center">
        {contentWithIcon}
      </span>
    );
  };

  return (
    <button
      ref={buttonRef}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        relative 
        inline-block 
        px-4 py-2 
        text-sm 
        font-bold 
        text-white 
        rounded-[4px] 
        border 
        overflow-hidden 
        transition-all 
        duration-300 
        ease-in-out 
        ${!disabled ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}
        bg-gradient-to-r 
        ${colorConfig.gradient}
        ${colorConfig.border}
        ${!disabled && colorConfig.boxShadow}
        ${className}
      `}
      style={
        !disabled
          ? ({
              '--mouse-x': `${mousePosition.x}px`,
              '--mouse-y': `${mousePosition.y}px`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {renderContent()}

      {!disabled && (
        <div
          className={`
            absolute 
            inset-0 
            transition-opacity 
            duration-300 
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: `radial-gradient(
              circle 100px at var(--mouse-x) var(--mouse-y), 
              ${colorConfig.glowColor}, 
              transparent 60%
            )`,
          }}
        />
      )}
    </button>
  );
};
