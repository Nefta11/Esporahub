import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, UserX, Settings } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import '@/styles/overview/overview-main.css';

const OverviewMainPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains('dark-theme')
  );

  const overviewItems = [
    {
      id: 'active-accounts',
      label: 'Cuentas activas',
      icon: <UserCheck size={24} />,
      color: '#34C759',
      path: '/cuentas-activas',
      description: 'Gestionar cuentas activas del sistema',
      count: 4,
      status: 'success'
    },
    {
      id: 'inactive-accounts',
      label: 'Cuentas inactivas',
      icon: <UserX size={24} />,
      color: '#FF3B30',
      path: '/cuentas-inactivas',
      description: 'Revisar y reactivar cuentas',
      count: 2,
      status: 'warning'
    },
    {
      id: 'account-config',
      label: 'Configuración de cuentas',
      icon: <Settings size={24} />,
      color: '#007AFF',
      path: '/configuracion-cuenta',
      description: 'Crear y configurar nuevas cuentas',
      count: 0,
      status: 'info'
    }
  ];

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

  const handleItemClick = (item: typeof overviewItems[0]) => {
    navigate(item.path);
  };

  return (
    <div className={`overview-main-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title="Overview de cuentas"
        subtitle="Gestión centralizada de todas las cuentas"
        backButtonText="Menú"
        backButtonPath="/dashboard"
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        userAvatarSize="md"
        showUserName={true}
      />

      {/* Main Content */}
      <main className={`overview-main-content ${isVisible ? 'visible' : ''}`}>
        <div className="overview-content-container">

          {/* Action Cards */}
          <section className="overview-actions-section">
            <div className="overview-section-header">
              <h2>Acciones disponibles</h2>
              <p>Selecciona una opción para continuar</p>
            </div>

            <div className="overview-actions-grid">
              {overviewItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`overview-action-card ${item.status}`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="overview-card-header">
                    <div className="overview-card-icon" style={{ backgroundColor: item.color }}>
                      {item.icon}
                    </div>
                    {item.count > 0 && (
                      <span className="overview-notification-badge">{item.count}</span>
                    )}
                  </div>

                  <div className="overview-card-content">
                    <h3 className="overview-card-title">{item.label}</h3>
                    <p className="overview-card-description">{item.description}</p>
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
    </div>
  );
};

export default OverviewMainPage;