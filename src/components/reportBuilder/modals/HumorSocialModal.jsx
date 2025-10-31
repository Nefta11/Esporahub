import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import '@/styles/reportBuilder/ChartModals.css';

const HumorSocialModal = ({ isOpen, onClose, canvas }) => {
  const [candidatos, setCandidatos] = useState([
    {
      nombre: 'Personaje 1',
      color: '#8B0000',
      x: 0,
      y: 0,
      sentimientos: [
        { nombre: 'Sentimiento 1', valor: 0 },
        { nombre: 'Sentimiento 2', valor: 0 }
      ]
    },
    {
      nombre: 'Personaje 2',
      color: '#FF69B4',
      x: 0,
      y: 0,
      sentimientos: [
        { nombre: 'Sentimiento 1', valor: 0 }
      ]
    },
    {
      nombre: 'Personaje 3',
      color: '#4169E1',
      x: 0,
      y: 0,
      sentimientos: [
        { nombre: 'Sentimiento 1', valor: 0 }
      ]
    }
  ]);

  if (!isOpen) return null;

  const handleCandidatoChange = (index, field, value) => {
    const newCandidatos = [...candidatos];
    newCandidatos[index][field] = value;
    setCandidatos(newCandidatos);
  };

  const handleAddCandidato = () => {
    setCandidatos([...candidatos, { 
      nombre: 'Nuevo\nCandidato', 
      color: '#808080', 
      x: 0, 
      y: 0,
      sentimientos: [{ nombre: 'Sentimiento', valor: 20 }]
    }]);
  };

  const handleRemoveCandidato = (index) => {
    const newCandidatos = candidatos.filter((_, i) => i !== index);
    setCandidatos(newCandidatos);
  };

  const handleSentimientoChange = (candIndex, sentIndex, field, value) => {
    const newCandidatos = [...candidatos];
    newCandidatos[candIndex].sentimientos[sentIndex][field] = value;
    setCandidatos(newCandidatos);
  };

  const handleAddSentimiento = (candIndex) => {
    const newCandidatos = [...candidatos];
    newCandidatos[candIndex].sentimientos.push({ nombre: 'Nuevo', valor: 10 });
    setCandidatos(newCandidatos);
  };

  const handleRemoveSentimiento = (candIndex, sentIndex) => {
    const newCandidatos = [...candidatos];
    newCandidatos[candIndex].sentimientos.splice(sentIndex, 1);
    setCandidatos(newCandidatos);
  };

  const drawHumorSocialChart = () => {
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
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('c. Coordenadas del Humor Social. Benchmark', 25, 30);
    ctx.font = '12px Arial';
    ctx.fillText('Nuevo León', 135, 48);

    // Grid configuration
    const gridLeft = 50;
    const gridTop = 80;
    const gridWidth = 420;
    const gridHeight = 420;
    const centerX = gridLeft + gridWidth / 2;
    const centerY = gridTop + gridHeight / 2;

    // Emotion labels for grid (8x8 grid)
    const emotions = [
      ['Cultura', 'Odio', 'Miedo', 'Entusiasmo', 'Amor', 'Euforia'],
      ['Reacción', 'Enojo', 'Irritación', 'Ilusión', 'Admiración', 'Fascinación'],
      ['Desprecio', 'Desdicha', 'Antipatía', 'Gratitud', 'Afín', 'Júbilo'],
      ['Vergüenza', 'Desconfianza', 'Rechazo', 'Simetría', 'Benéfico', 'Esperanza'],
      ['Depresión', 'Desprecio', 'Indiferencia', 'Aceptación', 'Gratitud', 'Optimismo'],
      ['', 'Desdén', '', 'Arrepentido', 'Confianza', 'Tranquilidad']
    ];

    const cellWidth = gridWidth / 6;
    const cellHeight = gridHeight / 6;

    // Color gradient for emotions
    const getColorForPosition = (col, row) => {
      const totalCells = 6;
      const midPoint = totalCells / 2;
      
      // Horizontal gradient (left to right: red to green)
      const hue = ((col / totalCells) * 120); // 0 (red) to 120 (green)
      
      // Vertical gradient (top to bottom: darker to lighter)
      const lightness = 30 + ((totalCells - row) / totalCells) * 40; // 30% to 70%
      
      return `hsl(${hue}, 60%, ${lightness}%)`;
    };

    // Draw emotion grid
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const x = gridLeft + col * cellWidth;
        const y = gridTop + row * cellHeight;
        
        ctx.fillStyle = getColorForPosition(col, row);
        ctx.fillRect(x, y, cellWidth, cellHeight);
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
        
        if (emotions[row] && emotions[row][col]) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(emotions[row][col], x + cellWidth / 2, y + cellHeight / 2 + 3);
        }
      }
    }

    // Draw axes labels
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Alta actividad', centerX, gridTop - 15);
    ctx.fillText('(+)', centerX, gridTop - 3);
    
    ctx.save();
    ctx.translate(gridLeft - 20, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Desagradable', 0, 0);
    ctx.restore();
    
    ctx.fillText('(-)', gridLeft - 8, centerY + 15);

    ctx.fillText('Baja actividad', centerX, gridTop + gridHeight + 25);
    ctx.fillText('(-)', centerX, gridTop + gridHeight + 38);
    
    ctx.save();
    ctx.translate(gridLeft + gridWidth + 20, centerY);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('Agradable', 0, 0);
    ctx.restore();
    
    ctx.fillText('(+)', gridLeft + gridWidth + 8, centerY + 15);

    // Draw center axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, gridTop);
    ctx.lineTo(centerX, gridTop + gridHeight);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(gridLeft, centerY);
    ctx.lineTo(gridLeft + gridWidth, centerY);
    ctx.stroke();

    // Draw candidate avatars on grid
    candidatos.forEach((candidato) => {
      // Convert coordinates to pixels
      const pixelX = centerX + (candidato.x / 3) * (gridWidth / 2);
      const pixelY = centerY - (candidato.y / 3) * (gridHeight / 2);
      
      // Draw avatar circle
      ctx.beginPath();
      ctx.arc(pixelX, pixelY, 18, 0, 2 * Math.PI);
      ctx.fillStyle = candidato.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // Draw right side candidate list with bars
    const rightX = gridLeft + gridWidth + 50;
    const startY = gridTop + 20;
    const candidateHeight = 45;

    candidatos.forEach((candidato, index) => {
      const y = startY + index * candidateHeight;
      
      // Draw avatar
      ctx.beginPath();
      ctx.arc(rightX + 20, y + 15, 16, 0, 2 * Math.PI);
      ctx.fillStyle = candidato.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw name
      const nameLines = candidato.nombre.split('\n');
      ctx.font = 'bold 9px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      nameLines.forEach((line, i) => {
        ctx.fillText(line, rightX + 42, y + 12 + i * 10);
      });
      
      // Draw sentiment bars
      const barStartX = rightX + 110;
      const barWidth = 120;
      const barHeight = 8;
      const barSpacing = 2;
      
      let barY = y + 5;
      candidato.sentimientos.forEach((sent) => {
        const sentBarWidth = (sent.valor / 100) * barWidth;
        
        // Bar background
        ctx.fillStyle = '#F0F0F0';
        ctx.fillRect(barStartX, barY, barWidth, barHeight);
        
        // Colored bar
        ctx.fillStyle = candidato.color;
        ctx.fillRect(barStartX, barY, sentBarWidth, barHeight);
        
        // Sentiment label
        ctx.font = '7px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.fillText(sent.nombre, barStartX + barWidth + 5, barY + 6);
        
        barY += barHeight + barSpacing;
      });
    });

    // Draw "03-Septiembre" label
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 9px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('03-Septiembre', width - 25, 48);

    return canvasElement;
  };

  const handleInsertChart = async () => {
    if (!canvas) return;

    const canvasElement = drawHumorSocialChart();
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
          Análisis de Humor Social - Coordenadas
        </h2>

        <p className="chart-modal-description">
          Configura los candidatos, sus posiciones en la matriz de humor y los sentimientos asociados
        </p>

        <button
          onClick={handleAddCandidato}
          className="chart-add-button"
        >
          <Plus size={16} />
          Agregar Candidato
        </button>

        {candidatos.map((candidato, candIndex) => (
          <div key={candIndex} className="chart-profile-card">
            <div className="chart-profile-header">
              <h3>Candidato {candIndex + 1}</h3>
              <button
                onClick={() => handleRemoveCandidato(candIndex)}
                className="chart-remove-button"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="chart-form-grid-4col">
              <div className="chart-form-field">
                <label className="chart-form-label">Nombre (usa \n para separar)</label>
                <input
                  type="text"
                  value={candidato.nombre}
                  onChange={(e) => handleCandidatoChange(candIndex, 'nombre', e.target.value)}
                  className="chart-form-input"
                />
              </div>
              <div className="chart-form-field">
                <label className="chart-form-label">Color</label>
                <input
                  type="color"
                  value={candidato.color}
                  onChange={(e) => handleCandidatoChange(candIndex, 'color', e.target.value)}
                  className="chart-form-input"
                />
              </div>
              <div className="chart-form-field">
                <label className="chart-form-label">Posición X (-3 a 3)</label>
                <input
                  type="number"
                  value={candidato.x}
                  onChange={(e) => handleCandidatoChange(candIndex, 'x', parseFloat(e.target.value) || 0)}
                  step="0.1"
                  min="-3"
                  max="3"
                  className="chart-form-input"
                />
              </div>
              <div className="chart-form-field">
                <label className="chart-form-label">Posición Y (-3 a 3)</label>
                <input
                  type="number"
                  value={candidato.y}
                  onChange={(e) => handleCandidatoChange(candIndex, 'y', parseFloat(e.target.value) || 0)}
                  step="0.1"
                  min="-3"
                  max="3"
                  className="chart-form-input"
                />
              </div>
            </div>

            <div className="chart-sentimientos-section">
              <div className="chart-sentimientos-header">
                <h4>Sentimientos</h4>
                <button
                  onClick={() => handleAddSentimiento(candIndex)}
                  className="chart-add-sentimiento-button"
                >
                  + Sentimiento
                </button>
              </div>

              {candidato.sentimientos.map((sent, sentIndex) => (
                <div key={sentIndex} className="chart-sentimiento-item">
                  <input
                    type="text"
                    placeholder="Sentimiento"
                    value={sent.nombre}
                    onChange={(e) => handleSentimientoChange(candIndex, sentIndex, 'nombre', e.target.value)}
                    className="chart-form-input"
                  />
                  <input
                    type="number"
                    placeholder="Valor %"
                    value={sent.valor}
                    onChange={(e) => handleSentimientoChange(candIndex, sentIndex, 'valor', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="chart-form-input chart-sentimiento-valor"
                    min="0"
                    max="100"
                  />
                  <button
                    onClick={() => handleRemoveSentimiento(candIndex, sentIndex)}
                    className="chart-remove-sentimiento-button"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

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

export default HumorSocialModal;
