import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import CustomSelect from '@/components/esporaReportBuilder/CustomSelect';
import '@/styles/esporaReportBuilder/espora-report-builder.css';

const ReportConfigurationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
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
        { value: 'verde', label: 'PORTADAS' },
        { value: 'amarillo', label: 'TEXTOS GENERALES' },
        { value: 'azul', label: 'ESTUDIOS, ANÁLISIS, BENCHMARKS, IDENTIFICACIONES, TABLEROS, FÓRMULAS, PROGRAMACIONES' },
        { value: 'naranja', label: 'SIGUIENTES PASOS' }
    ];

    const handleConfigurationChange = (value: string) => {
        setSelectedConfiguration(value);
        
        // Si se selecciona la opción azul (ESTUDIOS, ANÁLISIS, etc.), navegar al formulario
        if (value === 'azul') {
            navigate('/formulario', {
                state: {
                    selectedContent,
                    selectedConfiguration: configurationOptions.find(opt => opt.value === value)?.label
                }
            });
        }
    };

    return (
        <div className={`espora-report-builder-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
            <PageHeader
                title="Espora Report Builder"
                subtitle="Configuración tipo de contenido"
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
                                        placeholder="¿Qué tipo de contenido es?"
                                        className="content-selector-custom"
                                    />
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