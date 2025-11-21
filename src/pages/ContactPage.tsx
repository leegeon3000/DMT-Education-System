import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { SEOHead } from '../components/common/OptimizedComponents';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gửi tin nhắn thất bại');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
      link: 'https://maps.google.com',
    },
    {
      icon: PhoneIcon,
      title: 'Điện thoại',
      content: '(028) 1234 5678',
      link: 'tel:+842812345678',
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'thefirestar312@gmail.com',
      link: 'mailto:thefirestar312@gmail.com',
    },
    {
      icon: ClockIcon,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Thứ 7: 8:00 - 20:00\nChủ nhật: 8:00 - 17:00',
      link: null,
    },
  ];

  const subjects = [
    'Tư vấn khóa học',
    'Đăng ký học thử',
    'Học phí và ưu đãi',
    'Chương trình học',
    'Lịch học và thời gian',
    'Khác',
  ];

  return (
    <>
      <SEOHead
        title="Liên hệ - DMT Education"
        description="Liên hệ với DMT Education để được tư vấn về các khóa học THCS & THPT. Đội ngũ tư vấn viên chuyên nghiệp sẵn sàng hỗ trợ bạn."
        keywords="liên hệ DMT, tư vấn khóa học, đăng ký học, hotline DMT Education"
      />

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Liên hệ với chúng tôi
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Đội ngũ tư vấn viên của DMT Education luôn sẵn sàng hỗ trợ bạn
                <br className="hidden sm:block" />
                Hãy để lại thông tin, chúng tôi sẽ liên hệ trong thời gian sớm nhất
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-gray-600 hover:text-blue-600 transition-colors whitespace-pre-line"
                            target={item.link.startsWith('http') ? '_blank' : undefined}
                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Form */}
                <div className="lg:col-span-3 p-8 lg:p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Gửi tin nhắn cho chúng tôi
                  </h2>

                  {/* Status Messages */}
                  {status === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                      <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900">Gửi thành công!</h4>
                        <p className="text-green-700 text-sm mt-1">
                          Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                        </p>
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <ExclamationCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-900">Có lỗi xảy ra</h4>
                        <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="email@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="0901234567"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                        Chủ đề <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      >
                        <option value="">Chọn chủ đề</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nội dung <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                        placeholder="Nhập nội dung bạn muốn tư vấn..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Đang gửi...
                        </span>
                      ) : (
                        'Gửi tin nhắn'
                      )}
                    </button>
                  </form>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-2 bg-gradient-to-br from-red-600 to-rose-700 p-8 lg:p-12 text-white">
                  <h3 className="text-2xl font-bold mb-6">
                    Thông tin hỗ trợ
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">⏰ Thời gian phản hồi</h4>
                      <p className="text-red-100">
                        Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">📞 Hotline hỗ trợ</h4>
                      <p className="text-red-100">
                        (028) 1234 5678
                        <br />
                        Sẵn sàng hỗ trợ 8:00 - 20:00 hàng ngày
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">🎓 Đăng ký học thử MIỄN PHÍ</h4>
                      <p className="text-red-100 mb-4">
                        Trải nghiệm phương pháp học tập hiện đại của DMT Education
                      </p>
                      <a
                        href="#"
                        className="inline-block bg-white text-red-600 font-semibold px-6 py-3 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Đăng ký ngay
                      </a>
                    </div>

                    <div className="pt-6 border-t border-red-500">
                      <h4 className="font-semibold text-lg mb-2">💬 Chat trực tuyến</h4>
                      <p className="text-red-100">
                        Kết nối với tư vấn viên qua Zalo, Facebook Messenger
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section (Optional) */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Vị trí của chúng tôi
            </h2>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-w-16 aspect-h-9 h-96">
                {/* Replace with actual Google Maps embed */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Google Maps sẽ hiển thị ở đây</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default ContactPage;
