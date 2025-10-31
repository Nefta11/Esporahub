import React, { useState } from 'react';
import { Image as FabricImage } from 'fabric';
import '@/styles/reportBuilder/ChartModals.css';

const TopOfVoiceChartModal = ({ isOpen, onClose, canvas }) => {
  const [profiles, setProfiles] = useState([
    {
      name: 'Personaje 1',
      avatar: '',
      color: '#8B4513',
      percentage: 0,
      mentions: 0
    },
    {
      name: 'Personaje 2',
      avatar: '',
      color: '#2196F3',
      percentage: 0,
      mentions: 0
    },
    {
      name: 'Personaje 3',
      avatar: '',
      color: '#FF9800',
      percentage: 0,
      mentions: 0
    },
  ]);

  const [totalMentions, setTotalMentions] = useState(0);

  if (!isOpen) return null;

  const handleProfileChange = (index, field, value) => {
    const newProfiles = [...profiles];
    newProfiles[index][field] = value;
    setProfiles(newProfiles);
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

  const drawTopOfVoiceChart = () => {
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
    ctx.fillText('Top of Voice', 15, 18);

    // Configuración del donut chart
    const centerX = 150;
    const centerY = 135;
    const radius = 80;
    const innerRadius = 55;

    // Calcular total de porcentajes
    const total = profiles.reduce((sum, p) => sum + p.percentage, 0);
    let currentAngle = -Math.PI / 2; // Empezar desde arriba

    // Dibujar segmentos del donut
    profiles.forEach((profile) => {
      const sliceAngle = (profile.percentage / 100) * 2 * Math.PI;

      // Dibujar el segmento exterior
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = profile.color;
      ctx.fill();

      // Dibujar porcentaje en el segmento
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelRadius = (radius + innerRadius) / 2;
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;

      ctx.font = 'bold 10px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${profile.percentage}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });

    // Dibujar círculo interior (blanco)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Texto central: Total de menciones
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(totalMentions.toLocaleString(), centerX, centerY - 10);

    ctx.font = 'bold 9px Arial';
    ctx.fillText('Menciones', centerX, centerY + 8);

    // Dibujar puntos decorativos debajo
    const dotY = centerY + 20;
    const dotSpacing = 4;
    const dotsCount = 15;
    const dotsStartX = centerX - ((dotsCount - 1) * dotSpacing) / 2;

    ctx.fillStyle = '#00BCD4';
    for (let i = 0; i < dotsCount; i++) {
      ctx.beginPath();
      ctx.arc(dotsStartX + (i * dotSpacing), dotY, 1.5, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Leyenda lateral derecha con círculos de progreso
    const legendX = 320;
    const legendStartY = 50;
    const legendSpacing = 60;

    profiles.forEach((profile, index) => {
      const y = legendStartY + (index * legendSpacing);

      // Círculo de progreso (gris con color)
      const progressRadius = 20;
      const progressCenterX = legendX;
      const progressCenterY = y;

      // Fondo gris
      ctx.beginPath();
      ctx.arc(progressCenterX, progressCenterY, progressRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Progreso coloreado
      const progressAngle = (profile.percentage / 100) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(progressCenterX, progressCenterY, progressRadius, -Math.PI / 2, -Math.PI / 2 + progressAngle);
      ctx.strokeStyle = profile.color;
      ctx.lineWidth = 6;
      ctx.stroke();

      // Porcentaje dentro del círculo
      ctx.font = 'bold 8px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${profile.percentage}%`, progressCenterX, progressCenterY);

      // Avatar al lado derecho del círculo
      const avatarX = progressCenterX + 35;
      const avatarRadius = 12;

      ctx.beginPath();
      ctx.arc(avatarX, progressCenterY, avatarRadius, 0, 2 * Math.PI);
      ctx.fillStyle = profile.color;
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Si hay avatar cargado, dibujarlo
      if (profile.avatar) {
        const img = new Image();
        img.src = profile.avatar;
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, progressCenterY, avatarRadius, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, avatarX - avatarRadius, progressCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        ctx.restore();
      }

      // Nombre del perfil
      const nameLines = profile.name.split('\n');
      ctx.font = 'bold 6px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      nameLines.forEach((line, i) => {
        ctx.fillText(line, avatarX + 18, progressCenterY - 3 + (i * 7));
      });
    });

    // Descripción inferior
    ctx.font = '5px Arial';
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'left';
    const descText = 'Proporción de menciones totales en redes sociales sobre cada candidato durante';
    const descText2 = 'el periodo analizado';
    ctx.fillText(descText, 260, height - 20);
    ctx.fillText(descText2, 260, height - 12);

    return canvasElement;
  };

  const handleInsertChart = () => {
    if (!canvas) return;

    const canvasElement = drawTopOfVoiceChart();

    const fabricImg = new FabricImage(canvasElement, {
      left: 100,
      top: 100,
      selectable: true,
      hasControls: true,
    });

    canvas.add(fabricImg);
    canvas.renderAll();
    onClose();
  };

  return (
    <div className="chart-modal-overlay">
      <div className="chart-modal-container">
        <h2 className="chart-modal-title">
          Configurar Gráfica de Top of Voice
        </h2>

        <div className="chart-form-grid-single">
          <div className="chart-form-field">
            <label className="chart-form-label">
              Total de Menciones:
            </label>
            <input
              type="number"
              value={totalMentions}
              onChange={(e) => setTotalMentions(parseInt(e.target.value) || 0)}
              className="chart-form-input"
            />
          </div>
        </div>

        {profiles.map((profile, index) => (
          <div key={index} className="chart-profile-card">
            <h3>
              Perfil {index + 1}
            </h3>

            <div className="chart-form-grid">
              <div className="chart-form-field">
                <label className="chart-form-label">
                  Nombre:
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange(index, 'name', e.target.value)}
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
            </div>

            <div className="chart-form-grid">
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

              <div className="chart-form-field">
                <label className="chart-form-label">
                  Porcentaje (%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={profile.percentage}
                  onChange={(e) => handleProfileChange(index, 'percentage', parseInt(e.target.value) || 0)}
                  className="chart-form-input"
                />
              </div>
            </div>

            <div className="chart-form-grid-single">
              <div className="chart-form-field">
                <label className="chart-form-label">
                  Menciones:
                </label>
                <input
                  type="number"
                  min="0"
                  value={profile.mentions}
                  onChange={(e) => handleProfileChange(index, 'mentions', parseInt(e.target.value) || 0)}
                  className="chart-form-input"
                />
              </div>
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

export default TopOfVoiceChartModal;
