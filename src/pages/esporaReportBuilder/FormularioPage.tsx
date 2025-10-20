import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
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
    const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);
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

    const saveQuestion = (questionId: string) => {
        const questionToSave = questions.find(q => q.id === questionId);
        if (questionToSave && questionToSave.title.trim()) {
            // Agregar a preguntas guardadas
            setSavedQuestions([...savedQuestions, questionToSave]);
            // Remover de preguntas en edición
            setQuestions(questions.filter(q => q.id !== questionId));
        }
    };

    const deleteSavedQuestion = (questionId: string) => {
        setSavedQuestions(savedQuestions.filter(q => q.id !== questionId));
    };

    const editSavedQuestion = (questionId: string) => {
        const questionToEdit = savedQuestions.find(q => q.id === questionId);
        if (questionToEdit) {
            // Mover de vuelta a preguntas en edición
            setQuestions([...questions, questionToEdit]);
            setSavedQuestions(savedQuestions.filter(q => q.id !== questionId));
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;

        // Función para agregar nueva página si es necesario
        const checkPageBreak = (requiredSpace: number) => {
            if (yPosition + requiredSpace > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
                return true;
            }
            return false;
        };

        // Título del formulario
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Formulario', margin, yPosition);
        yPosition += 10;

        // Información del contenido y configuración
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        if (selectedContent) {
            doc.text(`Contenido: ${selectedContent}`, margin, yPosition);
            yPosition += 7;
        }
        if (selectedConfiguration) {
            doc.text(`Tipo: ${selectedConfiguration}`, margin, yPosition);
            yPosition += 7;
        }

        // Fecha de creación
        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Creado: ${currentDate}`, margin, yPosition);
        yPosition += 15;

        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Preguntas
        doc.setTextColor(0, 0, 0);
        savedQuestions.forEach((question, index) => {
            checkPageBreak(30);

            // Número y título de la pregunta
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            const questionTitle = `${index + 1}. ${question.title}${question.required ? ' *' : ''}`;

            // Dividir el texto si es muy largo
            const titleLines = doc.splitTextToSize(questionTitle, pageWidth - 2 * margin);
            doc.text(titleLines, margin, yPosition);
            yPosition += titleLines.length * 7;

            // Tipo de pregunta
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100, 100, 100);
            const questionType =
                question.type === 'multiple-choice' ? 'Opción múltiple (selecciona una)' :
                question.type === 'checkbox' ? 'Casillas de verificación (selecciona varias)' :
                question.type === 'dropdown' ? 'Lista desplegable' :
                'Respuesta de texto';
            doc.text(`Tipo: ${questionType}`, margin + 5, yPosition);
            yPosition += 7;

            // Opciones de respuesta
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');

            if (['multiple-choice', 'checkbox', 'dropdown'].includes(question.type) && question.options) {
                question.options.forEach((option, optIndex) => {
                    checkPageBreak(10);

                    const prefix = question.type === 'multiple-choice' ? '○' :
                                   question.type === 'checkbox' ? '☐' : '▸';
                    doc.text(`   ${prefix} ${option}`, margin + 5, yPosition);
                    yPosition += 6;
                });
            } else if (question.type === 'text') {
                // Línea para respuesta de texto
                doc.setDrawColor(200, 200, 200);
                doc.line(margin + 5, yPosition + 3, pageWidth - margin, yPosition + 3);
                yPosition += 10;
            }

            yPosition += 5;

            // Línea separadora entre preguntas
            if (index < savedQuestions.length - 1) {
                checkPageBreak(5);
                doc.setDrawColor(230, 230, 230);
                doc.line(margin, yPosition, pageWidth - margin, yPosition);
                yPosition += 10;
            }
        });

        // Pie de página
        const totalPages = doc.internal.pages.length - 1;
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `Página ${i} de ${totalPages}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        // Guardar el PDF
        const fileName = `Formulario_${selectedContent || 'Sin_Nombre'}_${Date.now()}.pdf`;
        doc.save(fileName);
    };

    const handleSaveForm = () => {
        console.log('Guardando formulario:', {
            content: selectedContent,
            configuration: selectedConfiguration,
            questions: savedQuestions
        });

        // Generar y descargar el PDF
        generatePDF();

        // Mostrar mensaje de éxito
        alert(`¡Formulario guardado exitosamente!\n\n${savedQuestions.length} preguntas exportadas a PDF.`);
    };

    return (
        <div className={`formulario-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
            <PageHeader
                title="Formulario"
                subtitle={selectedContent ? `Contenido: ${selectedContent}` : undefined}
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
                            {selectedConfiguration && (
                                <p className="form-subtitle">
                                    Tipo: {selectedConfiguration}
                                </p>
                            )}
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
                                        <p>No hay preguntas en edición. Haz clic en "Agregar Pregunta" para comenzar.</p>
                                    </div>
                                ) : (
                                    questions.map((question, index) => (
                                        <QuestionBuilder
                                            key={question.id}
                                            question={question}
                                            questionNumber={savedQuestions.length + index + 1}
                                            onUpdate={(updatedQuestion: Partial<Question>) => updateQuestion(question.id, updatedQuestion)}
                                            onDelete={() => deleteQuestion(question.id)}
                                            onSave={() => saveQuestion(question.id)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Saved Questions Section */}
                        {savedQuestions.length > 0 && (
                            <div className="saved-questions-section">
                                <div className="saved-questions-header">
                                    <h2>Preguntas Guardadas ({savedQuestions.length})</h2>
                                </div>
                                <div className="saved-questions-list">
                                    {savedQuestions.map((question, index) => (
                                        <div key={question.id} className="saved-question-item">
                                            <div className="saved-question-info">
                                                <span className="saved-question-number">#{index + 1}</span>
                                                <div className="saved-question-details">
                                                    <div className="saved-question-title">
                                                        {question.title}
                                                        {question.required && <span className="required-indicator">*</span>}
                                                    </div>
                                                    <div className="saved-question-meta">
                                                        Tipo: {question.type === 'multiple-choice' ? 'Opción múltiple' :
                                                               question.type === 'checkbox' ? 'Casillas' :
                                                               question.type === 'dropdown' ? 'Lista desplegable' : 'Texto'}
                                                        {question.options && ` • ${question.options.length} opciones`}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="saved-question-actions">
                                                <button
                                                    className="edit-saved-question-button"
                                                    onClick={() => editSavedQuestion(question.id)}
                                                    title="Editar pregunta"
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
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="delete-saved-question-button"
                                                    onClick={() => deleteSavedQuestion(question.id)}
                                                    title="Eliminar pregunta"
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
                                                        <polyline points="3,6 5,6 21,6" />
                                                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {savedQuestions.length > 0 && (
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