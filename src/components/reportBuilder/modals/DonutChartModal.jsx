import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { Image as FabricImage } from 'fabric';

// Registrar elementos de Chart.js
Chart.register(ArcElement, Tooltip, Legend);

const DonutChartModal = ({ isOpen, onClose, canvas }) => {
  const [title, setTitle] = useState('Gráfico Donut');
  const [segments, setSegments] = useState([
    { label: 'Segmento 1', value: 30, color: '#1967D2' },
    { label: 'Segmento 2', value: 25, color: '#5E5CE6' },
    { label: 'Segmento 3', value: 45, color: '#AF52DE' }
  ]);
  const previewCanvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (isOpen && previewCanvasRef.current) {
      updatePreview();
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [segments, title, isOpen]);

  const updatePreview = () => {
    if (!previewCanvasRef.current) return;

    // Destruir chart anterior
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = previewCanvasRef.current.getContext('2d');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: segments.map(s => s.label),
        datasets: [{
          data: segments.map(s => s.value),
          backgroundColor: segments.map(s => s.color),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 16, weight: 'bold' },
            color: '#1a1a1a'
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 10,
              font: { size: 12 }
            }
          }
        }
      }
    });
  };

  const addSegment = () => {
    const colors = ['#1967D2', '#5E5CE6', '#AF52DE', '#34A853', '#FBBC04', '#EA4335'];
    const newColor = colors[segments.length % colors.length];

    setSegments([
      ...segments,
      { label: `Segmento ${segments.length + 1}`, value: 10, color: newColor }
    ]);
  };

  const removeSegment = (index) => {
    if (segments.length > 2) {
      setSegments(segments.filter((_, i) => i !== index));
    }
  };

  const updateSegment = (index, field, value) => {
    const newSegments = [...segments];
    newSegments[index][field] = value;
    setSegments(newSegments);
  };

  const insertChartToCanvas = () => {
    if (!canvas) return;

    // Crear canvas temporal para el chart final
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 400;
    tempCanvas.height = 400;
    const tempCtx = tempCanvas.getContext('2d');

    const finalChart = new Chart(tempCtx, {
      type: 'doughnut',
      data: {
        labels: segments.map(s => s.label),
        datasets: [{
          data: segments.map(s => s.value),
          backgroundColor: segments.map(s => s.color),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 20, weight: 'bold' },
            color: '#1a1a1a'
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 14 }
            }
          }
        }
      }
    });

    // Esperar a que el chart se renderice y convertir a imagen
    setTimeout(() => {
      const dataURL = tempCanvas.toDataURL('image/png');

      // Crear elemento IMG directamente
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

        finalChart.destroy();
        handleClose();
      };
      imgElement.src = dataURL;
    }, 500);
  };

  const handleClose = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
    setTitle('Gráfico Donut');
    setSegments([
      { label: 'Segmento 1', value: 30, color: '#1967D2' },
      { label: 'Segmento 2', value: 25, color: '#5E5CE6' },
      { label: 'Segmento 3', value: 45, color: '#AF52DE' }
    ]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Gráfico Donut</h3>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Título del gráfico */}
          <div className="input-group">
            <label>Título del Gráfico:</label>
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
              <button className="btn-primary btn-sm" onClick={addSegment}>
                <Plus size={16} />
                Agregar Segmento
              </button>
            </div>

            <div className="segments-list">
              {segments.map((segment, index) => (
                <div key={index} className="segment-item">
                  <input
                    type="text"
                    placeholder="Etiqueta"
                    value={segment.label}
                    onChange={(e) => updateSegment(index, 'label', e.target.value)}
                    className="input-field input-segment-label"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Valor"
                    value={segment.value}
                    onChange={(e) => updateSegment(index, 'value', parseFloat(e.target.value) || 0)}
                    className="input-field input-segment-value"
                  />
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
                    disabled={segments.length <= 2}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Vista previa */}
          <div className="chart-preview">
            <h4>Vista Previa</h4>
            <div className="preview-container">
              <canvas ref={previewCanvasRef} width="300" height="300"></canvas>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={insertChartToCanvas}>
            Insertar Gráfico en Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonutChartModal;
