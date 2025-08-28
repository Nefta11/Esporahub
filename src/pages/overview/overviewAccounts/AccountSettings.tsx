import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { hasPermission } from '@/data/users';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import CreateAccountModal from '@/components/modals/CreateAccountModal';
import AccessDeniedModal from '@/components/modals/AccessDeniedModal';
import '@/styles/overview/overview-page.css';

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
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

  const handleCreateAccountClick = () => {
    if (user && hasPermission(user, 'create_accounts')) {
      setIsCreateModalOpen(true);
    } else {
      setDeniedFeature('Crear Cuenta');
      setShowAccessDeniedModal(true);
    }
  };

  const handleSelectAccountClick = () => {
    navigate('/seleccionar-cuenta');
  };

  // Opciones de configuración de cuentas
  const configurationOptions = [
    {
      id: 'create-account',
      name: 'Crear Cuenta',
      position: 'Nueva cuenta',
      color: 'text-blue-500',
      isActive: true,
      action: handleCreateAccountClick
    },
    {
      id: 'select-account',
      name: 'Seleccionar Cuenta',
      position: 'Cuenta existente',
      color: 'text-emerald-500',
      isActive: true,
      action: handleSelectAccountClick
    }
  ];

  return (
    <div className={`overview-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title="Configuración de cuentas"
        subtitle="Crear y gestionar cuentas del sistema"
        backButtonText="Overview"
        backButtonPath="/overview-menu"
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        userAvatarSize="md"
        showUserName={true}
      />

      {/* Main Content */}
      <main className={`overview-page-main-content ${isVisible ? 'visible' : ''}`}>
        <div className="overview-page-content-container">
          {/* Configuration Options Grid */}
          <section className="actions-section">
            <div className="overview-page-grid">
              {configurationOptions.map((option, index) => (
                <div
                  key={option.id}
                  className={`overview-page-card ${option.id}`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                  onClick={option.action}
                >
                  {/* User Avatar */}
                  <div className="overview-page-avatar">
                    <div className="overview-page-avatar-icon">
                      {option.id === 'create-account' ? (
                        <UserPlus size={24} />
                      ) : (
                        <Users size={24} />
                      )}
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="overview-page-info">
                    <h3 className="overview-page-name">{option.name}</h3>
                    <div className="overview-page-position">
                      {option.position}
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

      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAccount={() => { }}
      />

      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => setShowAccessDeniedModal(false)}
        featureName={deniedFeature}
      />
    </div>
  );
};

export default AccountSettings;