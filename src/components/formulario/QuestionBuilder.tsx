import React, { useState } from 'react';
import CustomSelect from '@/components/esporaReportBuilder/CustomSelect';

interface Question {
    id: string;
    title: string;
    type: 'multiple-choice' | 'checkbox' | 'dropdown' | 'text';
    options?: string[];
    required: boolean;
}

interface QuestionBuilderProps {
    question: Question;
    questionNumber: number;
    onUpdate: (updatedQuestion: Partial<Question>) => void;
    onDelete: () => void;
}

const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
    question,
    questionNumber,
    onUpdate,
    onDelete
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const questionTypeOptions = [
        { value: 'multiple-choice', label: 'Opción múltiple (radio)' },
        { value: 'checkbox', label: 'Casillas de verificación' },
        { value: 'dropdown', label: 'Lista desplegable' },
        { value: 'text', label: 'Respuesta de texto' }
    ];

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ title: e.target.value });
    };

    const handleTypeChange = (newType: string) => {
        const type = newType as Question['type'];
        const updatedQuestion: Partial<Question> = { type };
        
        // Si cambia a un tipo que necesita opciones, crear opciones por defecto
        if (['multiple-choice', 'checkbox', 'dropdown'].includes(type)) {
            updatedQuestion.options = question.options || ['Opción 1'];
        }
        
        onUpdate(updatedQuestion);
    };

    const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ required: e.target.checked });
    };

    const addOption = () => {
        const newOptions = [...(question.options || []), `Opción ${(question.options?.length || 0) + 1}`];
        onUpdate({ options: newOptions });
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...(question.options || [])];
        newOptions[index] = value;
        onUpdate({ options: newOptions });
    };

    const deleteOption = (index: number) => {
        const newOptions = question.options?.filter((_, i) => i !== index) || [];
        onUpdate({ options: newOptions });
    };

    const renderQuestionPreview = () => {
        switch (question.type) {
            case 'multiple-choice':
                return (
                    <div className="question-preview">
                        {question.options?.map((option, index) => (
                            <div key={index} className="preview-option">
                                <input type="radio" name={`preview-${question.id}`} disabled />
                                <span>{option}</span>
                            </div>
                        ))}
                    </div>
                );
            case 'checkbox':
                return (
                    <div className="question-preview">
                        {question.options?.map((option, index) => (
                            <div key={index} className="preview-option">
                                <input type="checkbox" disabled />
                                <span>{option}</span>
                            </div>
                        ))}
                    </div>
                );
            case 'dropdown':
                return (
                    <div className="question-preview">
                        <select disabled className="preview-select">
                            <option>Seleccionar...</option>
                            {question.options?.map((option, index) => (
                                <option key={index}>{option}</option>
                            ))}
                        </select>
                    </div>
                );
            case 'text':
                return (
                    <div className="question-preview">
                        <input type="text" placeholder="Respuesta de texto..." disabled className="preview-text" />
                    </div>
                );
        }
    };

    return (
        <div className="question-builder">
            <div className="question-header">
                <div className="question-title-section">
                    <span className="question-number">#{questionNumber}</span>
                    <button 
                        className="expand-button"
                        onClick={() => setIsExpanded(!isExpanded)}
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
                            className={isExpanded ? 'rotated' : ''}
                        >
                            <polyline points="6,9 12,15 18,9" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Escribe tu pregunta aquí..."
                        value={question.title}
                        onChange={handleTitleChange}
                        className="question-title-input"
                    />
                </div>
                <button className="delete-question-button" onClick={onDelete}>
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

            {isExpanded && (
                <div className="question-content">
                    <div className="question-config">
                        <div className="config-row">
                            <div className="config-item">
                                <label>Tipo de pregunta:</label>
                                <CustomSelect
                                    id={`type-${question.id}`}
                                    value={question.type}
                                    onChange={handleTypeChange}
                                    options={questionTypeOptions}
                                    placeholder="Seleccionar tipo"
                                    className="question-type-select"
                                />
                            </div>
                            <div className="config-item">
                                <label className="required-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={question.required}
                                        onChange={handleRequiredChange}
                                    />
                                    <span>Obligatoria</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {['multiple-choice', 'checkbox', 'dropdown'].includes(question.type) && (
                        <div className="options-section">
                            <div className="options-header">
                                <h4>Opciones de respuesta:</h4>
                                <button className="add-option-button" onClick={addOption}>
                                    <svg
                                        width="14"
                                        height="14"
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
                                    Agregar opción
                                </button>
                            </div>
                            <div className="options-list">
                                {question.options?.map((option, index) => (
                                    <div key={index} className="option-item">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(index, e.target.value)}
                                            className="option-input"
                                            placeholder={`Opción ${index + 1}`}
                                        />
                                        {(question.options?.length || 0) > 1 && (
                                            <button 
                                                className="delete-option-button"
                                                onClick={() => deleteOption(index)}
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
                                                >
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="question-preview-section">
                        <h4>Vista previa:</h4>
                        <div className="preview-container">
                            <div className="preview-question-title">
                                {question.title || 'Pregunta sin título'}
                                {question.required && <span className="required-indicator">*</span>}
                            </div>
                            {renderQuestionPreview()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionBuilder;