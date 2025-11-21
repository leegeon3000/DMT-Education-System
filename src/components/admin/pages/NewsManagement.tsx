import React, { useState, useEffect } from 'react';
import { Star, Pencil, Upload, Download, Trash2 } from 'lucide-react';
import { newsApi, News, CreateNewsData, UpdateNewsData } from '../../../services/news';

const NewsManagement: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'news' | 'announcement' | 'event'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  const [formData, setFormData] = useState<CreateNewsData>({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    type: 'news',
    status: 'draft',
    is_featured: false,
  });

  useEffect(() => {
    fetchNews();
  }, [filterType, filterStatus]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, limit: 50 };
      if (filterType !== 'all') params.type = filterType;
      if (filterStatus !== 'all') params.status = filterStatus;

      const response = await newsApi.getAll(params);
      setNews(response.data);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      alert('Không thể tải danh sách tin tức');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await newsApi.update(editingNews.id, formData as UpdateNewsData);
        alert('Cập nhật tin tức thành công!');
      } else {
        await newsApi.create(formData);
        alert('Tạo tin tức thành công!');
      }
      setShowModal(false);
      resetForm();
      fetchNews();
    } catch (error: any) {
      console.error('Failed to save news:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin tức này?')) return;
    try {
      await newsApi.delete(id);
      alert('Xóa thành công!');
      fetchNews();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Không thể xóa tin tức');
    }
  };

  const handlePublish = async (id: number, publish: boolean) => {
    try {
      await newsApi.publish(id, publish);
      alert(publish ? 'Đã xuất bản!' : 'Đã hủy xuất bản!');
      fetchNews();
    } catch (error) {
      console.error('Failed to publish:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const handleFeature = async (id: number, featured: boolean) => {
    try {
      await newsApi.feature(id, featured);
      alert(featured ? 'Đã đánh dấu nổi bật!' : 'Đã bỏ nổi bật!');
      fetchNews();
    } catch (error) {
      console.error('Failed to feature:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingNews(null);
    setShowModal(true);
  };

  const openEditModal = (item: News) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt || '',
      content: item.content,
      image_url: item.image_url || '',
      type: item.type,
      status: item.status,
      is_featured: item.is_featured,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image_url: '',
      type: 'news',
      status: 'draft',
      is_featured: false,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#10b981';
      case 'draft': return '#f59e0b';
      case 'archived': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'news': return 'Tin tức';
      case 'announcement': return 'Thông báo';
      case 'event': return 'Sự kiện';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Đã xuất bản';
      case 'draft': return 'Bản nháp';
      case 'archived': return 'Lưu trữ';
      default: return status;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            Quản lý Tin tức & Thông báo
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Quản lý tin tức, thông báo và sự kiện của trung tâm
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}
        >
          + Tạo tin tức mới
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div>
          <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
            Loại:
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">Tất cả</option>
            <option value="news">Tin tức</option>
            <option value="announcement">Thông báo</option>
            <option value="event">Sự kiện</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
            Trạng thái:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">Tất cả</option>
            <option value="draft">Bản nháp</option>
            <option value="published">Đã xuất bản</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </div>
      </div>

      {/* News List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Đang tải...
        </div>
      ) : news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Không có tin tức nào
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {news.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ display: 'flex', gap: '20px' }}>
                {/* Image */}
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      flexShrink: 0
                    }}
                  />
                )}

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      background: getStatusColor(item.status) + '20',
                      color: getStatusColor(item.status),
                      fontWeight: '600'
                    }}>
                      {getStatusLabel(item.status)}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      background: '#f3f4f6',
                      color: '#374151',
                      fontWeight: '600'
                    }}>
                      {getTypeLabel(item.type)}
                    </span>
                    {item.is_featured && (
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        background: '#fef3c7',
                        color: '#92400e',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Star className="w-3 h-3" fill="currentColor" />
                        Nổi bật
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: '#111827'
                  }}>
                    {item.title}
                  </h3>

                  {item.excerpt && (
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.excerpt}
                    </p>
                  )}

                  <div style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginBottom: '16px'
                  }}>
                    {item.published_at
                      ? `Xuất bản: ${new Date(item.published_at).toLocaleString('vi-VN')}`
                      : `Tạo: ${new Date(item.created_at).toLocaleString('vi-VN')}`}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => openEditModal(item)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                      Sửa
                    </button>

                    {item.status === 'draft' ? (
                      <button
                        onClick={() => handlePublish(item.id, true)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: '1px solid #10b981',
                          background: '#10b981',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Upload className="w-4 h-4" />
                        Xuất bản
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePublish(item.id, false)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: '1px solid #f59e0b',
                          background: '#f59e0b',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Hủy xuất bản
                      </button>
                    )}

                    <button
                      onClick={() => handleFeature(item.id, !item.is_featured)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px solid #fbbf24',
                        background: item.is_featured ? '#fbbf24' : 'white',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        color: item.is_featured ? 'white' : '#92400e',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Star className="w-4 h-4" fill={item.is_featured ? 'currentColor' : 'none'} />
                      {item.is_featured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px solid #ef4444',
                        background: 'white',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
              {editingNews ? 'Chỉnh sửa tin tức' : 'Tạo tin tức mới'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px'
                  }}
                  placeholder="Nhập tiêu đề..."
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Tóm tắt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Tóm tắt ngắn gọn..."
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Nội dung *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Nhập nội dung chi tiết..."
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px'
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Loại *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px'
                    }}
                  >
                    <option value="news">Tin tức</option>
                    <option value="announcement">Thông báo</option>
                    <option value="event">Sự kiện</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Trạng thái *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px'
                    }}
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Xuất bản</option>
                    <option value="archived">Lưu trữ</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    Đánh dấu là nổi bật
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: '#374151'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                >
                  {editingNews ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;
