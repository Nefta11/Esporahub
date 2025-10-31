import React, { useState } from 'react';
import { Image as FabricImage } from 'fabric';

// --- Datos Iniciales de Ejemplo (Usados como estado inicial) ---
const initialCandidateData = [
  {
    id: 'clf',
    name: 'Clara Luz Flores',
    logo: 'morena',
    ringColor: '#A6343C',
    sentiment: 'Decepción',
    matrix: { x: -1.8, y: -1.8 },
    chart: { v: 0.2, h: -0.8, norm_w: 0.5, norm_h: 0.6, norm_dot: [-0.1, -0.1] }
  },
  {
    id: 'wf',
    name: 'Waldo Fernández',
    logo: 'morena',
    ringColor: '#A6343C',
    sentiment: 'Incertidumbre',
    matrix: { x: -1.4, y: -1.4 },
    chart: { v: 0.1, h: -0.3, norm_w: 0.5, norm_h: 0.6, norm_dot: [-0.1, -0.1] }
  },
  // ... (puedes añadir más o empezar con un array vacío: [])
];

// --- Plantilla para nuevo candidato ---
const newCandidateTemplate = {
  id: `new_${Date.now()}`,
  name: 'Nuevo Candidato',
  logo: 'morena',
  ringColor: '#A6343C',
  sentiment: 'Incertidumbre',
  matrix: { x: 0, y: 0 },
  chart: { v: 0.1, h: -0.1, norm_w: 0.5, norm_h: 0.6, norm_dot: [-0.1, -0.1] }
};


// --- Definición de la Matriz de Emociones (Sin cambios) ---
const emotionLabels = [
  ['Cólera', 'Odio', 'Miedo', 'Entusiasmo', 'Amor', 'Euforia'],
  ['Repulsión', 'Enojo', 'Irritación', 'Motivación', 'Admiración', 'Fascinación'],
  ['Desprecio', 'Impotencia', 'Indignación', 'Curiosidad', 'Alegría', 'Orgullo'],
  ['Vergüenza', 'Desconfianza', 'Vulnerabilidad', 'Satisfacción', 'Confianza', 'Esperanza'],
  ['Desdén', 'Duda', 'Incertidumbre', 'Aceptación', 'Lealtad', 'Optimismo'],
  ['Depresión', 'Desolación', 'Inquietud', 'Seguridad', 'Tranquilidad', '']
];

// --- Colores (Sin cambios) ---
const getGridColor = (r, c) => {
  const lightness = 35 + (5 - r) * 5;
  if (c < 3 && r < 3) return `hsl(0, 60%, ${lightness + 5}%)`;
  if (c >= 3 && r < 3) return `hsl(120, 60%, ${lightness}%)`;
  if (c < 3 && r >= 3) return `hsl(0, 65%, ${lightness - 5}%)`;
  if (c >= 3 && r >= 3) return `hsl(80, 60%, ${lightness - 5}%)`;
  return '#888';
};

const getLogoColor = (logo) => {
  switch (logo) {
    case 'morena': return '#A6343C';
    case 'pri': return '#00843D';
    case 'mc': return '#E67E22';
    default: return '#999';
  }
};

// --- Función de Dibujo Principal (Sin cambios) ---
// Esta función ya acepta el array de candidatos, así que no necesita cambios.
const drawHistogram = (candidateData, title, footnote) => {
  const c = document.createElement('canvas');
  const width = 1700;
  const height = 900;
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d');

  // 1. Fondo
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // 2. Título (ahora viene de los argumentos)
  ctx.fillStyle = '#111';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(title, 50, 60);

  // --- 3. Matriz de Emociones (Izquierda) ---
  const gridLeft = 50;
  const gridTop = 120;
  const gridWidth = 600;
  const gridHeight = 600;
  const cols = 6;
  const rows = 6;
  const cellW = gridWidth / cols;
  const cellH = gridHeight / rows;
  const centerX = gridLeft + gridWidth / 2;
  const centerY = gridTop + gridHeight / 2;

  for (let r = 0; r < rows; r++) {
    for (let cidx = 0; cidx < cols; cidx++) {
      const x = gridLeft + cidx * cellW;
      const y = gridTop + r * cellH;
      ctx.fillStyle = getGridColor(r, cidx);
      ctx.fillRect(x, y, cellW, cellH);
      const label = emotionLabels[r] && emotionLabels[r][cidx];
      if (label) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + cellW / 2, y + cellH / 2);
      }
    }
  }

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, gridTop);
  ctx.lineTo(centerX, gridTop + gridHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(gridLeft, centerY);
  ctx.lineTo(gridLeft + gridWidth, centerY);
  ctx.stroke();

  ctx.fillStyle = '#111';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Alta actividad (+)', centerX + gridWidth / 4, gridTop + gridHeight + 20);
  ctx.fillText('Baja actividad (-)', centerX - gridWidth / 4, gridTop + gridHeight + 20);
  ctx.save();
  ctx.translate(gridLeft - 20, centerY);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Agrada (+)', gridHeight / 4, 0);
  ctx.fillText('Desagrado (-)', -gridHeight / 4, 0);
  ctx.restore();

  candidateData.forEach((cand) => {
    const px = centerX + (cand.matrix.x / 3) * (gridWidth / 2);
    const py = centerY - (cand.matrix.y / 3) * (gridHeight / 2);
    ctx.beginPath();
    ctx.arc(px, py, 18, 0, Math.PI * 2);
    ctx.fillStyle = cand.ringColor;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  });

  // --- 4. Columnas de Perfiles (Derecha) ---
  const col1Left = 700;
  const col2Left = 1200;
  const panelTop = 100;
  const rowH = 120;

  // Divide los candidatos en dos columnas
  const col1Data = candidateData.slice(0, Math.ceil(candidateData.length / 2));
  const col2Data = candidateData.slice(Math.ceil(candidateData.length / 2));

  const drawProfileRow = (ctx, profile, x, y) => {
    const avatarR = 30;
    const avatarX = x + avatarR + 10;
    const avatarY = y + avatarR + 10;

    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.fillStyle = profile.ringColor;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(avatarX + avatarR - 5, avatarY + avatarR - 5, 12, 0, Math.PI * 2);
    ctx.fillStyle = getLogoColor(profile.logo);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#111';
    ctx.textAlign = 'left';
    ctx.fillText(profile.name, x + avatarR * 2 + 20, avatarY - 5);

    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'right';
    ctx.fillText(profile.sentiment, x + 480, avatarY + 5);

    const chartX = x + 230;
    const chartY = y + 15;
    const chartW = 100;
    const chartH = 80;
    const cX = chartX + chartW / 2;
    const cY = chartY + chartH / 2;

    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cX, chartY);
    ctx.lineTo(cX, chartY + chartH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(chartX, cY);
    ctx.lineTo(chartX + chartW, cY);
    ctx.stroke();

    const vBarVal = profile.chart.v * (chartH / 2);
    const hBarVal = profile.chart.h * (chartW / 2);

    ctx.fillStyle = 'rgba(146, 208, 80, 0.7)'; // Green
    ctx.fillRect(cX + 2, cY - vBarVal, 10, vBarVal);

    ctx.fillStyle = 'rgba(192, 0, 0, 0.7)'; // Red
    ctx.fillRect(cX, cY - 2, hBarVal, 10);

    const normW = profile.chart.norm_w * (chartW / 2);
    const normH = profile.chart.norm_h * (chartH / 2);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.strokeRect(cX - normW / 2, cY - normH / 2, normW, normH);
    ctx.setLineDash([]);

    const [dotX, dotY] = profile.chart.norm_dot;
    ctx.beginPath();
    ctx.arc(cX + dotX * (chartW / 2), cY - dotY * (chartH / 2), 3, 0, Math.PI * 2);
    ctx.fillStyle = '#0070C0';
    ctx.fill();
  };

  col1Data.forEach((p, i) => {
    drawProfileRow(ctx, p, col1Left, panelTop + i * rowH);
  });
  col2Data.forEach((p, i) => {
    drawProfileRow(ctx, p, col2Left, panelTop + i * rowH);
  });

  // --- 5. Pie de página (ahora viene de argumentos) ---
  ctx.font = '12px Arial';
  ctx.fillStyle = '#555';
  ctx.textAlign = 'right';
  ctx.fillText(footnote, width - 50, height - 30);

  return c;
};

// --- Componente React del Modal (Modificado) ---
const HumorHistogramModal = ({ isOpen, onClose, canvas }) => {
  const [title, setTitle] = useState('Humor Social');
  const [footnote, setFootnote] = useState('*Humor Social realizado el 11.Diciembre.2024');

  // --- ESTE ES EL CAMBIO PRINCIPAL ---
  // El estado ahora es un array de objetos, no un string JSON.
  const [candidates, setCandidates] = useState(initialCandidateData);

  if (!isOpen) return null;

  // --- Funciones para manipular el array de candidatos ---
  const handleCandidateChange = (index, field, value) => {
    const newCandidates = [...candidates];
    const candidate = { ...newCandidates[index] }; // Copia el candidato a editar

    // Manejar campos anidados (matrix y chart)
    if (field === 'matrix.x') {
      candidate.matrix = { ...candidate.matrix, x: parseFloat(value) || 0 };
    } else if (field === 'matrix.y') {
      candidate.matrix = { ...candidate.matrix, y: parseFloat(value) || 0 };
    } else if (field === 'chart.v') {
      candidate.chart = { ...candidate.chart, v: parseFloat(value) || 0 };
    } else if (field === 'chart.h') {
      candidate.chart = { ...candidate.chart, h: parseFloat(value) || 0 };
    } else {
      // Campos de primer nivel (name, sentiment, logo, ringColor)
      candidate[field] = value;
    }

    newCandidates[index] = candidate; // Reemplaza el candidato antiguo por el editado
    setCandidates(newCandidates); // Actualiza el estado
  };

  const handleAddCandidate = () => {
    // Añade una copia de la plantilla al final del array
    setCandidates([...candidates, { ...newCandidateTemplate, id: `new_${Date.now()}` }]);
  };

  const handleRemoveCandidate = (index) => {
    // Filtra el array para eliminar el candidato en ese índice
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  // --- Función de Inserción (Modificada) ---
  const handleInsert = async () => {
    if (!canvas) return;

    // ¡Ya no hay que parsear JSON!
    // Simplemente usamos el estado 'candidates', 'title', y 'footnote'.
    const tempCanvas = drawHistogram(candidates, title, footnote);
    const dataURL = tempCanvas.toDataURL('image/png');

    const { Image: FabricImageClass } = await import('fabric');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const fabricImg = new FabricImageClass(img, {
          left: 60,
          top: 60,
          selectable: true,
          evented: true,
          hasControls: true,
          hasBorders: true,
          hoverCursor: 'move',
          name: 'humor-social-chart'
        });

        const targetWidth = 960;
        const scale = targetWidth / fabricImg.width;
        fabricImg.scaleX = scale;
        fabricImg.scaleY = scale;

        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        fabricImg.setCoords();
        canvas.requestRenderAll();
        onClose();
      } catch (err) {
        console.error('Error inserting image:', err);
      }
    };
    img.src = dataURL;
  };

  // --- JSX del Modal (Modificado) ---
  return (
    <div className="chart-modal-overlay">
      <div className="chart-modal-container" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 className="chart-modal-title">Gráfico de Humor Social</h2>

        <div className="chart-modal-field">
          <label>Título del Gráfico</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="chart-modal-field">
          <label>Pie de Página</label>
          <input value={footnote} onChange={(e) => setFootnote(e.target.value)} />
        </div>

        <hr style={{ margin: '20px 0' }} />

        <h3 style={{ marginTop: '0' }}>Candidatos</h3>

        {/* Contenedor de la lista de formularios de candidatos */}
        <div className="candidate-editor-list">
          {candidates.map((candidate, index) => (
            <fieldset key={candidate.id || index} className="candidate-editor-item" style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px' }}>
              <legend style={{ fontWeight: 'bold' }}>{candidate.name || `Candidato ${index + 1}`}</legend>

              <button
                onClick={() => handleRemoveCandidate(index)}
                style={{ float: 'right', background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Eliminar
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="chart-modal-field">
                  <label>Nombre</label>
                  <input value={candidate.name} onChange={(e) => handleCandidateChange(index, 'name', e.target.value)} />
                </div>
                <div className="chart-modal-field">
                  <label>Sentimiento</label>
                  <input value={candidate.sentiment} onChange={(e) => handleCandidateChange(index, 'sentiment', e.target.value)} />
                </div>
                <div className="chart-modal-field">
                  <label>Logo (ID: morena, pri, mc)</label>
                  <input value={candidate.logo} onChange={(e) => handleCandidateChange(index, 'logo', e.target.value)} />
                </div>
                <div className="chart-modal-field">
                  <label>Color Anillo (hex: #A6343C)</label>
                  <input value={candidate.ringColor} onChange={(e) => handleCandidateChange(index, 'ringColor', e.target.value)} />
                </div>
                <div className="chart-modal-field">
                  <label>Matriz X (-3 a 3)</label>
                  <input type="number" step="0.1" value={candidate.matrix.x} onChange={(e) => handleCandidateChange(index, 'matrix.x', e.target.value)} />
                </div>
                <div className="chart-modal-field">
                  <label>Matriz Y (-3 a 3)</label>
                  <input type="number" step="0.1" value={candidate.matrix.y} onChange={(e) => handleCandidateChange(index, 'matrix.y', e.target.value)} />
                </div>
                <div className="chart-modal-field">
                  <label>Chart V (verde, -1 a 1)</label>
                  <input type="number" step="0.1" value={candidate.chart.v} onChange={(e) => handleCandidateChange(index, 'chart.v', e.target.value)} />
                </div>
                <div className="chart-modal-field">
                  <label>Chart H (rojo, -1 a 1)</label>
                  <input type="number" step="0.1" value={candidate.chart.h} onChange={(e) => handleCandidateChange(index, 'chart.h', e.target.value)} />
                </div>
              </div>
            </fieldset>
          ))}
        </div>

        <button
          onClick={handleAddCandidate}
          className="chart-modal-button-insert"
          style={{ background: '#2ecc71', width: '100%', marginTop: '10px' }}
        >
          + Añadir Candidato
        </button>

        <div className="chart-modal-buttons" style={{ marginTop: '20px' }}>
          <button onClick={onClose} className="chart-modal-button-cancel">Cancelar</button>
          <button onClick={handleInsert} className="chart-modal-button-insert">Insertar Gráfico</button>
        </div>
      </div>
    </div>
  );
};

export default HumorHistogramModal;