import React from 'react';
import { Calendar, RefreshCw, User } from 'lucide-react';

interface TicketItemProps {
  ticket: {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
    assignedTo?: string;
  };
  onClick?: () => void;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return '#10B981';
      case 'in-progress': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Mở';
      case 'in-progress': return 'Đang xử lý';
      case 'closed': return 'Đã đóng';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      default: return priority;
    }
  };

  return (
    <div 
      onClick={onClick}
      style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E5E7EB',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        marginBottom: '1rem'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: '600', 
            color: '#111827',
            margin: '0 0 0.5rem 0'
          }}>
            {ticket.title}
          </h3>
          <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
            ID: #{ticket.id}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: getPriorityColor(ticket.priority) + '20',
            color: getPriorityColor(ticket.priority)
          }}>
            {getPriorityText(ticket.priority)}
          </span>
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: getStatusColor(ticket.status) + '20',
            color: getStatusColor(ticket.status)
          }}>
            {getStatusText(ticket.status)}
          </span>
        </div>
      </div>
      
      {/* Description */}
      <p style={{ 
        color: '#4B5563', 
        fontSize: '0.9rem',
        margin: '0 0 1rem 0',
        lineHeight: '1.5'
      }}>
        {ticket.description}
      </p>
      
      {/* Footer */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem', 
        color: '#9CA3AF',
        paddingTop: '1rem',
        borderTop: '1px solid #F3F4F6'
      }}>
        <div>
          <div style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} /> Tạo: {new Date(ticket.createdAt).toLocaleString('vi-VN')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={14} /> Cập nhật: {new Date(ticket.updatedAt).toLocaleString('vi-VN')}
          </div>
        </div>
        
        {ticket.assignedTo && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              padding: '0.25rem 0.5rem',
              backgroundColor: '#F3F4F6',
              borderRadius: '4px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <User size={14} /> {ticket.assignedTo}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketItem;
