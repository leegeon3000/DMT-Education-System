/**
 * Animation Utilities for Framer Motion
 * Reusable animation variants and configurations
 */

import { Variants } from 'framer-motion';

/**
 * Fade in animations
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

/**
 * Scale animations
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const scaleUp: Variants = {
  hidden: { scale: 0 },
  visible: { 
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15 }
  }
};

/**
 * Stagger container animations
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

/**
 * Slide animations
 */
export const slideInLeft: Variants = {
  hidden: { x: '-100%' },
  visible: { 
    x: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
};

export const slideInRight: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
};

/**
 * Rotation animations
 */
export const rotate: Variants = {
  hidden: { rotate: -180, opacity: 0 },
  visible: { 
    rotate: 0, 
    opacity: 1,
    transition: { duration: 0.7, ease: 'easeOut' }
  }
};

/**
 * Bounce animation
 */
export const bounce: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 10
    }
  }
};

/**
 * Float animation (continuous)
 */
export const floatAnimation = {
  y: [-10, 10],
  transition: {
    y: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut'
    }
  }
};

/**
 * Pulse animation (continuous)
 */
export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

/**
 * Hover animations
 */
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.3 }
};

export const hoverLift = {
  y: -10,
  transition: { duration: 0.3 }
};

export const hoverGlow = {
  boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
  transition: { duration: 0.3 }
};

/**
 * Page transition animations
 */
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 }
};

/**
 * Number counter animation configuration
 */
export const counterConfig = {
  start: 0,
  duration: 2.5,
  delay: 0.5,
  useEasing: true,
  separator: ',',
  decimal: '.',
};

/**
 * Scroll reveal hook configuration
 */
export const scrollRevealConfig = {
  threshold: 0.1,
  triggerOnce: true,
  rootMargin: '0px 0px -100px 0px'
};

/**
 * Card hover variant
 */
export const cardHover: Variants = {
  rest: { 
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.3 }
  }
};

/**
 * Button press animation
 */
export const buttonPress = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

/**
 * Glassmorphism card animation
 */
export const glassCard: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    backdropFilter: 'blur(0px)'
  },
  visible: { 
    opacity: 1, 
    y: 0,
    backdropFilter: 'blur(10px)',
    transition: { duration: 0.6 }
  }
};

/**
 * Gradient animation (for backgrounds)
 */
export const gradientAnimation = {
  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: 'linear'
  }
};

/**
 * Text reveal animation
 */
export const textReveal: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
    skewY: 3
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.6,
      ease: 'easeOut'
    }
  })
};

/**
 * Draw line animation (for decorative lines)
 */
export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2, ease: 'easeInOut' },
      opacity: { duration: 0.5 }
    }
  }
};
