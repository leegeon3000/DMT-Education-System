import React, { useState } from 'react';
import { SEOHead } from '../../../components/common';
import { 
  LifeBuoy, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Book,
  Headphones,
  FileText,
  Users,
  TrendingUp,
  Video
} from 'lucide-react';

interface SupportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  link: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const Support: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const supportCategories: SupportCategory[] = [
    {
      id: 'tickets',
      title: 'Quản lý Tickets',
      description: 'Xem và xử lý yêu cầu hỗ trợ từ học viên',
      icon: MessageCircle,
      color: 'blue-600',
      link: '/staff/tickets'
    },
    {
      id: 'live-chat',
      title: 'Chat trực tiếp',
      description: 'Hỗ trợ học viên qua chat realtime',
      icon: Headphones,
      color: 'green-600',
      link: '#'
    },
    {
      id: 'knowledge',
      title: 'Cơ sở tri thức',
      description: 'Tài liệu hướng dẫn và giải đáp thắc mắc',
      icon: Book,
      color: 'cyan-600',
      link: '#'
    },
    {
      id: 'video-call',
      title: 'Video tư vấn',
      description: 'Hỗ trợ qua video call cho vấn đề phức tạp',
      icon: Video,
      color: 'orange-600',
      link: '#'
    },
  ];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'Làm thế nào để reset mật khẩu cho học viên?',
      answer: 'Truy cập phần Quản lý học viên > Tìm học viên > Click "Reset mật khẩu". Mật khẩu mới sẽ được gửi qua email.',
      category: 'Tài khoản'
    },
    {
      id: 2,
      question: 'Quy trình xử lý yêu cầu hoàn tiền?',
      answer: 'Kiểm tra điều kiện hoàn tiền theo chính sách > Gửi yêu cầu lên phòng Tài chính > Theo dõi trạng thái trong hệ thống.',
      category: 'Thanh toán'
    },
    {
      id: 3,
      question: 'Cách xử lý khi học viên không nhận được email xác nhận?',
      answer: 'Kiểm tra email trong hệ thống > Xác nhận email chính xác > Gửi lại email xác nhận > Hướng dẫn học viên kiểm tra spam folder.',
      category: 'Kỹ thuật'
    },
    {
      id: 4,
      question: 'Làm sao để chuyển học viên sang lớp khác?',
      answer: 'Vào Quản lý đăng ký lớp > Chọn học viên > Edit > Chọn lớp mới > Kiểm tra trùng lịch > Xác nhận chuyển lớp.',
      category: 'Học vụ'
    },
  ];

  const stats = [
    { label: 'Tickets hôm nay', value: '24', icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Đang xử lý', value: '12', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Đã giải quyết', value: '156', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Tỷ lệ hài lòng', value: '94%', icon: TrendingUp, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  ];

  const contactMethods = [
    { icon: Phone, label: 'Hotline', value: '1800-xxxx', color: 'text-green-600' },
    { icon: Mail, label: 'Email', value: 'support@dmt.edu.vn', color: 'text-blue-600' },
    { icon: MessageCircle, label: 'Zalo', value: '0xxx-xxx-xxx', color: 'text-cyan-600' },
  ];

  return (
    <>
      <SEOHead
        title="Hỗ trợ - DMT Education"
        description="Trung tâm hỗ trợ nhân viên"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Trung tâm hỗ trợ
            </h1>
            <p className="text-gray-600 mt-1">Công cụ và tài nguyên để hỗ trợ học viên hiệu quả</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                    </div>
                    <div className={`p-3 ${stat.bg} rounded-lg`}>
                      <Icon size={24} className={stat.color} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Support Categories */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kênh hỗ trợ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <a
                    key={category.id}
                    href={category.link}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group cursor-pointer"
                  >
                    <div className={`w-12 h-12 bg-${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </a>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle size={20} className="text-blue-600" />
                        <span className="font-medium text-gray-900 text-left">{faq.question}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {faq.category}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Liên hệ hỗ trợ</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon size={20} className={method.color} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{method.label}</p>
                        <p className="font-semibold text-gray-900">{method.value}</p>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3 mb-3">
                    <Clock size={20} className="text-orange-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Giờ làm việc</p>
                      <p className="text-sm text-gray-600 mt-1">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                      <p className="text-sm text-gray-600">Thứ 7: 8:00 - 12:00</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={18} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Lưu ý</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Vấn đề khẩn cấp vui lòng gọi hotline để được hỗ trợ nhanh nhất
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Tài liệu hướng dẫn</h3>
                <div className="space-y-2">
                  <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                    <FileText size={16} />
                    <span>Hướng dẫn xử lý ticket</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                    <FileText size={16} />
                    <span>Quy trình hoàn tiền</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                    <FileText size={16} />
                    <span>Chính sách học vụ</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                    <Users size={16} />
                    <span>Quy định chăm sóc khách hàng</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;