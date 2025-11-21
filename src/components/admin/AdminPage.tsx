import React from 'react';
import AdminLayout from './AdminLayoutNew';
import AdminDashboard from './AdminDashboard';

const AdminPage: React.FC = () => {
  return (
    <AdminLayout currentPage="dashboard">
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminPage;
