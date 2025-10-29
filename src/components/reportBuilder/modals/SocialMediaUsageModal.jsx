import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Image as FabricImage } from 'fabric';

const SocialMediaUsageModal = ({ isOpen, onClose, canvas }) => {
  const [platforms, setPlatforms] = useState([
    {
      name: 'Facebook',
      logoUrl: 'https://cdn.simpleicons.org/facebook/1877F2',
      color: '#1877F2',
      registeredUsers: '2.76M',
      activeDailyUsers: '1.79 M',
      activeHoursDaily: '1.15 Hrs',
      platformUsers: '2.1 M'
    },
    {
      name: 'YouTube',
      logoUrl: 'https://cdn.simpleicons.org/youtube/FF0000',
      color: '#FF0000',
      registeredUsers: '2.24M',
      activeDailyUsers: '1.43 M',
      activeHoursDaily: '1.33 Hrs',
      platformUsers: '1.9 M'
    },
    {
      name: 'TikTok',
      logoUrl: 'https://cdn.simpleicons.org/tiktok/000000',
      color: '#000000',
      registeredUsers: '2.18M',
      activeDailyUsers: '1.96 M',
      activeHoursDaily: '1.28 Hrs',
      platformUsers: '2.5 M'
    },
    {
      name: 'Instagram',
      logoUrl: 'https://cdn.simpleicons.org/instagram/E4405F',
      color: '#E4405F',
      registeredUsers: '1.23M',
      activeDailyUsers: '0.86 M',
      activeHoursDaily: '1.11 Hrs',
      platformUsers: '1.0 M'
    },
    {
      name: 'X (Twitter)',
      logoUrl: 'https://cdn.simpleicons.org/x/000000',
      color: '#000000',
      registeredUsers: '0.46M',
      activeDailyUsers: '0.27 M',
      activeHoursDaily: '0.40 Hrs',
      platformUsers: '0.1 M'
    },
    {
      name: 'Whatsapp',
      logoUrl: 'https://cdn.simpleicons.org/whatsapp/25D366',
      color: '#25D366',
      registeredUsers: '2.45M',
      activeDailyUsers: '2.01 M',
      activeHoursDaily: '3.00 Hrs',
      platformUsers: '5.5 M'
    }
  ]);
  const canvasRef = useRef(null);
  const [loadedLogos, setLoadedLogos] = useState({});

  // Cargar logos cuando cambian las plataformas
  useEffect(() => {
    const loadLogos = async () => {
      const logoPromises = platforms.map((platform) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve({ url: platform.logoUrl, img });
          img.onerror = () => resolve({ url: platform.logoUrl, img: null });
          img.src = platform.logoUrl;
        });
      });

      const results = await Promise.all(logoPromises);
      const logosMap = {};
      results.forEach(({ url, img }) => {
        if (img) logosMap[url] = img;
      });
      setLoadedLogos(logosMap);
    };

    if (isOpen) {
      loadLogos();
    }
  }, [platforms, isOpen]);

  useEffect(() => {
    if (isOpen && canvasRef.current && Object.keys(loadedLogos).length > 0) {
      drawPreview();
    }
  }, [loadedLogos, platforms, isOpen]);

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
    const startY = 20;
    const rowHeight = 45;
    const columnWidths = [130, 110, 110, 110, 110];

    // Encabezados
    const headers = ['', 'Usuarios registrados', 'Usuarios activos diarios', 'Horas activas diarias', 'Usuarios datos en plataforma'];
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(startX, startY, columnWidths.reduce((a, b) => a + b, 0), 35);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 9px Arial';
    ctx.textAlign = 'center';

    let currentX = startX;
    headers.forEach((header, index) => {
      if (index === 0) {
        currentX += columnWidths[index];
        return;
      }
      ctx.fillText(header, currentX + columnWidths[index] / 2, startY + 22, columnWidths[index] - 10);
      currentX += columnWidths[index];
    });

    // Filas de datos
    let currentY = startY + 35;
    platforms.forEach((platform, index) => {
      // Fondo de fila
      const bgColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
      ctx.fillStyle = bgColor;
      ctx.fillRect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight);

      // Borde superior
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, currentY);
      ctx.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY);
      ctx.stroke();

      // Logo y nombre de la plataforma
      const logo = loadedLogos[platform.logoUrl];
      if (logo) {
        ctx.drawImage(logo, startX + 10, currentY + 14, 20, 20);
      } else {
        // Fallback: dibujar círculo de color si no carga el logo
        ctx.fillStyle = platform.color;
        ctx.beginPath();
        ctx.arc(startX + 20, currentY + 24, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = platform.color;
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(platform.name, startX + 35, currentY + 28);

      // Valores
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';

      currentX = startX + columnWidths[0];
      ctx.fillText(platform.registeredUsers, currentX + columnWidths[1] / 2, currentY + 20);
      
      ctx.font = '9px Arial';
      ctx.fillText('Usuarios registrados', currentX + columnWidths[1] / 2, currentY + 35);

      currentX += columnWidths[1];
      ctx.font = 'bold 12px Arial';
      ctx.fillText(platform.activeDailyUsers, currentX + columnWidths[2] / 2, currentY + 20);
      
      ctx.font = '9px Arial';
      ctx.fillText('Usuarios activos diarios', currentX + columnWidths[2] / 2, currentY + 35);

      currentX += columnWidths[2];
      ctx.font = 'bold 12px Arial';
      ctx.fillText(platform.activeHoursDaily, currentX + columnWidths[3] / 2, currentY + 20);
      
      ctx.font = '9px Arial';
      ctx.fillText('Horas activas diarias', currentX + columnWidths[3] / 2, currentY + 35);

      currentX += columnWidths[3];
      ctx.font = 'bold 12px Arial';
      ctx.fillText(platform.platformUsers, currentX + columnWidths[4] / 2, currentY + 20);
      
      ctx.font = '9px Arial';
      ctx.fillText('Usuarios datos en plataforma', currentX + columnWidths[4] / 2, currentY + 35);

      // Líneas verticales separadoras con borde punteado en la última columna
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      currentX = startX + columnWidths[0];
      
      for (let i = 1; i < columnWidths.length; i++) {
        if (i === columnWidths.length - 1) {
          // Línea punteada para la última columna
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 2;
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = '#e0e0e0';
          ctx.lineWidth = 1;
        }
        
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(currentX, currentY + rowHeight);
        ctx.stroke();
        currentX += columnWidths[i];
      }
      
      ctx.setLineDash([]);

      currentY += rowHeight;
    });

    // Borde inferior
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, currentY);
    ctx.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY);
    ctx.stroke();
  };

  const addPlatform = () => {
    setPlatforms([
      ...platforms,
      {
        name: `Plataforma ${platforms.length + 1}`,
        logoUrl: 'https://cdn.simpleicons.org/genericbrand/000000',
        color: '#000000',
        registeredUsers: '0M',
        activeDailyUsers: '0 M',
        activeHoursDaily: '0 Hrs',
        platformUsers: '0 M'
      }
    ]);
  };

  const removePlatform = (index) => {
    if (platforms.length > 1) {
      setPlatforms(platforms.filter((_, i) => i !== index));
    }
  };

  const updatePlatform = (index, field, value) => {
    const newPlatforms = [...platforms];
    newPlatforms[index][field] = value;
    setPlatforms(newPlatforms);
  };

  const insertTableToCanvas = async () => {
    if (!canvas) return;

    // Asegurarse de que todos los logos estén cargados
    const logoPromises = platforms.map((platform) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve({ url: platform.logoUrl, img });
        img.onerror = () => resolve({ url: platform.logoUrl, img: null });
        img.src = platform.logoUrl;
      });
    });

    const results = await Promise.all(logoPromises);
    const logosMap = {};
    results.forEach(({ url, img }) => {
      if (img) logosMap[url] = img;
    });

    // Crear canvas temporal
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1200;
    tempCanvas.height = 100 + (platforms.length * 90);
    const tempCtx = tempCanvas.getContext('2d');

    // Fondo blanco
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Configuración
    const startX = 20;
    const startY = 40;
    const rowHeight = 90;
    const columnWidths = [260, 220, 220, 220, 220];

    // Encabezados
    const headers = ['', 'Usuarios registrados', 'Usuarios activos diarios', 'Horas activas diarias', 'Usuarios datos en plataforma'];
    tempCtx.fillStyle = '#f5f5f5';
    tempCtx.fillRect(startX, startY, columnWidths.reduce((a, b) => a + b, 0), 60);

    tempCtx.fillStyle = '#000000';
    tempCtx.font = 'bold 16px Arial';
    tempCtx.textAlign = 'center';

    let currentX = startX;
    headers.forEach((header, index) => {
      if (index === 0) {
        currentX += columnWidths[index];
        return;
      }
      
      // Dividir el texto del encabezado en múltiples líneas si es necesario
      const words = header.split(' ');
      let line = '';
      let lineCount = 0;
      const maxWidth = columnWidths[index] - 20;
      const lineHeight = 18;
      
      words.forEach((word, wordIndex) => {
        const testLine = line + word + ' ';
        const metrics = tempCtx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          tempCtx.fillText(line.trim(), currentX + columnWidths[index] / 2, startY + 20 + (lineCount * lineHeight));
          line = word + ' ';
          lineCount++;
        } else {
          line = testLine;
        }
        
        if (wordIndex === words.length - 1) {
          tempCtx.fillText(line.trim(), currentX + columnWidths[index] / 2, startY + 20 + (lineCount * lineHeight));
        }
      });
      
      currentX += columnWidths[index];
    });

    // Filas de datos
    let currentY = startY + 60;
    platforms.forEach((platform, index) => {
      // Fondo de fila
      const bgColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
      tempCtx.fillStyle = bgColor;
      tempCtx.fillRect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight);

      // Borde superior
      tempCtx.strokeStyle = '#e0e0e0';
      tempCtx.lineWidth = 2;
      tempCtx.beginPath();
      tempCtx.moveTo(startX, currentY);
      tempCtx.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY);
      tempCtx.stroke();

      // Logo y nombre de la plataforma
      const logo = logosMap[platform.logoUrl];
      if (logo) {
        tempCtx.drawImage(logo, startX + 20, currentY + 25, 40, 40);
      } else {
        // Fallback: dibujar círculo de color si no carga el logo
        tempCtx.fillStyle = platform.color;
        tempCtx.beginPath();
        tempCtx.arc(startX + 40, currentY + 45, 20, 0, Math.PI * 2);
        tempCtx.fill();
      }

      tempCtx.fillStyle = platform.color;
      tempCtx.font = 'bold 20px Arial';
      tempCtx.textAlign = 'left';
      tempCtx.fillText(platform.name, startX + 70, currentY + 55);

      // Valores
      tempCtx.fillStyle = '#000000';
      tempCtx.font = 'bold 22px Arial';
      tempCtx.textAlign = 'center';

      currentX = startX + columnWidths[0];
      tempCtx.fillText(platform.registeredUsers, currentX + columnWidths[1] / 2, currentY + 38);
      
      tempCtx.font = '14px Arial';
      tempCtx.fillText('Usuarios registrados', currentX + columnWidths[1] / 2, currentY + 65);

      currentX += columnWidths[1];
      tempCtx.font = 'bold 22px Arial';
      tempCtx.fillText(platform.activeDailyUsers, currentX + columnWidths[2] / 2, currentY + 38);
      
      tempCtx.font = '14px Arial';
      tempCtx.fillText('Usuarios activos diarios', currentX + columnWidths[2] / 2, currentY + 65);

      currentX += columnWidths[2];
      tempCtx.font = 'bold 22px Arial';
      tempCtx.fillText(platform.activeHoursDaily, currentX + columnWidths[3] / 2, currentY + 38);
      
      tempCtx.font = '14px Arial';
      tempCtx.fillText('Horas activas diarias', currentX + columnWidths[3] / 2, currentY + 65);

      currentX += columnWidths[3];
      tempCtx.font = 'bold 22px Arial';
      tempCtx.fillText(platform.platformUsers, currentX + columnWidths[4] / 2, currentY + 38);
      
      tempCtx.font = '14px Arial';
      tempCtx.fillText('Usuarios datos en plataforma', currentX + columnWidths[4] / 2, currentY + 65);

      // Líneas verticales separadoras
      tempCtx.strokeStyle = '#e0e0e0';
      tempCtx.lineWidth = 2;
      currentX = startX + columnWidths[0];
      
      for (let i = 1; i < columnWidths.length; i++) {
        if (i === columnWidths.length - 1) {
          // Línea punteada para la última columna
          tempCtx.setLineDash([6, 6]);
          tempCtx.strokeStyle = '#ff0000';
          tempCtx.lineWidth = 3;
        } else {
          tempCtx.setLineDash([]);
          tempCtx.strokeStyle = '#e0e0e0';
          tempCtx.lineWidth = 2;
        }
        
        tempCtx.beginPath();
        tempCtx.moveTo(currentX, currentY);
        tempCtx.lineTo(currentX, currentY + rowHeight);
        tempCtx.stroke();
        currentX += columnWidths[i];
      }
      
      tempCtx.setLineDash([]);

      currentY += rowHeight;
    });

    // Borde inferior
    tempCtx.strokeStyle = '#e0e0e0';
    tempCtx.lineWidth = 2;
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
        scaleX: 0.6,
        scaleY: 0.6
      });
      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      canvas.renderAll();
      handleClose();
    };
    
    imgElement.src = dataURL;
  };

  const handleClose = () => {
    setPlatforms([
      {
        name: 'Facebook',
        logoUrl: 'https://cdn.simpleicons.org/facebook/1877F2',
        color: '#1877F2',
        registeredUsers: '2.76M',
        activeDailyUsers: '1.79 M',
        activeHoursDaily: '1.15 Hrs',
        platformUsers: '2.1 M'
      },
      {
        name: 'YouTube',
        logoUrl: 'https://cdn.simpleicons.org/youtube/FF0000',
        color: '#FF0000',
        registeredUsers: '2.24M',
        activeDailyUsers: '1.43 M',
        activeHoursDaily: '1.33 Hrs',
        platformUsers: '1.9 M'
      },
      {
        name: 'TikTok',
        logoUrl: 'https://cdn.simpleicons.org/tiktok/000000',
        color: '#000000',
        registeredUsers: '2.18M',
        activeDailyUsers: '1.96 M',
        activeHoursDaily: '1.28 Hrs',
        platformUsers: '2.5 M'
      },
      {
        name: 'Instagram',
        logoUrl: 'https://cdn.simpleicons.org/instagram/E4405F',
        color: '#E4405F',
        registeredUsers: '1.23M',
        activeDailyUsers: '0.86 M',
        activeHoursDaily: '1.11 Hrs',
        platformUsers: '1.0 M'
      },
      {
        name: 'X (Twitter)',
        logoUrl: 'https://cdn.simpleicons.org/x/000000',
        color: '#000000',
        registeredUsers: '0.46M',
        activeDailyUsers: '0.27 M',
        activeHoursDaily: '0.40 Hrs',
        platformUsers: '0.1 M'
      },
      {
        name: 'Whatsapp',
        logoUrl: 'https://cdn.simpleicons.org/whatsapp/25D366',
        color: '#25D366',
        registeredUsers: '2.45M',
        activeDailyUsers: '2.01 M',
        activeHoursDaily: '3.00 Hrs',
        platformUsers: '5.5 M'
      }
    ]);
    setLoadedLogos({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h3 className="modal-title">Estudio de Uso de Medios Sociales</h3>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Lista de plataformas */}
          <div className="segments-section">
            <div className="section-header">
              <h4>Plataformas de Redes Sociales</h4>
              <button className="btn-primary btn-sm" onClick={addPlatform}>
                <Plus size={16} />
                Agregar Plataforma
              </button>
            </div>

            <div style={{ marginBottom: '15px', fontSize: '12px', color: '#666' }}>
              <strong>Nota:</strong> Los logos se cargan desde Simple Icons CDN.
              <br />
              Formato: <code>https://cdn.simpleicons.org/[nombre]/[color]</code>
              <br />
              Ejemplo: <code>https://cdn.simpleicons.org/facebook/1877F2</code>
            </div>

            {platforms.map((platform, index) => (
              <div key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 100px 40px', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                    {loadedLogos[platform.logoUrl] ? (
                      <img
                        src={platform.logoUrl}
                        alt={platform.name}
                        style={{ width: '32px', height: '32px' }}
                      />
                    ) : (
                      <div style={{ width: '32px', height: '32px', background: platform.color, borderRadius: '4px' }} />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Nombre de la plataforma"
                    value={platform.name}
                    onChange={(e) => updatePlatform(index, 'name', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="color"
                    value={platform.color}
                    onChange={(e) => updatePlatform(index, 'color', e.target.value)}
                    className="input-color"
                    style={{ width: '100%', height: '38px' }}
                  />
                  <div style={{ fontWeight: 'bold', color: platform.color }}>
                    {platform.name}
                  </div>
                  <button
                    className="btn-danger btn-icon"
                    onClick={() => removePlatform(index)}
                    disabled={platforms.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                    URL del Logo
                  </label>
                  <input
                    type="text"
                    placeholder="https://cdn.simpleicons.org/facebook/1877F2"
                    value={platform.logoUrl}
                    onChange={(e) => updatePlatform(index, 'logoUrl', e.target.value)}
                    className="input-field"
                    style={{ fontSize: '11px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                      Usuarios registrados
                    </label>
                    <input
                      type="text"
                      placeholder="2.76M"
                      value={platform.registeredUsers}
                      onChange={(e) => updatePlatform(index, 'registeredUsers', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                      Usuarios activos diarios
                    </label>
                    <input
                      type="text"
                      placeholder="1.79 M"
                      value={platform.activeDailyUsers}
                      onChange={(e) => updatePlatform(index, 'activeDailyUsers', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                      Horas activas diarias
                    </label>
                    <input
                      type="text"
                      placeholder="1.15 Hrs"
                      value={platform.activeHoursDaily}
                      onChange={(e) => updatePlatform(index, 'activeHoursDaily', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                      Usuarios en plataforma
                    </label>
                    <input
                      type="text"
                      placeholder="2.1 M"
                      value={platform.platformUsers}
                      onChange={(e) => updatePlatform(index, 'platformUsers', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vista previa */}
          <div className="chart-preview">
            <h4>Vista Previa</h4>
            <div className="preview-container" style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
              <canvas ref={canvasRef} width="570" height="350"></canvas>
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

export default SocialMediaUsageModal;
