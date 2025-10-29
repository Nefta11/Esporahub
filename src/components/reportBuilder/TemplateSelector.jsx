import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';
import { templates } from '@/config/templates';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import '@/styles/reportBuilder/TemplateSelector.css';

const TemplateSelector = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFilminas, setSelectedFilminas] = useState({});
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
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
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

  const handleFilminaSelect = (templateId, filminaId) => {
    setSelectedFilminas(prev => ({
      ...prev,
      [templateId]: filminaId
    }));
  };

  const handleSelectTemplate = (templateId) => {
    const filminaId = selectedFilminas[templateId] || 1; // Default to first filmina
    navigate(`/report-builder/editor/${templateId}/${filminaId}`);
  };

  return (
    <div className={`template-selector-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title="Espora Report Builder"
        subtitle="Selecciona una plantilla para comenzar a crear tu reporte"
        backButtonText="Menú"
        backButtonPath="/dashboard"
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        userAvatarSize="md"
        showUserName={true}
      />

      <div className={`template-selector-container ${isVisible ? 'visible' : ''}`}>

        <div className="templates-grid">
          {templates.map((template, index) => (
            <div
              key={template.id}
              className="template-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="template-header">
                <div className="template-icon" style={{ backgroundColor: template.color }}>
                  <FileText size={32} />
                </div>
                <div className="template-meta">
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-description">{template.description}</p>
                </div>
              </div>

              <div className="template-stats">
                <span className="filmina-count">{template.filminaCount} filminas</span>
              </div>

              <div className="filminas-list-container">
                <h4 className="filminas-list-title">Selecciona una filmina:</h4>
                <ul className="filminas-list">
                  {template.filminas.map((filmina) => {
                    const isSelected = selectedFilminas[template.id] === filmina.id;
                    return (
                      <li
                        key={filmina.id}
                        className={`filmina-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleFilminaSelect(template.id, filmina.id)}
                      >
                        <span className="filmina-number">{filmina.order}</span>
                        <span className="filmina-title">{filmina.title}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button
                className="select-template-button"
                onClick={() => handleSelectTemplate(template.id)}
              >
                <span>Seleccionar plantilla</span>
                <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <PageFooter
        showLogoutDialog={showLogoutDialog}
        onLogoutClick={() => setShowLogoutDialog(true)}
        onLogoutDialogClose={() => setShowLogoutDialog(false)}
      />
    </div>
  );
};

export default TemplateSelector;
