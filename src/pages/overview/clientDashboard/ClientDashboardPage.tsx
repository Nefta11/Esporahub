import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Handshake, Settings, Presentation } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { hasPermission } from '@/data/users';
import PageHeader from '@/components/generals/PageHeader';
import PageFooter from '@/components/generals/PageFooter';
import AccessDeniedModal from '@/components/generals/AccessDeniedModal';
import '@/styles/client-dashboard.css';

const ClientDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [clientName, setClientName] = useState('');
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [deniedFeature, setDeniedFeature] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains('dark-theme')
  );
  const { user } = useAuthStore();

  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  };

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
      icon: <FileText size={32} />,
      color: '#007AFF',
      path: '/expediente-electronico'
    },
    {
      id: 'acuerdo',
      label: 'Acuerdo de colaboración',
      icon: <Handshake size={32} />,
      color: '#34C759',
      path: '/construction'
    },
    {
      id: 'eho',
      label: 'EHO',
      icon: <Settings size={32} />,
      color: '#AF52DE',
      path: '/account'
    },
    {
      id: 'presentacion',
      label: 'Presentación inicial',
      icon: <Presentation size={32} />,
      color: '#FF9500',
      path: '/construction'
    }
  ];

  const handleMenuItemClick = (item: typeof menuItems[0]) => {
    // Verificar permisos según la sección
    if (item.id === 'eho' && (!user || !hasPermission(user, 'edit_checklist'))) {
      setDeniedFeature('EHO (Engagement Hands-Off)');
      setShowAccessDeniedModal(true);
      return;
    }

    // Si tiene permisos o no se requieren permisos especiales para esta sección
    switch (item.id) {
      case 'expediente':
        navigate('/expediente-electronico', { state: { clientName } });
        break;
      case 'acuerdo':
        navigate('/account', { state: { clientName } });
        break;
      case 'eho':
        navigate('/eho', { state: { clientName } });
        break;
      case 'presentacion':
        navigate('/presentacion-inicial', { state: { clientName } });
        break;
      default:
        navigate(item.path);
        break;
    }
  };

  return (
    <div className={`client-dashboard-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title={clientName ? clientName.split(' - ')[0] : "Dashboard del Cliente"}
        subtitle={clientName ? clientName.split(' - ')[1] : "Gestión de servicios y documentos"}
        backButtonText="Menú"
        backButtonPath="/dashboard"
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        userAvatarSize="md"
        showUserName={true}
      />

      {/* Main Content */}
      <main className={`client-dashboard-main-content ${isVisible ? 'visible' : ''}`}>
        <div className="client-dashboard-content-container">
          {/* Services Section */}
          <section className="client-dashboard-services-section">
            <div className="client-dashboard-section-header">
              <h2>Servicios disponibles</h2>
              <p>Selecciona un servicio para continuar</p>
            </div>

            <div className="client-dashboard-grid">
              {menuItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`client-dashboard-card ${item.id}`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                  onClick={() => handleMenuItemClick(item)}
                >
                  {/* Service Icon */}
                  <div className="client-dashboard-icon">
                    <div className="client-dashboard-icon-content">
                      {React.cloneElement(item.icon as React.ReactElement, { size: 32 })}
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="client-dashboard-info">
                    <h3 className="client-dashboard-title">{item.label}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <PageFooter
        showLogoutDialog={showLogoutDialog}
        onLogoutClick={() => setShowLogoutDialog(true)}
        onLogoutDialogClose={() => setShowLogoutDialog(false)}
      />

      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => setShowAccessDeniedModal(false)}
        featureName={deniedFeature}
      />
    </div>
  );
};

export default ClientDashboardPage;