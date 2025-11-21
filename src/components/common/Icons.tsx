import React from 'react';

// SVG Icons cho DMT Education - Organized và cleaned up
export const Icons = {
  // Educational Icons
  Target: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#FF8E53" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="white" stroke="url(#targetGradient)" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7" fill="white" stroke="url(#targetGradient)" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" fill="white" stroke="url(#targetGradient)" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill="url(#targetGradient)" />
    </svg>
  ),

  Bulb: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="bulbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
        <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path d="M9 2.5a6.5 6.5 0 0 1 5.27 10.47l.06.03s.34 1 .34 1.5v1a2 2 0 0 1-1 1.73V19a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1.77A2 2 0 0 1 5 16v-1c0-.5.34-1.5.34-1.5l.06-.03A6.5 6.5 0 0 1 9 2.5z" 
        fill="url(#bulbGradient)" filter="url(#bulbGlow)" />
      <path d="M9.5 21h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1z" fill="#E67E22" />
      <path d="M8.5 18h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z" fill="#E67E22" />
    </svg>
  ),

  Star: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
        <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feFlood floodColor="#FFD700" result="glowColor" />
          <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
          <feComposite in="SourceGraphic" in2="softGlow" operator="over" />
        </filter>
      </defs>
      <path d="M12 2L9.2 8.6 2 9.2l5.5 5.3-1.3 7.5 5.8-3 5.8 3-1.3-7.5 5.5-5.3-7.2-.6z" 
        fill="url(#starGradient)" stroke="#E67E22" strokeWidth="0.5" filter="url(#starGlow)" />
    </svg>
  ),

  Trophy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
        <linearGradient id="trophyBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CD7F32" />
          <stop offset="100%" stopColor="#A0522D" />
        </linearGradient>
      </defs>
      <path d="M6 4v3.2c0 1 0 2 .4 2.9.5 1 1.3 1.7 2.2 2.2.5.3 1.1.4 1.7.5.7 0 1.4-.2 2-.5 1-.5 1.8-1.2 2.3-2.2.4-.9.4-1.9.4-2.9V4H6z" 
        fill="url(#trophyGradient)" stroke="#E67E22" strokeWidth="0.5" />
      <path d="M14 4h5c.6 0 1 .4 1 1s-.4 1-1 1h-1c-.7 0-1 .3-1 1v1c0 1.7-1.3 3-3 3" 
        fill="none" stroke="#E67E22" strokeWidth="0.5" />
      <path d="M10 4H5c-.6 0-1 .4-1 1s.4 1 1 1h1c.7 0 1 .3 1 1v1c0 1.7 1.3 3 3 3" 
        fill="none" stroke="#E67E22" strokeWidth="0.5" />
      <path d="M9 13v5h6v-5" fill="none" stroke="#E67E22" strokeWidth="0.5" />
      <path d="M8 18h8v2c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-2z" 
        fill="url(#trophyBase)" stroke="#E67E22" strokeWidth="0.5" />
    </svg>
  ),

  Book: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="bookGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3498DB" />
          <stop offset="100%" stopColor="#8E44AD" />
        </linearGradient>
        <linearGradient id="bookGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2980B9" />
          <stop offset="100%" stopColor="#9B59B6" />
        </linearGradient>
        <linearGradient id="pageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5F5F5" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>
      </defs>
      <path d="M4 6v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-12c-1.1 0-2 .9-2 2z" 
        fill="url(#bookGradient1)" />
      <path d="M4 6v14c0 1.1.9 2 2 2h12V4h-12c-1.1 0-2 .9-2 2z" 
        fill="url(#bookGradient2)" />
      <path d="M6 4h10v16h-10z" fill="url(#pageGradient)" />
      <path d="M8 8h6M8 12h6M8 16h4" stroke="#3498DB" strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  ),

  Graduation: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="gradCapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3498DB" />
          <stop offset="100%" stopColor="#2980B9" />
        </linearGradient>
        <linearGradient id="gradTasselGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F1C40F" />
          <stop offset="100%" stopColor="#F39C12" />
        </linearGradient>
      </defs>
      <path d="M12 4L3 9l9 5 7.6-4.2c.6.4.9 1 .9 1.7v3c-.5.2-1 .8-1 1.5s.4 1.3 1 1.5V20h1v-2.5c.5-.2 1-.8 1-1.5s-.4-1.3-1-1.5v-3c0-1.2-.7-2.3-1.7-2.9L21 8l-9-4z" 
        fill="url(#gradCapGradient)" />
      <path d="M9 13v5c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-5l-3 1.7L9 13z" 
        fill="url(#gradTasselGradient)" />
    </svg>
  ),

  Teacher: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="teacherHeadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB6C1" />
          <stop offset="100%" stopColor="#FF69B4" />
        </linearGradient>
        <linearGradient id="teacherBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4682B4" />
          <stop offset="100%" stopColor="#1E90FF" />
        </linearGradient>
        <linearGradient id="teacherBookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#A52A2A" />
        </linearGradient>
        <linearGradient id="teacherGlassesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="100%" stopColor="#333333" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="7" r="4" fill="url(#teacherHeadGradient)" />
      <rect x="6" y="11" width="12" height="10" rx="2" fill="url(#teacherBodyGradient)" />
      <rect x="5" y="16" width="6" height="8" rx="1" fill="url(#teacherBookGradient)" />
      <path d="M9 7h6M8 6h1M15 6h1" stroke="url(#teacherGlassesGradient)" strokeWidth="0.75" />
    </svg>
  ),

  // Communication Icons
  News: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="newsGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F5F5" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>
        <linearGradient id="newsGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ECECEC" />
          <stop offset="100%" stopColor="#CCCCCC" />
        </linearGradient>
        <linearGradient id="newsHeaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3498DB" />
          <stop offset="100%" stopColor="#2980B9" />
        </linearGradient>
      </defs>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="url(#newsGradient1)" />
      <path d="M19 5H5v3h14V5z" fill="url(#newsHeaderGradient)" />
      <path d="M7 10h8v2H7zM7 14h10v1H7zM7 17h10v1H7zM17 10h2v2h-2z" fill="url(#newsGradient2)" />
    </svg>
  ),

  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#27AE60" />
          <stop offset="100%" stopColor="#2ECC71" />
        </linearGradient>
        <filter id="phoneGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feFlood floodColor="#27AE60" floodOpacity="0.5" result="glowColor" />
          <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
          <feComposite in="SourceGraphic" in2="softGlow" operator="over" />
        </filter>
      </defs>
      <path d="M19.23 15.26l-2.54-.29a1.99 1.99 0 0 0-1.64.57l-1.84 1.84a15.045 15.045 0 0 1-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52a2.001 2.001 0 0 0-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07.53 8.54 7.36 15.36 15.89 15.89 1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98z"
        fill="url(#phoneGradient)" filter="url(#phoneGlow)" />
    </svg>
  ),

  Location: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="locationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E74C3C" />
          <stop offset="100%" stopColor="#C0392B" />
        </linearGradient>
        <filter id="locationShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="#C0392B" floodOpacity="0.5" />
        </filter>
      </defs>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill="url(#locationGradient)" filter="url(#locationShadow)" />
    </svg>
  ),

  Email: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="emailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FF9800" />
        </linearGradient>
        <linearGradient id="emailPaperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5F5F5" />
        </linearGradient>
        <filter id="emailShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="#FF9800" floodOpacity="0.5" />
        </filter>
      </defs>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"
        fill="url(#emailGradient)" filter="url(#emailShadow)" />
      <path d="M20 4H4c-.5 0-.9.2-1.3.5l8.6 8.6c.7.7 1.7.7 2.4 0l8.6-8.6c-.4-.3-.8-.5-1.3-.5z"
        fill="url(#emailPaperGradient)" />
    </svg>
  ),

  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="calendarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B59B6" />
          <stop offset="100%" stopColor="#8E44AD" />
        </linearGradient>
        <linearGradient id="calendarTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8E44AD" />
          <stop offset="100%" stopColor="#9B59B6" />
        </linearGradient>
      </defs>
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
        fill="url(#calendarGradient)" />
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v3h18V5c0-1.1-.9-2-2-2z"
        fill="url(#calendarTopGradient)" />
      <path d="M7 12h2v2H7zM11 12h2v2h-2zM15 12h2v2h-2zM7 16h2v2H7zM11 16h2v2h-2zM15 16h2v2h-2z"
        fill="white" />
    </svg>
  ),

  // Special Icons
  Gift: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="giftBoxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E91E63" />
          <stop offset="100%" stopColor="#D81B60" />
        </linearGradient>
        <linearGradient id="giftTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F06292" />
          <stop offset="100%" stopColor="#EC407A" />
        </linearGradient>
        <linearGradient id="giftRibbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>
      </defs>
      <path d="M20 6h-2c.55-.55 1-1.22 1-2 0-1.66-1.34-3-3-3-1.23 0-2.29.75-2.75 1.82-.44-1.05-1.5-1.82-2.75-1.82-1.66 0-3 1.34-3 3 0 .78.45 1.45 1 2H5C3.9 6 3 6.9 3 8v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"
        fill="url(#giftBoxGradient)" />
      <path d="M20 6h-2c.55-.55 1-1.22 1-2 0-1.66-1.34-3-3-3-1.23 0-2.29.75-2.75 1.82-.44-1.05-1.5-1.82-2.75-1.82-1.66 0-3 1.34-3 3 0 .78.45 1.45 1 2H5C3.9 6 3 6.9 3 8v3h18V8c0-1.1-.9-2-2-2z"
        fill="url(#giftTopGradient)" />
      <path d="M3 8h18v3H3zM11 5v15M13 5v15"
        fill="none" stroke="url(#giftRibbonGradient)" strokeWidth="2" />
    </svg>
  ),

  Rocket: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="rocketBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF5252" />
          <stop offset="100%" stopColor="#FF1744" />
        </linearGradient>
        <linearGradient id="rocketWindowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#90CAF9" />
          <stop offset="100%" stopColor="#42A5F5" />
        </linearGradient>
        <linearGradient id="rocketFireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FF9800" />
        </linearGradient>
        <filter id="fireGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path d="M12 2.5s4.5 2.04 4.5 10.5c0 2.49-1.04 5.57-1.6 7H9.1c-.56-1.43-1.6-4.51-1.6-7C7.5 4.54 12 2.5 12 2.5z"
        fill="url(#rocketBodyGradient)" />
      <circle cx="12" cy="9" r="2" fill="url(#rocketWindowGradient)" />
      <path d="M12 14.5c-5 0-6 4-6 4h12s-1-4-6-4zM15 15v2M12 15v3M9 15v2"
        fill="none" stroke="#E0E0E0" strokeWidth="1" />
      <path d="M11 19l1 3 1-3M8 19s-1 2 0 3M16 19s1 2 0 3"
        fill="url(#rocketFireGradient)" filter="url(#fireGlow)" />
    </svg>
  ),

  Celebration: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="celebrationGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FF9800" />
        </linearGradient>
        <linearGradient id="celebrationGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F44336" />
          <stop offset="100%" stopColor="#E91E63" />
        </linearGradient>
        <linearGradient id="celebrationGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2196F3" />
          <stop offset="100%" stopColor="#03A9F4" />
        </linearGradient>
        <linearGradient id="celebrationGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#8BC34A" />
        </linearGradient>
        <filter id="celebrationGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path d="M7 11.5l4.5-7.5 1.5 2-3.5 5.5z" fill="url(#celebrationGradient1)" filter="url(#celebrationGlow)" />
      <path d="M14 3l-2 6 7-2-5-4z" fill="url(#celebrationGradient2)" filter="url(#celebrationGlow)" />
      <path d="M6 16l7-3-3 8-4-5z" fill="url(#celebrationGradient3)" filter="url(#celebrationGlow)" />
      <path d="M19 12l-6-1 4 6 2-5z" fill="url(#celebrationGradient4)" filter="url(#celebrationGlow)" />
      <circle cx="12" cy="12" r="1" fill="#FFEB3B" />
      <circle cx="7" cy="5" r="0.5" fill="#FFEB3B" />
      <circle cx="17" cy="7" r="0.5" fill="#FFEB3B" />
      <circle cx="19" cy="16" r="0.5" fill="#FFEB3B" />
      <circle cx="5" cy="17" r="0.5" fill="#FFEB3B" />
    </svg>
  ),

  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="checkCircleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C853" />
          <stop offset="100%" stopColor="#64DD17" />
        </linearGradient>
        <filter id="checkCircleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="12" cy="12" r="10" fill="none" stroke="url(#checkCircleGradient)" strokeWidth="2" />
      <path 
        d="M9 12l2 2 4-4" 
        fill="none" 
        stroke="url(#checkCircleGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#checkCircleGlow)"
      />
      <circle cx="12" cy="12" r="6" fill="url(#checkCircleGradient)" fillOpacity="0.2" />
    </svg>
  ),

  Announcement: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="micGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9C27B0" />
          <stop offset="100%" stopColor="#673AB7" />
        </linearGradient>
        <linearGradient id="micGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3F51B5" />
          <stop offset="100%" stopColor="#2196F3" />
        </linearGradient>
        <filter id="micGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feFlood floodColor="#9C27B0" floodOpacity="0.3" result="glowColor" />
          <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
          <feComposite in="SourceGraphic" in2="softGlow" operator="over" />
        </filter>
      </defs>
      <path d="M9 18h6v2H9z" fill="url(#micGradient1)" />
      <path d="M12 22L12 15" fill="none" stroke="url(#micGradient1)" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 1c-2.21 0-4 1.79-4 4v6c0 2.21 1.79 4 4 4s4-1.79 4-4V5c0-2.21-1.79-4-4-4z" 
        fill="url(#micGradient2)" filter="url(#micGlow)" />
      <path d="M7 9v2c0 2.76 2.24 5 5 5s5-2.24 5-5V9" 
        fill="none" stroke="url(#micGradient1)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1,1" />
      <path d="M5 9v2c0 3.87 3.13 7 7 7s7-3.13 7-7V9" 
        fill="none" stroke="url(#micGradient1)" strokeWidth="1" strokeLinecap="round" strokeDasharray="1,2" />
      <path d="M10 5c0-1.1 0.9-2 2-2s2 0.9 2 2" fill="none" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.7" />
    </svg>
  ),

  Bank: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="bankGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1565C0" />
          <stop offset="100%" stopColor="#0D47A1" />
        </linearGradient>
        <linearGradient id="bankGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#90CAF9" />
          <stop offset="100%" stopColor="#42A5F5" />
        </linearGradient>
        <linearGradient id="bankGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E3F2FD" />
          <stop offset="100%" stopColor="#BBDEFB" />
        </linearGradient>
        <filter id="bankShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>
      <rect x="2" y="17" width="20" height="3" fill="url(#bankGradient1)" filter="url(#bankShadow)" />
      <path d="M12 3L2 9h20L12 3z" fill="url(#bankGradient2)" filter="url(#bankShadow)" />
      <rect x="4" y="9" width="2" height="8" fill="url(#bankGradient3)" rx="0.5" />
      <rect x="8" y="9" width="2" height="8" fill="url(#bankGradient3)" rx="0.5" />
      <rect x="12" y="9" width="2" height="8" fill="url(#bankGradient3)" rx="0.5" />
      <rect x="16" y="9" width="2" height="8" fill="url(#bankGradient3)" rx="0.5" />
      <rect x="3" y="20" width="18" height="2" fill="url(#bankGradient1)" />
      <circle cx="12" cy="6" r="0.8" fill="#E3F2FD" />
      <rect x="11.5" y="3" width="1" height="2" fill="#E3F2FD" />
    </svg>
  ),

  // Social Media Icons
  Facebook: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="facebookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1877f2" />
          <stop offset="100%" stopColor="#42a5f5" />
        </linearGradient>
      </defs>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" 
        fill="url(#facebookGradient)" />
    </svg>
  ),

  YouTube: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="youtubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0000" />
          <stop offset="100%" stopColor="#ff6b35" />
        </linearGradient>
      </defs>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" 
        fill="url(#youtubeGradient)" />
    </svg>
  ),

  TikTok: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="tiktokGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0050" />
          <stop offset="50%" stopColor="#00f2ea" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" 
        fill="url(#tiktokGradient)" />
    </svg>
  ),

  // Contact Icons (smaller versions)
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="mapPinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
        fill="url(#mapPinGradient)" />
    </svg>
  ),

  ContactPhone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="contactPhoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" 
        fill="url(#contactPhoneGradient)" />
    </svg>
  ),

  ContactEmail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="contactEmailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" 
        fill="url(#contactEmailGradient)" />
    </svg>
  ),

  // New icons for Teacher Reviews Section
  Quote: ({ size = 24, color = "currentColor", ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3" 
        fill={color} 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  ),

  ChevronLeft: ({ size = 24, color = "currentColor", ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M15 18l-6-6 6-6" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  ),

  ChevronRight: ({ size = 24, color = "currentColor", ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9 18l6-6-6-6" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  ),

  Newspaper: ({ size = 24, color = "currentColor", ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-5M10 6h8v4h-8z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  ),

  Image: ({ size = 24, color = "currentColor", ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle cx="8.5" cy="8.5" r="1.5" fill={color} />
      <path d="M21 15l-5-5L5 21" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  )
};

export default Icons;
