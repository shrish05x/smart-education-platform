import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';
import { THEME_CSS } from '../theme';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={{ display:'flex', height:'100vh', background:'#0D0C1D', color:'#fff', overflowX:'hidden' }}>
      <style>{THEME_CSS}</style>

      {/* Faint god-ray behind sidebar */}
      <div style={{ position:'fixed', top:0, left:0, bottom:0, right:0, zIndex:0, pointerEvents:'none',
        background:'radial-gradient(ellipse 60% 50% at 0% 50%,rgba(172,106,255,0.05) 0%,transparent 70%)' }} />

      <DashboardSidebar
        isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden', position:'relative', zIndex:1 }}>
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ flex:1, overflowY:'auto', padding:'1.75rem 1.5rem' }}>
          <div style={{ maxWidth:1500, margin:'0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:40, backdropFilter:'blur(4px)' }}
          className="lg:hidden"/>
      )}
    </div>
  );
};

export default DashboardLayout;
