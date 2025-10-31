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

  const drawTopOfMindChart = async () => {
    if (!canvas) return;

    // Aumentar resolución para mejor calidad (escala 2x)
    const baseWidth = 1920;
    const baseHeight = 900;
    const scale = 2; // Factor de escala para mejor calidad
    const width = baseWidth * scale;
    const height = baseHeight * scale;
    
    const canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    const ctx = canvasElement.getContext('2d');

    // Activar antialiasing y suavizado
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fondo blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Barra superior azul (escalada)
    ctx.fillStyle = '#0C6B75';
    ctx.fillRect(0, 0, width, 60 * scale);

    // Título principal en la barra azul (escalado)
    ctx.font = `bold ${32 * scale}px Arial`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText('Top Of Mind', 30 * scale, 42 * scale);

    // Perfiles con avatares - MEJOR DISTRIBUIDOS Y CENTRADOS
    const avatarY = 140 * scale; // Más abajo para evitar superposición
    const avatarRadius = 55 * scale; // Un poco más grande para mejor visibilidad
    const avatarSpacing = 280 * scale; // MÁS ESPACIO entre avatares
    const startAvatarX = 450 * scale; // Más a la derecha para evitar superposición con título

    // Cargar todas las imágenes primero
    const loadedImages = await Promise.all(
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

    // Dibujar avatares y nombres (todo escalado)
    profiles.forEach((profile, index) => {
      const x = startAvatarX + (index * avatarSpacing);

      // Avatar con borde blanco para contraste
      if (loadedImages[index]) {
        // Borde blanco exterior
        ctx.beginPath();
        ctx.arc(x, avatarY, avatarRadius + (4 * scale), 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, avatarY, avatarRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
          loadedImages[index],
          x - avatarRadius,
          avatarY - avatarRadius,
          avatarRadius * 2,
          avatarRadius * 2
        );
        ctx.restore();

        // Borde negro
        ctx.beginPath();
        ctx.arc(x, avatarY, avatarRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3 * scale;
        ctx.stroke();
      } else {
        // Círculo placeholder
        ctx.beginPath();
        ctx.arc(x, avatarY, avatarRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#E5E7EB';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3 * scale;
        ctx.stroke();
      }

      // Nombre del perfil (escalado)
      const nameLines = profile.name.split('\n');
      ctx.font = `bold ${16 * scale}px Arial`;
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      nameLines.forEach((line, i) => {
        ctx.fillText(line, x, avatarY + avatarRadius + (28 * scale) + (i * 20 * scale));
      });
    });

    // Leyenda en la esquina inferior derecha (escalada)
    const legendY = height - (40 * scale);
    const legendItems = [
      { text: 'Positivo', color: '#10B981', symbol: '+' },
      { text: 'Neutro', color: '#FFA500', symbol: '●' },
      { text: 'Negativo', color: '#DC2626', symbol: '−' }
    ];

    let legendX = width - (400 * scale);
    legendItems.forEach((item) => {
      ctx.fillStyle = item.color;
      ctx.font = `bold ${20 * scale}px Arial`;
      ctx.textAlign = 'left';
      ctx.fillText(item.symbol, legendX, legendY);
      
      ctx.font = `${16 * scale}px Arial`;
      ctx.fillStyle = '#000000';
      ctx.fillText(item.text, legendX + (25 * scale), legendY);
      
      legendX += (130 * scale);
    });

    // Temas con barras (todo escalado para mejor calidad)
    const startY = 280 * scale; // Más abajo para dar espacio a los avatares
    const rowHeight = 53 * scale;
    const maxBarWidth = 1140 * scale;
    const leftMargin = 85 * scale;
    const rightMargin = 220 * scale;
    
    // Calcular el valor máximo para escalar las barras
    const maxValue = Math.max(...topics.map(t => t.value), 1);

    topics.forEach((topic, index) => {
      const y = startY + (index * rowHeight);
      
      // Texto del tema (escalado para mejor calidad)
      ctx.font = `${14 * scale}px Arial`; // Font ligeramente más grande
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      
      const maxTextWidth = maxBarWidth - (20 * scale);
      let displayText = topic.text;
      let textWidth = ctx.measureText(displayText).width;
      
      if (textWidth > maxTextWidth) {
        while (textWidth > maxTextWidth - (30 * scale) && displayText.length > 0) {
          displayText = displayText.slice(0, -1);
          textWidth = ctx.measureText(displayText + '...').width;
        }
        displayText += '...';
      }
      
      ctx.fillText(displayText, leftMargin, y + (15 * scale));

      // Barra de color según sentimiento (escalada)
      const barWidth = maxValue > 0 ? (topic.value / maxValue) * maxBarWidth : 0;
      let barColor;
      
      // Colores corregidos según el sentimiento
      if (topic.sentiment === 'positive') {
        barColor = '#10B981'; // Verde para positivo
      } else if (topic.sentiment === 'negative') {
        barColor = '#DC2626'; // Rojo para negativo
      } else {
        barColor = '#FFA500'; // Naranja para neutro
      }
      
      ctx.fillStyle = barColor;
      ctx.fillRect(leftMargin, y + (22 * scale), barWidth, 24 * scale);

      // Valor numérico al final de la barra (escalado)
      ctx.font = `bold ${18 * scale}px Arial`;
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'right';
      const valueX = width - rightMargin + (90 * scale);
      ctx.fillText(topic.value.toLocaleString(), valueX, y + (40 * scale));

      // Símbolo de sentimiento (escalado)
      ctx.font = `bold ${24 * scale}px Arial`;
      ctx.fillStyle = barColor;
      ctx.textAlign = 'center';
      let symbol = '●';
      if (topic.sentiment === 'positive') symbol = '+';
      if (topic.sentiment === 'negative') symbol = '−';
      ctx.fillText(symbol, valueX + (50 * scale), y + (40 * scale));
    });

    // Importar fabric.Image y agregar al canvas
    // Escalar de vuelta al tamaño original para el canvas de Fabric
    const fabricImg = new FabricImage(canvasElement, {
      left: 0,
      top: 0,
      selectable: true,
      hasControls: true,
      scaleX: 1 / scale, // Escalar de vuelta al tamaño original
      scaleY: 1 / scale, // Esto mantiene la alta resolución pero en el tamaño correcto
    });

    canvas.add(fabricImg);
    canvas.renderAll();
  };

  const handleInsert = async () => {
    await drawTopOfMindChart();
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
