import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import CustomSelect from '@/components/esporaReportBuilder/CustomSelect';
import '@/styles/esporaReportBuilder/espora-report-builder.css';

const ReportConfigurationPage: React.FC = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [selectedConfiguration, setSelectedConfiguration] = useState<string>('');
    const [isDarkMode, setIsDarkMode] = useState(() =>
        document.body.classList.contains('dark-theme')
    );

    // Obtener el contenido seleccionado de la página anterior
    const selectedContent = location.state?.selectedContent || 'Contenido seleccionado';

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

    // Opciones de configuración según la imagen
    const configurationOptions = [
        { value: 'verde', label: 'VERDE (PORTADAS)' },
        { value: 'amarillo', label: 'AMARILLO (TEXTOS GENERALES)' },
        { value: 'azul', label: 'AZUL (ESTUDIOS, BENCHMARKS, IDENTIFICACIONES, TABLEROS, PROGRAMACIONES)' },
        { value: 'naranja', label: 'NARANJA (SIGUIENTES PASOS)' }
    ];

    const handleConfigurationChange = (value: string) => {
        setSelectedConfiguration(value);
    };

    const handleGenerateReport = () => {
        // Aquí implementarás la lógica para generar el reporte final
        console.log('Generando reporte con:', {
            content: selectedContent,
            configuration: selectedConfiguration
        });
        // Por ahora, regresar a la página anterior
        // navigate('/espora-report-builder');
    };

    return (
        <div className={`espora-report-builder-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
            <PageHeader
                title="Configuración de Reporte"
                subtitle="Configura los parámetros de tu reporte"
                backButtonText="Volver"
                backButtonPath="/espora-report-builder"
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
                            <h2>Configuración de Reporte</h2>
                        </div>

                        <div className="report-builder-controls">
                            <div className="content-selector-container">
                                <label className="selector-label">
                                    {selectedContent}
                                </label>
                                <div className="custom-select-container">
                                    <CustomSelect
                                        id="configuration-selector"
                                        value={selectedConfiguration}
                                        onChange={handleConfigurationChange}
                                        options={configurationOptions}
                                        placeholder="Selecciona una configuración..."
                                        className="content-selector-custom"
                                    />
                                </div>

                                <div className="build-button-container">
                                    <button
                                        onClick={handleGenerateReport}
                                        disabled={!selectedConfiguration}
                                        className={`build-report-button ${selectedConfiguration ? 'enabled' : 'disabled'}`}
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
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14,2 14,8 20,8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10,9 9,9 8,9" />
                                        </svg>
                                        Generar Reporte
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

export default ReportConfigurationPage;