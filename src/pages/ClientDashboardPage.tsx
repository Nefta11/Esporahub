import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, FileText, Handshake, Settings, Presentation } from 'lucide-react';
import Logo from '../components/Logo';
import LogoutDialog from '../components/LogoutDialog';
import MenuBackground from '../components/MenuBackground';
import '../styles/overview.css';

const ClientDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [clientName, setClientName] = useState('');
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
    // Get client name from location state if available
    const state = location.state as { clientName?: string };
    if (state?.clientName) {
      setClientName(state.clientName);
    }
  }, [location]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const menuItems = [
    {
      id: 'expediente',
      label: 'Expediente electrónico',
      icon: <FileText size={35} className="text-blue-500" />,
      path: '/expediente-electronico'
    },
    {
      id: 'acuerdo',
      label: 'Acuerdo de colaboración',
      icon: <Handshake size={35} className="text-emerald-500" />,
      path: '/construction'
    },
    {
      id: 'eho',
      label: 'EHO',
      icon: <Settings size={35} className="text-purple-500" />,
      path: '/account'
    },
    {
      id: 'presentacion',
      label: 'Presentación inicial',
      icon: <Presentation size={35} className="text-orange-500" />,
      path: '/construction'
    }
  ];

  const handleMenuItemClick = (item: typeof menuItems[0]) => {
    if (item.id === 'expediente') {
      // Expediente electrónico lleva a su propia página
      navigate('/expediente-electronico', { state: { clientName } });
    } else if (item.id === 'acuerdo') {
      // Acuerdo de colaboración lleva a la configuración de servicios (account)
      navigate('/account', { state: { clientName } });
    } else if (item.id === 'eho') {
      // EHO lleva directamente al checklist de captura
      navigate('/checklist-captura', { state: { clientName } });
    } else if (item.id === 'presentacion') {
      // Presentación inicial lleva a su propia página
      navigate('/presentacion-inicial', { state: { clientName } });
    } else {
      // Los demás van a construcción por ahora
      navigate(item.path);
    }
  };

  return (
    <div className={`overview-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <MenuBackground />
      <div className="overview-header">
        <div className="overview-breadcrumb-container">
          <span className="overview-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="overview-breadcrumb-link"
          >
            Menú
          </button>
          <span className="overview-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview-main')}
            className="overview-breadcrumb-link"
          >
            Overview
          </button>
          <span className="overview-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview')}
            className="overview-breadcrumb-link"
          >
            Configuración
          </button>
          <span className="overview-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/select-account')}
            className="overview-breadcrumb-link"
          >
            Seleccionar
          </button>
        </div>
        <div className="client-title-container">
          {clientName ? (
            <>
              <h1 className="client-name-line">
                {clientName.split(' - ')[0]}
              </h1>
              <h2 className="client-position-line">
                {clientName.split(' - ')[1]}
              </h2>
            </>
          ) : (
            <h1 className="overview-title">Dashboard del Cliente</h1>
          )}
        </div>
        <div className="header-right">
          <Logo />
        </div>
      </div>

      <div className={`overview-menu-grid ${isVisible ? 'visible' : ''}`} style={{ 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '1rem',
        maxWidth: '800px',
        flexWrap: 'nowrap'
      }}>
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item-wrapper">
            <button
              className="menu-item"
              onClick={() => handleMenuItemClick(item)}
            >
              <div className="menu-item-icon">
                {item.icon}
              </div>
            </button>
            <span className="menu-item-label">{item.label}</span>
          </div>
        ))}
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
    </div>
  );
};

export default ClientDashboardPage;