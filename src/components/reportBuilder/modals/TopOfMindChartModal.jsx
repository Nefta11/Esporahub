import React, { useState } from 'react';
import { Image as FabricImage } from 'fabric';
import '@/styles/reportBuilder/ChartModals.css';

const initialProfiles = [
  { name: 'Personaje 1', avatar: '' },
  { name: 'Personaje 2', avatar: '' },
  { name: 'Personaje 3', avatar: '' },
];

const initialTopics = [
  { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', value: 0, sentiment: 'positive' },
  { text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', value: 0, sentiment: 'negative' },
  { text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', value: 0, sentiment: 'positive' },
  { text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', value: 0, sentiment: 'negative' },
  { text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', value: 0, sentiment: 'neutral' },
];

const TopOfMindChartModal = ({ isOpen, onClose, canvas }) => {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [topics, setTopics] = useState(initialTopics);

  if (!isOpen) return null;

  const handleProfileChange = (index, field, value) => {
    const updated = [...profiles];
    updated[index][field] = value;
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

  const handleTopicChange = (index, field, value) => {
    const updated = [...topics];
    if (field === 'value') {
      updated[index][field] = parseInt(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setTopics(updated);
  };

  const addTopic = () => {
    setTopics([...topics, { text: 'Nuevo tema', value: 100000, sentiment: 'neutral' }]);
  };

  const removeTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const drawTopOfMindChart = () => {
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

    // Título principal
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText('Top Of Mind', 30, 35);

    // Perfiles con avatares (parte superior)
    const avatarY = 20;
    const avatarSpacing = 100;
    const startAvatarX = 130;

    profiles.forEach((profile, index) => {
      const x = startAvatarX + (index * avatarSpacing);

      // Avatar
      if (profile.avatar) {
        const img = new Image();
        img.src = profile.avatar;
        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, avatarY, 20, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, x - 20, avatarY - 20, 40, 40);
          ctx.restore();

          // Borde
          ctx.beginPath();
          ctx.arc(x, avatarY, 20, 0, 2 * Math.PI);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.stroke();
        };
      } else {
        ctx.beginPath();
        ctx.arc(x, avatarY, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#E5E7EB';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Nombre
      const nameLines = profile.name.split('\n');
      ctx.font = 'bold 9px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      nameLines.forEach((line, i) => {
        ctx.fillText(line, x, avatarY + 30 + (i * 10));
      });
    });

    // Leyenda
    const legendY = 60;
    const legendItems = [
      { text: 'Positivo', color: '#10B981', symbol: '+' },
      { text: 'Neutro', color: '#F59E0B', symbol: '●' },
      { text: 'Negativo', color: '#EF4444', symbol: '−' }
    ];

    let legendX = width - 250;
    legendItems.forEach((item, index) => {
      ctx.fillStyle = item.color;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(item.symbol, legendX, legendY);
      
      ctx.font = '11px Arial';
      ctx.fillStyle = '#000000';
      ctx.fillText(item.text, legendX + 20, legendY);
      
      legendX += 80;
    });

    // Temas con barras
    const startY = 85;
    const barHeight = 35;
    const spacing = 5;
    const maxWidth = 700;
    const maxValue = Math.max(...topics.map(t => t.value));

    topics.forEach((topic, index) => {
      const y = startY + (index * (barHeight + spacing));
      
      // Texto del tema (máximo 3 líneas)
      ctx.font = '8px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      
      const words = topic.text.split(' ');
      const maxTextWidth = 670;
      const lines = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth && currentLine !== '') {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine.trim());
      
      // Mostrar máximo 2 líneas
      lines.slice(0, 2).forEach((line, i) => {
        ctx.fillText(line, 80, y + 10 + (i * 10));
      });

      // Barra de color según sentimiento
      const barWidth = (topic.value / maxValue) * maxWidth;
      let barColor;
      switch (topic.sentiment) {
        case 'positive':
          barColor = '#10B981';
          break;
        case 'negative':
          barColor = '#EF4444';
          break;
        case 'neutral':
          barColor = '#F59E0B';
          break;
        default:
          barColor = '#6B7280';
      }
      
      ctx.fillStyle = barColor;
      ctx.fillRect(80, y + 25, barWidth, 10);

      // Valor numérico
      ctx.font = 'bold 11px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'right';
      ctx.fillText(topic.value.toLocaleString(), width - 20, y + 33);

      // Símbolo de sentimiento
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = barColor;
      ctx.textAlign = 'center';
      let symbol = '●';
      if (topic.sentiment === 'positive') symbol = '+';
      if (topic.sentiment === 'negative') symbol = '−';
      ctx.fillText(symbol, width - 50, y + 33);
    });

    // Importar fabric.Image y agregar al canvas
    const fabricImg = new FabricImage(canvasElement, {
      left: 0,
      top: 0,
      selectable: true,
      hasControls: true,
    });

    canvas.add(fabricImg);
    canvas.renderAll();
  };

  const handleInsert = () => {
    drawTopOfMindChart();
    onClose();
  };

  return (
    <div className="chart-modal-overlay">
      <div className="chart-modal-container">
        <h2 className="chart-modal-title">
          Configurar Gráfica Top of Mind
        </h2>

        {/* Perfiles */}
        <div className="mb-24">
          <h3 className="section-heading">Perfiles</h3>
          <div className="grid-3-col">
            {profiles.map((profile, index) => (
              <div key={index} className="chart-profile-card">
                <label className="chart-form-label">
                  Nombre:
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange(index, 'name', e.target.value)}
                  className="chart-form-input"
                />
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
            ))}
          </div>
        </div>

        {/* Temas */}
        <div className="mb-24">
          <div className="section-header-row">
            <h3 className="section-heading-no-margin">Temas (Top of Mind)</h3>
            <button
              onClick={addTopic}
              className="chart-add-button"
            >
              + Agregar Tema
            </button>
          </div>

          <div className="scrollable-container">
            {topics.map((topic, index) => (
              <div key={index} className="topic-card">
                <div className="grid-label-auto-auto">
                  <label className="topic-label">Tema {index + 1}</label>
                  <select
                    value={topic.sentiment}
                    onChange={(e) => handleTopicChange(index, 'sentiment', e.target.value)}
                    className="chart-form-select"
                  >
                    <option value="positive">Positivo</option>
                    <option value="neutral">Neutro</option>
                    <option value="negative">Negativo</option>
                  </select>
                  <button
                    onClick={() => removeTopic(index)}
                    className="chart-delete-button"
                  >
                    Eliminar
                  </button>
                </div>
                <textarea
                  value={topic.text}
                  onChange={(e) => handleTopicChange(index, 'text', e.target.value)}
                  rows={2}
                  className="chart-form-textarea"
                />
                <input
                  type="number"
                  value={topic.value}
                  onChange={(e) => handleTopicChange(index, 'value', e.target.value)}
                  placeholder="Valor"
                  className="chart-form-input"
                />
              </div>
            ))}
          </div>
        </div>

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

export default TopOfMindChartModal;
