'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedItemProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'scale' | 'rotate';
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export default function AnimatedItem({
  children,
  animation = 'fade-in',
  delay = 0,
  duration: _duration = 500,
  className = '',
  once = true,
}: AnimatedItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, [once]);

  const animations = {
    'fade-in': 'opacity-0 animate-fade-in',
    'slide-up': 'translate-y-10 opacity-0 animate-slide-up',
    scale: 'scale-95 opacity-0 animate-scale',
    rotate: 'rotate-12 opacity-0 animate-rotate',
  };

  // Create delay classes based on delay prop
  const getDelayClass = () => {
    if (delay === 0) return '';
    if (delay <= 100) return 'animation-delay-100';
    if (delay <= 200) return 'animation-delay-200';
    if (delay <= 300) return 'animation-delay-300';
    if (delay <= 400) return 'animation-delay-400';
    if (delay <= 500) return 'animation-delay-500';
    return 'animation-delay-600';
  };

  return (
    <div
      ref={ref}
      className={`${isVisible ? animations[animation] : 'opacity-0'} ${getDelayClass()} ${className}`}
    >
      {children}
    </div>
  );
}
