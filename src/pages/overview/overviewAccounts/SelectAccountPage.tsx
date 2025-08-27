import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/generals/PageHeader';
import PageFooter from '@/components/generals/PageFooter';
import '@/styles/overview/select-account.css';

const SelectAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains('dark-theme')
  );

  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
    setIsDarkMode(!isDarkMode);
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
    setIsVisible(true);
  }, []);

  // Lista de cuentas disponibles con estado activo/inactivo
  const accounts = [
    { id: 1, name: 'Juan Pérez', position: 'Alcalde', color: 'text-blue-500', isActive: true },
    { id: 2, name: 'María García', position: 'Gobernadora', color: 'text-emerald-500', isActive: true },
    { id: 3, name: 'Carlos López', position: 'Diputado', color: 'text-purple-500', isActive: false },
    { id: 4, name: 'Ana Martínez', position: 'Senadora', color: 'text-red-500', isActive: true },
    { id: 5, name: 'Roberto Silva', position: 'Presidente Municipal', color: 'text-yellow-500', isActive: false },
    { id: 6, name: 'Laura Hernández', position: 'Diputada Local', color: 'text-teal-500', isActive: true }
  ];

  const [accountStatuses] = useState<{ [key: number]: boolean }>(() => {
    const initialStatuses: { [key: number]: boolean } = {};
    accounts.forEach(account => {
      initialStatuses[account.id] = account.isActive;
    });
    return initialStatuses;
  });

  const handleAccountSelect = (accountName: string, position: string) => {
    navigate('/cliente-dashboard', {
      state: {
        clientName: `${accountName} - ${position}`
      }
    });
  };

  return (
    <div className={`select-account-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title="Seleccionar cuenta"
        subtitle="Elige una cuenta para continuar"
        backButtonText="Configuración"
        backButtonPath="/overview"
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        userAvatarSize="md"
        showUserName={true}
      />

      {/* Main Content */}
      <main className={`select-account-main-content ${isVisible ? 'visible' : ''}`}>
        <div className="select-account-content-container">
          {/* Accounts Grid */}
          <section className="select-account-section">
            <div className="select-account-grid">
              {accounts.map((account, index) => (
                <div
                  key={account.id}
                  className={`select-account-card ${accountStatuses[account.id] ? 'active' : 'inactive'}`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                  onClick={() => handleAccountSelect(account.name, account.position)}
                >
                  {/* Status dot */}
                  <div className={`select-account-status-dot ${accountStatuses[account.id] ? 'active' : 'inactive'}`}></div>

                  {/* User Avatar */}
                  <div className="select-account-avatar">
                    <div className="select-account-avatar-icon">
                      <div className="select-account-avatar-head"></div>
                      <div className="select-account-avatar-body"></div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="select-account-info">
                    <h3 className="select-account-name">{account.name}</h3>
                    <div className="select-account-position">
                      {account.position}
                    </div>
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

export default SelectAccountPage;