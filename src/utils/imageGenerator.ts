/**
 * Image Generator Utility
 * Generates SVG-based placeholder images, gradients, and patterns
 * No external images needed!
 */

// Helper function to safely encode UTF-8 strings to base64
function utf8ToBase64(str: string): string {
  try {
    // Use encodeURIComponent + btoa to handle Unicode
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch (e) {
    console.error('Failed to encode string to base64:', e);
    // Fallback: remove all non-ASCII characters
    const safeStr = str.replace(/[^\x00-\x7F]/g, '');
    return btoa(safeStr);
  }
}

export class ImageGenerator {
  /**
   * Generate gradient avatar based on name
   */
  static generateAvatar(name: string, size: number = 120): string {
    const colors = [
      ['#3B82F6', '#1E40AF'], // Blue
      ['#8B5CF6', '#6D28D9'], // Purple
      ['#EC4899', '#DB2777'], // Pink
      ['#F97316', '#EA580C'], // Orange
      ['#10B981', '#059669'], // Green
      ['#06B6D4', '#0891B2'], // Cyan
    ];

    const index = name.charCodeAt(0) % colors.length;
    const [color1, color2] = colors[index];
    const initials = this.getInitials(name);

    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#grad-${name})" />
        <text 
          x="50%" 
          y="50%" 
          text-anchor="middle" 
          dy=".35em" 
          fill="white" 
          font-size="${size / 2.5}" 
          font-weight="600"
          font-family="system-ui, -apple-system, sans-serif"
        >
          ${initials}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
  }

  /**
   * Generate course thumbnail with category color
   */
  static generateCourseThumbnail(
    category: string,
    title: string,
    width: number = 400,
    height: number = 225
  ): string {
    const categoryColors: Record<string, [string, string]> = {
      programming: ['#3B82F6', '#1E40AF'],
      design: ['#EC4899', '#DB2777'],
      business: ['#F97316', '#EA580C'],
      language: ['#10B981', '#059669'],
      math: ['#8B5CF6', '#6D28D9'],
      science: ['#06B6D4', '#0891B2'],
      default: ['#6366F1', '#4F46E5'],
    };

    const [color1, color2] = categoryColors[category.toLowerCase()] || categoryColors.default;
    const icon = this.getCategoryIcon(category);

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-course-${category}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
          <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="white" opacity="0.1" />
          </pattern>
        </defs>
        
        <!-- Background gradient -->
        <rect width="${width}" height="${height}" fill="url(#grad-course-${category})" />
        
        <!-- Pattern overlay -->
        <rect width="${width}" height="${height}" fill="url(#pattern)" />
        
        <!-- Icon -->
        <text 
          x="50%" 
          y="45%" 
          text-anchor="middle" 
          dy=".35em" 
          fill="white" 
          font-size="64" 
          opacity="0.9"
        >
          ${icon}
        </text>
        
        <!-- Category badge -->
        <rect x="20" y="20" width="120" height="32" rx="16" fill="white" opacity="0.2" />
        <text 
          x="80" 
          y="36" 
          text-anchor="middle" 
          dy=".35em" 
          fill="white" 
          font-size="14" 
          font-weight="600"
          font-family="system-ui, -apple-system, sans-serif"
        >
          ${category.toUpperCase()}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
  }

  /**
   * Generate abstract pattern background
   */
  static generatePatternBackground(
    variant: 'dots' | 'waves' | 'grid' | 'circles' = 'dots',
    color: string = '#3B82F6',
    width: number = 1920,
    height: number = 1080
  ): string {
    let pattern = '';

    switch (variant) {
      case 'dots':
        pattern = `
          <pattern id="pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="3" fill="${color}" opacity="0.15" />
          </pattern>
        `;
        break;
      case 'waves':
        pattern = `
          <pattern id="pattern" x="0" y="0" width="100" height="50" patternUnits="userSpaceOnUse">
            <path d="M0,25 Q25,0 50,25 T100,25" stroke="${color}" fill="none" opacity="0.15" stroke-width="2" />
          </pattern>
        `;
        break;
      case 'grid':
        pattern = `
          <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${color}" opacity="0.1" stroke-width="1" />
          </pattern>
        `;
        break;
      case 'circles':
        pattern = `
          <pattern id="pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="30" fill="none" stroke="${color}" opacity="0.1" stroke-width="2" />
          </pattern>
        `;
        break;
    }

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${pattern}
        </defs>
        <rect width="${width}" height="${height}" fill="white" />
        <rect width="${width}" height="${height}" fill="url(#pattern)" />
      </svg>
    `;

    return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
  }

  /**
   * Generate gradient mesh background
   */
  static generateMeshGradient(
    colors: string[] = ['#3B82F6', '#8B5CF6', '#EC4899'],
    width: number = 1920,
    height: number = 1080
  ): string {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad1" cx="30%" cy="30%">
            <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:${colors[0]};stop-opacity:0" />
          </radialGradient>
          <radialGradient id="grad2" cx="70%" cy="40%">
            <stop offset="0%" style="stop-color:${colors[1]};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:0" />
          </radialGradient>
          <radialGradient id="grad3" cx="50%" cy="80%">
            <stop offset="0%" style="stop-color:${colors[2]};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:${colors[2]};stop-opacity:0" />
          </radialGradient>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
          </filter>
        </defs>
        
        <rect width="${width}" height="${height}" fill="#f9fafb" />
        
        <g filter="url(#blur)">
          <ellipse cx="30%" cy="30%" rx="400" ry="300" fill="url(#grad1)" />
          <ellipse cx="70%" cy="40%" rx="450" ry="350" fill="url(#grad2)" />
          <ellipse cx="50%" cy="80%" rx="500" ry="400" fill="url(#grad3)" />
        </g>
      </svg>
    `;

    return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
  }

  /**
   * Generate icon placeholder
   */
  static generateIcon(
    icon: string,
    color: string = '#3B82F6',
    size: number = 64
  ): string {
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.adjustColor(color, -20)};stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#icon-grad)" opacity="0.1" />
        <text 
          x="50%" 
          y="50%" 
          text-anchor="middle" 
          dy=".35em" 
          fill="url(#icon-grad)" 
          font-size="${size / 2}" 
          font-weight="600"
        >
          ${icon}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
  }

  // Helper methods
  private static getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  private static getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      programming: '💻',
      design: '🎨',
      business: '💼',
      language: '🌍',
      math: '📐',
      science: '🔬',
      default: '📚',
    };

    return icons[category.toLowerCase()] || icons.default;
  }

  private static adjustColor(color: string, amount: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, ((num >> 16) & 0xFF) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xFF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0xFF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
}

/**
 * Preset gradient combinations
 */
export const gradients = {
  blue: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
  purple: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
  pink: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
  orange: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
  green: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  cyan: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
  sunset: 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
  ocean: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
  forest: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  royal: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
};

/**
 * Generate illustration-style images
 */
export class IllustrationGenerator {
  /**
   * Generate abstract geometric illustration
   */
  static generateGeometric(
    type: 'education' | 'success' | 'teamwork' | 'growth' = 'education',
    width: number = 400,
    height: number = 300
  ): string {
    const colors = this.getIllustrationColors(type);
    
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="bg-${type}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.bg1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.bg2};stop-opacity:1" />
          </linearGradient>
          <linearGradient id="shape1-${type}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:0.8" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="400" height="300" fill="url(#bg-${type})" rx="20"/>
        
        ${this.getIllustrationShapes(type)}
        
        <!-- Decorative elements -->
        <circle cx="350" cy="50" r="30" fill="${colors.accent}" opacity="0.15"/>
        <circle cx="50" cy="250" r="40" fill="${colors.secondary}" opacity="0.1"/>
      </svg>
    `;

    return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
  }

  /**
   * Generate character illustration
   */
  static generateCharacter(
    role: 'student' | 'teacher' | 'graduate' = 'student',
    size: number = 200
  ): string {
    const colors = {
      student: { skin: '#FBBF77', hair: '#4A5568', shirt: '#3B82F6' },
      teacher: { skin: '#F4A460', hair: '#2D3748', shirt: '#8B5CF6' },
      graduate: { skin: '#DEB887', hair: '#1A202C', shirt: '#10B981' }
    }[role];

    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="grad-${role}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:0.1" />
          </linearGradient>
        </defs>
        
        <!-- Background circle -->
        <circle cx="100" cy="100" r="95" fill="${colors.shirt}" opacity="0.1"/>
        
        <!-- Body -->
        <ellipse cx="100" cy="140" rx="40" ry="50" fill="${colors.shirt}"/>
        
        <!-- Neck -->
        <rect x="90" y="110" width="20" height="20" fill="${colors.skin}" rx="3"/>
        
        <!-- Head -->
        <circle cx="100" cy="85" r="30" fill="${colors.skin}"/>
        <ellipse cx="100" cy="85" rx="30" ry="32" fill="url(#grad-${role})"/>
        
        <!-- Hair -->
        <path d="M 70 75 Q 70 55 100 55 Q 130 55 130 75 L 130 85 Q 130 65 100 60 Q 70 65 70 85 Z" fill="${colors.hair}"/>
        
        <!-- Face features -->
        <!-- Eyes -->
        <circle cx="90" cy="85" r="3" fill="#2D3748"/>
        <circle cx="110" cy="85" r="3" fill="#2D3748"/>
        
        <!-- Smile -->
        <path d="M 85 95 Q 100 100 115 95" stroke="#2D3748" stroke-width="2" fill="none" stroke-linecap="round"/>
        
        ${role === 'teacher' ? `
          <!-- Glasses -->
          <circle cx="90" cy="85" r="8" fill="none" stroke="#2D3748" stroke-width="2"/>
          <circle cx="110" cy="85" r="8" fill="none" stroke="#2D3748" stroke-width="2"/>
          <line x1="98" y1="85" x2="102" y2="85" stroke="#2D3748" stroke-width="2"/>
        ` : ''}
        
        ${role === 'graduate' ? `
          <!-- Graduation cap -->
          <rect x="70" y="55" width="60" height="8" fill="#1A202C" rx="2"/>
          <path d="M 65 55 L 100 45 L 135 55 Z" fill="#1A202C"/>
          <rect x="98" y="45" width="4" height="15" fill="#F59E0B"/>
          <circle cx="100" cy="60" r="3" fill="#F59E0B"/>
        ` : ''}
        
        ${role === 'student' ? `
          <!-- Book -->
          <rect x="60" y="170" width="25" height="20" fill="#EF4444" rx="2"/>
          <line x1="72.5" y1="170" x2="72.5" y2="190" stroke="#991B1B" stroke-width="1"/>
        ` : ''}
      </svg>
    `;

    return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
  }

  /**
   * Generate icon illustration with background
   */
  static generateIconIllustration(
    icon: 'book' | 'trophy' | 'rocket' | 'lightbulb' | 'star',
    size: number = 150
  ): string {
    const iconPaths = {
      book: 'M12 6v15m6-11v11m-12-11v11M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
      trophy: 'M5 7h14m-9 0v8m5-8v8M5 7a2 2 0 0 1-2-2V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2M5 7c0 5 3 8 7 8s7-3 7-8m-7 8v4m-4 0h8',
      rocket: 'M15 3l6 6-6 6-3-3-3 3-3-3 3-3-3-3 6-6zm-9 18h12',
      lightbulb: 'M12 2a7 7 0 0 1 5 11.9V18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-4.1A7 7 0 0 1 12 2zm-3 16h6m-3 4v-2',
      star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    };

    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#10B981'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150">
        <defs>
          <linearGradient id="grad-icon-${icon}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.adjustColor(color, -30)};stop-opacity:1" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Background circles -->
        <circle cx="75" cy="75" r="70" fill="url(#grad-icon-${icon})" opacity="0.1"/>
        <circle cx="75" cy="75" r="55" fill="url(#grad-icon-${icon})" opacity="0.15"/>
        
        <!-- Icon container -->
        <circle cx="75" cy="75" r="40" fill="url(#grad-icon-${icon})" filter="url(#shadow)"/>
        
        <!-- Icon -->
        <g transform="translate(51, 51) scale(1.5)">
          <path d="${iconPaths[icon]}" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        
        <!-- Decorative dots -->
        <circle cx="20" cy="130" r="4" fill="${color}" opacity="0.3"/>
        <circle cx="130" cy="25" r="5" fill="${color}" opacity="0.25"/>
        <circle cx="30" cy="40" r="3" fill="${color}" opacity="0.2"/>
      </svg>
    `;

    return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
  }

  private static getIllustrationColors(type: string) {
    const colorSchemes: Record<string, any> = {
      education: {
        bg1: '#EFF6FF',
        bg2: '#DBEAFE',
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#F59E0B'
      },
      success: {
        bg1: '#F0FDF4',
        bg2: '#DCFCE7',
        primary: '#10B981',
        secondary: '#059669',
        accent: '#F59E0B'
      },
      teamwork: {
        bg1: '#FDF4FF',
        bg2: '#FAE8FF',
        primary: '#8B5CF6',
        secondary: '#EC4899',
        accent: '#3B82F6'
      },
      growth: {
        bg1: '#FEF3C7',
        bg2: '#FDE68A',
        primary: '#F59E0B',
        secondary: '#EF4444',
        accent: '#10B981'
      }
    };
    return colorSchemes[type] || colorSchemes.education;
  }

  private static getIllustrationShapes(type: string): string {
    const shapes: Record<string, string> = {
      education: `
        <!-- Book stack -->
        <rect x="50" y="140" width="100" height="15" fill="url(#shape1-education)" rx="3"/>
        <rect x="60" y="125" width="90" height="15" fill="url(#shape1-education)" opacity="0.8" rx="3"/>
        <rect x="70" y="110" width="80" height="15" fill="url(#shape1-education)" opacity="0.6" rx="3"/>
        
        <!-- Graduation cap -->
        <path d="M 200 80 L 250 60 L 300 80 L 250 100 Z" fill="#F59E0B" opacity="0.8"/>
        <rect x="248" y="100" width="4" height="30" fill="#F59E0B" opacity="0.8"/>
      `,
      success: `
        <!-- Trophy -->
        <path d="M 250 100 L 230 150 L 270 150 Z" fill="url(#shape1-success)"/>
        <ellipse cx="250" cy="155" rx="25" ry="8" fill="url(#shape1-success)" opacity="0.6"/>
        <circle cx="250" cy="95" r="15" fill="#F59E0B" opacity="0.8"/>
        
        <!-- Stars -->
        <path d="M 300 100 L 305 110 L 315 110 L 307 116 L 310 126 L 300 120 L 290 126 L 293 116 L 285 110 L 295 110 Z" fill="#F59E0B" opacity="0.6"/>
      `,
      teamwork: `
        <!-- People circles -->
        <circle cx="220" cy="120" r="25" fill="url(#shape1-teamwork)"/>
        <circle cx="280" cy="120" r="25" fill="url(#shape1-teamwork)" opacity="0.8"/>
        <circle cx="250" cy="160" r="25" fill="url(#shape1-teamwork)" opacity="0.9"/>
      `,
      growth: `
        <!-- Arrow up -->
        <path d="M 250 160 L 250 80" stroke="url(#shape1-growth)" stroke-width="8" stroke-linecap="round"/>
        <path d="M 230 100 L 250 80 L 270 100" stroke="url(#shape1-growth)" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Growth bars -->
        <rect x="200" y="140" width="15" height="20" fill="url(#shape1-growth)" opacity="0.4" rx="3"/>
        <rect x="220" y="130" width="15" height="30" fill="url(#shape1-growth)" opacity="0.6" rx="3"/>
        <rect x="240" y="115" width="15" height="45" fill="url(#shape1-growth)" opacity="0.8" rx="3"/>
      `
    };
    return shapes[type] || shapes.education;
  }

  private static adjustColor(color: string, amount: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, ((num >> 16) & 0xFF) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xFF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0xFF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
}

/**
 * Generate random gradient
 */
export function getRandomGradient(): string {
  const gradientList = Object.values(gradients);
  return gradientList[Math.floor(Math.random() * gradientList.length)];
}
