import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';
import { templates } from '@/config/templates';
import '@/styles/reportBuilder/TemplateSelector.css';

const TemplateSelector = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectTemplate = (templateId) => {
    navigate(`/report-builder/editor/${templateId}`);
  };

  return (
    <div className="template-selector-page">
      <div className={`template-selector-container ${isVisible ? 'visible' : ''}`}>
        <div className="selector-header">
          <h1 className="selector-title">Espora Report Builder</h1>
          <p className="selector-subtitle">Selecciona una plantilla para comenzar a crear tu reporte</p>
        </div>

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
                <h4 className="filminas-list-title">Contenido incluido:</h4>
                <ul className="filminas-list">
                  {template.filminas.map((filmina) => (
                    <li key={filmina.id} className="filmina-item">
                      <span className="filmina-number">{filmina.order}</span>
                      <span className="filmina-title">{filmina.title}</span>
                    </li>
                  ))}
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
    </div>
  );
};

export default TemplateSelector;
