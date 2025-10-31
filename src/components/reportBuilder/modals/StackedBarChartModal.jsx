import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Image as FabricImage } from 'fabric';
import '@/styles/reportBuilder/ChartModals.css';

const StackedBarChartModal = ({ isOpen, onClose, canvas }) => {
  const [title, setTitle] = useState('');
  const [segments, setSegments] = useState([
    { 
      percentage: 78, 
      label: 'Internet', 
      color: '#8B1538',
      description: 'Clases A,B,C,D\nJóvenes'
    },
    { 
      percentage: 18, 
      label: 'Antibios', 
      color: '#C84B6B',
      description: ''
    },
    { 
      percentage: 4, 
      label: 'Medios Tradicionales', 
      color: '#E899AE',
      description: 'Amas de casa\nTercera Edad'
    }
  ]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      drawPreview();
    }
  }, [segments, title, isOpen]);

  const drawPreview = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Configuración del gráfico vertical
    const chartX = 50; // Barra a la izquierda
    const chartBottomY = height - 80; // Margen inferior para etiquetas
    const chartTopY = 50; // Margen superior
    const maxBarHeight = chartBottomY - chartTopY;
    const barWidth = 100;

    // Dibujar barra apilada verticalmente (de abajo hacia arriba)
    let currentY = chartBottomY;
    
    // Invertir el orden para dibujar de abajo hacia arriba
    const reversedSegments = [...segments].reverse();
    
    reversedSegments.forEach((segment) => {
      const segmentHeight = (segment.percentage / 100) * maxBarHeight;

      // Dibujar segmento vertical
      ctx.fillStyle = segment.color;
      ctx.fillRect(chartX, currentY - segmentHeight, barWidth, segmentHeight);

      // Borde del segmento
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(chartX, currentY - segmentHeight, barWidth, segmentHeight);

      // Porcentaje dentro del segmento
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${segment.percentage}%`,
        chartX + barWidth / 2,
        currentY - segmentHeight / 2
      );

      currentY -= segmentHeight;
    });

    // Dibujar etiquetas y descripciones (en orden original)
    currentY = chartBottomY;
    const labelStartX = chartX + barWidth + 20; // Etiquetas a la derecha de la barra
    
    reversedSegments.forEach((segment) => {
      const segmentHeight = (segment.percentage / 100) * maxBarHeight;
      const centerY = currentY - segmentHeight / 2;

      // Etiqueta del segmento a la derecha
      ctx.fillStyle = segment.color;
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(segment.label, labelStartX, centerY);

      // Descripción (si existe)
      if (segment.description) {
        ctx.fillStyle = '#333333';
        ctx.font = '10px Arial';
        const lines = segment.description.split('\n');
        lines.forEach((line, idx) => {
          ctx.fillText(line, labelStartX, centerY + 15 + (idx * 12));
        });
      }

      // Línea apuntando al segmento desde la derecha de la barra
      if (segment.description || segment.label) {
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chartX + barWidth + 5, centerY);
        ctx.lineTo(labelStartX - 5, centerY);
        ctx.stroke();
      }

      currentY -= segmentHeight;
    });
  };

  const addSegment = () => {
    const colors = ['#8B1538', '#C84B6B', '#E899AE', '#F5C2D0', '#9B59B6', '#3498DB'];
    const newColor = colors[segments.length % colors.length];

    setSegments([
      ...segments,
      { percentage: 10, label: `Segmento ${segments.length + 1}`, color: newColor, description: '' }
    ]);
  };

  const removeSegment = (index) => {
    if (segments.length > 1) {
      setSegments(segments.filter((_, i) => i !== index));
    }
  };

  const updateSegment = (index, field, value) => {
    const newSegments = [...segments];
    if (field === 'percentage') {
      value = Math.max(0, Math.min(100, parseFloat(value) || 0));
    }
    newSegments[index][field] = value;
    setSegments(newSegments);
  };

  const normalizePercentages = () => {
    const total = segments.reduce((sum, s) => sum + s.percentage, 0);
    if (total === 0) return;

    const normalized = segments.map(s => ({
      ...s,
      percentage: Math.round((s.percentage / total) * 100)
    }));

    // Ajustar para que sume exactamente 100
    const sum = normalized.reduce((acc, s) => acc + s.percentage, 0);
    if (sum !== 100 && normalized.length > 0) {
      normalized[0].percentage += (100 - sum);
    }

    setSegments(normalized);
  };

  const insertChartToCanvas = () => {
    if (!canvas) return;

    // Crear canvas temporal para renderizar el gráfico final
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 500;
    tempCanvas.height = 600;
    const tempCtx = tempCanvas.getContext('2d');

    // Fondo blanco
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Configuración del gráfico vertical
    const chartX = 80; // Barra a la izquierda
    const chartBottomY = tempCanvas.height - 100; // Margen inferior
    const chartTopY = title ? 100 : 60; // Margen superior
    const maxBarHeight = chartBottomY - chartTopY;
    const barWidth = 150;

    // Dibujar título si existe
    if (title) {
      tempCtx.fillStyle = '#1a1a1a';
      tempCtx.font = 'bold 28px Arial';
      tempCtx.textAlign = 'left';
      tempCtx.fillText(title, 30, 50);
    }

    // Dibujar barra apilada verticalmente (de abajo hacia arriba)
    let currentY = chartBottomY;
    
    // Invertir el orden para dibujar de abajo hacia arriba
    const reversedSegments = [...segments].reverse();
    
    reversedSegments.forEach((segment) => {
      const segmentHeight = (segment.percentage / 100) * maxBarHeight;

      // Dibujar segmento vertical
      tempCtx.fillStyle = segment.color;
      tempCtx.fillRect(chartX, currentY - segmentHeight, barWidth, segmentHeight);

      // Borde del segmento
      tempCtx.strokeStyle = '#ffffff';
      tempCtx.lineWidth = 4;
      tempCtx.strokeRect(chartX, currentY - segmentHeight, barWidth, segmentHeight);

      // Porcentaje dentro del segmento
      tempCtx.fillStyle = '#ffffff';
      tempCtx.font = 'bold 32px Arial';
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      tempCtx.fillText(
        `${segment.percentage}%`,
        chartX + barWidth / 2,
        currentY - segmentHeight / 2
      );

      currentY -= segmentHeight;
    });

    // Dibujar etiquetas y descripciones (en orden original)
    currentY = chartBottomY;
    const labelStartX = chartX + barWidth + 30; // Etiquetas a la derecha de la barra
    
    reversedSegments.forEach((segment) => {
      const segmentHeight = (segment.percentage / 100) * maxBarHeight;
      const centerY = currentY - segmentHeight / 2;

      // Etiqueta del segmento a la derecha
      tempCtx.fillStyle = segment.color;
      tempCtx.font = 'bold 18px Arial';
      tempCtx.textAlign = 'left';
      tempCtx.fillText(segment.label, labelStartX, centerY);

      // Descripción (si existe)
      if (segment.description) {
        tempCtx.fillStyle = '#333333';
        tempCtx.font = '14px Arial';
        const lines = segment.description.split('\n');
        lines.forEach((line, idx) => {
          tempCtx.fillText(line, labelStartX, centerY + 22 + (idx * 18));
        });
      }

      // Línea apuntando al segmento desde la derecha de la barra
      if (segment.description || segment.label) {
        tempCtx.strokeStyle = '#666666';
        tempCtx.lineWidth = 2;
        tempCtx.beginPath();
        tempCtx.moveTo(chartX + barWidth + 10, centerY);
        tempCtx.lineTo(labelStartX - 10, centerY);
        tempCtx.stroke();
      }

      currentY -= segmentHeight;
    });

    // Convertir canvas a imagen y agregar al canvas principal
    const dataURL = tempCanvas.toDataURL('image/png');
    const imgElement = new Image();
    
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: 100,
        top: 100,
        scaleX: 0.7,
        scaleY: 0.7
      });
      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      canvas.renderAll();
      handleClose();
    };
    
    imgElement.src = dataURL;
  };

  const handleClose = () => {
    setTitle('');
    setSegments([
      { 
        percentage: 78, 
        label: 'Internet', 
        color: '#8B1538',
        description: 'Clases A,B,C,D\nJóvenes'
      },
      { 
        percentage: 18, 
        label: 'Antibios', 
        color: '#C84B6B',
        description: ''
      },
      { 
        percentage: 4, 
        label: 'Medios Tradicionales', 
        color: '#E899AE',
        description: 'Amas de casa\nTercera Edad'
      }
    ]);
    onClose();
  };

  if (!isOpen) return null;

  const totalPercentage = segments.reduce((sum, s) => sum + s.percentage, 0);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Gráfico de Barras Apiladas</h3>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Título del gráfico */}
          <div className="input-group">
            <label>Título del Gráfico (opcional):</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Ingresa el título..."
            />
          </div>

          {/* Lista de segmentos */}
          <div className="segments-section">
            <div className="section-header">
              <h4>Segmentos</h4>
              <div className="section-header-controls">
                <span className={`total-percentage ${totalPercentage === 100 ? 'total-complete' : 'total-incomplete'}`}>
                  Total: {totalPercentage}%
                </span>
                <button className="btn-secondary btn-sm" onClick={normalizePercentages}>
                  Normalizar a 100%
                </button>
                <button className="btn-primary btn-sm" onClick={addSegment}>
                  <Plus size={16} />
                  Agregar Segmento
                </button>
              </div>
            </div>

            <div className="segments-list">
              {segments.map((segment, index) => (
                <div key={index} className="segment-item">
                  <div className="segment-controls">
                    <input
                      type="text"
                      placeholder="Nombre del segmento"
                      value={segment.label}
                      onChange={(e) => updateSegment(index, 'label', e.target.value)}
                      className="input-field input-segment-label"
                    />
                    <div className="percentage-input-group">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        placeholder="0-100"
                        value={segment.percentage}
                        onChange={(e) => updateSegment(index, 'percentage', e.target.value)}
                        className="input-field input-segment-value"
                      />
                      <span className="percentage-symbol">%</span>
                    </div>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={segment.color}
                        onChange={(e) => updateSegment(index, 'color', e.target.value)}
                        className="input-color"
                      />
                    </div>
                    <button
                      className="btn-danger btn-icon"
                      onClick={() => removeSegment(index)}
                      disabled={segments.length <= 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <textarea
                    placeholder="Descripción o etiqueta adicional (opcional, usa Enter para múltiples líneas)"
                    value={segment.description}
                    onChange={(e) => updateSegment(index, 'description', e.target.value)}
                    className="chart-form-textarea"
                    rows="2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Vista previa */}
          <div className="chart-preview">
            <h4>Vista Previa</h4>
            <div className="preview-container">
              <canvas ref={canvasRef} width="600" height="350"></canvas>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
          <button 
            className="btn-primary" 
            onClick={insertChartToCanvas}
            disabled={totalPercentage !== 100}
          >
            Insertar Gráfico en Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default StackedBarChartModal;
