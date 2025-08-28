import React, { useEffect, useState } from 'react';
import { Construction } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import '../styles/construction.css';

const ConstructionPage: React.FC = () => {
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

  return (
    <div className={`construction-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title="Sitio en construcción"
        subtitle="Esta función estará disponible próximamente"
        backButtonText="Volver al menú"
        backButtonPath="/dashboard"
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        userAvatarSize="md"
        showUserName={true}
      />

      <div className="construction-overlay" />
      <div className="construction-overlay" style={{ transform: 'rotate(180deg)' }} />

      <main className={`construction-content ${isVisible ? 'visible' : ''}`}>
        <div className="icon-container">
          <Construction className="construction-icon" size={64} />
        </div>
        <h1>Sitio en construcción</h1>
        <p className="description">
          Estamos trabajando para brindarte la mejor experiencia.
          Esta función estará disponible muy pronto.
        </p>

        <div className="progress-bar">
          <div className="progress-value" />
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

export default ConstructionPage;