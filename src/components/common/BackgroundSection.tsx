import React from 'react';
import { LazyImage } from './OptimizedComponents';

export interface BackgroundSectionProps {
  children: React.ReactNode;
  backgroundImage?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
  parallax?: boolean;
  id?: string;
}

export const BackgroundSection: React.FC<BackgroundSectionProps> = ({
  children,
  backgroundImage,
  overlay = true,
  overlayColor = 'rgba(0, 0, 0, 0.3)',
  overlayOpacity = 0.3,
  className = '',
  style = {},
  parallax = false,
  id
}) => {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    if (!parallax) return;

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallax]);

  const sectionStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: parallax ? '120%' : '100%',
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: parallax ? 'fixed' : 'scroll',
    transform: parallax ? `translateY(${scrollY * 0.5}px)` : 'none',
    transition: parallax ? 'none' : 'transform 0.3s ease',
    zIndex: 1
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: overlayColor,
    opacity: overlay ? overlayOpacity : 0,
    zIndex: 2
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 3
  };

  return (
    <section 
      id={id}
      className={className}
      style={sectionStyle}
    >
      {backgroundImage && (
        <>
          <div style={backgroundStyle} />
          {overlay && <div style={overlayStyle} />}
        </>
      )}
      <div style={contentStyle}>
        {children}
      </div>
    </section>
  );
};

// Animated gradient backgrounds for sections without images
export const GradientBackground: React.FC<{
  children: React.ReactNode;
  gradient: string;
  className?: string;
  style?: React.CSSProperties;
  animated?: boolean;
}> = ({ 
  children, 
  gradient, 
  className = '', 
  style = {},
  animated = false 
}) => {
  React.useEffect(() => {
    if (animated) {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient {
          background-size: 400% 400% !important;
          animation: gradientShift 15s ease infinite !important;
        }
      `;
      document.head.appendChild(styleSheet);
      
      return () => {
        document.head.removeChild(styleSheet);
      };
    }
  }, [animated]);

  return (
    <section 
      className={`${className} ${animated ? 'animated-gradient' : ''}`}
      style={{
        background: gradient,
        position: 'relative',
        ...style
      }}
    >
      {children}
    </section>
  );
};

// Predefined background configurations for different sections
export const SECTION_BACKGROUNDS = {
  hero: {
    image: '/images/ANH-GV/DMT-25-14.jpg', 
    overlay: true,
    overlayColor: 'rgba(59, 130, 246, 0.8)', // Blue overlay
    parallax: true
  },
  about: {
    image: '/images/ANH-HOC-SINH/DMT-25-23.jpg',
    overlay: true,
    overlayColor: 'rgba(16, 185, 129, 0.7)', // Green overlay
    parallax: false
  },
  courses: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #ffffffff 100%)',
    animated: true
  },
  achievements: {
    image: '/young-boy-playing-aviator-toy-air-plane-imagination-dreaming-being-pilot-future-business-district-urban.jpg',
    overlay: true,
    overlayColor: 'rgba(139, 69, 19, 0.6)',
    parallax: true
  },
  contact: {
    image: '/images/ANH-HOC-SINH/DMT-25-26_1.jpg',
    overlay: true,
    overlayColor: 'rgba(255, 255, 255, 1)', // Light overlay
    parallax: false
  },
  schedule: {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    animated: true
  },
  news: {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    animated: false
  }
} as const;
