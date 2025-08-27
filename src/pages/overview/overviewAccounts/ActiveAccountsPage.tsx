import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import PageHeader from '@/components/generals/PageHeader';
import PageFooter from '@/components/generals/PageFooter';
import '@/styles/overview/active-accounts.css';

const ActiveAccountsPage: React.FC = () => {
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

  // Solo cuentas activas
  const activeAccounts = [
    { id: 1, name: 'Juan Pérez', position: 'Alcalde', color: 'text-blue-500' },
    { id: 2, name: 'María García', position: 'Gobernadora', color: 'text-emerald-500' },
    { id: 4, name: 'Ana Martínez', position: 'Senadora', color: 'text-red-500' },
    { id: 6, name: 'Laura Hernández', position: 'Diputada Local', color: 'text-teal-500' }
  ];

  const accountStatuses: { [key: number]: boolean } = {};
  activeAccounts.forEach(account => {
    accountStatuses[account.id] = true; // Todas están activas
  });

  const handleAccountSelect = (accountName: string, position: string) => {
    navigate('/cliente-dashboard', {
      state: {
        clientName: `${accountName} - ${position}`
      }
    });
  };

  return (
    <div className={`active-accounts-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title="Cuentas activas"
        subtitle="Gestión de cuentas activas del sistema"
        backButtonText="Menú"
        backButtonPath="/overview-menu"
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        userAvatarSize="md"
        showUserName={true}
      />

      {/* Main Content */}
      <main className={`active-accounts-main-content ${isVisible ? 'visible' : ''}`}>
        <div className="active-accounts-content-container">
          {/* Accounts Grid */}
          <section className="active-accounts-section">
            <div className="active-accounts-grid">
              {activeAccounts.map((account, index) => (
                <div
                  key={account.id}
                  className="active-account-card"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                  onClick={() => handleAccountSelect(account.name, account.position)}
                >
                  {/* User Avatar */}
                  <div className="active-account-avatar">
                    <div className="active-account-avatar-icon">
                      <User size={24} />
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="active-account-info">
                    <h3 className="active-account-name">{account.name}</h3>
                    <div className="active-account-position">
                      {account.position}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Mensaje si no hay cuentas activas */}
      {activeAccounts.filter(account => accountStatuses[account.id]).length === 0 && (
        <div className="active-accounts-empty-state">
          <div className="active-accounts-empty-icon">
            <User size={64} color={isDarkMode ? 'rgba(0, 122, 255, 0.6)' : 'rgba(0, 122, 255, 0.6)'} />
          </div>
          <h3 className="active-accounts-empty-title">
            No hay cuentas activas
          </h3>
          <p className="active-accounts-empty-description">
            Todas las cuentas han sido desactivadas
          </p>
        </div>
      )}

      <PageFooter
        showLogoutDialog={showLogoutDialog}
        onLogoutClick={() => setShowLogoutDialog(true)}
        onLogoutDialogClose={() => setShowLogoutDialog(false)}
      />
    </div>
  );
};

export default ActiveAccountsPage;