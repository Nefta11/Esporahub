import React, { useState } from 'react';
import { X, Square, Circle, Triangle, Hexagon, Star } from 'lucide-react';
import '@/styles/reportBuilder/ChartModals.css';

const ShapePickerModal = ({ isOpen, onClose, onSelectShape }) => {
  const [selectedColor, setSelectedColor] = useState('#1967D2');

  const shapes = [
    {
      id: 'rect',
      name: 'Rectángulo',
      icon: Square,
      description: 'Forma rectangular básica'
    },
    {
      id: 'circle',
      name: 'Círculo',
      icon: Circle,
      description: 'Forma circular perfecta'
    },
    {
      id: 'triangle',
      name: 'Triángulo',
      icon: Triangle,
      description: 'Triángulo equilátero'
    },
    {
      id: 'polygon',
      name: 'Hexágono',
      icon: Hexagon,
      description: 'Polígono de 6 lados'
    },
    {
      id: 'star',
      name: 'Estrella',
      icon: Star,
      description: 'Estrella de 5 puntas'
    }
  ];

  const handleSelectShape = (shapeType) => {
    onSelectShape(shapeType, { fill: selectedColor });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Seleccionar Forma</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Color Picker */}
          <div className="shape-color-section">
            <label>Color de la forma:</label>
            <div className="color-input-row">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder="#1967D2"
              />
            </div>
          </div>

          {/* Shape Grid */}
          <div className="shape-grid">
            {shapes.map((shape) => {
              const Icon = shape.icon;
              return (
                <button
                  key={shape.id}
                  className="shape-card"
                  onClick={() => handleSelectShape(shape.id)}
                  title={shape.description}
                  style={{ '--shape-color': selectedColor }}
                >
                  <div className="shape-icon">
                    <Icon size={48} strokeWidth={1.5} />
                  </div>
                  <h4 className="shape-name">{shape.name}</h4>
                  <p className="shape-description">{shape.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShapePickerModal;
