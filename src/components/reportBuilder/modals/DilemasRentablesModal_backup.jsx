import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import '@/styles/reportBuilder/ChartModals.css';

const ActivacionPorTemaModal = ({ isOpen, onClose, canvas }) => {
  const [temas, setTemas] = useState([
    { tema: 'Tema 1', activacion: 0, color: '#8B0000' },
    { tema: 'Tema 2', activacion: 0, color: '#CD5C5C' },
    { tema: 'Tema 3', activacion: 0, color: '#DC143C' },
    { tema: 'Tema 4', activacion: 0, color: '#F08080' },
    { tema: 'Tema 5', activacion: 0, color: '#8B4513' },
  ]);

  if (!isOpen) return null;

  const handleTemaChange = (index, field, value) => {
    const newTemas = [...temas];
    newTemas[index][field] = value;
    setTemas(newTemas);
  };

  const handleAddTema = () => {
    setTemas([...temas, { tema: 'Nuevo tema', activacion: 50, color: '#808080' }]);
  };

  const handleRemoveTema = (index) => {
    const newTemas = temas.filter((_, i) => i !== index);
    setTemas(newTemas);
  };

  const drawActivacionChart = () => {
    const canvasElement = document.createElement('canvas');
    // Aumentar resolución para mejor calidad (x2)
    const scale = 2;
    const width = 960;
    const height = 540;
    canvasElement.width = width * scale;
    canvasElement.height = height * scale;
    canvasElement.style.width = width + 'px';
    canvasElement.style.height = height + 'px';
    const ctx = canvasElement.getContext('2d');
    
    // Escalar el contexto para mejor renderizado
    ctx.scale(scale, scale);

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Estudio de activación por tema', 40, 40);

    // Subtitle "Alta Activación" and "Baja Activación"
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#2E7D32';
    ctx.fillText('Alta Activación', 40, 70);
    
    ctx.fillStyle = '#C62828';
    ctx.textAlign = 'right';
    ctx.fillText('Baja Activación', width - 40, 70);
    ctx.textAlign = 'left';

    // Vertical indicator line
    const lineX = width - 60;
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(lineX, 90);
    ctx.lineTo(lineX, 105);
    ctx.stroke();

    ctx.strokeStyle = '#C62828';
    ctx.beginPath();
    ctx.moveTo(lineX, height - 70);
    ctx.lineTo(lineX, height - 55);
    ctx.stroke();

    // Draw gradient line indicator on the right
    const gradientHeight = height - 165;
    const gradient = ctx.createLinearGradient(0, 105, 0, 105 + gradientHeight);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(0.5, '#FFC107');
    gradient.addColorStop(1, '#C62828');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(lineX, 105);
    ctx.lineTo(lineX, 105 + gradientHeight);
    ctx.stroke();

    // Chart configuration
    const startY = 105;
    const chartHeight = gradientHeight;
    const barHeight = 38;
    const spacing = (chartHeight - (temas.length * barHeight)) / (temas.length + 1);

    // Sort temas by activation (descending)
    const sortedTemas = [...temas].sort((a, b) => b.activacion - a.activacion);

    // Draw bars
    sortedTemas.forEach((tema, index) => {
      const y = startY + spacing + index * (barHeight + spacing);
      const maxBarWidth = width - 200;
      const barWidth = Math.max((tema.activacion / 100) * maxBarWidth, 0);

      // Draw bar background with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      
      ctx.fillStyle = '#F8F9FA';
      ctx.fillRect(100, y, maxBarWidth, barHeight);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 1;
      ctx.strokeRect(100, y, maxBarWidth, barHeight);

      // Draw colored bar
      if (barWidth > 0) {
        ctx.fillStyle = tema.color;
        ctx.fillRect(100, y, barWidth, barHeight);
      }

      // Draw tema label
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      
      // Sombra para el texto
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.fillText(tema.tema, 108, y + 24);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Draw percentage on the right of the bar
      ctx.font = 'bold 13px Arial, sans-serif';
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'left';
      const percentX = 100 + maxBarWidth + 12;
      ctx.fillText(`${tema.activacion}%`, percentX, y + 24);
    });

    return canvasElement;
  };

  const handleInsertChart = async () => {
    if (!canvas) return;

    // Buscar gráfica existente de activación por tema para conservar su posición y escala
    const existingChart = canvas.getObjects().find(obj => obj.name === 'activacion-por-tema-chart');
    
    // Guardar propiedades de la gráfica existente
    const existingProps = existingChart ? {
      left: existingChart.left,
      top: existingChart.top,
      scaleX: existingChart.scaleX,
      scaleY: existingChart.scaleY,
      angle: existingChart.angle
    } : {
      left: 50,
      top: 50,
      scaleX: 0.5,
      scaleY: 0.5,
      angle: 0
    };

    // Eliminar gráfica existente
    if (existingChart) {
      canvas.remove(existingChart);
    }

    const canvasElement = drawActivacionChart();
    const dataURL = canvasElement.toDataURL('image/png', 1.0);

    const { Image: FabricImage } = await import('fabric');
    
    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: existingProps.left,
        top: existingProps.top,
        scaleX: existingProps.scaleX,
        scaleY: existingProps.scaleY,
        angle: existingProps.angle,
        selectable: true,
        hasControls: true,
        name: 'activacion-por-tema-chart'
      });

      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      canvas.renderAll();
      onClose();
    };
    imgElement.src = dataURL;
  };

  return (
    <div className="chart-modal-overlay">
      <div className="chart-modal-container">
        <h2 className="chart-modal-title">
          Estudio de Activación por Tema
        </h2>

        <div className="chart-form-grid-single">
          <p className="chart-form-label">
            Configura los temas y sus niveles de activación (0-100%). Las barras se ordenarán automáticamente de mayor a menor activación.
          </p>
        </div>

        <div className="chart-profile-card">
          <div style={{ marginBottom: '12px', display: 'grid', gridTemplateColumns: '2fr 140px 80px 45px', gap: '12px', paddingLeft: '10px', paddingRight: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Nombre del Tema</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Activación %</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', textAlign: 'center' }}>Color</span>
            <span></span>
          </div>
          {temas.map((tema, index) => (
            <div key={index} className="tema-row">
              <input
                type="text"
                placeholder="Ej: Enojo, Alegría, Confianza..."
                value={tema.tema}
                onChange={(e) => handleTemaChange(index, 'tema', e.target.value)}
                className="chart-form-input"
              />
              <input
                type="number"
                placeholder="0-100"
                value={tema.activacion}
                onChange={(e) => handleTemaChange(index, 'activacion', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="chart-form-input"
                min="0"
                max="100"
              />
              <input
                type="color"
                value={tema.color}
                onChange={(e) => handleTemaChange(index, 'color', e.target.value)}
                className="chart-form-input color-input"
                title="Seleccionar color"
              />
              <button
                onClick={() => handleRemoveTema(index)}
                className="chart-delete-button"
                title="Eliminar tema"
                disabled={temas.length <= 1}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={handleAddTema}
            className="chart-add-button"
          >
            <Plus size={16} />
            Agregar Tema
          </button>
        </div>

        <div className="chart-modal-buttons">
          <button
            onClick={onClose}
            className="chart-modal-button-cancel"
          >
            Cancelar
          </button>
          <button
            onClick={handleInsertChart}
            className="chart-modal-button-insert"
          >
            Insertar Gráfica
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivacionPorTemaModal;
