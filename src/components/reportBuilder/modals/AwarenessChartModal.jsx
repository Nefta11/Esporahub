import React, { useState } from 'react';
import { Image as FabricImage } from 'fabric';
import '@/styles/reportBuilder/ChartModals.css';

const initialProfiles = [
  { name: 'Personaje 1', avatar: '', alcance: 0, impresiones: 0, color: '#0D7377' },
  { name: 'Personaje 2', avatar: '', alcance: 0, impresiones: 0, color: '#0D7377' },
  { name: 'Personaje 3', avatar: '', alcance: 0, impresiones: 0, color: '#0D7377' },
];

const AwarenessChartModal = ({ isOpen, onClose, canvas }) => {
  const [profiles, setProfiles] = useState(initialProfiles);

  if (!isOpen) return null;

  const handleProfileChange = (index, field, value) => {
    const updated = [...profiles];
    updated[index][field] = field === 'alcance' || field === 'impresiones' ? parseInt(value) || 0 : value;
    setProfiles(updated);
  };

  const handleAvatarUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = [...profiles];
      updated[index].avatar = ev.target.result;
      setProfiles(updated);
    };
    reader.readAsDataURL(file);
  };

  const drawAwarenessChart = () => {
    if (!canvas) return;

    const width = 960;
    const height = 540;
    const canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    const ctx = canvasElement.getContext('2d');

    // Fondo blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Título
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText('Awareness', 40, 60);

    // Leyenda (centrada)
    const legendX = 600;
    const legendY = 50;

    ctx.fillStyle = '#14B8A6';
    ctx.fillRect(legendX, legendY, 20, 20);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText('Alcance', legendX + 30, legendY + 15);

    ctx.fillStyle = '#0D7377';
    ctx.fillRect(legendX + 150, legendY, 20, 20);
    ctx.fillText('Impresiones', legendX + 180, legendY + 15);

    // Calcular máximo valor para escala
    const maxValue = Math.max(...profiles.map(p => Math.max(p.alcance, p.impresiones)));
    const scale = maxValue > 0 ? 650 / maxValue : 0;

    // Configuración de barras
    const barHeight = 35;
    const profileSpacing = 110;
    const startY = 140;
    const startX = 120;

    profiles.forEach((profile, index) => {
      const yPos = startY + (index * profileSpacing);

      // Avatar
      if (profile.avatar) {
        const img = new Image();
        img.src = profile.avatar;
        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(70, yPos + 20, 35, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, 35, yPos - 15, 70, 70);
          ctx.restore();

          // Borde del avatar
          ctx.beginPath();
          ctx.arc(70, yPos + 20, 35, 0, 2 * Math.PI);
          ctx.strokeStyle = profile.color;
          ctx.lineWidth = 3;
          ctx.stroke();
        };
      } else {
        // Círculo placeholder
        ctx.beginPath();
        ctx.arc(70, yPos + 20, 35, 0, 2 * Math.PI);
        ctx.fillStyle = '#E5E7EB';
        ctx.fill();
        ctx.strokeStyle = profile.color;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Nombre
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText(profile.name, 70, yPos + 70);

      // Barra de Alcance (verde claro)
      const alcanceWidth = profile.alcance * scale;
      ctx.fillStyle = '#14B8A6';
      ctx.fillRect(startX, yPos, alcanceWidth, barHeight);

      // Valor de Alcance
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      ctx.fillText(profile.alcance.toLocaleString(), startX + alcanceWidth + 10, yPos + 22);

      // Barra de Impresiones (verde oscuro)
      const impresionesWidth = profile.impresiones * scale;
      ctx.fillStyle = '#0D7377';
      ctx.fillRect(startX, yPos + barHeight + 8, impresionesWidth, barHeight);

      // Valor de Impresiones
      ctx.fillText(profile.impresiones.toLocaleString(), startX + impresionesWidth + 10, yPos + barHeight + 30);
    });

    // Grid lines
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    const gridSteps = 5;
    for (let i = 0; i <= gridSteps; i++) {
      const x = startX + (650 / gridSteps) * i;
      ctx.beginPath();
      ctx.moveTo(x, 100);
      ctx.lineTo(x, height - 40);
      ctx.stroke();

      // Etiquetas del eje X
      const value = maxValue > 0 ? Math.round((maxValue / gridSteps) * i) : 0;
      ctx.font = '12px Arial';
      ctx.fillStyle = '#6B7280';
      ctx.textAlign = 'center';
      ctx.fillText(value.toLocaleString(), x, height - 20);
    }

    // Agregar al canvas de Fabric
    const fabricImg = new FabricImage(canvasElement, {
      left: 50,
      top: 50,
      scaleX: 0.8,
      scaleY: 0.8,
      selectable: true,
      hasControls: true,
      name: 'awareness-chart'
    });

    canvas.add(fabricImg);
    canvas.renderAll();
  };

  const handleInsert = () => {
    drawAwarenessChart();
    onClose();
  };

  return (
    <div className="chart-modal-overlay">
      <div className="chart-modal-container">
        <h2 className="chart-modal-title">
          Configurar Gráfica de Awareness
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

            <div className="chart-form-grid-single">
              <div className="chart-form-field">
                <label className="chart-form-label">
                  Alcance:
                </label>
                <input
                  type="number"
                  value={profile.alcance}
                  onChange={(e) => handleProfileChange(index, 'alcance', e.target.value)}
                  className="chart-form-input"
                />
              </div>

              <div className="chart-form-field">
                <label className="chart-form-label">
                  Impresiones:
                </label>
                <input
                  type="number"
                  value={profile.impresiones}
                  onChange={(e) => handleProfileChange(index, 'impresiones', e.target.value)}
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
            onClick={handleInsert}
            className="chart-modal-button-insert"
          >
            Insertar Gráfica
          </button>
        </div>
      </div>
    </div>
  );
};

export default AwarenessChartModal;
