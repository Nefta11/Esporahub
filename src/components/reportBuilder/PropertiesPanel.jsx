import React, { useState, useEffect } from 'react';
import { Copy, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const PropertiesPanel = ({
  selectedObject,
  onUpdateProperty,
  onDuplicate,
  onDelete,
  onBringToFront,
  onSendToBack
}) => {
  const [properties, setProperties] = useState({});

  useEffect(() => {
    if (selectedObject) {
      const isLine = selectedObject.type === 'line';
      setProperties({
        text: selectedObject.text || '',
        fill: selectedObject.fill || '#000000',
        stroke: selectedObject.stroke || '#000000',
        strokeWidth: selectedObject.strokeWidth || 2,
        opacity: selectedObject.opacity || 1,
        left: Math.round(selectedObject.left) || 0,
        top: Math.round(selectedObject.top) || 0,
        width: Math.round(selectedObject.width * (selectedObject.scaleX || 1)) || 0,
        height: Math.round(selectedObject.height * (selectedObject.scaleY || 1)) || 0,
        angle: Math.round(selectedObject.angle) || 0,
        fontSize: selectedObject.fontSize || 18,
        fontWeight: selectedObject.fontWeight || 'normal',
        textAlign: selectedObject.textAlign || 'left'
      });
    }
  }, [selectedObject]);

  const handleChange = (property, value) => {
    setProperties(prev => ({ ...prev, [property]: value }));
    onUpdateProperty(property, value);
  };

  if (!selectedObject) {
    return (
      <aside className="editor-sidebar-right">
        <h3 className="sidebar-title">Propiedades</h3>
        <div className="properties-placeholder">
          <p>Selecciona un objeto para editar sus propiedades</p>
        </div>
      </aside>
    );
  }

  const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text';
  const isLine = selectedObject.type === 'line';

  return (
    <aside className="editor-sidebar-right">
      <h3 className="sidebar-title">Propiedades</h3>

      <div className="properties-panel">
        {/* Texto */}
        {isText && (
          <div className="property-group">
            <label className="property-label">Texto</label>
            <textarea
              className="property-textarea"
              value={properties.text}
              onChange={(e) => handleChange('text', e.target.value)}
              rows="3"
            />
          </div>
        )}

        {/* Color */}
        <div className="property-group">
          <label className="property-label">{isLine ? 'Color de línea' : 'Color'}</label>
          <div className="property-color-row">
            <input
              type="color"
              className="property-input-color"
              value={isLine ? properties.stroke : properties.fill}
              onChange={(e) => handleChange(isLine ? 'stroke' : 'fill', e.target.value)}
            />
            <input
              type="text"
              className="property-input-text"
              value={isLine ? properties.stroke : properties.fill}
              onChange={(e) => handleChange(isLine ? 'stroke' : 'fill', e.target.value)}
            />
          </div>
        </div>

        {/* Grosor de línea (solo para líneas) */}
        {isLine && (
          <div className="property-group">
            <label className="property-label">Grosor de línea</label>
            <input
              type="number"
              className="property-input"
              value={properties.strokeWidth}
              onChange={(e) => handleChange('strokeWidth', parseFloat(e.target.value))}
              min="1"
              max="50"
            />
          </div>
        )}

        {/* Opacidad */}
        <div className="property-group">
          <label className="property-label">Opacidad</label>
          <div className="property-slider-row">
            <input
              type="range"
              className="property-slider"
              value={properties.opacity * 100}
              onChange={(e) => handleChange('opacity', parseFloat(e.target.value) / 100)}
              min="0"
              max="100"
            />
            <span className="property-value">{Math.round(properties.opacity * 100)}%</span>
          </div>
        </div>

        {/* Posición */}
        <div className="property-group">
          <label className="property-label">Posición</label>
          <div className="property-row">
            <div className="property-input-group">
              <label className="property-sublabel">X</label>
              <input
                type="number"
                className="property-input"
                value={properties.left}
                onChange={(e) => handleChange('left', parseFloat(e.target.value))}
              />
            </div>
            <div className="property-input-group">
              <label className="property-sublabel">Y</label>
              <input
                type="number"
                className="property-input"
                value={properties.top}
                onChange={(e) => handleChange('top', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Tamaño */}
        <div className="property-group">
          <label className="property-label">Tamaño</label>
          <div className="property-row">
            <div className="property-input-group">
              <label className="property-sublabel">Ancho</label>
              <input
                type="number"
                className="property-input"
                value={properties.width}
                onChange={(e) => handleChange('scaleX', parseFloat(e.target.value) / selectedObject.width)}
              />
            </div>
            <div className="property-input-group">
              <label className="property-sublabel">Alto</label>
              <input
                type="number"
                className="property-input"
                value={properties.height}
                onChange={(e) => handleChange('scaleY', parseFloat(e.target.value) / selectedObject.height)}
              />
            </div>
          </div>
        </div>

        {/* Rotación */}
        <div className="property-group">
          <label className="property-label">Rotación</label>
          <input
            type="number"
            className="property-input"
            value={properties.angle}
            onChange={(e) => handleChange('angle', parseFloat(e.target.value))}
            min="0"
            max="360"
          />
        </div>

        {/* Propiedades de texto */}
        {isText && (
          <>
            <div className="property-group">
              <label className="property-label">Tamaño de fuente</label>
              <input
                type="number"
                className="property-input"
                value={properties.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                min="8"
                max="200"
              />
            </div>

            <div className="property-group">
              <label className="property-label">Peso de fuente</label>
              <select
                className="property-select"
                value={properties.fontWeight}
                onChange={(e) => handleChange('fontWeight', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            <div className="property-group">
              <label className="property-label">Alineación</label>
              <select
                className="property-select"
                value={properties.textAlign}
                onChange={(e) => handleChange('textAlign', e.target.value)}
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </>
        )}

        {/* Acciones */}
        <div className="property-actions">
          <button className="action-button" onClick={onDuplicate} title="Duplicar">
            <Copy size={18} />
            <span>Duplicar</span>
          </button>

          <button className="action-button danger" onClick={onDelete} title="Eliminar">
            <Trash2 size={18} />
            <span>Eliminar</span>
          </button>

          <button className="action-button" onClick={onBringToFront} title="Traer al frente">
            <ArrowUp size={18} />
            <span>Al frente</span>
          </button>

          <button className="action-button" onClick={onSendToBack} title="Enviar atrás">
            <ArrowDown size={18} />
            <span>Atrás</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
