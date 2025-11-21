import React, { useState, useEffect } from 'react';
import { Icons } from '../common/Icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { newsApi, News } from '../../services/news';

const AnnouncementBanner: React.FC = () => {
  const [announcements, setAnnouncements] = useState<News[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await newsApi.getAll({
          type: 'announcement',
          is_featured: true,
          status: 'published',
          limit: 10,
          page: 1
        });
        setAnnouncements(response.data);
      } catch (err) {
        console.error('Failed to load announcements:', err);
        // Không hiển thị error, chỉ ẩn banner nếu không có data
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Auto-rotation every 5 seconds
  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  // Don't render if loading or no announcements
  if (loading || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className="fade-in-up" style={{
      background: COLORS.backgrounds.announcement,
      padding: SPACING.md + ' 0',
      textAlign: 'center',
      fontSize: TYPOGRAPHY.fontSize.base,
      fontWeight: TYPOGRAPHY.fontWeight.medium,
      color: '#92400e',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: SPACING.container.maxWidth,
        margin: SPACING.container.margin,
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.lg,
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: TYPOGRAPHY.fontSize.xl }}>
          <Icons.Celebration />
        </span>
        <span style={{ flex: '1 1 auto', minWidth: '300px' }}>
          {currentAnnouncement.title}
        </span>
        <button className="hover-scale" style={{
          background: COLORS.primary.main,
          color: COLORS.neutral.white,
          padding: `${SPACING.xs} ${SPACING.lg}`,
          borderRadius: SPACING.lg,
          border: 'none',
          fontSize: TYPOGRAPHY.fontSize.xs,
          fontWeight: TYPOGRAPHY.fontWeight.semibold,
          cursor: 'pointer'
        }}>
          Xem chi tiết
        </button>
      </div>

      {/* Pagination Dots */}
      {announcements.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '12px'
        }}>
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentIndex ? '#92400e' : '#d1d5db',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease'
              }}
              aria-label={`Go to announcement ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementBanner;

