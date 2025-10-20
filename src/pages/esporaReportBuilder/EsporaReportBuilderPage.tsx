import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import '@/styles/esporaReportBuilder/espora-report-builder.css';

const EsporaReportBuilderPage: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
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

    const options = [
        { value: 'opcion1', label: 'Opción 1' },
        { value: 'opcion2', label: 'Opción 2' },
        { value: 'opcion3', label: 'Opción 3' }
    ];

    const handleOptionChange = (value: string) => {
        setSelectedOption(value);
    };

    const handleBuildReport = () => {
        // Función para construir el reporte
        console.log('Construyendo reporte con:', selectedOption);
        // Aquí se implementará la lógica para construir el reporte
    };

    return (
        <div className={`espora-report-builder-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
            <PageHeader
                title="Espora Report Builder"
                subtitle="Constructor de reportes inteligente"
                backButtonText="Menú"
                backButtonPath="/dashboard"
                isDarkMode={isDarkMode}
                onThemeToggle={handleThemeToggle}
                showUserAvatar={true}
                userAvatarSize="md"
                showUserName={true}
            />

            {/* Main Content */}
            <main className={`report-builder-main ${isVisible ? 'visible' : ''}`}>
                <div className="report-builder-content-container">
                    <section className="report-builder-section">
                        <div className="report-builder-section-header">
                            <h2>Espora Report Builder</h2>
                        </div>

                        <div className="report-builder-controls">
                            <div className="content-selector-container">
                                <label htmlFor="content-selector" className="selector-label">
                                    Seleccionar contenido
                                </label>
                                <div className="custom-select-container">
                                    <select
                                        id="content-selector"
                                        value={selectedOption}
                                        onChange={(e) => handleOptionChange(e.target.value)}
                                        className="content-selector"
                                    >
                                        <option value="" disabled>
                                            Selecciona una opción...
                                        </option>
                                        {options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="select-arrow">
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="6,9 12,15 18,9"></polyline>
                                        </svg>
                                    </div>
                                </div>

                                <div className="build-button-container">
                                    <button
                                        onClick={handleBuildReport}
                                        disabled={!selectedOption}
                                        className={`build-report-button ${selectedOption ? 'enabled' : 'disabled'}`}
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="button-icon"
                                        >
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <path d="M7 7h10" />
                                            <path d="M7 12h10" />
                                            <path d="M7 17h6" />
                                        </svg>
                                        Construir Reporte
                                    </button>
                                </div>
                            </div>
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

export default EsporaReportBuilderPage;