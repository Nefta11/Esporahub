import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js/auto';
import { Image as FabricImage } from 'fabric';

// Registrar elementos de Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const UsoMediosModal = ({ isOpen, onClose, canvas }) => {
  const [title, setTitle] = useState('Uso de Medios Sociales');
  const [platforms, setPlatforms] = useState([
    { name: 'Facebook', percentage: 85, color: '#1877F2' },
    { name: 'Instagram', percentage: 72, color: '#E4405F' },
    { name: 'Twitter/X', percentage: 58, color: '#1DA1F2' },
    { name: 'TikTok', percentage: 65, color: '#000000' },
    { name: 'LinkedIn', percentage: 45, color: '#0A66C2' }
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
  }, [platforms, title, isOpen]);

  const updatePreview = () => {
    if (!previewCanvasRef.current) return;

    // Destruir chart anterior
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = previewCanvasRef.current.getContext('2d');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: platforms.map(p => p.name),
        datasets: [{
          label: 'Uso (%)',
          data: platforms.map(p => p.percentage),
          backgroundColor: platforms.map(p => p.color),
          borderWidth: 0
        }]
      },
      options: {
        indexAxis: 'y', // Barras horizontales
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 14, weight: 'bold' },
            color: '#1a1a1a'
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%'
            },
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  };

  const addPlatform = () => {
    const colors = ['#1877F2', '#E4405F', '#1DA1F2', '#0A66C2', '#25D366', '#FF0000'];
    const newColor = colors[platforms.length % colors.length];

    setPlatforms([
      ...platforms,
      { name: `Plataforma ${platforms.length + 1}`, percentage: 50, color: newColor }
    ]);
  };

  const removePlatform = (index) => {
    if (platforms.length > 1) {
      setPlatforms(platforms.filter((_, i) => i !== index));
    }
  };

  const updatePlatform = (index, field, value) => {
    const newPlatforms = [...platforms];
    if (field === 'percentage') {
      // Limitar entre 0 y 100
      value = Math.max(0, Math.min(100, value));
    }
    newPlatforms[index][field] = value;
    setPlatforms(newPlatforms);
  };

  const insertChartToCanvas = () => {
    if (!canvas) return;

    // Crear canvas temporal para el chart final
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 600;
    tempCanvas.height = 400;
    const tempCtx = tempCanvas.getContext('2d');

    const finalChart = new Chart(tempCtx, {
      type: 'bar',
      data: {
        labels: platforms.map(p => p.name),
        datasets: [{
          label: 'Uso (%)',
          data: platforms.map(p => p.percentage),
          backgroundColor: platforms.map(p => p.color),
          borderWidth: 0
        }]
      },
      options: {
        indexAxis: 'y', // Barras horizontales
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 18, weight: 'bold' },
            color: '#1a1a1a'
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.x}%`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%',
              font: { size: 12 }
            },
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            ticks: {
              font: { size: 14 }
            },
            grid: {
              display: false
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
          scaleX: 0.8,
          scaleY: 0.8
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
    setTitle('Uso de Medios Sociales');
    setPlatforms([
      { name: 'Facebook', percentage: 85, color: '#1877F2' },
      { name: 'Instagram', percentage: 72, color: '#E4405F' },
      { name: 'Twitter/X', percentage: 58, color: '#1DA1F2' },
      { name: 'TikTok', percentage: 65, color: '#000000' },
      { name: 'LinkedIn', percentage: 45, color: '#0A66C2' }
    ]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Gráfico de Uso de Medios</h3>
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

          {/* Lista de plataformas */}
          <div className="segments-section">
            <div className="section-header">
              <h4>Plataformas</h4>
              <button className="btn-primary btn-sm" onClick={addPlatform}>
                <Plus size={16} />
                Agregar Plataforma
              </button>
            </div>

            <div className="segments-list">
              {platforms.map((platform, index) => (
                <div key={index} className="segment-item">
                  <input
                    type="text"
                    placeholder="Nombre de la plataforma"
                    value={platform.name}
                    onChange={(e) => updatePlatform(index, 'name', e.target.value)}
                    className="input-field input-segment-label"
                  />
                  <div className="percentage-input-group">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={platform.percentage}
                      onChange={(e) => updatePlatform(index, 'percentage', parseFloat(e.target.value) || 0)}
                      className="input-field input-segment-value"
                    />
                    <span className="percentage-symbol">%</span>
                  </div>
                  <div className="color-input-group">
                    <input
                      type="color"
                      value={platform.color}
                      onChange={(e) => updatePlatform(index, 'color', e.target.value)}
                      className="input-color"
                    />
                  </div>
                  <button
                    className="btn-danger btn-icon"
                    onClick={() => removePlatform(index)}
                    disabled={platforms.length <= 1}
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
              <canvas ref={previewCanvasRef} width="400" height="300"></canvas>
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

export default UsoMediosModal;
