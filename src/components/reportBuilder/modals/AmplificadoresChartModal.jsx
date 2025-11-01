import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import '@/styles/reportBuilder/ChartModals.css';

const AmplificadoresChartModal = ({ isOpen, onClose, canvas }) => {
  const [profiles, setProfiles] = useState([
    {
      name: 'Personaje 1',
      avatar: '',
      color: '#8B4513',
      medios: [
        { medio: 'Medio 1', titulo: 'Lorem ipsum dolor sit amet', impacto: 0 },
        { medio: 'Medio 2', titulo: 'Consectetur adipiscing elit', impacto: 0 },
      ],
      outlets: [
        { outlet: 'Outlet 1', titulo: 'Sed do eiusmod tempor incididunt', impacto: 0 },
        { outlet: 'Outlet 2', titulo: 'Ut labore et dolore magna aliqua', impacto: 0 },
      ],
      influenciadores: [
        { username: 'influencer1', seguidores: 0 },
        { username: 'influencer2', seguidores: 0 },
      ]
    },
    {
      name: 'Personaje 2',
      avatar: '',
      color: '#2196F3',
      medios: [],
      outlets: [],
      influenciadores: []
    },
    {
      name: 'Personaje 3',
      avatar: '',
      color: '#FF9800',
      medios: [],
      outlets: [],
      influenciadores: []
    },
  ]);

  if (!isOpen) return null;

  const handleProfileChange = (profileIndex, field, value) => {
    const newProfiles = [...profiles];
    newProfiles[profileIndex][field] = value;
    setProfiles(newProfiles);
  };

  const handleAvatarUpload = (profileIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleProfileChange(profileIndex, 'avatar', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMedio = (profileIndex) => {
    const newProfiles = [...profiles];
    newProfiles[profileIndex].medios.push({ medio: '', titulo: '', impacto: 0 });
    setProfiles(newProfiles);
  };

  const handleRemoveMedio = (profileIndex, medioIndex) => {
    const newProfiles = [...profiles];
    newProfiles[profileIndex].medios.splice(medioIndex, 1);
    setProfiles(newProfiles);
  };

  const handleMedioChange = (profileIndex, medioIndex, field, value) => {
    const newProfiles = [...profiles];
    newProfiles[profileIndex].medios[medioIndex][field] = value;
    setProfiles(newProfiles);
  };

  const handleAddOutlet = (profileIndex) => {
    const newProfiles = [...profiles];
    newProfiles[profileIndex].outlets.push({ outlet: '', titulo: '', impacto: 0 });
    setProfiles(newProfiles);
  };

  const handleRemoveOutlet = (profileIndex, outletIndex) => {
    const newProfiles = [...profiles];
    newProfiles[profileIndex].outlets.splice(outletIndex, 1);
    setProfiles(newProfiles);
  };

  const handleOutletChange = (profileIndex, outletIndex, field, value) => {
    const newProfiles = [...profiles];
    newProfiles[profileIndex].outlets[outletIndex][field] = value;
    setProfiles(newProfiles);
  };

  const handleAddInfluencer = (profileIndex) => {
    const newProfiles = [...profiles];
    newProfiles[profileIndex].influenciadores.push({ username: '', seguidores: 0 });
    setProfiles(newProfiles);
  };

  const handleRemoveInfluencer = (profileIndex, influencerIndex) => {
    const newProfiles = [...profiles];
    newProfiles[profileIndex].influenciadores.splice(influencerIndex, 1);
    setProfiles(newProfiles);
  };

  const handleInfluencerChange = (profileIndex, influencerIndex, field, value) => {
    const newProfiles = [...profiles];
    newProfiles[profileIndex].influenciadores[influencerIndex][field] = value;
    setProfiles(newProfiles);
  };

  const drawAmplificadoresChart = async () => {
    const canvasElement = document.createElement('canvas');
    // Mantener el tamaño original del canvas para evitar recortes
    const scaleFactor = 1.0; // Sin escalar internamente
    const width = 2000; // Tamaño original
    const height = 1080; // Tamaño original
    canvasElement.width = width;
    canvasElement.height = height;
    const ctx = canvasElement.getContext('2d');

    // Configuración de alta calidad
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

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

    // Background
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, width, height);

    // Title con mejor calidad (escalado)
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${32 * scaleFactor}px Arial, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('Amplificadores de la conversación', 40 * scaleFactor, 60 * scaleFactor);

    // Column configuration - escalado proporcionalmente
    const startY = 100 * scaleFactor;
    const avatarCol = 30 * scaleFactor;
    const avatarWidth = 180 * scaleFactor;
    const colWidth = 570 * scaleFactor;
    const mediosX = avatarCol + avatarWidth;
    const outletsX = mediosX + colWidth;
    const influenciadoresX = outletsX + colWidth;
    const rowHeight = 195 * scaleFactor;
    const headerHeight = 60 * scaleFactor;
    const avatarRadius = 55 * scaleFactor;

    // Draw column headers con mejor diseño
    const headers = [
      { title: 'Medios', x: mediosX },
      { title: 'Outlets', x: outletsX, subtitle: 'Impacto' },
      { title: 'Influenciadores', x: influenciadoresX, subtitle: 'Seguidores' },
    ];

    headers.forEach((header) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(header.x, startY, colWidth, headerHeight);
      ctx.strokeStyle = '#00BCD4';
      ctx.lineWidth = 3 * scaleFactor;
      ctx.strokeRect(header.x, startY, colWidth, headerHeight);

      ctx.font = `bold ${26 * scaleFactor}px Arial, sans-serif`;
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      ctx.fillText(header.title, header.x + 20 * scaleFactor, startY + 38 * scaleFactor);

      if (header.subtitle) {
        ctx.font = `${20 * scaleFactor}px Arial, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(header.subtitle, header.x + colWidth - 40 * scaleFactor, startY + 38 * scaleFactor);
      }
    });

    let currentY = startY + headerHeight;

    // Draw each profile
    profiles.forEach((profile, profileIndex) => {
      // Calcular el número real de filas necesarias para cada columna
      const mediosRows = profile.medios.length || 0;
      const outletsRows = profile.outlets.length || 0;
      const influenciadoresRows = profile.influenciadores.length || 0;
      
      // Si outlets está vacío, cuenta como 1 fila para el mensaje
      const effectiveOutletsRows = outletsRows === 0 ? 1 : outletsRows;
      
      const maxRows = Math.max(
        mediosRows || 1,
        effectiveOutletsRows,
        influenciadoresRows || 1
      );
      const sectionHeight = maxRows * rowHeight;

      // Draw avatar column background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(avatarCol, currentY, avatarWidth, sectionHeight);
      ctx.strokeStyle = '#00BCD4';
      ctx.lineWidth = 3 * scaleFactor;
      ctx.strokeRect(avatarCol, currentY, avatarWidth, sectionHeight);

      // Draw avatar circle con mejor calidad
      const avatarCenterY = currentY + sectionHeight / 2;
      const avatarCenterX = avatarCol + avatarWidth / 2;

      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, 2 * Math.PI);
      ctx.fillStyle = profile.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 5 * scaleFactor;
      ctx.stroke();

      // Si hay avatar cargado, dibujarlo
      if (loadedAvatars[profileIndex]) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(
          loadedAvatars[profileIndex],
          avatarCenterX - avatarRadius,
          avatarCenterY - avatarRadius,
          avatarRadius * 2,
          avatarRadius * 2
        );
        ctx.restore();

        // Redibujar el borde después del clip
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 5 * scaleFactor;
        ctx.stroke();
      }

      // Draw profile name con mejor tipografía
      const nameLines = profile.name.split('\n');
      ctx.font = `bold ${18 * scaleFactor}px Arial, sans-serif`;
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      const nameY = avatarCenterY + avatarRadius + 25 * scaleFactor;
      nameLines.forEach((line, i) => {
        ctx.fillText(line, avatarCol + avatarWidth / 2, nameY + i * 22 * scaleFactor);
      });

      // Draw Medios column con mejor diseño
      for (let i = 0; i < maxRows; i++) {
        const y = currentY + i * rowHeight;
        const medio = profile.medios[i];
        
        // Solo dibujar celda si hay datos o si es necesario para mantener estructura
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(mediosX, y, colWidth, rowHeight);
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 2 * scaleFactor;
        ctx.strokeRect(mediosX, y, colWidth, rowHeight);

        if (medio && medio.medio) {
          // Green tag for medio name - mejor diseño
          ctx.font = `bold ${18 * scaleFactor}px Arial, sans-serif`;
          const medioText = medio.medio || '';
          const tagWidth = Math.max(ctx.measureText(medioText).width + 30 * scaleFactor, 100 * scaleFactor);

          ctx.fillStyle = '#4CAF50';
          ctx.fillRect(mediosX + 15 * scaleFactor, y + 70 * scaleFactor, tagWidth, 36 * scaleFactor);

          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'left';
          ctx.fillText(medioText, mediosX + 30 * scaleFactor, y + 95 * scaleFactor);

          // Title - mejor espaciado y en nueva línea
          ctx.font = `${16 * scaleFactor}px Arial, sans-serif`;
          ctx.fillStyle = '#000000';
          const titleStartX = mediosX + tagWidth + 25 * scaleFactor;
          const maxTitleWidth = colWidth - tagWidth - 110 * scaleFactor;
          let titulo = medio.titulo || '';

          // Truncar título si es muy largo
          while (ctx.measureText(titulo).width > maxTitleWidth && titulo.length > 0) {
            titulo = titulo.slice(0, -1);
          }
          if (titulo.length < (medio.titulo || '').length) {
            titulo = titulo.trim() + '...';
          }

          ctx.fillText(titulo, titleStartX, y + 88 * scaleFactor);

          // Impact number - mejor posición y más pequeño
          ctx.font = `bold ${20 * scaleFactor}px Arial, sans-serif`;
          ctx.textAlign = 'right';
          ctx.fillText((medio.impacto || 0).toString(), mediosX + colWidth - 40 * scaleFactor, y + 102 * scaleFactor);
          ctx.textAlign = 'left';
        }
      }

      // Draw Outlets column con mejor diseño
      if (profile.outlets.length === 0) {
        // "Sin datos para el análisis" message - ocupar toda la sección
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(outletsX, currentY, colWidth, sectionHeight);
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 2;
        ctx.strokeRect(outletsX, currentY, colWidth, sectionHeight);

        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.fillStyle = '#CCCCCC';
        ctx.textAlign = 'center';
        ctx.fillText('Sin datos para', outletsX + colWidth / 2, avatarCenterY - 15);
        ctx.fillText('el análisis', outletsX + colWidth / 2, avatarCenterY + 20);
        ctx.textAlign = 'left';
      } else {
        for (let i = 0; i < maxRows; i++) {
          const y = currentY + i * rowHeight;
          const outlet = profile.outlets[i];
          
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(outletsX, y, colWidth, rowHeight);
          ctx.strokeStyle = '#CCCCCC';
          ctx.lineWidth = 2;
          ctx.strokeRect(outletsX, y, colWidth, rowHeight);

          if (outlet && outlet.outlet) {
            // Colored tag for outlet - mejor diseño
            const outletColors = {
              'SDP Noticias': '#FF4444',
              'Notigram': '#4CAF50',
              'Contacto Politico': '#2196F3',
              'Contacto Hoy': '#2196F3',
              'LJA.MX': '#FF9800',
            };
            
            ctx.font = 'bold 16px Arial, sans-serif';
            const outletText = outlet.outlet || '';
            const outletTextWidth = ctx.measureText(outletText).width;
            const tagWidth = Math.max(outletTextWidth + 24, 90);
            
            ctx.fillStyle = outletColors[outlet.outlet] || '#9E9E9E';
            ctx.fillRect(outletsX + 15, y + 70, tagWidth, 36);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.fillText(outletText, outletsX + 15 + tagWidth / 2, y + 94);
            ctx.textAlign = 'left';

            // Title - mejor espaciado
            ctx.font = '16px Arial, sans-serif';
            ctx.fillStyle = '#000000';
            const titleStartX = outletsX + tagWidth + 25;
            const maxTitleWidth = colWidth - tagWidth - 110;
            let titulo = outlet.titulo || '';
            
            while (ctx.measureText(titulo).width > maxTitleWidth && titulo.length > 0) {
              titulo = titulo.slice(0, -1);
            }
            if (titulo.length < (outlet.titulo || '').length) {
              titulo = titulo.trim() + '...';
            }
            
            ctx.fillText(titulo, titleStartX, y + 88);

            // Impact number - mejor posición
            ctx.font = 'bold 20px Arial, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText((outlet.impacto || 0).toString(), outletsX + colWidth - 40, y + 102);
            ctx.textAlign = 'left';
          }
        }
      }

      // Draw Influenciadores column con mejor diseño
      for (let i = 0; i < maxRows; i++) {
        const y = currentY + i * rowHeight;
        const influencer = profile.influenciadores[i];
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(influenciadoresX, y, colWidth, rowHeight);
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 2;
        ctx.strokeRect(influenciadoresX, y, colWidth, rowHeight);

        if (influencer && influencer.username) {
          // Username con mejor tipografía
          ctx.font = 'bold 22px Arial, sans-serif';
          ctx.fillStyle = '#E91E63';
          ctx.textAlign = 'left';
          ctx.fillText(influencer.username || '', influenciadoresX + 20, y + 102);

          // Followers count con mejor formato
          ctx.font = 'bold 22px Arial, sans-serif';
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'right';
          const followers = influencer.seguidores || 0;
          ctx.fillText(followers.toLocaleString('en-US'), influenciadoresX + colWidth - 40, y + 102);
          ctx.textAlign = 'left';
        }
      }

      currentY += sectionHeight;
    });

    return canvasElement;
  };

  const handleInsertChart = async () => {
    if (!canvas) return;

    const canvasElement = await drawAmplificadoresChart();
    const dataURL = canvasElement.toDataURL('image/png', 1.0);

    const { Image: FabricImage } = await import('fabric');

    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: 50,
        top: 50,
        scaleX: 0.42, // 0.6 * 0.7 = 0.42 para mantener el tamaño deseado
        scaleY: 0.42,
        selectable: true,
        hasControls: true,
        name: 'amplificadores-chart'
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
          Amplificadores de la Conversación
        </h2>
        
        <p className="chart-modal-description">
          Configure los amplificadores de la conversación para cada personaje. 
          Los valores comenzarán en 0 y puede personalizarlos según su análisis.
        </p>

        {profiles.map((profile, profileIndex) => (
          <div key={profileIndex} className="chart-profile-card">
            <div className="chart-profile-header">
              <h3>Perfil {profileIndex + 1}</h3>
            </div>

            {/* Nombre del Personaje */}
            <div className="chart-form-field">
              <label className="chart-form-label">
                Nombre del Personaje
              </label>
              <input
                type="text"
                placeholder="Ej: José Ramón Enríquez"
                value={profile.name}
                onChange={(e) => handleProfileChange(profileIndex, 'name', e.target.value)}
                className="chart-form-input"
              />
            </div>

            {/* Color del Avatar */}
            <div className="chart-form-field">
              <label className="chart-form-label">
                Color del Avatar
              </label>
              <input
                type="color"
                value={profile.color}
                onChange={(e) => handleProfileChange(profileIndex, 'color', e.target.value)}
                className="color-input"
              />
            </div>

            {/* Avatar Upload */}
            <div className="chart-form-field">
              <label className="chart-form-label">
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAvatarUpload(profileIndex, e)}
                className="chart-form-input"
              />
            </div>

            {/* Medios Section */}
            <div className="chart-form-field">
              <label className="chart-form-label">
                Medios
              </label>
              <button onClick={() => handleAddMedio(profileIndex)} className="chart-add-button">
                <Plus size={16} /> Agregar Medio
              </button>
              {profile.medios.map((medio, medioIndex) => (
                <div key={medioIndex} className="chart-row-item">
                  <input
                    type="text"
                    placeholder="Medio"
                    value={medio.medio}
                    onChange={(e) => handleMedioChange(profileIndex, medioIndex, 'medio', e.target.value)}
                    className="chart-form-input"
                  />
                  <input
                    type="text"
                    placeholder="Título"
                    value={medio.titulo}
                    onChange={(e) => handleMedioChange(profileIndex, medioIndex, 'titulo', e.target.value)}
                    className="chart-form-input"
                  />
                  <input
                    type="number"
                    placeholder="Impacto"
                    value={medio.impacto}
                    onChange={(e) => handleMedioChange(profileIndex, medioIndex, 'impacto', parseInt(e.target.value) || 0)}
                    className="chart-form-input"
                  />
                  <button onClick={() => handleRemoveMedio(profileIndex, medioIndex)} className="chart-delete-button">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Outlets Section */}
            <div className="chart-form-field">
              <label className="chart-form-label">
                Outlets
              </label>
              <button onClick={() => handleAddOutlet(profileIndex)} className="chart-add-button">
                <Plus size={16} /> Agregar Outlet
              </button>
              {profile.outlets.map((outlet, outletIndex) => (
                <div key={outletIndex} className="chart-row-item">
                  <input
                    type="text"
                    placeholder="Outlet"
                    value={outlet.outlet}
                    onChange={(e) => handleOutletChange(profileIndex, outletIndex, 'outlet', e.target.value)}
                    className="chart-form-input"
                  />
                  <input
                    type="text"
                    placeholder="Título"
                    value={outlet.titulo}
                    onChange={(e) => handleOutletChange(profileIndex, outletIndex, 'titulo', e.target.value)}
                    className="chart-form-input"
                  />
                  <input
                    type="number"
                    placeholder="Impacto"
                    value={outlet.impacto}
                    onChange={(e) => handleOutletChange(profileIndex, outletIndex, 'impacto', parseInt(e.target.value) || 0)}
                    className="chart-form-input"
                  />
                  <button onClick={() => handleRemoveOutlet(profileIndex, outletIndex)} className="chart-delete-button">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Influenciadores Section */}
            <div className="chart-form-field">
              <label className="chart-form-label">
                Influenciadores
              </label>
              <button onClick={() => handleAddInfluencer(profileIndex)} className="chart-add-button">
                <Plus size={16} /> Agregar Influencer
              </button>
              {profile.influenciadores.map((influencer, influencerIndex) => (
                <div key={influencerIndex} className="chart-row-item">
                  <input
                    type="text"
                    placeholder="Username"
                    value={influencer.username}
                    onChange={(e) => handleInfluencerChange(profileIndex, influencerIndex, 'username', e.target.value)}
                    className="chart-form-input"
                  />
                  <input
                    type="number"
                    placeholder="Seguidores"
                    value={influencer.seguidores}
                    onChange={(e) => handleInfluencerChange(profileIndex, influencerIndex, 'seguidores', parseInt(e.target.value) || 0)}
                    className="chart-form-input"
                  />
                  <button onClick={() => handleRemoveInfluencer(profileIndex, influencerIndex)} className="chart-delete-button">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
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

export default AmplificadoresChartModal;
