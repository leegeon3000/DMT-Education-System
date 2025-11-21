import React from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { ImageGenerator } from '../../utils/imageGenerator';
import { fadeInUp } from '../../utils/animations';
import logo from '/logo-dmt.png';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Khóa học',
    links: [
      { name: 'Toán học', href: '/courses/math' },
      { name: 'Vật lý', href: '/courses/physics' },
      { name: 'Hóa học', href: '/courses/chemistry' },
      { name: 'Tiếng Anh', href: '/courses/english' },
      { name: 'Văn học', href: '/courses/literature' },
      { name: 'Sinh học', href: '/courses/biology' }
    ]
  },
  {
    title: 'Về chúng tôi',
    links: [
      { name: 'Giới thiệu', href: '/about' },
      { name: 'Giảng viên', href: '/teachers' },
      { name: 'Thành tựu', href: '/achievements' },
      { name: 'Tin tức', href: '/news' },
      { name: 'Tuyển dụng', href: '/careers' },
      { name: 'Liên hệ', href: '/contact' }
    ]
  },
  {
    title: 'Hỗ trợ',
    links: [
      { name: 'Câu hỏi thường gặp', href: '/faq' },
      { name: 'Hướng dẫn đăng ký', href: '/guide' },
      { name: 'Chính sách học phí', href: '/pricing-policy' },
      { name: 'Bảo mật thông tin', href: '/privacy' },
      { name: 'Điều khoản sử dụng', href: '/terms' },
      { name: 'Hỗ trợ kỹ thuật', href: '/support' }
    ]
  }
];

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/dmteducation',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/dmteducation',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/dmteducation',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/dmteducation',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </svg>
    )
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@dmteducation',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    )
  }
];

const ModernFooter: React.FC = () => {
  const logo = ImageGenerator.generateAvatar('DMT Education', 40);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Brand */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="flex items-center gap-2 mb-4">
                <motion.img
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  src={logo}
                  alt="DMT Education"
                  className="w-9 h-9 rounded-lg shadow-lg"
                />
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                    DMT Education
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">Nâng tầm tri thức</p>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <MapPinIcon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white mb-1">Cơ sở Gò Vấp:</div>
                    <div>Chung cư K26, Dương Quảng Hàm, Phường 7, Quận Gò Vấp, TP.HCM</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <MapPinIcon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white mb-1">Cơ sở Quận 12:</div>
                    <div>71/31 Song Hành, Phường Tân Hưng Thuận, Quận 12, TP.HCM</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <MapPinIcon className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white mb-1">Cơ sở Quận 3:</div>
                    <div>384/26 Nam Kỳ Khởi Nghĩa, Phường 8, Quận 3, TP.HCM</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs pt-2 border-t border-gray-800">
                  <PhoneIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="font-semibold text-white">Hotline: 077 230 5566</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <EnvelopeIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>example@dmteducation.vn</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <ClockIcon className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>T2-T6: 7:00 - 21:00 | T7-CN: 8:00 - 20:00</span>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-5">
                <p className="text-xs font-semibold text-white mb-2">Kết nối với chúng tôi</p>
                <div className="flex gap-2">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 bg-gray-800 hover:bg-gradient-to-br hover:from-red-600 hover:to-rose-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all shadow-lg"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Columns 2-4: Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
            >
              <h3 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-xs text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 pt-6 border-t border-gray-800"
        >
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-white font-bold mb-1.5 text-sm">
                Đăng ký nhận thông tin mới nhất
              </h3>
              <p className="text-xs text-gray-400">
                Nhận tin tức, khóa học mới và ưu đãi đặc biệt qua email
              </p>
            </div>
            <div>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                >
                  Đăng ký
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>


      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-xs text-gray-500 text-center md:text-left">
              © {currentYear} <span className="text-white font-semibold">DMT Education</span>. 
              All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
              <a href="/terms" className="text-gray-500 hover:text-white transition-colors">
                Điều khoản dịch vụ
              </a>
              <a href="/cookies" className="text-gray-500 hover:text-white transition-colors">
                Cookies
              </a>
              <a href="/sitemap" className="text-gray-500 hover:text-white transition-colors">
                Sơ đồ trang
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
