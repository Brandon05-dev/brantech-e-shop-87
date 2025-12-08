import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { cn } from '@/lib/utils';

const AdminLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Brantech Electronics</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main
          className={cn(
            'min-h-screen transition-all duration-300',
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          )}
        >
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
