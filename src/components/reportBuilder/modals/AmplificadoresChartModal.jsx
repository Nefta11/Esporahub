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

  const drawAmplificadoresChart = () => {
    const canvasElement = document.createElement('canvas');
    const width = 960;
    const height = 540;
    canvasElement.width = width;
    canvasElement.height = height;
    const ctx = canvasElement.getContext('2d');

    // Background
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Amplificadores de la conversación', 25, 35);

    // Column configuration
    const startY = 60;
    const avatarCol = 25;
    const avatarWidth = 95;
    const colWidth = 280;
    const mediosX = avatarCol + avatarWidth;
    const outletsX = mediosX + colWidth;
    const influenciadoresX = outletsX + colWidth;
    const rowHeight = 32;
    const headerHeight = 30;

    // Draw column headers
    const headers = [
      { title: 'Medios', x: mediosX },
      { title: 'Outlets', x: outletsX, subtitle: 'Impacto' },
      { title: 'Influenciadores', x: influenciadoresX, subtitle: 'Seguidores' },
    ];

    headers.forEach((header) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(header.x, startY, colWidth, headerHeight);
      ctx.strokeStyle = '#00BCD4';
      ctx.lineWidth = 2;
      ctx.strokeRect(header.x, startY, colWidth, headerHeight);

      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      ctx.fillText(header.title, header.x + 10, startY + 20);

      if (header.subtitle) {
        ctx.font = '11px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(header.subtitle, header.x + colWidth - 10, startY + 20);
      }
    });

    let currentY = startY + headerHeight;

    // Draw each profile
    profiles.forEach((profile, profileIndex) => {
      const maxRows = Math.max(
        profile.medios.length || 1,
        profile.outlets.length || 1,
        profile.influenciadores.length || 1
      );
      const sectionHeight = maxRows * rowHeight;

      // Draw avatar column background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(avatarCol, currentY, avatarWidth, sectionHeight);
      ctx.strokeStyle = '#00BCD4';
      ctx.lineWidth = 2;
      ctx.strokeRect(avatarCol, currentY, avatarWidth, sectionHeight);

      // Draw avatar circle
      const avatarCenterY = currentY + sectionHeight / 2;
      ctx.beginPath();
      ctx.arc(avatarCol + avatarWidth / 2, avatarCenterY, 28, 0, 2 * Math.PI);
      ctx.fillStyle = profile.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw profile name
      const nameLines = profile.name.split('\n');
      ctx.font = 'bold 11px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      const nameY = avatarCenterY + 45;
      nameLines.forEach((line, i) => {
        ctx.fillText(line, avatarCol + avatarWidth / 2, nameY + i * 14);
      });

      // Draw Medios column
      for (let i = 0; i < maxRows; i++) {
        const y = currentY + i * rowHeight;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(mediosX, y, colWidth, rowHeight);
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.strokeRect(mediosX, y, colWidth, rowHeight);

        const medio = profile.medios[i];
        if (medio) {
          // Green tag for medio name
          ctx.fillStyle = '#4CAF50';
          const tagWidth = ctx.measureText(medio.medio).width + 16;
          ctx.fillRect(mediosX + 8, y + 6, tagWidth, 18);
          
          ctx.font = 'bold 10px Arial';
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'left';
          ctx.fillText(medio.medio, mediosX + 16, y + 18);

          // Title
          ctx.font = '9px Arial';
          ctx.fillStyle = '#000000';
          const maxTitleWidth = colWidth - 60;
          let titulo = medio.titulo;
          if (ctx.measureText(titulo).width > maxTitleWidth) {
            while (ctx.measureText(titulo + '...').width > maxTitleWidth && titulo.length > 0) {
              titulo = titulo.slice(0, -1);
            }
            titulo += '...';
          }
          ctx.fillText(titulo, mediosX + 8, y + 28);

          // Impact number
          ctx.font = 'bold 11px Arial';
          ctx.textAlign = 'right';
          ctx.fillText(medio.impacto.toString(), mediosX + colWidth - 10, y + 20);
          ctx.textAlign = 'left';
        }
      }

      // Draw Outlets column
      if (profile.outlets.length === 0) {
        // "Sin datos para el análisis" message
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(outletsX, currentY, colWidth, sectionHeight);
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.strokeRect(outletsX, currentY, colWidth, sectionHeight);

        ctx.font = 'bold 13px Arial';
        ctx.fillStyle = '#999999';
        ctx.textAlign = 'center';
        ctx.fillText('Sin datos para', outletsX + colWidth / 2, avatarCenterY - 8);
        ctx.fillText('el análisis', outletsX + colWidth / 2, avatarCenterY + 8);
        ctx.textAlign = 'left';
      } else {
        for (let i = 0; i < maxRows; i++) {
          const y = currentY + i * rowHeight;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(outletsX, y, colWidth, rowHeight);
          ctx.strokeStyle = '#CCCCCC';
          ctx.lineWidth = 1;
          ctx.strokeRect(outletsX, y, colWidth, rowHeight);

          const outlet = profile.outlets[i];
          if (outlet) {
            // Colored tag for outlet
            const outletColors = {
              'SDP Noticias': '#FF4444',
              'Notigram': '#4CAF50',
              'Contacto Politico': '#2196F3',
              'LJA.MX': '#FF9800',
            };
            ctx.fillStyle = outletColors[outlet.outlet] || '#9E9E9E';
            ctx.fillRect(outletsX + 8, y + 7, 90, 18);
            
            ctx.font = 'bold 9px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.fillText(outlet.outlet, outletsX + 53, y + 19);
            ctx.textAlign = 'left';

            // Title
            ctx.font = '9px Arial';
            ctx.fillStyle = '#000000';
            const maxTitleWidth = colWidth - 140;
            let titulo = outlet.titulo;
            if (ctx.measureText(titulo).width > maxTitleWidth) {
              while (ctx.measureText(titulo + '...').width > maxTitleWidth && titulo.length > 0) {
                titulo = titulo.slice(0, -1);
              }
              titulo += '...';
            }
            ctx.fillText(titulo, outletsX + 105, y + 19);

            // Impact number
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(outlet.impacto.toString(), outletsX + colWidth - 10, y + 20);
            ctx.textAlign = 'left';
          }
        }
      }

      // Draw Influenciadores column
      for (let i = 0; i < maxRows; i++) {
        const y = currentY + i * rowHeight;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(influenciadoresX, y, colWidth, rowHeight);
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.strokeRect(influenciadoresX, y, colWidth, rowHeight);

        const influencer = profile.influenciadores[i];
        if (influencer) {
          // Username
          ctx.font = 'bold 11px Arial';
          ctx.fillStyle = '#E91E63';
          ctx.textAlign = 'left';
          ctx.fillText(influencer.username, influenciadoresX + 10, y + 20);

          // Followers count
          ctx.font = 'bold 11px Arial';
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'right';
          ctx.fillText(influencer.seguidores.toLocaleString('en-US'), influenciadoresX + colWidth - 10, y + 20);
          ctx.textAlign = 'left';
        }
      }

      currentY += sectionHeight;
    });

    return canvasElement;
  };

  const handleInsertChart = async () => {
    if (!canvas) return;

    const canvasElement = drawAmplificadoresChart();
    const dataURL = canvasElement.toDataURL('image/png');

    const { Image: FabricImage } = await import('fabric');
    
    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: 50,
        top: 50,
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
          Amplificadores de la Conversación
        </h2>

        {profiles.map((profile, profileIndex) => (
          <div key={profileIndex} className="chart-profile-card">
            <h3>
              Perfil {profileIndex + 1}: {profile.name.replace('\n', ' ')}
            </h3>

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
