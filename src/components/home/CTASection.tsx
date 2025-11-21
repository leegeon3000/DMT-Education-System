import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles } from 'lucide-react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { IllustrationGenerator, ImageGenerator } from '../../utils/imageGenerator';
import { fadeInUp, scaleIn } from '../../utils/animations';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const CTASection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nội dung phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('submitting');

    try {
      // Gửi data đến backend API
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        
        // Reset status after 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }
  };

  const successIllustration = IllustrationGenerator.generateIconIllustration('trophy', 200);
  const rocketIllustration = IllustrationGenerator.generateIconIllustration('star', 300);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
            Liên hệ với chúng tôi
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Bắt đầu hành trình của bạn ngay hôm nay
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Để lại thông tin và chúng tôi sẽ tư vấn miễn phí về lộ trình học tập phù hợp nhất cho bạn
          </p>
        </motion.div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden border border-gray-100">
              {/* Pattern background */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
                <img
                  src={ImageGenerator.generatePatternBackground('waves', '#3B82F6')}
                  alt="pattern"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Form content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Đăng ký tư vấn miễn phí
                </h3>
                <p className="text-gray-600 mb-6">
                  Điền thông tin và nhận tư vấn từ chuyên gia trong 24h
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                        className={`block w-full pl-12 pr-4 py-3 border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-500 flex items-center"
                      >
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                        className={`block w-full pl-12 pr-4 py-3 border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        placeholder="example@email.com"
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-500 flex items-center"
                      >
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                        className={`block w-full pl-12 pr-4 py-3 border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        placeholder="0123456789"
                      />
                    </div>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-500 flex items-center"
                      >
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </motion.p>
                    )}
                  </div>

                  {/* Message field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-4 pointer-events-none">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                        rows={4}
                        className={`block w-full pl-12 pr-4 py-3 border ${
                          errors.message ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
                        placeholder="Tôi muốn tìm hiểu về..."
                      />
                    </div>
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-500 flex items-center"
                      >
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        {errors.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={status === 'submitting'}
                    whileHover={status === 'idle' ? { scale: 1.02 } : {}}
                    whileTap={status === 'idle' ? { scale: 0.98 } : {}}
                    className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center ${
                      status === 'submitting'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-rose-600 hover:shadow-xl'
                    }`}
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        Gửi thông tin
                        <PaperAirplaneIcon className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Privacy note */}
                <p className="mt-4 text-xs text-gray-500 text-center">
                  Thông tin của bạn sẽ được bảo mật tuyệt đối theo chính sách bảo mật của chúng tôi
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right - Info & Illustration */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Illustration */}
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img
                  src={rocketIllustration}
                  alt="Rocket illustration"
                  className="w-full max-w-md mx-auto"
                />
              </motion.div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                {
                  title: 'Ưu đãi đặc biệt',
                  description: 'Nhận ngay voucher giảm giá lên đến 20% cho khóa học đầu tiên',
                  color: 'from-rose-500 to-rose-600'
                },
                {
                  title: 'Học thử miễn phí',
                  description: 'Trải nghiệm 1 buổi học miễn phí trước khi quyết định đăng ký',
                  color: 'from-pink-500 to-pink-600'
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center`}>
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success/Error Modal */}
      <AnimatePresence>
        {(status === 'success' || status === 'error') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setStatus('idle')}
          >
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              {status === 'success' ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mb-6"
                  >
                    <img
                      src={successIllustration}
                      alt="Success"
                      className="w-32 h-32 mx-auto"
                    />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                    Gửi thành công!
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã quan tâm đến DMT Education. Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStatus('idle')}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Đóng
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircleIcon className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Có lỗi xảy ra
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Không thể gửi thông tin. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStatus('idle')}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Đóng
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CTASection;
