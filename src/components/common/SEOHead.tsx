import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
  locale?: string;
  alternateLocales?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  schema?: object;
}

const defaultSEO = {
  title: 'DMT Education - Trung tâm đào tạo tiếng Anh & Toán tư duy hàng đầu',
  description: 'DMT Education - Trung tâm đào tạo IELTS, tiếng Anh giao tiếp và Toán tư duy chất lượng cao. Với đội ngũ giáo viên chuyên nghiệp, phương pháp giảng dạy hiện đại và môi trường học tập thân thiện.',
  keywords: [
    'DMT Education',
    'IELTS',
    'tiếng Anh',
    'Toán tư duy',
    'giáo dục',
    'đào tạo',
    'học tiếng Anh',
    'IELTS Junior',
    'IELTS cấp tốc',
    'coding junior',
    'TP.HCM',
    'Vietnam'
  ],
  image: '/logo-dmt.png',
  siteName: 'DMT Education',
  locale: 'vi_VN',
  type: 'website' as const
};

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  siteName,
  locale = 'vi_VN',
  alternateLocales = ['en_US'],
  noindex = false,
  nofollow = false,
  canonical,
  schema
}) => {
  const seoTitle = title || defaultSEO.title;
  const seoDescription = description || defaultSEO.description;
  const seoKeywords = [...defaultSEO.keywords, ...keywords];
  const seoImage = image || defaultSEO.image;
  const seoSiteName = siteName || defaultSEO.siteName;
  const currentUrl = url || window.location.href;
  
  const fullImageUrl = seoImage.startsWith('http') 
    ? seoImage 
    : `${window.location.origin}${seoImage}`;

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow'
  ].join(', ');

  // Structured Data cho Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "DMT Education",
    "alternateName": "Trung tâm DMT Education",
    "url": window.location.origin,
    "logo": fullImageUrl,
    "description": seoDescription,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "TP. Hồ Chí Minh",
      "addressCountry": "VN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-772-305-566",
      "contactType": "Customer Service",
      "email": "info@dmt-edu.vn"
    },
    "sameAs": [
      "https://www.facebook.com/dmteducation",
      "https://www.instagram.com/dmteducation"
    ],
    "offers": [
      {
        "@type": "Course",
        "name": "IELTS Junior",
        "description": "Khóa học tiếng Anh cơ bản dành cho trẻ em từ 8-12 tuổi",
        "provider": {
          "@type": "Organization",
          "name": "DMT Education"
        }
      },
      {
        "@type": "Course", 
        "name": "IELTS Cấp tốc",
        "description": "Khóa học tăng cường cho học sinh THPT",
        "provider": {
          "@type": "Organization",
          "name": "DMT Education"
        }
      },
      {
        "@type": "Course",
        "name": "Toán Tư duy",
        "description": "Phát triển tư duy logic và khả năng giải quyết vấn đề",
        "provider": {
          "@type": "Organization",
          "name": "DMT Education"
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords.join(', ')} />
      <meta name="author" content={author || 'DMT Education'} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={seoSiteName} />
      <meta property="og:locale" content={locale} />
      {alternateLocales.map(altLocale => (
        <meta key={altLocale} property="og:locale:alternate" content={altLocale} />
      ))}
      
      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#dc2626" />
      <meta name="msapplication-TileColor" content="#dc2626" />
      
      {/* Language Meta Tags */}
      <meta httpEquiv="content-language" content={locale.replace('_', '-')} />
      <link rel="alternate" hrefLang={locale.replace('_', '-')} href={currentUrl} />
      {alternateLocales.map(altLocale => (
        <link 
          key={altLocale}
          rel="alternate" 
          hrefLang={altLocale.replace('_', '-')} 
          href={currentUrl} 
        />
      ))}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || organizationSchema)}
      </script>
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/logo-dmt.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/logo-dmt.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/logo-dmt.png" />
      <link rel="manifest" href="/manifest.json" />
    </Helmet>
  );
};

export default SEOHead;
