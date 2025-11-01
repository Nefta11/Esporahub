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
    
    // Aumentar resolución para mejor calidad (escala 3x)
    const baseWidth = 960;
    const baseHeight = 540;
    const scale = 3;
    const width = baseWidth * scale;
    const height = baseHeight * scale;
    
    canvasElement.width = width;
    canvasElement.height = height;
    const ctx = canvasElement.getContext('2d');

    // Activar antialiasing y suavizado
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fondo blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Título principal (escalado)
    ctx.font = `bold ${27 * scale}px Arial`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText('Top of Choice', 45 * scale, 54 * scale);

    // Línea central vertical (escalada) - DEFINIR PRIMERO
    const centerX = width / 2;

    // Leyendas superiores (escaladas y centradas)
    const legendY = 105 * scale;

    // "No votaría por..." (Rojo) - centrado en el lado izquierdo
    const leftLegendX = centerX / 2; // Centro del cuadrante izquierdo
    ctx.beginPath();
    ctx.arc(leftLegendX - (90 * scale), legendY, 12 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#C62828';
    ctx.fill();
    ctx.font = `${18 * scale}px Arial`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText('No votaría por...', leftLegendX - (60 * scale), legendY + (6 * scale));

    // "Votaría por..." (Verde) - centrado en el lado derecho
    const rightLegendX = centerX + (centerX / 2); // Centro del cuadrante derecho
    ctx.beginPath();
    ctx.arc(rightLegendX - (75 * scale), legendY, 12 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#2E7D32';
    ctx.fill();
    ctx.fillText('Votaría por...', rightLegendX - (45 * scale), legendY + (6 * scale));

    // Dibujar la línea central vertical
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(centerX, 150 * scale);
    ctx.lineTo(centerX, height - (90 * scale));
    ctx.stroke();

    // Configuración de barras (escaladas)
    const startY = 180 * scale;
    const barHeight = 90 * scale;
    const spacing = 135 * scale;
    const maxBarWidth = 540 * scale;

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
      const avatarRadius = 36 * scale;

      // Barra "No votaría" (izquierda, roja)
      const noVotariaWidth = (profile.noVotaria / 100) * maxBarWidth;
      ctx.fillStyle = '#C62828';
      ctx.fillRect(centerX - noVotariaWidth, y, noVotariaWidth, barHeight);

      // Porcentaje "No votaría" - solo mostrar si hay suficiente espacio (evitar superposición con avatar)
      const minBarWidthForText = 80 * scale; // Ancho mínimo para mostrar texto sin superposición
      if (profile.noVotaria > 0 && noVotariaWidth > minBarWidthForText) {
        ctx.font = `bold ${30 * scale}px Arial`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(`${profile.noVotaria}%`, centerX - (noVotariaWidth / 2), y + (barHeight / 2) + (9 * scale));
      }

      // Barra "Sí votaría" (derecha, verde)
      const siVotariaWidth = (profile.siVotaria / 100) * maxBarWidth;
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(centerX, y, siVotariaWidth, barHeight);

      // Porcentaje "Sí votaría" - solo mostrar si hay suficiente espacio (evitar superposición con avatar)
      if (profile.siVotaria > 0 && siVotariaWidth > minBarWidthForText) {
        ctx.font = `bold ${30 * scale}px Arial`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(`${profile.siVotaria}%`, centerX + (siVotariaWidth / 2), y + (barHeight / 2) + (9 * scale));
      }

      // Avatar (dibujado después de las barras para que esté encima)
      if (avatarImages[index]) {
        // Borde blanco exterior para mejor contraste
        ctx.beginPath();
        ctx.arc(centerX, avatarY, avatarRadius + (6 * scale), 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, avatarY, avatarRadius, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(
          avatarImages[index], 
          centerX - avatarRadius, 
          avatarY - avatarRadius, 
          avatarRadius * 2, 
          avatarRadius * 2
        );
        ctx.restore();

        // Borde del avatar
        ctx.beginPath();
        ctx.arc(centerX, avatarY, avatarRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6 * scale;
        ctx.stroke();
      } else {
        // Avatar placeholder
        ctx.beginPath();
        ctx.arc(centerX, avatarY, avatarRadius, 0, 2 * Math.PI);
        ctx.fillStyle = profile.color || '#E5E7EB';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6 * scale;
        ctx.stroke();
      }

      // Nombre del perfil debajo del avatar
      const nameLines = profile.name.split('\n');
      ctx.font = `bold ${15 * scale}px Arial`;
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      nameLines.forEach((line, i) => {
        ctx.fillText(line, centerX, avatarY + (60 * scale) + (i * (18 * scale)));
      });
    });

    return canvasElement;
  };

  const handleInsertChart = async () => {
    if (!canvas) return;

    const canvasElement = await drawTopOfChoiceChart();

    const { Image: FabricImage } = await import('fabric');

    const fabricImg = new FabricImage(canvasElement, {
      left: 100,
      top: 100,
      selectable: true,
      hasControls: true,
      name: 'top-of-choice-chart',
      scaleX: 0.5 / 3, // Reducido a la mitad del tamaño base (50% de 960px = 480px)
      scaleY: 0.5 / 3, // Mantiene la alta resolución en tamaño más pequeño
    });

    canvas.add(fabricImg);
    canvas.setActiveObject(fabricImg);
    canvas.renderAll();
    onClose();
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
