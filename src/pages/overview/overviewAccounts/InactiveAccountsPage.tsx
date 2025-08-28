import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import '@/styles/overview/inactive-accounts.css';

const InactiveAccountsPage: React.FC = () => {
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

  // Solo cuentas inactivas
  const inactiveAccounts = [
    { id: 3, name: 'Carlos López', position: 'Diputado', color: 'text-purple-500' },
    { id: 5, name: 'Roberto Silva', position: 'Presidente Municipal', color: 'text-yellow-500' }
  ];

  const [accountStatuses] = useState<{ [key: number]: boolean }>(() => {
    const initialStatuses: { [key: number]: boolean } = {};
    inactiveAccounts.forEach(account => {
      initialStatuses[account.id] = false; // Todas empiezan como inactivas
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
    <div className={`inactive-accounts-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title="Cuentas inactivas"
        subtitle="Gestión de cuentas inactivas del sistema"
        backButtonText="Menú"
        backButtonPath="/overview-menu"
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        userAvatarSize="md"
        showUserName={true}
      />

      {/* Main Content */}
      <main className={`inactive-accounts-main-content ${isVisible ? 'visible' : ''}`}>
        <div className="inactive-accounts-content-container">
          {/* Accounts Grid */}
          <section className="inactive-accounts-section">
            <div className="inactive-accounts-grid">
              {inactiveAccounts.map((account, index) => (
                <div
                  key={account.id}
                  className="inactive-account-card"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                  onClick={() => handleAccountSelect(account.name, account.position)}
                >
                  {/* User Avatar */}
                  <div className="inactive-account-avatar">
                    <div className="inactive-account-avatar-icon">
                      <User size={24} />
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="inactive-account-info">
                    <h3 className="inactive-account-name">{account.name}</h3>
                    <div className="inactive-account-position">
                      {account.position}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Mensaje si no hay cuentas inactivas */}
      {inactiveAccounts.filter(account => !accountStatuses[account.id]).length === 0 && (
        <div className="inactive-accounts-empty-state">
          <div className="inactive-accounts-empty-icon">
            <User size={64} color={isDarkMode ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.6)'} />
          </div>
          <h3 className="inactive-accounts-empty-title">
            No hay cuentas inactivas
          </h3>
          <p className="inactive-accounts-empty-description">
            Todas las cuentas han sido activadas
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

export default InactiveAccountsPage;