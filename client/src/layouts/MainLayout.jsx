import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { THEME_CSS } from '../theme';

const MainLayout = () => (
  <div style={{ minHeight:'100vh', background:'#0D0C1D', color:'#fff', overflowX:'hidden' }}>
    <style>{THEME_CSS}</style>
    <div className="god-ray-l" />
    <div className="god-ray-r" />
    <Navbar />
    <main style={{ paddingTop:80 }}>
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
