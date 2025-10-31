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
    const width = 960;
    const height = 540;
    canvasElement.width = width;
    canvasElement.height = height;
    const ctx = canvasElement.getContext('2d');

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Estudio de activación por tema', 30, 35);

    // Subtitle "Alta Activación" and "Baja Activación"
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#2E7D32';
    ctx.fillText('Alta Activación', 30, 60);
    
    ctx.fillStyle = '#C62828';
    ctx.textAlign = 'right';
    ctx.fillText('Baja Activación', width - 30, 60);
    ctx.textAlign = 'left';

    // Vertical indicator line
    const lineX = width - 50;
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(lineX, 80);
    ctx.lineTo(lineX, 90);
    ctx.stroke();

    ctx.strokeStyle = '#C62828';
    ctx.beginPath();
    ctx.moveTo(lineX, height - 80);
    ctx.lineTo(lineX, height - 70);
    ctx.stroke();

    // Draw gradient line indicator on the right
    const gradientHeight = height - 170;
    const gradient = ctx.createLinearGradient(0, 90, 0, 90 + gradientHeight);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#C62828');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(lineX, 90);
    ctx.lineTo(lineX, 90 + gradientHeight);
    ctx.stroke();

    // Chart configuration
    const startY = 90;
    const chartHeight = gradientHeight;
    const barHeight = 35;
    const spacing = (chartHeight - (temas.length * barHeight)) / (temas.length + 1);

    // Sort temas by activation (descending)
    const sortedTemas = [...temas].sort((a, b) => b.activacion - a.activacion);

    // Draw bars
    sortedTemas.forEach((tema, index) => {
      const y = startY + spacing + index * (barHeight + spacing);
      const maxBarWidth = width - 180;
      const barWidth = (tema.activacion / 100) * maxBarWidth;

      // Draw bar background
      ctx.fillStyle = '#F5F5F5';
      ctx.fillRect(90, y, maxBarWidth, barHeight);
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 1;
      ctx.strokeRect(90, y, maxBarWidth, barHeight);

      // Draw colored bar
      ctx.fillStyle = tema.color;
      ctx.fillRect(90, y, barWidth, barHeight);

      // Draw tema label
      ctx.font = 'bold 13px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      ctx.fillText(tema.tema, 95, y + 22);

      // Draw percentage on the right of the bar
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      const percentX = 90 + barWidth + 10;
      ctx.fillText(`${tema.activacion}%`, percentX, y + 22);
    });

    return canvasElement;
  };

  const handleInsertChart = async () => {
    if (!canvas) return;

    const canvasElement = drawActivacionChart();
    const dataURL = canvasElement.toDataURL('image/png');

    const { Image: FabricImage } = await import('fabric');
    
    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: 50,
        top: 50,
        selectable: true,
        hasControls: true,
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
            Configura los temas y sus niveles de activación (0-100%)
          </p>
        </div>

        <div className="chart-profile-card">
          {temas.map((tema, index) => (
            <div key={index} className="tema-row">
              <input
                type="text"
                placeholder="Tema"
                value={tema.tema}
                onChange={(e) => handleTemaChange(index, 'tema', e.target.value)}
                className="chart-form-input"
              />
              <input
                type="number"
                placeholder="Activación %"
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
              />
              <button
                onClick={() => handleRemoveTema(index)}
                className="chart-delete-button"
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
