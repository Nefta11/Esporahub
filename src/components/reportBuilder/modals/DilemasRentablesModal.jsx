import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import '@/styles/reportBuilder/DilemasRentablesModal.css';

const DilemasRentablesModal = ({ isOpen, onClose, canvas }) => {
  const [caracteristicasIzquierda, setCaracteristicasIzquierda] = useState([
    { titulo: 'Característica 1', subitems: ['Sub-item 1', 'Sub-item 2'] }
  ]);
  
  const [caracteristicasDerecha, setCaracteristicasDerecha] = useState([
    { titulo: 'Característica 1', subitems: ['Sub-item 1', 'Sub-item 2'] }
  ]);

  if (!isOpen) return null;

  // Handlers para características izquierda
  const handleCaracteristicaIzqChange = (index, value) => {
    const newCaract = [...caracteristicasIzquierda];
    newCaract[index].titulo = value;
    setCaracteristicasIzquierda(newCaract);
  };

  const handleSubitemIzqChange = (caracIndex, subIndex, value) => {
    const newCaract = [...caracteristicasIzquierda];
    newCaract[caracIndex].subitems[subIndex] = value;
    setCaracteristicasIzquierda(newCaract);
  };

  const handleAddCaracteristicaIzq = () => {
    setCaracteristicasIzquierda([...caracteristicasIzquierda, { titulo: 'Nueva característica', subitems: ['Sub-item 1'] }]);
  };

  const handleRemoveCaracteristicaIzq = (index) => {
    setCaracteristicasIzquierda(caracteristicasIzquierda.filter((_, i) => i !== index));
  };

  const handleAddSubitemIzq = (caracIndex) => {
    const newCaract = [...caracteristicasIzquierda];
    newCaract[caracIndex].subitems.push('Nuevo sub-item');
    setCaracteristicasIzquierda(newCaract);
  };

  const handleRemoveSubitemIzq = (caracIndex, subIndex) => {
    const newCaract = [...caracteristicasIzquierda];
    newCaract[caracIndex].subitems = newCaract[caracIndex].subitems.filter((_, i) => i !== subIndex);
    setCaracteristicasIzquierda(newCaract);
  };

  // Handlers para características derecha
  const handleCaracteristicaDerChange = (index, value) => {
    const newCaract = [...caracteristicasDerecha];
    newCaract[index].titulo = value;
    setCaracteristicasDerecha(newCaract);
  };

  const handleSubitemDerChange = (caracIndex, subIndex, value) => {
    const newCaract = [...caracteristicasDerecha];
    newCaract[caracIndex].subitems[subIndex] = value;
    setCaracteristicasDerecha(newCaract);
  };

  const handleAddCaracteristicaDer = () => {
    setCaracteristicasDerecha([...caracteristicasDerecha, { titulo: 'Nueva característica', subitems: ['Sub-item 1'] }]);
  };

  const handleRemoveCaracteristicaDer = (index) => {
    setCaracteristicasDerecha(caracteristicasDerecha.filter((_, i) => i !== index));
  };

  const handleAddSubitemDer = (caracIndex) => {
    const newCaract = [...caracteristicasDerecha];
    newCaract[caracIndex].subitems.push('Nuevo sub-item');
    setCaracteristicasDerecha(newCaract);
  };

  const handleRemoveSubitemDer = (caracIndex, subIndex) => {
    const newCaract = [...caracteristicasDerecha];
    newCaract[caracIndex].subitems = newCaract[caracIndex].subitems.filter((_, i) => i !== subIndex);
    setCaracteristicasDerecha(newCaract);
  };

  const drawDilemasChart = () => {
    const canvasElement = document.createElement('canvas');
    const width = 1920;
    const height = 1080;
    canvasElement.width = width;
    canvasElement.height = height;
    const ctx = canvasElement.getContext('2d');

    // Configuración de alta calidad
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fondo blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Configuración optimizada para evitar encimamiento
    const centerX = width / 2;
    const centerY = height / 2;
    const sideWidth = 520;  // Aún más reducido para máxima separación
    const sideHeight = 980; // Aumentado para dar más espacio vertical
    const cornerRadius = 20;
    const vsCircleRadius = 100;
    const gap = 300;  // MUCHO más espacio entre el borde del rectángulo y el círculo VS

    // Función para dibujar rectángulo con bordes redondeados
    const drawRoundedRect = (x, y, w, h, r, fillColor, strokeColor) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();

      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.stroke();
    };

    // Calcular posiciones de los rectángulos
    const leftX = centerX - gap - sideWidth - 80; // Movido 80px más hacia la izquierda
    const rightX = centerX + gap;
    const rectY = centerY - sideHeight / 2;

    // PASO 1: Dibujar flechas conectoras PRIMERO (debajo de todo)
    const arrowStartY = rectY + 110; // Posición Y donde inician las flechas (fuera del header)

    // Flechas desde lado izquierdo hacia VS
    ctx.strokeStyle = '#CC0000';
    ctx.lineWidth = 5;
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.5; // Semi-transparente para que no distraiga

    ctx.beginPath();
    ctx.moveTo(leftX + sideWidth, arrowStartY);
    ctx.lineTo(centerX - vsCircleRadius - 15, centerY - 35);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leftX + sideWidth, arrowStartY);
    ctx.lineTo(centerX - vsCircleRadius - 15, centerY + 35);
    ctx.stroke();

    // Flechas desde lado derecho hacia VS
    ctx.strokeStyle = '#0066CC';
    ctx.beginPath();
    ctx.moveTo(rightX, arrowStartY);
    ctx.lineTo(centerX + vsCircleRadius + 15, centerY - 35);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightX, arrowStartY);
    ctx.lineTo(centerX + vsCircleRadius + 15, centerY + 35);
    ctx.stroke();

    ctx.globalAlpha = 1.0; // Restaurar opacidad

    // PASO 2: Dibujar rectángulos de fondo
    drawRoundedRect(leftX, rectY, sideWidth, sideHeight, cornerRadius, '#FFFFFF', '#CC0000');
    drawRoundedRect(rightX, rectY, sideWidth, sideHeight, cornerRadius, '#FFFFFF', '#0066CC');

    // PASO 3: Dibujar headers con fondo de color
    const headerHeight = 100;

    // Header izquierdo (Rojo) con esquinas redondeadas superiores
    ctx.fillStyle = '#CC0000';
    ctx.beginPath();
    ctx.moveTo(leftX + cornerRadius, rectY);
    ctx.lineTo(leftX + sideWidth - cornerRadius, rectY);
    ctx.arcTo(leftX + sideWidth, rectY, leftX + sideWidth, rectY + cornerRadius, cornerRadius);
    ctx.lineTo(leftX + sideWidth, rectY + headerHeight);
    ctx.lineTo(leftX, rectY + headerHeight);
    ctx.lineTo(leftX, rectY + cornerRadius);
    ctx.arcTo(leftX, rectY, leftX + cornerRadius, rectY, cornerRadius);
    ctx.closePath();
    ctx.fill();

    // Header derecho (Azul) con esquinas redondeadas superiores
    ctx.fillStyle = '#0066CC';
    ctx.beginPath();
    ctx.moveTo(rightX + cornerRadius, rectY);
    ctx.lineTo(rightX + sideWidth - cornerRadius, rectY);
    ctx.arcTo(rightX + sideWidth, rectY, rightX + sideWidth, rectY + cornerRadius, cornerRadius);
    ctx.lineTo(rightX + sideWidth, rectY + headerHeight);
    ctx.lineTo(rightX, rectY + headerHeight);
    ctx.lineTo(rightX, rectY + cornerRadius);
    ctx.arcTo(rightX, rectY, rightX + cornerRadius, rectY, cornerRadius);
    ctx.closePath();
    ctx.fill();

    // PASO 4: Textos de los headers
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Título izquierdo
    ctx.font = 'bold 34px Arial';
    ctx.fillText('Lorem Ipsum & Dolor Sit', leftX + sideWidth / 2, rectY + 38);
    ctx.font = '23px Arial';
    ctx.fillText('(Amet Consectetur)', leftX + sideWidth / 2, rectY + 70);

    // Título derecho
    ctx.font = 'bold 34px Arial';
    ctx.fillText('Consequat &', rightX + sideWidth / 2, rectY + 38);
    ctx.font = '23px Arial';
    ctx.fillText('Duis Aute', rightX + sideWidth / 2, rectY + 70);

    // PASO 5: Función para dibujar características sin encimamiento
    const drawCaracteristicas = (x, y, caracteristicas, color) => {
      let currentY = y + headerHeight + 45; // AÚN MÁS espacio después del header
      const itemHeight = 58;  // Más alto para mejor legibilidad y separación
      const subitemHeight = 50; // Más alto para mejor legibilidad y separación
      const margin = 50;  // MÁS margen a los lados
      const itemWidth = sideWidth - (margin * 2);
      const padding = 20;
      const spaceBetweenItems = 15; // MÁS espacio entre items de lista
      const spaceBetweenGroups = 35; // MÁS espacio entre grupos de características
      const maxContentHeight = sideHeight - headerHeight - 70;

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      caracteristicas.forEach((caract, index) => {
        // Verificar si hay espacio suficiente
        if (currentY - (y + headerHeight) > maxContentHeight) return;

        // Caja de característica principal con sombra sutil
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(x + margin, currentY, itemWidth, itemHeight);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#D0D0D0';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + margin, currentY, itemWidth, itemHeight);

        // Texto de característica principal
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#1a1a1a';
        ctx.fillText(caract.titulo, x + margin + padding, currentY + itemHeight / 2);
        currentY += itemHeight + spaceBetweenItems; // Usar espaciado definido

        // Subitems
        caract.subitems.forEach((subitem, subIndex) => {
          if (currentY - (y + headerHeight) > maxContentHeight) return;

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x + margin, currentY, itemWidth, subitemHeight);
          ctx.strokeStyle = '#E8E8E8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + margin, currentY, itemWidth, subitemHeight);

          // Bullet point
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x + margin + padding + 6, currentY + subitemHeight / 2, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '21px Arial';
          ctx.fillStyle = '#4a4a4a';
          ctx.fillText(subitem, x + margin + padding + 20, currentY + subitemHeight / 2);
          currentY += subitemHeight + spaceBetweenItems; // Usar espaciado consistente
        });

        // Espacio extra entre grupos de características (solo si no es el último)
        if (index < caracteristicas.length - 1) {
          currentY += spaceBetweenGroups;
        }
      });
    };

    // PASO 6: Dibujar características
    drawCaracteristicas(leftX, rectY, caracteristicasIzquierda, '#CC0000');
    drawCaracteristicas(rightX, rectY, caracteristicasDerecha, '#0066CC');

    // PASO 7: Círculo central "VS" con sombra (encima de todo)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;

    ctx.beginPath();
    ctx.arc(centerX, centerY, vsCircleRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();

    // Borde blanco alrededor del círculo VS
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.font = 'bold 60px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VS', centerX, centerY);

    return canvasElement;
  };

  const handleInsertChart = async () => {
    if (!canvas) return;

    // Buscar gráfica existente de dilemas rentables para conservar su posición y escala
    const existingChart = canvas.getObjects().find(obj => obj.name === 'dilemas-rentables-chart');
    
    // Guardar propiedades de la gráfica existente
    const existingProps = existingChart ? {
      left: existingChart.left,
      top: existingChart.top,
      scaleX: existingChart.scaleX,
      scaleY: existingChart.scaleY,
      angle: existingChart.angle
    } : {
      left: 50,
      top: 30,
      scaleX: 0.38,  // Escala optimizada para visualización
      scaleY: 0.38,
      angle: 0
    };

    // Eliminar gráfica existente para evitar duplicación
    if (existingChart) {
      canvas.remove(existingChart);
    }

    const canvasElement = drawDilemasChart();
    const dataURL = canvasElement.toDataURL('image/png', 1.0);

    const { Image: FabricImage } = await import('fabric');
    
    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: existingProps.left,
        top: existingProps.top,
        scaleX: existingProps.scaleX,
        scaleY: existingProps.scaleY,
        angle: existingProps.angle,
        selectable: true,
        hasControls: true,
        name: 'dilemas-rentables-chart'
      });

      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      canvas.renderAll();
      onClose();
    };
    imgElement.src = dataURL;
  };

  return (
    <div className="dilemas-modal-overlay">
      <div className="dilemas-modal-container">
        <h2 className="dilemas-modal-title">
          Identificación de los Dilemas Rentables
        </h2>

        <div className="dilemas-description">
          <p>Configura las características de ambos lados del dilema. Cada característica puede tener múltiples sub-items.</p>
        </div>

        <div className="dilemas-columns">
          {/* Columna Izquierda - Lorem Ipsum */}
          <div className="dilemas-column dilemas-left">
            <h3 className="dilemas-column-title">Lorem Ipsum & Dolor Sit (Lado Izquierdo)</h3>
            
            {caracteristicasIzquierda.map((caract, cIndex) => (
              <div key={cIndex} className="dilemas-card">
                <div className="dilemas-card-header">
                  <input
                    type="text"
                    value={caract.titulo}
                    onChange={(e) => handleCaracteristicaIzqChange(cIndex, e.target.value)}
                    className="dilemas-input dilemas-input-title"
                    placeholder="Característica principal"
                  />
                  <button
                    onClick={() => handleRemoveCaracteristicaIzq(cIndex)}
                    className="dilemas-btn-delete"
                    title="Eliminar característica"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="dilemas-subitems">
                  {caract.subitems.map((subitem, sIndex) => (
                    <div key={sIndex} className="dilemas-subitem-row">
                      <input
                        type="text"
                        value={subitem}
                        onChange={(e) => handleSubitemIzqChange(cIndex, sIndex, e.target.value)}
                        className="dilemas-input dilemas-input-subitem"
                        placeholder="Sub-item"
                      />
                      <button
                        onClick={() => handleRemoveSubitemIzq(cIndex, sIndex)}
                        className="dilemas-btn-delete-small"
                        title="Eliminar sub-item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddSubitemIzq(cIndex)}
                    className="dilemas-btn-add-subitem"
                  >
                    <Plus size={14} />
                    Agregar sub-item
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddCaracteristicaIzq}
              className="dilemas-btn-add"
            >
              <Plus size={16} />
              Agregar Característica
            </button>
          </div>

          {/* Columna Derecha - Consequat */}
          <div className="dilemas-column dilemas-right">
            <h3 className="dilemas-column-title">Consequat & Duis Aute (Lado Derecho)</h3>
            
            {caracteristicasDerecha.map((caract, cIndex) => (
              <div key={cIndex} className="dilemas-card">
                <div className="dilemas-card-header">
                  <input
                    type="text"
                    value={caract.titulo}
                    onChange={(e) => handleCaracteristicaDerChange(cIndex, e.target.value)}
                    className="dilemas-input dilemas-input-title"
                    placeholder="Característica principal"
                  />
                  <button
                    onClick={() => handleRemoveCaracteristicaDer(cIndex)}
                    className="dilemas-btn-delete"
                    title="Eliminar característica"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="dilemas-subitems">
                  {caract.subitems.map((subitem, sIndex) => (
                    <div key={sIndex} className="dilemas-subitem-row">
                      <input
                        type="text"
                        value={subitem}
                        onChange={(e) => handleSubitemDerChange(cIndex, sIndex, e.target.value)}
                        className="dilemas-input dilemas-input-subitem"
                        placeholder="Sub-item"
                      />
                      <button
                        onClick={() => handleRemoveSubitemDer(cIndex, sIndex)}
                        className="dilemas-btn-delete-small"
                        title="Eliminar sub-item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddSubitemDer(cIndex)}
                    className="dilemas-btn-add-subitem"
                  >
                    <Plus size={14} />
                    Agregar sub-item
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddCaracteristicaDer}
              className="dilemas-btn-add"
            >
              <Plus size={16} />
              Agregar Característica
            </button>
          </div>
        </div>

        <div className="dilemas-modal-buttons">
          <button
            onClick={onClose}
            className="dilemas-btn-cancel"
          >
            Cancelar
          </button>
          <button
            onClick={handleInsertChart}
            className="dilemas-btn-insert"
          >
            Insertar Gráfica
          </button>
        </div>
      </div>
    </div>
  );
};

export default DilemasRentablesModal;
