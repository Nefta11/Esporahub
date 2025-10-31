import React, { useState } from 'react';
import { X } from 'lucide-react';
import '@/styles/reportBuilder/ChartModals.css';

const TopOfChoiceChartModal = ({ isOpen, onClose, canvas }) => {
  const [profiles, setProfiles] = useState([
    {
      name: 'Personaje 1',
      avatar: '',
      color: '#8B4513',
      noVotaria: 0,
      siVotaria: 0
    },
    {
      name: 'Personaje 2',
      avatar: '',
      color: '#2196F3',
      noVotaria: 0,
      siVotaria: 0
    },
    {
      name: 'Personaje 3',
      avatar: '',
      color: '#FF9800',
      noVotaria: 0,
      siVotaria: 0
    },
  ]);

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

  const drawTopOfChoiceChart = async () => {
    const canvasElement = document.createElement('canvas');
    const width = 480;
    const height = 360; // Aumentado para más espacio
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
    ctx.fillText('Top of Choice', 15, 18);

    // Leyendas superiores
    const legendY = 35;

    // "No votaría por..." (Rojo)
    ctx.beginPath();
    ctx.arc(100, legendY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#C62828';
    ctx.fill();
    ctx.font = '6px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText('No votaría por...', 110, legendY + 2);

    // "Votaría por..." (Verde)
    ctx.beginPath();
    ctx.arc(width - 110, legendY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#2E7D32';
    ctx.fill();
    ctx.fillText('Votaría por...', width - 100, legendY + 2);

    // Línea central vertical
    const centerX = width / 2;
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, 50);
    ctx.lineTo(centerX, height - 30);
    ctx.stroke();

    // Configuración de barras
    const startY = 60;
    const barHeight = 30;
    const spacing = 45; // Aumentado para más espacio entre perfiles
    const maxBarWidth = 180;

    // Cargar todas las imágenes de avatares primero
    const avatarImages = await Promise.all(
      profiles.map(profile => {
        if (profile.avatar) {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = profile.avatar;
          });
        }
        return Promise.resolve(null);
      })
    );

    profiles.forEach((profile, index) => {
      const y = startY + (index * (barHeight + spacing));

      // Avatar y nombre en el centro
      const avatarY = y + (barHeight / 2);

      // Barra "No votaría" (izquierda, roja)
      const noVotariaWidth = (profile.noVotaria / 100) * maxBarWidth;
      ctx.fillStyle = '#C62828';
      ctx.fillRect(centerX - noVotariaWidth, y, noVotariaWidth, barHeight);

      // Porcentaje "No votaría"
      if (profile.noVotaria > 0) {
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(`${profile.noVotaria}%`, centerX - (noVotariaWidth / 2), y + (barHeight / 2) + 3);
      }

      // Barra "Sí votaría" (derecha, verde)
      const siVotariaWidth = (profile.siVotaria / 100) * maxBarWidth;
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(centerX, y, siVotariaWidth, barHeight);

      // Porcentaje "Sí votaría"
      if (profile.siVotaria > 0) {
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(`${profile.siVotaria}%`, centerX + (siVotariaWidth / 2), y + (barHeight / 2) + 3);
      }

      // Avatar (dibujado después de las barras para que esté encima)
      if (avatarImages[index]) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, avatarY, 12, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(avatarImages[index], centerX - 12, avatarY - 12, 24, 24);
        ctx.restore();

        // Borde del avatar
        ctx.beginPath();
        ctx.arc(centerX, avatarY, 12, 0, 2 * Math.PI);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Avatar placeholder
        ctx.beginPath();
        ctx.arc(centerX, avatarY, 12, 0, 2 * Math.PI);
        ctx.fillStyle = profile.color || '#E5E7EB';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Nombre del perfil debajo del avatar
      const nameLines = profile.name.split('\n');
      ctx.font = 'bold 5px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      nameLines.forEach((line, i) => {
        ctx.fillText(line, centerX, avatarY + 20 + (i * 6));
      });
    });

    return canvasElement;
  };

  const handleInsertChart = async () => {
    if (!canvas) return;

    const canvasElement = await drawTopOfChoiceChart();
    const dataURL = canvasElement.toDataURL('image/png');

    const { Image: FabricImage } = await import('fabric');

    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: 100,
        top: 100,
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
          Gráfica Top of Choice
        </h2>

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

            <div className="chart-form-grid-single">
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

            <div className="chart-form-grid">
              <div className="chart-form-field">
                <label className="chart-form-label">
                  No votaría (%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={profile.noVotaria}
                  onChange={(e) => handleProfileChange(index, 'noVotaria', parseInt(e.target.value) || 0)}
                  className="chart-form-input"
                />
              </div>

              <div className="chart-form-field">
                <label className="chart-form-label">
                  Sí votaría (%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={profile.siVotaria}
                  onChange={(e) => handleProfileChange(index, 'siVotaria', parseInt(e.target.value) || 0)}
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

export default TopOfChoiceChartModal;
