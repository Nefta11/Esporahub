import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Image as FabricImage } from 'fabric';

const InfluencersTableModal = ({ isOpen, onClose, canvas }) => {
  const [title, setTitle] = useState('Influencers (alcance local): Baja California');
  const [subtitle, setSubtitle] = useState('Periodo de análisis: 09 al 29 de abril');
  const [influencers, setInfluencers] = useState([
    { 
      name: 'Michel Chávez', 
      username: '@lis.michihn',
      platform: 'TikTok',
      followers: '37.7M',
      topic: 'Música, entretenimiento'
    },
    { 
      name: 'Braulio Rod', 
      username: '@brauliorodrg',
      platform: 'TikTok',
      followers: '6.8M',
      topic: 'Comedia, sketch'
    },
    { 
      name: 'Melissa Muro', 
      username: '@melissamuroo',
      platform: 'TikTok',
      followers: '2.3M',
      topic: 'Vlog, cocina, humor'
    },
    { 
      name: 'Diana Montoya', 
      username: '@montoyadiana_',
      platform: 'TikTok',
      followers: '2.1M',
      topic: 'Belleza'
    },
    { 
      name: 'Marbella Beltrán', 
      username: '@marbellalb',
      platform: 'TikTok',
      followers: '1.8M',
      topic: 'Moda, belleza'
    },
    { 
      name: 'Gisele Peña', 
      username: '@giselepea',
      platform: 'TikTok',
      followers: '3M',
      topic: 'Moda, estilo de vida'
    },
    { 
      name: 'Aarón Yera', 
      username: '@aaronyera',
      platform: 'TikTok',
      followers: '1.8M',
      topic: 'Entretenimiento, contenido social'
    },
    { 
      name: 'Manny Mata', 
      username: '@mannymatamx',
      platform: 'TikTok',
      followers: '4.6M',
      topic: 'Comedia, entretenimiento'
    },
    { 
      name: 'Alex Carlež Verduzco', 
      username: '@tonystarkmex',
      platform: 'TikTok',
      followers: '1.2M',
      topic: 'Entretenimiento'
    },
    { 
      name: 'Tony Coblán', 
      username: 'Tony Coblán music',
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
        name: 'Michel Chávez', 
        username: '@lis.michihn',
        platform: 'TikTok',
        followers: '37.7M',
        topic: 'Música, entretenimiento'
      },
      { 
        name: 'Braulio Rod', 
        username: '@brauliorodrg',
        platform: 'TikTok',
        followers: '6.8M',
        topic: 'Comedia, sketch'
      },
      { 
        name: 'Melissa Muro', 
        username: '@melissamuroo',
        platform: 'TikTok',
        followers: '2.3M',
        topic: 'Vlog, cocina, humor'
      },
      { 
        name: 'Diana Montoya', 
        username: '@montoyadiana_',
        platform: 'TikTok',
        followers: '2.1M',
        topic: 'Belleza'
      },
      { 
        name: 'Marbella Beltrán', 
        username: '@marbellalb',
        platform: 'TikTok',
        followers: '1.8M',
        topic: 'Moda, belleza'
      },
      { 
        name: 'Gisele Peña', 
        username: '@giselepea',
        platform: 'TikTok',
        followers: '3M',
        topic: 'Moda, estilo de vida'
      },
      { 
        name: 'Aarón Yera', 
        username: '@aaronyera',
        platform: 'TikTok',
        followers: '1.8M',
        topic: 'Entretenimiento, contenido social'
      },
      { 
        name: 'Manny Mata', 
        username: '@mannymatamx',
        platform: 'TikTok',
        followers: '4.6M',
        topic: 'Comedia, entretenimiento'
      },
      { 
        name: 'Alex Carlež Verduzco', 
        username: '@tonystarkmex',
        platform: 'TikTok',
        followers: '1.2M',
        topic: 'Entretenimiento'
      },
      { 
        name: 'Tony Coblán', 
        username: 'Tony Coblán music',
        platform: 'Youtube',
        followers: '2.41K',
        topic: 'Música'
      }
    ]);
    onClose();
  };

  if (!isOpen) return null;

  // Estilos para inputs con mejor visibilidad en dark mode
  const inputStyle = {
    width: '100%',
    border: '1px solid #d0d0d0',
    backgroundColor: '#ffffff',
    color: '#000000'
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h3 className="modal-title">Tabla de Influenciadores</h3>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Configuración general */}
          <div style={{ 
            marginBottom: '25px', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#4A3F7A', fontSize: '16px' }}>
              Configuración General
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600', 
                  fontSize: '13px',
                  color: '#333'
                }}>
                  Estado/Región:
                </label>
                <input
                  type="text"
                  value={title.replace('Influencers (alcance local): ', '')}
                  onChange={(e) => setTitle(`Influencers (alcance local): ${e.target.value}`)}
                  className="input-field"
                  placeholder="Baja California"
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600', 
                  fontSize: '13px',
                  color: '#333'
                }}>
                  Periodo de Análisis:
                </label>
                <input
                  type="text"
                  value={subtitle.replace('Periodo de análisis: ', '')}
                  onChange={(e) => setSubtitle(`Periodo de análisis: ${e.target.value}`)}
                  className="input-field"
                  placeholder="09 al 29 de abril"
                  style={inputStyle}
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

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 1fr) 40px', 
              gap: '8px', 
              padding: '10px',
              backgroundColor: '#f0f0f0',
              borderRadius: '6px',
              marginBottom: '10px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#555'
            }}>
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
                style={{ 
                  marginBottom: '12px', 
                  padding: '15px', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px', 
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr 40px', gap: '12px', marginBottom: '10px', alignItems: 'center' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px', 
                      fontSize: '11px', 
                      fontWeight: '600',
                      color: '#666'
                    }}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre del influencer"
                      value={influencer.name}
                      onChange={(e) => updateInfluencer(index, 'name', e.target.value)}
                      className="input-field"
                      style={inputStyle}
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px', 
                      fontSize: '11px', 
                      fontWeight: '600',
                      color: '#666'
                    }}>
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={influencer.username}
                      onChange={(e) => updateInfluencer(index, 'username', e.target.value)}
                      className="input-field"
                      style={inputStyle}
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px', 
                      fontSize: '11px', 
                      fontWeight: '600',
                      color: '#666'
                    }}>
                      Plataforma
                    </label>
                    <select
                      value={influencer.platform}
                      onChange={(e) => updateInfluencer(index, 'platform', e.target.value)}
                      className="input-field"
                      style={inputStyle}
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
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px', 
                      fontSize: '11px', 
                      fontWeight: '600',
                      color: '#666'
                    }}>
                      Seguidores
                    </label>
                    <input
                      type="text"
                      placeholder="37.7M"
                      value={influencer.followers}
                      onChange={(e) => updateInfluencer(index, 'followers', e.target.value)}
                      className="input-field"
                      style={inputStyle}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                    <button
                      className="btn-danger btn-icon"
                      onClick={() => removeInfluencer(index)}
                      disabled={influencers.length <= 1}
                      title="Eliminar influencer"
                      style={{ width: '36px', height: '36px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontSize: '11px', 
                    fontWeight: '600',
                    color: '#666'
                  }}>
                    Tema / Categoría del Contenido
                  </label>
                  <input
                    type="text"
                    placeholder="Música, entretenimiento, comedia, etc."
                    value={influencer.topic}
                    onChange={(e) => updateInfluencer(index, 'topic', e.target.value)}
                    className="input-field"
                    style={inputStyle}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Vista previa */}
          <div className="chart-preview">
            <h4>Vista Previa</h4>
            <div className="preview-container" style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
              <canvas ref={canvasRef} width="500" height="500"></canvas>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={insertTableToCanvas}>
            Insertar Tabla en Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfluencersTableModal;
