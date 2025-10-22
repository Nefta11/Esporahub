import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { X, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import QuestionBuilder from '@/components/formulario/QuestionBuilder';
import LoadingOverlay from '@/components/esporaReportBuilder/LoadingOverlay';
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
    const navigate = useNavigate();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<{file: File, url: string}[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
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

    const generatePDF = async () => {
        const doc = new jsPDF({
            orientation: 'landscape'
        });
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

        // Función para cargar imagen como base64
        const loadImageAsBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
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

        // Sección de imágenes
        if (imageUrls.length > 0) {
            checkPageBreak(30);

            // Línea separadora
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 15;

            // Título de sección de imágenes
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Imágenes', margin, yPosition);
            yPosition += 15;

            // Agregar imágenes
            for (let i = 0; i < imageUrls.length; i++) {
                const imageData = imageUrls[i];
                try {
                    const base64Image = await loadImageAsBase64(imageData.file);

                    // Calcular dimensiones de la imagen
                    const maxWidth = pageWidth - 2 * margin;
                    const maxHeight = 80;

                    // Crear imagen temporal para obtener dimensiones originales
                    const img = new Image();
                    img.src = base64Image;

                    await new Promise((resolve) => {
                        img.onload = () => {
                            const imgWidth = img.width;
                            const imgHeight = img.height;
                            const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
                            const finalWidth = imgWidth * ratio;
                            const finalHeight = imgHeight * ratio;

                            // Verificar si hay espacio para la imagen
                            checkPageBreak(finalHeight + 20);

                            // Agregar imagen al PDF
                            doc.addImage(base64Image, 'JPEG', margin, yPosition, finalWidth, finalHeight);
                            yPosition += finalHeight + 5;

                            // Agregar nombre del archivo
                            doc.setFontSize(9);
                            doc.setFont('helvetica', 'italic');
                            doc.setTextColor(100, 100, 100);
                            doc.text(imageData.file.name, margin, yPosition);
                            yPosition += 10;

                            resolve(true);
                        };
                    });
                } catch (error) {
                    console.error('Error al cargar imagen:', error);
                }
            }
        }

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

    const handleSaveForm = async () => {
        // Mostrar el loading overlay
        setIsExporting(true);

        // Simular un pequeño delay para que el usuario vea el loading
        setTimeout(() => {
            console.log('Guardando formulario:', {
                content: selectedContent,
                configuration: selectedConfiguration,
                questions: savedQuestions
            });

            // Generar y descargar el PDF
            generatePDF();

            // Ocultar el loading overlay después de la exportación
            setTimeout(() => {
                setIsExporting(false);
            }, 500);
        }, 800);
    };

    const handleExitClick = () => {
        // Siempre mostrar el modal de confirmación
        setShowExitModal(true);
    };

    const handleConfirmExit = () => {
        setShowExitModal(false);
        navigate('/espora-report-builder');
    };

    const handleAddFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

            // Crear URLs para las imágenes
            const newImageUrls = newFiles.map(file => ({
                file,
                url: URL.createObjectURL(file)
            }));

            setUploadedFiles([...uploadedFiles, ...newFiles]);
            setImageUrls([...imageUrls, ...newImageUrls]);
        }

        // Reset input para permitir seleccionar el mismo archivo nuevamente
        event.target.value = '';
    };

    const handleRemoveImage = (index: number) => {
        const newImageUrls = [...imageUrls];
        const newUploadedFiles = [...uploadedFiles];

        // Liberar la URL del objeto
        URL.revokeObjectURL(newImageUrls[index].url);

        newImageUrls.splice(index, 1);
        newUploadedFiles.splice(index, 1);

        setImageUrls(newImageUrls);
        setUploadedFiles(newUploadedFiles);
    };

    // Cleanup URLs cuando el componente se desmonte
    React.useEffect(() => {
        return () => {
            imageUrls.forEach(img => URL.revokeObjectURL(img.url));
        };
    }, []);

    return (
        <div className={`formulario-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
            <PageHeader
                title="Configuración de pantalla"
                subtitle={selectedContent ? `Contenido: ${selectedContent}` : undefined}
                backButtonPath="/seleccionar-tipo-contenido"
                isDarkMode={isDarkMode}
                onThemeToggle={handleThemeToggle}
                showUserAvatar={true}
                userAvatarSize="md"
                showUserName={true}
            />

            {/* Exit Button */}
            <div className="exit-button-container">
                <button
                    className="exit-form-button"
                    onClick={handleExitClick}
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
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Salir
                </button>
            </div>

            <main className="formulario-main">
                <div className="formulario-container">
                    <section className="formulario-content">
                        <div className="form-header">
                            <h1 className="form-title">Configuración de pantalla</h1>
                            {selectedConfiguration && (
                                <p className="form-subtitle">
                                    Tipo: {selectedConfiguration}
                                </p>
                            )}
                        </div>

                        <div className="questions-section">
                            <div className="questions-header">
                                <h2>Preguntas</h2>
                                <div className="buttons-container">
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

                                    {/* Add Image Button */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                    <button
                                        className="add-file-button"
                                        onClick={handleAddFileClick}
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
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                        Agregar imagen
                                    </button>
                                </div>
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

                        {/* Images Gallery Section */}
                        {imageUrls.length > 0 && (
                            <div className="images-gallery-section">
                                <div className="images-gallery-header">
                                    <h2>Imágenes agregadas ({imageUrls.length})</h2>
                                </div>
                                <div className="images-gallery-grid">
                                    {imageUrls.map((imageData, index) => (
                                        <div key={index} className="image-gallery-item">
                                            <img
                                                src={imageData.url}
                                                alt={`Imagen ${index + 1}`}
                                                className="gallery-image"
                                            />
                                            <button
                                                className="remove-image-button"
                                                onClick={() => handleRemoveImage(index)}
                                                title="Eliminar imagen"
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
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                            <div className="image-name">{imageData.file.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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

            <LoadingOverlay
                isVisible={isExporting}
                message="Exportando PDF..."
                submessage={`Generando formulario con ${savedQuestions.length} pregunta${savedQuestions.length !== 1 ? 's' : ''}`}
            />

            {/* Exit Confirmation Modal */}
            {showExitModal && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
                        isDarkMode ? 'bg-black/50' : 'bg-black/30'
                    }`}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowExitModal(false);
                        }
                    }}
                >
                    <div
                        className={`w-full max-w-md p-6 rounded-xl shadow-2xl animate-in fade-in duration-200 ${
                            isDarkMode
                                ? 'bg-zinc-900/90 border border-white/10'
                                : 'bg-white/95 border border-blue-200/30 shadow-blue-100/20'
                        }`}
                        style={{
                            transform: 'translateY(0)',
                            animation: 'modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${
                                    isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
                                }`}>
                                    <AlertTriangle size={20} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                                </div>
                                <h2 className={`text-xl font-semibold ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    ¿Salir del formulario?
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowExitModal(false)}
                                className={`transition-colors ${
                                    isDarkMode
                                        ? 'text-white/60 hover:text-white'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={`mb-6 ${
                            isDarkMode ? 'text-white/80' : 'text-gray-600'
                        }`}>
                            <p className="mb-3">¿Estás seguro de que deseas salir?</p>
                            <p className="text-sm font-medium py-2 px-3 rounded-md"
                                style={{
                                    backgroundColor: isDarkMode ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                    borderLeft: `3px solid ${isDarkMode ? '#ffc107' : '#ff9800'}`
                                }}
                            >
                                Se perderá el progreso que llevas
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowExitModal(false)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isDarkMode
                                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmExit}
                                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all ${
                                    isDarkMode
                                        ? 'bg-red-500/80 hover:bg-red-500'
                                        : 'bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-red-200/50'
                                }`}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormularioPage;