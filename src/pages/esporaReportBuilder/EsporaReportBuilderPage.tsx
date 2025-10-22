import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import CustomSelect from '@/components/esporaReportBuilder/CustomSelect';
import LoadingOverlay from '@/components/esporaReportBuilder/LoadingOverlay';
import { reportBuilderOptions } from '@/data/reportBuilderOptions';
import '@/styles/esporaReportBuilder/espora-report-builder.css';

const EsporaReportBuilderPage: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
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

    const handleOptionChange = (value: string) => {
        setSelectedOption(value);
    };

    const handleBuildReport = async () => {
        if (!selectedOption) return;
        
        setIsLoading(true);
        
        // Simular tiempo de carga
        setTimeout(() => {
            // Encontrar el label de la opción seleccionada
            const selectedOptionData = reportBuilderOptions.find(option => option.value === selectedOption);
            const selectedContentLabel = selectedOptionData?.label || 'Contenido seleccionado';
            
            // Navegar a la nueva página con el contenido seleccionado
            navigate('/seleccionar-tipo-contenido', {
                state: {
                    selectedContent: selectedContentLabel
                }
            });
            
            setIsLoading(false);
        }, 2000); // 2 segundos de animación de carga
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
                        <div className="report-builder-controls">
                            <div className="content-selector-container">
                                <label htmlFor="content-selector" className="selector-label">
                                    Selecciona el contenido a configurar
                                </label>
                                <div className="custom-select-container">
                                    <CustomSelect
                                        id="content-selector"
                                        value={selectedOption}
                                        onChange={handleOptionChange}
                                        options={reportBuilderOptions}
                                        placeholder="Selecciona una opción..."
                                        className="content-selector-custom"
                                    />
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

            <LoadingOverlay
                isVisible={isLoading}
                message="Construyendo reporte..."
                submessage="Preparando la configuración"
            />
        </div>
    );
};

export default EsporaReportBuilderPage;