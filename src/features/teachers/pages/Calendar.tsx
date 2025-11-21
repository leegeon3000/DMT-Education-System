import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/userSlice';
import { SEOHead } from '../../../components/common';
import TeacherLayout from '../../../components/layout/TeacherLayout';
import teacherAPI, { ClassSchedule } from '../../../services/teacherAPI';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'class' | 'meeting' | 'event' | 'deadline';
  startDate: string;
  endDate: string;
  description: string;
  location?: string;
}

const Calendar: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadSchedule();
  }, [user?.teacher_id]);

  const loadSchedule = async () => {
    if (!user?.teacher_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await teacherAPI.getSchedule(user.teacher_id);
      
      if (data.length === 0) {
        const mockSchedules: ClassSchedule[] = [
          {
            id: '1',
            subject: 'Toán học',
            className: '10A',
            room: 'P101',
            startTime: '08:00',
            endTime: '09:40',
            dayOfWeek: 1,
            studentCount: 35
          },
          {
            id: '2',
            subject: 'Vật lý',
            className: '11B',
            room: 'P205',
            startTime: '10:00',
            endTime: '11:40',
            dayOfWeek: 1,
            studentCount: 32
          },
          {
            id: '3',
            subject: 'Toán học',
            className: '10B',
            room: 'P102',
            startTime: '14:00',
            endTime: '15:40',
            dayOfWeek: 2,
            studentCount: 38
          },
          {
            id: '4',
            subject: 'Vật lý',
            className: '11A',
            room: 'P205',
            startTime: '08:00',
            endTime: '09:40',
            dayOfWeek: 3,
            studentCount: 34
          }
        ];
        setSchedules(mockSchedules);
      } else {
        setSchedules(data);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Họp phụ huynh lớp 10A',
      type: 'meeting',
      startDate: '2025-08-16T14:00:00',
      endDate: '2025-08-16T16:00:00',
      description: 'Họp phụ huynh định kỳ',
      location: 'Phòng họp 1'
    },
    {
      id: '2',
      title: 'Hạn nộp bài tập Vật lý',
      type: 'deadline',
      startDate: '2025-08-18T23:59:00',
      endDate: '2025-08-18T23:59:00',
      description: 'Bài tập chương Động học'
    }
  ]);

  const getDaysOfWeek = () => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const getSchedulesForDay = (dayOfWeek: number) => {
    return schedules.filter(schedule => schedule.dayOfWeek === dayOfWeek);
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => 
      event.startDate.startsWith(dateStr)
    );
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'meeting': return 'bg-red-100 text-red-700 border-red-200';
      case 'event': return 'bg-green-100 text-green-700 border-green-200';
      case 'deadline': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const days = direction === 'next' ? 7 : -7;
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const weekDays = getWeekDays();

  return (
    <>
      <SEOHead 
        title="Lịch dạy - DMT Education"
        description="Lịch giảng dạy và các sự kiện của giáo viên"
        keywords="lịch dạy, lịch giảng dạy, thời khóa biểu"
      />
      
      <div style={{ padding: '24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CalendarIcon size={24} /> Lịch dạy & Sự kiện
              </h1>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Quản lý lịch giảng dạy và các sự kiện quan trọng
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={goToToday}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Hôm nay
              </button>
              
              <div style={{
                display: 'flex',
                backgroundColor: '#f1f5f9',
                borderRadius: '6px',
                padding: '4px'
              }}>
                <button
                  onClick={() => setViewMode('week')}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: viewMode === 'week' ? '#dc2626' : 'transparent',
                    color: viewMode === 'week' ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Tuần
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: viewMode === 'month' ? '#dc2626' : 'transparent',
                    color: viewMode === 'month' ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Tháng
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            backgroundColor: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => navigateWeek('prev')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ← Trước
            </button>
            
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1e293b'
            }}>
              Tuần {weekDays[0].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - {weekDays[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </h2>
            
            <button
              onClick={() => navigateWeek('next')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Sau →
            </button>
          </div>

          {/* Calendar Grid */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {/* Header Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0'
            }}>
              {weekDays.map((date, index) => (
                <div key={index} style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  borderRight: index < 6 ? '1px solid #e2e8f0' : 'none'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '4px'
                  }}>
                    {getDaysOfWeek()[index]}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: date.toDateString() === new Date().toDateString() ? '#dc2626' : '#1e293b'
                  }}>
                    {formatDate(date)}
                  </div>
                </div>
              ))}
            </div>

            {/* Content Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              minHeight: '400px'
            }}>
              {weekDays.map((date, dayIndex) => {
                const daySchedules = getSchedulesForDay(date.getDay());
                const dayEvents = getEventsForDate(date);
                
                return (
                  <div key={dayIndex} style={{
                    padding: '12px 8px',
                    borderRight: dayIndex < 6 ? '1px solid #e2e8f0' : 'none',
                    backgroundColor: date.toDateString() === new Date().toDateString() ? '#fef2f2' : 'transparent'
                  }}>
                    {/* Class Schedules */}
                    {daySchedules.map((schedule) => (
                      <div key={schedule.id} style={{
                        backgroundColor: '#dbeafe',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        padding: '8px',
                        marginBottom: '8px',
                        fontSize: '12px'
                      }}>
                        <div style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '2px' }}>
                          {schedule.subject} - {schedule.className}
                        </div>
                        <div style={{ color: '#374151' }}>
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={11} /> {schedule.room} • {schedule.studentCount} HS
                        </div>
                      </div>
                    ))}

                    {/* Events */}
                    {dayEvents.map((event) => (
                      <div key={event.id} style={{
                        border: '1px solid',
                        borderRadius: '6px',
                        padding: '8px',
                        marginBottom: '8px',
                        fontSize: '12px'
                      }} className={getEventTypeColor(event.type)}>
                        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                          {event.title}
                        </div>
                        <div style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {event.type === 'deadline' ? <CalendarIcon size={11} /> : <MapPin size={11} />} {event.description}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            gap: '24px',
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#dbeafe',
                border: '1px solid #bfdbfe',
                borderRadius: '4px'
              }}></div>
              <span style={{ fontSize: '14px', color: '#374151' }}>Lớp học</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#e9d5ff',
                border: '1px solid #c4b5fd',
                borderRadius: '4px'
              }}></div>
              <span style={{ fontSize: '14px', color: '#374151' }}>Họp</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#ffffffff',
                border: '1px solid #ffffffff',
                borderRadius: '4px'
              }}></div>
              <span style={{ fontSize: '14px', color: '#374151' }}>Deadline</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#bbf7d0',
                border: '1px solid #86efac',
                borderRadius: '4px'
              }}></div>
              <span style={{ fontSize: '14px', color: '#374151' }}>Sự kiện</span>
            </div>
          </div>
        </div>
    </>
  );
};

export default Calendar;
