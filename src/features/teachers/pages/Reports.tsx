import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/userSlice';
import { SEOHead } from '../../../components/common';
import TeacherLayout from '../../../components/layout/TeacherLayout';
import teacherAPI, { TeachingReport } from '../../../services/teacherAPI';
import { BarChart3, School, Users, CheckCircle, ClipboardList, GraduationCap, Target, FileSpreadsheet } from 'lucide-react';

interface StudentProgress {
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  currentScore: number;
  improvement: number;
  attendance: number;
  submissionRate: number;
}

interface ClassSummary {
  className: string;
  subject: string;
  totalStudents: number;
  avgScore: number;
  passRate: number;
  attendanceRate: number;
  completionRate: number;
}

const Reports: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'classes'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('2025-08');
  const [monthlyReports, setMonthlyReports] = useState<TeachingReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [user?.teacher_id]);

  const loadReports = async () => {
    if (!user?.teacher_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await teacherAPI.getTeachingReports(user.teacher_id);
      
      if (data.length === 0) {
        const mockReports: TeachingReport[] = [
          {
            id: '1',
            month: '2025-08',
            totalClasses: 45,
            totalHours: 68,
            studentsCount: 156,
            avgAttendance: 92.5,
            assignmentsGiven: 12,
            avgScore: 7.8
          },
          {
            id: '2',
            month: '2025-07',
            totalClasses: 52,
            totalHours: 78,
            studentsCount: 148,
            avgAttendance: 89.2,
            assignmentsGiven: 15,
            avgScore: 7.5
          },
          {
            id: '3',
            month: '2025-06',
            totalClasses: 48,
            totalHours: 72,
            studentsCount: 152,
            avgAttendance: 91.8,
            assignmentsGiven: 13,
            avgScore: 7.6
          }
        ];
        setMonthlyReports(mockReports);
      } else {
        setMonthlyReports(data);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const [studentProgress] = useState<StudentProgress[]>([
    {
      studentId: '1',
      studentName: 'Nguyễn Văn An',
      className: '10A',
      subject: 'Toán học',
      currentScore: 8.5,
      improvement: 12,
      attendance: 95,
      submissionRate: 100
    },
    {
      studentId: '2',
      studentName: 'Trần Thị Bình',
      className: '10A',
      subject: 'Toán học',
      currentScore: 7.2,
      improvement: -5,
      attendance: 88,
      submissionRate: 85
    },
    {
      studentId: '3',
      studentName: 'Lê Minh Cường',
      className: '11B',
      subject: 'Vật lý',
      currentScore: 9.0,
      improvement: 8,
      attendance: 92,
      submissionRate: 95
    },
    {
      studentId: '4',
      studentName: 'Phạm Thị Dung',
      className: '11B',
      subject: 'Vật lý',
      currentScore: 6.8,
      improvement: -2,
      attendance: 85,
      submissionRate: 78
    }
  ]);

  const [classSummaries] = useState<ClassSummary[]>([
    {
      className: '10A',
      subject: 'Toán học',
      totalStudents: 35,
      avgScore: 7.8,
      passRate: 85.7,
      attendanceRate: 91.5,
      completionRate: 92.3
    },
    {
      className: '10B',
      subject: 'Toán học',
      totalStudents: 38,
      avgScore: 7.5,
      passRate: 82.1,
      attendanceRate: 89.2,
      completionRate: 88.9
    },
    {
      className: '11A',
      subject: 'Vật lý',
      totalStudents: 34,
      avgScore: 8.1,
      passRate: 88.2,
      attendanceRate: 93.1,
      completionRate: 94.1
    },
    {
      className: '11B',
      subject: 'Vật lý',
      totalStudents: 32,
      avgScore: 7.9,
      passRate: 87.5,
      attendanceRate: 90.8,
      completionRate: 91.7
    }
  ]);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `Tháng ${month}/${year}`;
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return '#22c55e';
    if (improvement < 0) return '#ef4444';
    return '#64748b';
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#22c55e';
    if (score >= 6.5) return '#f59e0b';
    return '#ef4444';
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return '#22c55e';
    if (percentage >= 80) return '#f59e0b';
    return '#ef4444';
  };

  const exportReport = () => {
    // Handle export functionality
    console.log('Exporting report...');
  };

  const currentReport = monthlyReports.find(r => r.month === selectedPeriod) || monthlyReports[0];

  return (
    <>
      <SEOHead 
        title="Báo cáo - DMT Education"
        description="Báo cáo giảng dạy và thống kê học sinh"
        keywords="báo cáo, thống kê, kết quả học tập"
      />
      
      <div style={{ padding: '24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '4px'
              }}>
                Báo cáo & Thống kê
              </h1>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Tổng hợp kết quả giảng dạy và học tập
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#fff'
                }}
              >
                {monthlyReports.map((report) => (
                  <option key={report.id} value={report.month}>
                    {formatMonth(report.month)}
                  </option>
                ))}
              </select>
              
              <button
                onClick={exportReport}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FileSpreadsheet size={16} /> Xuất báo cáo
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                    Tổng lớp dạy
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                    {currentReport.totalClasses}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    {currentReport.totalHours} giờ học
                  </p>
                </div>
                <div style={{ color: '#3b82f6' }}><School size={32} /></div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                    Tổng học sinh
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                    {currentReport.studentsCount}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    Có mặt: {currentReport.avgAttendance}%
                  </p>
                </div>
                <div style={{ color: '#10b981' }}><Users size={32} /></div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                    Điểm trung bình
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: getScoreColor(currentReport.avgScore) }}>
                    {currentReport.avgScore}/10
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    {currentReport.assignmentsGiven} bài tập
                  </p>
                </div>
                <div style={{ color: '#f59e0b' }}><BarChart3 size={32} /></div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                    Tỷ lệ có mặt
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: getPercentageColor(currentReport.avgAttendance) }}>
                    {currentReport.avgAttendance}%
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    Tháng này
                  </p>
                </div>
                <div style={{ color: '#22c55e' }}><CheckCircle size={32} /></div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            borderRadius: '8px',
            padding: '4px',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: activeTab === 'overview' ? '#dc2626' : 'transparent',
                color: activeTab === 'overview' ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <ClipboardList size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('students')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: activeTab === 'students' ? '#dc2626' : 'transparent',
                color: activeTab === 'students' ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <GraduationCap size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Học sinh
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: activeTab === 'classes' ? '#dc2626' : 'transparent',
                color: activeTab === 'classes' ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <School size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Lớp học
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                  Báo cáo tháng {formatMonth(selectedPeriod)}
                </h2>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Monthly Trend */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                      Xu hướng 3 tháng
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {monthlyReports.slice(0, 3).map((report) => (
                        <div key={report.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                            {formatMonth(report.month)}
                          </span>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                            <span style={{ color: '#64748b' }}>
                              {report.totalClasses} lớp
                            </span>
                            <span style={{ color: getScoreColor(report.avgScore) }}>
                              {report.avgScore} điểm
                            </span>
                            <span style={{ color: getPercentageColor(report.avgAttendance) }}>
                              {report.avgAttendance}% có mặt
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Summary */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Target size={18} /> Hiệu suất giảng dạy
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: '#f0fdf4',
                        borderRadius: '6px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <span style={{ fontSize: '14px', color: '#166534' }}>Lớp có điểm TB ≥ 8.0</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#166534' }}>2/4 lớp</span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: '#fffbeb',
                        borderRadius: '6px',
                        border: '1px solid #fed7aa'
                      }}>
                        <span style={{ fontSize: '14px', color: '#92400e' }}>Tỷ lệ có mặt TB</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#92400e' }}>91.1%</span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '6px',
                        border: '1px solid #bfdbfe'
                      }}>
                        <span style={{ fontSize: '14px', color: '#1e40af' }}>Bài tập hoàn thành</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e40af' }}>89.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                  Tiến độ học sinh
                </h2>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                          Học sinh
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                          Lớp
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                          Môn học
                        </th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                          Điểm hiện tại
                        </th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                          Tiến bộ
                        </th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                          Có mặt
                        </th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                          Nộp bài
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentProgress.map((student) => (
                        <tr key={student.studentId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px', fontSize: '14px', color: '#1e293b' }}>
                            {student.studentName}
                          </td>
                          <td style={{ padding: '12px', fontSize: '14px', color: '#64748b' }}>
                            {student.className}
                          </td>
                          <td style={{ padding: '12px', fontSize: '14px', color: '#64748b' }}>
                            {student.subject}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: getScoreColor(student.currentScore)
                            }}>
                              {student.currentScore}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: getImprovementColor(student.improvement)
                            }}>
                              {student.improvement > 0 ? '+' : ''}{student.improvement}%
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              fontSize: '14px',
                              color: getPercentageColor(student.attendance)
                            }}>
                              {student.attendance}%
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              fontSize: '14px',
                              color: getPercentageColor(student.submissionRate)
                            }}>
                              {student.submissionRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'classes' && (
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                  Tổng kết lớp học
                </h2>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px'
                }}>
                  {classSummaries.map((classData, index) => (
                    <div key={index} style={{
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc'
                    }}>
                      <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                          {classData.className} - {classData.subject}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#64748b' }}>
                          {classData.totalStudents} học sinh
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', color: '#374151' }}>Điểm trung bình</span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: getScoreColor(classData.avgScore)
                          }}>
                            {classData.avgScore}/10
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', color: '#374151' }}>Tỷ lệ đậu</span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: getPercentageColor(classData.passRate)
                          }}>
                            {classData.passRate}%
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', color: '#374151' }}>Tỷ lệ có mặt</span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: getPercentageColor(classData.attendanceRate)
                          }}>
                            {classData.attendanceRate}%
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', color: '#374151' }}>Hoàn thành bài tập</span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: getPercentageColor(classData.completionRate)
                          }}>
                            {classData.completionRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}
        </div>
    </>
  );
};

export default Reports;