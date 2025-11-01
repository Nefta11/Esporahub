import React, { useState } from 'react';
import { X } from 'lucide-react';
import '@/styles/reportBuilder/ChartModals.css';

const TopOfHeartChartModal = ({ isOpen, onClose, canvas }) => {
  const [profiles, setProfiles] = useState([
    { name: 'Personaje 1', avatar: '', color: '#8B4513' },
    { name: 'Personaje 2', avatar: '', color: '#2196F3' },
    { name: 'Personaje 3', avatar: '', color: '#FF9800' },
  ]);

  const [archetypes, setArchetypes] = useState([
    {
      name: 'Trabajador',
      scores: [0, 0, 0]
    },
    {
      name: 'Innovador',
      scores: [0, 0, 0]
    },
    {
      name: 'Tenaz',
      scores: [0, 0, 0]
    },
    {
      name: 'Pragmático',
      scores: [0, 0, 0]
    },
  ]);

  if (!isOpen) return null;

  const handleProfileChange = (index, field, value) => {
    const newProfiles = [...profiles];
    newProfiles[index][field] = value;
    setProfiles(newProfiles);
  };

  const handleArchetypeScoreChange = (archetypeIndex, profileIndex, value) => {
    const newArchetypes = [...archetypes];
    // Convertir el valor a número, permitir decimales
    const numValue = value === '' ? 0 : parseFloat(value);
    newArchetypes[archetypeIndex].scores[profileIndex] = isNaN(numValue) ? 0 : numValue;
    setArchetypes(newArchetypes);
  };

  const handleAvatarUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleProfileChange(index, 'avatar', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawTopOfHeartChart = async () => {
    const canvasElement = document.createElement('canvas');
    const width = 480;
    const height = 270;
    canvasElement.width = width;
    canvasElement.height = height;
    const ctx = canvasElement.getContext('2d');

    // Fondo blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Título principal
    ctx.font = 'bold 9px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText('Top of Heart', 15, 18);

    // Configuración de la tabla
    const startX = 80;
    const startY = 35;
    const columnWidth = 80;
    const rowHeight = 45;
    const circleRadius = 6;
    const maxCircles = 5;

    // Dibujar encabezados de arquetipos
    ctx.font = 'bold 7px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    archetypes.forEach((archetype, index) => {
      const x = startX + (index * columnWidth) + (columnWidth / 2);
      ctx.fillText(archetype.name, x, startY - 10);
    });

    // Dibujar línea horizontal superior
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + (archetypes.length * columnWidth), startY);
    ctx.stroke();

    // Cargar todas las imágenes de avatares primero
    const loadedAvatars = await Promise.all(
      profiles.map(async (profile) => {
        if (profile.avatar) {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = profile.avatar;
          });
        }
        return null;
      })
    );

    // Dibujar cada perfil
    profiles.forEach((profile, profileIndex) => {
      const y = startY + 10 + (profileIndex * rowHeight);

      // Avatar del perfil
      ctx.beginPath();
      ctx.arc(35, y + 10, 12, 0, 2 * Math.PI);
      ctx.fillStyle = profile.color || '#E5E7EB';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Si hay avatar cargado, dibujarlo
      if (loadedAvatars[profileIndex]) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(35, y + 10, 12, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(loadedAvatars[profileIndex], 35 - 12, y + 10 - 12, 24, 24);
        ctx.restore();

        // Redibujar el borde después del clip
        ctx.beginPath();
        ctx.arc(35, y + 10, 12, 0, 2 * Math.PI);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Nombre del perfil
      const nameLines = profile.name.split('\n');
      ctx.font = 'bold 4px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      nameLines.forEach((line, i) => {
        ctx.fillText(line, 50, y + 8 + (i * 5));
      });

      // Dibujar círculos para cada arquetipo
      archetypes.forEach((archetype, archetypeIndex) => {
        const score = archetype.scores[profileIndex];
        const fullCircles = Math.floor(score);
        const hasHalfCircle = (score % 1) >= 0.5;
        
        const colX = startX + (archetypeIndex * columnWidth);
        const circlesStartX = colX + 15;

        // Dibujar círculos completos
        for (let i = 0; i < maxCircles; i++) {
          const cx = circlesStartX + (i * (circleRadius * 2 + 3));
          
          ctx.beginPath();
          ctx.arc(cx, y + 10, circleRadius, 0, 2 * Math.PI);
          
          if (i < fullCircles) {
            // Círculo lleno
            ctx.fillStyle = profile.color || '#E5E7EB';
            ctx.fill();
          } else if (i === fullCircles && hasHalfCircle) {
            // Medio círculo
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, y + 10, circleRadius, 0, 2 * Math.PI);
            ctx.clip();
            ctx.fillStyle = profile.color || '#E5E7EB';
            ctx.fillRect(cx - circleRadius, y + 10 - circleRadius, circleRadius, circleRadius * 2);
            ctx.restore();
          } else {
            // Círculo vacío
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
          }
          
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Línea horizontal separadora
      if (profileIndex < profiles.length - 1) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(startX, y + rowHeight - 10);
        ctx.lineTo(startX + (archetypes.length * columnWidth), y + rowHeight - 10);
        ctx.stroke();
      }
    });

    // Línea horizontal inferior
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const finalY = startY + 10 + (profiles.length * rowHeight);
    ctx.moveTo(startX, finalY);
    ctx.lineTo(startX + (archetypes.length * columnWidth), finalY);
    ctx.stroke();

    // Escala de referencia (abajo derecha)
    const legendY = height - 25;
    const legendX = width - 130;
    ctx.font = '5px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText('Escala:', legendX, legendY);

    // Dibujar círculos de la leyenda
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(legendX + 28 + (i * 12), legendY - 2, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    ctx.fillText('= 100% menciones', legendX + 88, legendY);

    return canvasElement;
  };

  const handleInsertChart = async () => {
    if (!canvas) return;

    const canvasElement = await drawTopOfHeartChart();
    const dataURL = canvasElement.toDataURL('image/png');

    const { Image: FabricImage } = await import('fabric');

    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: 100,
        top: 100,
        selectable: true,
        hasControls: true,
        name: 'top-of-heart-chart'
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
          Gráfica Top of Heart
        </h2>

        {/* Sección de Perfiles */}
        <div className="chart-profile-card">
          <h3>Perfiles</h3>

          {profiles.map((profile, index) => (
            <div key={index}>
              <div className="chart-form-grid">
                <div className="chart-form-field">
                  <label className="chart-form-label">
                    Nombre Perfil {index + 1}:
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange(index, 'name', e.target.value)}
                    placeholder="Nombre del perfil"
                    className="chart-form-input"
                  />
                </div>

                <div className="chart-form-field">
                  <label className="chart-form-label">
                    Color:
                  </label>
                  <input
                    type="color"
                    value={profile.color}
                    onChange={(e) => handleProfileChange(index, 'color', e.target.value)}
                    className="chart-form-input"
                  />
                </div>

                <div className="chart-form-field">
                  <label className="chart-form-label">
                    Avatar:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAvatarUpload(index, e)}
                    className="chart-form-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Arquetipos y Puntuaciones */}
        <div className="chart-profile-card">
          <h3>Arquetipos y Puntuaciones (0-5, decimales permitidos)</h3>

          {archetypes.map((archetype, archetypeIndex) => (
            <div key={archetypeIndex}>
              <div className="chart-form-field">
                <label className="chart-form-label">
                  <strong>{archetype.name}:</strong>
                </label>
              </div>

              <div className="chart-form-grid">
                {profiles.map((profile, profileIndex) => (
                  <div key={profileIndex} className="chart-form-field">
                    <label className="chart-form-label">
                      {profile.name.split('\n')[0]}:
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="5"
                      value={archetype.scores[profileIndex]}
                      onChange={(e) => handleArchetypeScoreChange(archetypeIndex, profileIndex, e.target.value)}
                      className="chart-form-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
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

export default TopOfHeartChartModal;
