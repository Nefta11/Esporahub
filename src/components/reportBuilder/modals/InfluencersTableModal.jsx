import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Image as FabricImage } from 'fabric';
import '@/styles/reportBuilder/ChartModals.css';

const InfluencersTableModal = ({ isOpen, onClose, canvas }) => {
  const [title, setTitle] = useState('Influencers (alcance local): Baja California');
  const [subtitle, setSubtitle] = useState('Periodo de análisis: 09 al 29 de abril');
  const [influencers, setInfluencers] = useState([
    { 
      name: 'Influencer 1', 
      username: '@influencer1',
      platform: 'TikTok',
      followers: '37.7M',
      topic: 'Música, entretenimiento'
    },
    { 
      name: 'Influencer 2', 
      username: '@influencer2',
      platform: 'TikTok',
      followers: '6.8M',
      topic: 'Comedia, sketch'
    },
    { 
      name: 'Influencer 3', 
      username: '@influencer3',
      platform: 'TikTok',
      followers: '2.3M',
      topic: 'Vlog, cocina, humor'
    },
    { 
      name: 'Influencer 4', 
      username: '@influencer4',
      platform: 'TikTok',
      followers: '2.1M',
      topic: 'Belleza'
    },
    { 
      name: 'Influencer 5', 
      username: '@influencer5',
      platform: 'TikTok',
      followers: '1.8M',
      topic: 'Moda, belleza'
    },
    { 
      name: 'Influencer 6', 
      username: '@influencer6',
      platform: 'TikTok',
      followers: '3M',
      topic: 'Moda, estilo de vida'
    },
    { 
      name: 'Influencer 7', 
      username: '@influencer7',
      platform: 'TikTok',
      followers: '1.8M',
      topic: 'Entretenimiento, contenido social'
    },
    { 
      name: 'Influencer 8', 
      username: '@influencer8',
      platform: 'TikTok',
      followers: '4.6M',
      topic: 'Comedia, entretenimiento'
    },
    { 
      name: 'Influencer 9', 
      username: '@influencer9',
      platform: 'TikTok',
      followers: '1.2M',
      topic: 'Entretenimiento'
    },
    { 
      name: 'Influencer 10', 
      username: '@influencer10',
      platform: 'Youtube',
      followers: '2.41K',
      topic: 'Música'
    }
  ]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      drawPreview();
    }
  }, [influencers, title, subtitle, isOpen]);

  const drawPreview = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Configuración
    const startX = 10;
    let currentY = 10;
    const rowHeight = 30;
    const headerHeight = 40;
    const columnWidths = [100, 100, 90, 70, 140];

    // Título
    if (title) {
      ctx.fillStyle = '#4A3F7A';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(title, startX, currentY + 15);
      currentY += 25;
    }

    // Subtítulo
    if (subtitle) {
      ctx.fillStyle = '#666666';
      ctx.font = '10px Arial';
      ctx.fillText(subtitle, startX, currentY + 10);
      currentY += 20;
    }

    // Encabezados de tabla
    const headers = ['Nombre', 'Username', 'Red más popular', 'Seguidores', 'Tema'];
    ctx.fillStyle = '#4A3F7A';
    ctx.fillRect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), headerHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px Arial';
    ctx.textAlign = 'center';

    let currentX = startX;
    headers.forEach((header, index) => {
      ctx.fillText(header, currentX + columnWidths[index] / 2, currentY + headerHeight / 2 + 3);
      currentX += columnWidths[index];
    });

    currentY += headerHeight;

    // Filas de datos
    influencers.forEach((influencer, index) => {
      // Fondo de fila alternado
      const bgColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff';
      ctx.fillStyle = bgColor;
      ctx.fillRect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight);

      // Borde superior
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, currentY);
      ctx.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY);
      ctx.stroke();

      // Datos
      ctx.fillStyle = '#000000';
      ctx.font = '9px Arial';
      ctx.textAlign = 'left';

      currentX = startX;

      // Nombre
      ctx.fillText(influencer.name.substring(0, 20), currentX + 5, currentY + rowHeight / 2 + 3);
      currentX += columnWidths[0];

      // Username
      ctx.fillText(influencer.username.substring(0, 18), currentX + 5, currentY + rowHeight / 2 + 3);
      currentX += columnWidths[1];

      // Plataforma
      ctx.textAlign = 'center';
      ctx.fillText(influencer.platform, currentX + columnWidths[2] / 2, currentY + rowHeight / 2 + 3);
      currentX += columnWidths[2];

      // Seguidores
      ctx.fillText(influencer.followers, currentX + columnWidths[3] / 2, currentY + rowHeight / 2 + 3);
      currentX += columnWidths[3];

      // Tema
      ctx.textAlign = 'left';
      ctx.fillText(influencer.topic.substring(0, 28), currentX + 5, currentY + rowHeight / 2 + 3);

      currentY += rowHeight;
    });

    // Borde inferior de la tabla
    ctx.strokeStyle = '#4A3F7A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, currentY);
    ctx.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY);
    ctx.stroke();
  };

  const addInfluencer = () => {
    setInfluencers([
      ...influencers,
      { 
        name: 'Nuevo Influencer', 
        username: '@username',
        platform: 'TikTok',
        followers: '0K',
        topic: 'Tema'
      }
    ]);
  };

  const removeInfluencer = (index) => {
    if (influencers.length > 1) {
      setInfluencers(influencers.filter((_, i) => i !== index));
    }
  };

  const updateInfluencer = (index, field, value) => {
    const newInfluencers = [...influencers];
    newInfluencers[index][field] = value;
    setInfluencers(newInfluencers);
  };

  const insertTableToCanvas = () => {
    if (!canvas) return;

    // Crear canvas temporal
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1100;
    tempCanvas.height = 150 + (influencers.length * 50);
    const tempCtx = tempCanvas.getContext('2d');

    // Fondo blanco
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Configuración
    const startX = 30;
    let currentY = 30;
    const rowHeight = 50;
    const headerHeight = 60;
    const columnWidths = [180, 180, 160, 120, 250];

    // Título
    if (title) {
      tempCtx.fillStyle = '#4A3F7A';
      tempCtx.font = 'bold 24px Arial';
      tempCtx.textAlign = 'left';
      tempCtx.fillText(title, startX, currentY + 20);
      currentY += 35;
    }

    // Subtítulo
    if (subtitle) {
      tempCtx.fillStyle = '#666666';
      tempCtx.font = '16px Arial';
      tempCtx.fillText(subtitle, startX, currentY + 15);
      currentY += 30;
    }

    // Encabezados de tabla
    const headers = ['Nombre', 'Username', 'Red más popular', 'Seguidores', 'Tema'];
    tempCtx.fillStyle = '#4A3F7A';
    tempCtx.fillRect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), headerHeight);

    tempCtx.fillStyle = '#ffffff';
    tempCtx.font = 'bold 16px Arial';
    tempCtx.textAlign = 'center';

    let currentX = startX;
    headers.forEach((header, index) => {
      tempCtx.fillText(header, currentX + columnWidths[index] / 2, currentY + headerHeight / 2 + 6);
      currentX += columnWidths[index];
    });

    currentY += headerHeight;

    // Filas de datos
    influencers.forEach((influencer, index) => {
      // Fondo de fila alternado
      const bgColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff';
      tempCtx.fillStyle = bgColor;
      tempCtx.fillRect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight);

      // Borde superior
      tempCtx.strokeStyle = '#e0e0e0';
      tempCtx.lineWidth = 1;
      tempCtx.beginPath();
      tempCtx.moveTo(startX, currentY);
      tempCtx.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY);
      tempCtx.stroke();

      // Datos
      tempCtx.fillStyle = '#000000';
      tempCtx.font = '15px Arial';
      tempCtx.textAlign = 'left';

      currentX = startX;

      // Nombre
      tempCtx.fillText(influencer.name, currentX + 10, currentY + rowHeight / 2 + 5);
      currentX += columnWidths[0];

      // Username
      tempCtx.fillText(influencer.username, currentX + 10, currentY + rowHeight / 2 + 5);
      currentX += columnWidths[1];

      // Plataforma
      tempCtx.textAlign = 'center';
      tempCtx.fillText(influencer.platform, currentX + columnWidths[2] / 2, currentY + rowHeight / 2 + 5);
      currentX += columnWidths[2];

      // Seguidores
      tempCtx.fillText(influencer.followers, currentX + columnWidths[3] / 2, currentY + rowHeight / 2 + 5);
      currentX += columnWidths[3];

      // Tema
      tempCtx.textAlign = 'left';
      tempCtx.fillText(influencer.topic, currentX + 10, currentY + rowHeight / 2 + 5);

      currentY += rowHeight;
    });

    // Borde inferior de la tabla
    tempCtx.strokeStyle = '#4A3F7A';
    tempCtx.lineWidth = 3;
    tempCtx.beginPath();
    tempCtx.moveTo(startX, currentY);
    tempCtx.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY);
    tempCtx.stroke();

    // Convertir canvas a imagen y agregar al canvas principal
    const dataURL = tempCanvas.toDataURL('image/png');
    const imgElement = new Image();
    
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: 50,
        top: 50,
        scaleX: 0.65,
        scaleY: 0.65
      });
      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      canvas.renderAll();
      handleClose();
    };
    
    imgElement.src = dataURL;
  };

  const handleClose = () => {
    setTitle('Influencers (alcance local): Baja California');
    setSubtitle('Periodo de análisis: 09 al 29 de abril');
    setInfluencers([
      { 
        name: 'Influencer 1', 
        username: '@influencer1',
        platform: 'TikTok',
        followers: '37.7M',
        topic: 'Música, entretenimiento'
      },
      { 
        name: 'Influencer 2', 
        username: '@influencer2',
        platform: 'TikTok',
        followers: '6.8M',
        topic: 'Comedia, sketch'
      },
      { 
        name: 'Influencer 3', 
        username: '@influencer3',
        platform: 'TikTok',
        followers: '2.3M',
        topic: 'Vlog, cocina, humor'
      },
      { 
        name: 'Influencer 4', 
        username: '@influencer4',
        platform: 'TikTok',
        followers: '2.1M',
        topic: 'Belleza'
      },
      { 
        name: 'Influencer 5', 
        username: '@influencer5',
        platform: 'TikTok',
        followers: '1.8M',
        topic: 'Moda, belleza'
      },
      { 
        name: 'Influencer 6', 
        username: '@influencer6',
        platform: 'TikTok',
        followers: '3M',
        topic: 'Moda, estilo de vida'
      },
      { 
        name: 'Influencer 7', 
        username: '@influencer7',
        platform: 'TikTok',
        followers: '1.8M',
        topic: 'Entretenimiento, contenido social'
      },
      { 
        name: 'Influencer 8', 
        username: '@influencer8',
        platform: 'TikTok',
        followers: '4.6M',
        topic: 'Comedia, entretenimiento'
      },
      { 
        name: 'Influencer 9', 
        username: '@influencer9',
        platform: 'TikTok',
        followers: '1.2M',
        topic: 'Entretenimiento'
      },
      { 
        name: 'Influencer 10', 
        username: '@influencer10',
        platform: 'Youtube',
        followers: '2.41K',
        topic: 'Música'
      }
    ]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="chart-modal-overlay" onClick={handleClose}>
      <div className="chart-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="chart-modal-title">Tabla de Influenciadores</h3>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Configuración general */}
          <div className="chart-form-section">
            <h4 className="chart-form-section-title">
              Configuración General
            </h4>

            <div className="chart-form-grid">
              <div>
                <label className="chart-form-label">
                  Estado/Región:
                </label>
                <input
                  type="text"
                  value={title.replace('Influencers (alcance local): ', '')}
                  onChange={(e) => setTitle(`Influencers (alcance local): ${e.target.value}`)}
                  className="chart-form-input"
                  placeholder="Baja California"
                />
              </div>

              <div>
                <label className="chart-form-label">
                  Periodo de Análisis:
                </label>
                <input
                  type="text"
                  value={subtitle.replace('Periodo de análisis: ', '')}
                  onChange={(e) => setSubtitle(`Periodo de análisis: ${e.target.value}`)}
                  className="chart-form-input"
                  placeholder="09 al 29 de abril"
                />
              </div>
            </div>
          </div>

          {/* Lista de influencers */}
          <div className="segments-section">
            <div className="section-header">
              <h4>Influenciadores</h4>
              <button className="btn-primary btn-sm" onClick={addInfluencer}>
                <Plus size={16} />
                Agregar Influencer
              </button>
            </div>

            <div className="chart-table-header">
              <div>Nombre</div>
              <div>Username</div>
              <div>Plataforma</div>
              <div>Seguidores</div>
              <div>Tema</div>
              <div></div>
            </div>

            {influencers.map((influencer, index) => (
              <div
                key={index}
                className="chart-influencer-row"
              >
                <div className="chart-influencer-grid">
                  <div>
                    <label className="chart-form-label chart-form-label-small">
                      Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre del influencer"
                      value={influencer.name}
                      onChange={(e) => updateInfluencer(index, 'name', e.target.value)}
                      className="chart-form-input"
                    />
                  </div>

                  <div>
                    <label className="chart-form-label chart-form-label-small">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={influencer.username}
                      onChange={(e) => updateInfluencer(index, 'username', e.target.value)}
                      className="chart-form-input"
                    />
                  </div>

                  <div>
                    <label className="chart-form-label chart-form-label-small">
                      Plataforma
                    </label>
                    <select
                      value={influencer.platform}
                      onChange={(e) => updateInfluencer(index, 'platform', e.target.value)}
                      className="chart-form-input"
                    >
                      <option value="TikTok">TikTok</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Twitter/X">Twitter/X</option>
                      <option value="Twitch">Twitch</option>
                    </select>
                  </div>

                  <div>
                    <label className="chart-form-label chart-form-label-small">
                      Seguidores
                    </label>
                    <input
                      type="text"
                      placeholder="37.7M"
                      value={influencer.followers}
                      onChange={(e) => updateInfluencer(index, 'followers', e.target.value)}
                      className="chart-form-input"
                    />
                  </div>

                  <div className="chart-button-delete">
                    <button
                      className="btn-danger btn-icon"
                      onClick={() => removeInfluencer(index)}
                      disabled={influencers.length <= 1}
                      title="Eliminar influencer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="chart-form-label chart-form-label-small">
                    Tema / Categoría del Contenido
                  </label>
                  <input
                    type="text"
                    placeholder="Música, entretenimiento, comedia, etc."
                    value={influencer.topic}
                    onChange={(e) => updateInfluencer(index, 'topic', e.target.value)}
                    className="chart-form-input"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Vista previa */}
          <div className="chart-preview">
            <h4>Vista Previa</h4>
            <div className="preview-container">
              <canvas ref={canvasRef} width="500" height="500"></canvas>
            </div>
          </div>
        </div>

        <div className="chart-modal-buttons">
          <button className="chart-modal-button-cancel" onClick={handleClose}>
            Cancelar
          </button>
          <button className="chart-modal-button-insert" onClick={insertTableToCanvas}>
            Insertar Tabla en Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfluencersTableModal;
