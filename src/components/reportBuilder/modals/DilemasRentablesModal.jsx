import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import '@/styles/reportBuilder/DilemasRentablesModal.css';

// Datos iniciales con Lorem Ipsum
const initialCaracteristicasIzquierda = [
  { titulo: 'Lorem ipsum dolor', subitems: ['Lorem ipsum', 'Dolor sit amet', 'Consectetur adipiscing'] }
];

const initialCaracteristicasDerecha = [
  { titulo: 'Sed do eiusmod', subitems: ['Tempor incididunt', 'Ut labore et dolore'] }
];

const DilemasRentablesModal = ({ isOpen, onClose, canvas }) => {
  const [caracteristicasIzquierda, setCaracteristicasIzquierda] = useState(initialCaracteristicasIzquierda);
  const [caracteristicasDerecha, setCaracteristicasDerecha] = useState(initialCaracteristicasDerecha);

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

  const drawDilemasChart = (izquierda = caracteristicasIzquierda, derecha = caracteristicasDerecha) => {
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

    const centerX = width / 2;
    const centerY = height / 2;
    const vsCircleRadius = 65;
    const cornerRadius = 8;

    // Función para dibujar rectángulo con bordes redondeados
    const drawRoundedRect = (x, y, w, h, r, fillColor, strokeColor, lineWidth = 3) => {
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
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    // Función para dibujar flecha curva
    const drawCurvedArrow = (fromX, fromY, toX, toY, color, curvature = 0.3) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.setLineDash([]);

      // Calcular punto de control para la curva
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      const dx = toX - fromX;
      const dy = toY - fromY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Perpendicular para la curva
      const cpX = midX + (-dy / dist) * dist * curvature;
      const cpY = midY + (dx / dist) * dist * curvature;

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.quadraticCurveTo(cpX, cpY, toX, toY);
      ctx.stroke();

      // Dibujar punta de flecha
      const angle = Math.atan2(toY - cpY, toX - cpX);
      const arrowLength = 15;
      const arrowWidth = 10;

      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(
        toX - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle),
        toY - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle)
      );
      ctx.lineTo(
        toX - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle),
        toY - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle)
      );
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    // Función para dibujar caja con título y subitems
    const drawBox = (x, y, titulo, subtitulo, subitems, color, maxWidth = 280) => {
      const padding = 15;
      const lineHeight = 24;
      const titleHeight = subtitulo ? 65 : 50;
      const subitemHeight = subitems.length * lineHeight + 20;
      const totalHeight = titleHeight + subitemHeight;

      // Dibujar caja completa con fondo blanco y borde de color
      drawRoundedRect(x, y, maxWidth, totalHeight, cornerRadius, '#FFFFFF', color, 4);

      // Sección del título (con color de fondo)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + cornerRadius, y);
      ctx.lineTo(x + maxWidth - cornerRadius, y);
      ctx.arcTo(x + maxWidth, y, x + maxWidth, y + cornerRadius, cornerRadius);
      ctx.lineTo(x + maxWidth, y + titleHeight);
      ctx.lineTo(x, y + titleHeight);
      ctx.lineTo(x, y + cornerRadius);
      ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
      ctx.closePath();
      ctx.fill();

      // Texto del título (blanco sobre fondo de color)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 19px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (subtitulo) {
        ctx.fillText(titulo, x + maxWidth / 2, y + 20);
        ctx.font = '15px Arial';
        ctx.fillText(subtitulo, x + maxWidth / 2, y + 42);
      } else {
        ctx.fillText(titulo, x + maxWidth / 2, y + titleHeight / 2);
      }

      // Subitems (texto del color del borde sobre fondo blanco)
      ctx.fillStyle = color;
      ctx.font = '15px Arial';
      ctx.textAlign = 'left';

      subitems.forEach((subitem, index) => {
        const subY = y + titleHeight + 10 + (index * lineHeight);

        // Bullet point del color del borde
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x + padding, subY + lineHeight / 2, 3, 0, Math.PI * 2);
        ctx.fill();

        // Texto del subitem del color del borde
        ctx.fillStyle = color;
        ctx.fillText(subitem, x + padding + 10, subY + lineHeight / 2);
      });

      return { x, y, width: maxWidth, height: totalHeight };
    };

    // LADO IZQUIERDO (ROJO)
    const leftColor = '#8B1A1A';
    const leftMainBox = drawBox(
      150,
      centerY - 60,
      'Lorem Ipsum',
      'Dolor & Sit Amet',
      ['(Consectetur)'],
      leftColor,
      350
    );

    // Cajas adicionales izquierda - basadas en los datos
    const leftBoxes = [];

    // Calcular posiciones dinámicamente
    const leftPositions = [
      { x: 80, y: 80 },
      { x: 320, y: 50 },
      { x: 80, y: centerY + 180 }
    ];

    izquierda.forEach((caract, index) => {
      const pos = leftPositions[index] || { x: 80, y: 80 + (index * 150) };
      leftBoxes.push(drawBox(
        pos.x,
        pos.y,
        caract.titulo,
        null,
        caract.subitems,
        leftColor,
        250
      ));
    });

    // LADO DERECHO (AZUL)
    const rightColor = '#1E5A96';
    const rightMainBox = drawBox(
      width - 500,
      centerY - 60,
      'Adipiscing Elit',
      'Tempor & Incididunt',
      [],
      rightColor,
      350
    );

    // Cajas adicionales derecha - basadas en los datos
    const rightBoxes = [];

    // Calcular posiciones dinámicamente
    const rightPositions = [
      { x: width - 320, y: 60 },
      { x: width - 480, y: centerY - 270 },
      { x: width - 420, y: centerY + 180 },
      { x: width - 780, y: centerY + 250 }
    ];

    derecha.forEach((caract, index) => {
      const pos = rightPositions[index] || { x: width - 320, y: 60 + (index * 150) };
      rightBoxes.push(drawBox(
        pos.x,
        pos.y,
        caract.titulo,
        null,
        caract.subitems,
        rightColor,
        280
      ));
    });

    // DIBUJAR FLECHAS desde cajas principales hacia VS
    const vsLeft = centerX - vsCircleRadius - 15;
    const vsRight = centerX + vsCircleRadius + 15;
    const vsTop = centerY - vsCircleRadius / 2;
    const vsBottom = centerY + vsCircleRadius / 2;

    // Flecha desde caja principal izquierda
    drawCurvedArrow(
      leftMainBox.x + leftMainBox.width,
      leftMainBox.y + leftMainBox.height / 2,
      vsLeft,
      centerY,
      leftColor,
      0.2
    );

    // Flechas desde cajas adicionales izquierda
    leftBoxes.forEach(box => {
      const fromX = box.x + box.width;
      const fromY = box.y + box.height / 2;
      const toY = fromY < centerY ? vsTop : (fromY > centerY ? vsBottom : centerY);
      drawCurvedArrow(fromX, fromY, vsLeft, toY, leftColor, 0.15);
    });

    // Flecha desde caja principal derecha
    drawCurvedArrow(
      rightMainBox.x,
      rightMainBox.y + rightMainBox.height / 2,
      vsRight,
      centerY,
      rightColor,
      -0.2
    );

    // Flechas desde cajas adicionales derecha
    rightBoxes.forEach(box => {
      const fromX = box.x;
      const fromY = box.y + box.height / 2;
      const toY = fromY < centerY ? vsTop : (fromY > centerY ? vsBottom : centerY);
      drawCurvedArrow(fromX, fromY, vsRight, toY, rightColor, -0.15);
    });

    // Círculo central "VS"
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.arc(centerX, centerY, vsCircleRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Borde blanco del círculo
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Texto "VS"
    ctx.font = 'bold 48px Arial';
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
      scaleX: 0.38,
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
            <h3 className="dilemas-column-title">Gobierno Populismo & Estable (Lado Izquierdo)</h3>

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
            <h3 className="dilemas-column-title">Gobierno Realista & Inestable (Lado Derecho)</h3>

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

// Exportar datos y función de dibujo para reutilización
export const initialDilemasData = {
  izquierda: initialCaracteristicasIzquierda,
  derecha: initialCaracteristicasDerecha
};

export const drawDilemasChartFromData = (izquierda, derecha) => {
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

  const centerX = width / 2;
  const centerY = height / 2;
  const vsCircleRadius = 65;
  const cornerRadius = 8;

  // Función para dibujar rectángulo con bordes redondeados
  const drawRoundedRect = (x, y, w, h, r, fillColor, strokeColor, lineWidth = 3) => {
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
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  // Función para dibujar flecha curva
  const drawCurvedArrow = (fromX, fromY, toX, toY, color, curvature = 0.3) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.setLineDash([]);

    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const cpX = midX + (-dy / dist) * dist * curvature;
    const cpY = midY + (dx / dist) * dist * curvature;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(cpX, cpY, toX, toY);
    ctx.stroke();

    const angle = Math.atan2(toY - cpY, toX - cpX);
    const arrowLength = 15;
    const arrowWidth = 10;

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle),
      toY - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle)
    );
    ctx.lineTo(
      toX - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle),
      toY - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  // Función para dibujar caja con título y subitems
  const drawBox = (x, y, titulo, subtitulo, subitems, color, maxWidth = 280) => {
    const padding = 15;
    const lineHeight = 24;
    const titleHeight = subtitulo ? 65 : 50;
    const subitemHeight = subitems.length * lineHeight + 20;
    const totalHeight = titleHeight + subitemHeight;

    drawRoundedRect(x, y, maxWidth, totalHeight, cornerRadius, '#FFFFFF', color, 4);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + cornerRadius, y);
    ctx.lineTo(x + maxWidth - cornerRadius, y);
    ctx.arcTo(x + maxWidth, y, x + maxWidth, y + cornerRadius, cornerRadius);
    ctx.lineTo(x + maxWidth, y + titleHeight);
    ctx.lineTo(x, y + titleHeight);
    ctx.lineTo(x, y + cornerRadius);
    ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 19px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (subtitulo) {
      ctx.fillText(titulo, x + maxWidth / 2, y + 20);
      ctx.font = '15px Arial';
      ctx.fillText(subtitulo, x + maxWidth / 2, y + 42);
    } else {
      ctx.fillText(titulo, x + maxWidth / 2, y + titleHeight / 2);
    }

    ctx.fillStyle = color;
    ctx.font = '15px Arial';
    ctx.textAlign = 'left';

    subitems.forEach((subitem, index) => {
      const subY = y + titleHeight + 10 + (index * lineHeight);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + padding, subY + lineHeight / 2, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = color;
      ctx.fillText(subitem, x + padding + 10, subY + lineHeight / 2);
    });

    return { x, y, width: maxWidth, height: totalHeight };
  };

  // LADO IZQUIERDO (ROJO)
  const leftColor = '#8B1A1A';
  const leftMainBox = drawBox(
    150,
    centerY - 60,
    'Lorem Ipsum',
    'Dolor & Sit Amet',
    ['(Consectetur)'],
    leftColor,
    350
  );

  const leftBoxes = [];
  const leftPositions = [
    { x: 80, y: 80 },
    { x: 320, y: 50 },
    { x: 80, y: centerY + 180 }
  ];

  izquierda.forEach((caract, index) => {
    const pos = leftPositions[index] || { x: 80, y: 80 + (index * 150) };
    leftBoxes.push(drawBox(
      pos.x,
      pos.y,
      caract.titulo,
      null,
      caract.subitems,
      leftColor,
      250
    ));
  });

  // LADO DERECHO (AZUL)
  const rightColor = '#1E5A96';
  const rightMainBox = drawBox(
    width - 500,
    centerY - 60,
    'Adipiscing Elit',
    'Tempor & Incididunt',
    [],
    rightColor,
    350
  );

  const rightBoxes = [];
  const rightPositions = [
    { x: width - 320, y: 60 },
    { x: width - 480, y: centerY - 270 },
    { x: width - 420, y: centerY + 180 },
    { x: width - 780, y: centerY + 250 }
  ];

  derecha.forEach((caract, index) => {
    const pos = rightPositions[index] || { x: width - 320, y: 60 + (index * 150) };
    rightBoxes.push(drawBox(
      pos.x,
      pos.y,
      caract.titulo,
      null,
      caract.subitems,
      rightColor,
      280
    ));
  });

  // DIBUJAR FLECHAS
  const vsLeft = centerX - vsCircleRadius - 15;
  const vsRight = centerX + vsCircleRadius + 15;
  const vsTop = centerY - vsCircleRadius / 2;
  const vsBottom = centerY + vsCircleRadius / 2;

  drawCurvedArrow(
    leftMainBox.x + leftMainBox.width,
    leftMainBox.y + leftMainBox.height / 2,
    vsLeft,
    centerY,
    leftColor,
    0.2
  );

  leftBoxes.forEach(box => {
    const fromX = box.x + box.width;
    const fromY = box.y + box.height / 2;
    const toY = fromY < centerY ? vsTop : (fromY > centerY ? vsBottom : centerY);
    drawCurvedArrow(fromX, fromY, vsLeft, toY, leftColor, 0.15);
  });

  drawCurvedArrow(
    rightMainBox.x,
    rightMainBox.y + rightMainBox.height / 2,
    vsRight,
    centerY,
    rightColor,
    -0.2
  );

  rightBoxes.forEach(box => {
    const fromX = box.x;
    const fromY = box.y + box.height / 2;
    const toY = fromY < centerY ? vsTop : (fromY > centerY ? vsBottom : centerY);
    drawCurvedArrow(fromX, fromY, vsRight, toY, rightColor, -0.15);
  });

  // Círculo central "VS"
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  ctx.arc(centerX, centerY, vsCircleRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();

  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', centerX, centerY);

  return canvasElement;
};

export default DilemasRentablesModal;