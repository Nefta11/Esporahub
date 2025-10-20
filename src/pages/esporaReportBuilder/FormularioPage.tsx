import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import QuestionBuilder from '@/components/formulario/QuestionBuilder';
import '@/styles/formulario/formulario.css';

interface Question {
    id: string;
    title: string;
    type: 'multiple-choice' | 'checkbox' | 'dropdown' | 'text';
    options?: string[];
    required: boolean;
}

const FormularioPage: React.FC = () => {
    const location = useLocation();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(() =>
        document.body.classList.contains('dark-theme')
    );

    // Obtener datos de la página anterior
    const { selectedContent, selectedConfiguration } = location.state || {};

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

    const addQuestion = () => {
        const newQuestion: Question = {
            id: `question-${Date.now()}`,
            title: '',
            type: 'multiple-choice',
            options: ['Opción 1'],
            required: false
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (questionId: string, updatedQuestion: Partial<Question>) => {
        setQuestions(questions.map(q => 
            q.id === questionId ? { ...q, ...updatedQuestion } : q
        ));
    };

    const deleteQuestion = (questionId: string) => {
        setQuestions(questions.filter(q => q.id !== questionId));
    };

    const handleSaveForm = () => {
        console.log('Guardando formulario:', {
            content: selectedContent,
            configuration: selectedConfiguration,
            questions
        });
        // Aquí implementarías la lógica para guardar el formulario
    };

    return (
        <div className={`formulario-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
            <PageHeader
                title="Formulario"
                backButtonPath="/seleccionar-tipo-contenido"
                isDarkMode={isDarkMode}
                onThemeToggle={handleThemeToggle}
                showUserAvatar={true}
                userAvatarSize="md"
                showUserName={true}
            />

            <main className="formulario-main">
                <div className="formulario-container">
                    <section className="formulario-content">
                        <div className="form-header">
                            <h1 className="form-title">Crear Formulario</h1>
                            <p className="form-subtitle">
                                {selectedContent && `Contenido: ${selectedContent}`}
                                {selectedConfiguration && ` • Tipo: ${selectedConfiguration}`}
                            </p>
                        </div>

                        <div className="questions-section">
                            <div className="questions-header">
                                <h2>Preguntas</h2>
                                <button 
                                    className="add-question-button"
                                    onClick={addQuestion}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    Agregar Pregunta
                                </button>
                            </div>

                            <div className="questions-list">
                                {questions.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No hay preguntas aún. Haz clic en "Agregar Pregunta" para comenzar.</p>
                                    </div>
                                ) : (
                                    questions.map((question, index) => (
                                        <QuestionBuilder
                                            key={question.id}
                                            question={question}
                                            questionNumber={index + 1}
                                            onUpdate={(updatedQuestion: Partial<Question>) => updateQuestion(question.id, updatedQuestion)}
                                            onDelete={() => deleteQuestion(question.id)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        {questions.length > 0 && (
                            <div className="form-actions">
                                <button 
                                    className="save-form-button"
                                    onClick={handleSaveForm}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                        <polyline points="17,21 17,13 7,13 7,21" />
                                        <polyline points="7,3 7,8 15,8" />
                                    </svg>
                                    Guardar Formulario
                                </button>
                            </div>
                        )}
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

export default FormularioPage;