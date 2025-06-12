import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import LogoutDialog from '../components/LogoutDialog';
import MenuBackground from '../components/MenuBackground';
import '../styles/overview.css';

const OverviewMainPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.body.classList.contains('dark-theme')
  );
  
  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('dark-theme'));
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  };

  return (
    <div className={`overview-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <MenuBackground />
      <div className="overview-header">
        <button 
          onClick={() => navigate('/dashboard')}
          className="back-link"
        >
          <ArrowLeft size={16} />
          <span>Volver al menú</span>
        </button>
        <h1 className="overview-title">
          Overview de cuentas
        </h1>
        <div className="header-right">
          <Logo />
        </div>
      </div>

      <button 
        className="logout-button"
        onClick={() => setShowLogoutDialog(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '20px',
          fontSize: '0.875rem',
          cursor: 'pointer',
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          ...(isDarkMode ? {
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: 'rgba(255, 255, 255, 0.7)'
          } : {
            background: 'rgba(253, 253, 254, 0.95)',
            color: '#0171E2',
            border: '2px solid #0171E2',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
          })
        }}
      >
        <LogOut size={16} />
        <span>Cerrar sesión</span>
      </button>

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={() => navigate('/')}
      />

      <div className={`overview-buttons ${isVisible ? 'visible' : ''}`}>
        <button 
          className="overview-button" 
          onClick={() => navigate('/construction')}
        >
          <LayoutDashboard size={24} className="button-icon" />
          <span className="button-text">Overview General</span>
        </button>
        <button 
          className="overview-button" 
          onClick={() => navigate('/overview')}
        >
          <Settings size={24} className="button-icon" />
          <span className="button-text">Seteo de cuentas</span>
        </button>
      </div>
    </div>
  );
};

export default OverviewMainPage;