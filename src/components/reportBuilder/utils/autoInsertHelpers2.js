// Auto-insertar helpers para Histograma del Humor Social y otros gráficos adicionales

// Auto-insertar Histograma del Humor Social
export const autoInsertHumorHistogram = async (canvas) => {
  if (!canvas) return;

  // Datos de ejemplo para el histograma
  const candidateData = [
    {
      id: 'p1',
      name: 'Personaje 1',
      logo: 'morena',
      ringColor: '#A6343C',
      sentiment: 'Incertidumbre',
      percentage: '15%',
      matrix: { x: -1.2, y: -1.5 },
      chart: { v: 0.2, h: -0.6, norm_w: 0.5, norm_h: 0.6, norm_dot: [-0.1, -0.1] }
    },
    {
      id: 'p2',
      name: 'Personaje 2',
      logo: 'pri',
      ringColor: '#00843D',
      sentiment: 'Aceptación',
      percentage: '22%',
      matrix: { x: 0.8, y: 0.5 },
      chart: { v: 0.5, h: 0.2, norm_w: 0.5, norm_h: 0.6, norm_dot: [0.1, 0.1] }
    },
    {
      id: 'p3',
      name: 'Personaje 3',
      logo: 'mc',
      ringColor: '#E67E22',
      sentiment: 'Decepción',
      percentage: '18%',
      matrix: { x: -0.5, y: -2.0 },
      chart: { v: 0.1, h: -0.4, norm_w: 0.5, norm_h: 0.6, norm_dot: [-0.1, -0.1] }
    },
  ];

  const title = 'Histograma del Humor Social';
  const footnote = '*Histograma del Humor Social realizado el ' + new Date().toLocaleDateString('es-MX');

  // Datos de la matriz de emociones
  const emotionLabels = [
    ['Cólera', 'Odio', 'Miedo', 'Entusiasmo', 'Amor', 'Euforia'],
    ['Repulsión', 'Enojo', 'Irritación', 'Motivación', 'Admiración', 'Fascinación'],
    ['Desprecio', 'Impotencia', 'Indignación', 'Curiosidad', 'Alegría', 'Orgullo'],
    ['Vergüenza', 'Desconfianza', 'Vulnerabilidad', 'Satisfacción', 'Confianza', 'Esperanza'],
    ['Desdén', 'Duda', 'Incertidumbre', 'Aceptación', 'Lealtad', 'Optimismo'],
    ['Depresión', 'Desolación', 'Inquietud', 'Seguridad', 'Tranquilidad', '']
  ];

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

  // Crear canvas temporal
  const tempCanvas = document.createElement('canvas');
  const width = 1700;
  const height = 900;
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext('2d');

  // 1. Fondo
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // 2. Título
  ctx.fillStyle = '#111';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(title, 50, 60);

  // 3. Matriz de Emociones (Izquierda)
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

  // 4. Columnas de Perfiles (Derecha) - 3 COLUMNAS
  const col1Left = 700;
  const col2Left = 1070;
  const col3Left = 1440;
  const panelTop = 100;
  const rowH = 120;

  const itemsPerCol = Math.ceil(candidateData.length / 3);
  const col1Data = candidateData.slice(0, itemsPerCol);
  const col2Data = candidateData.slice(itemsPerCol, itemsPerCol * 2);
  const col3Data = candidateData.slice(itemsPerCol * 2);

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

    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#111';
    ctx.textAlign = 'left';
    ctx.fillText(profile.name, x + avatarR * 2 + 20, avatarY - 10);

    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = '#555';
    ctx.fillText(profile.percentage || '0%', x + avatarR * 2 + 20, avatarY + 5);

    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText(profile.sentiment, x + 10, avatarY + 65);

    const chartX = x + 120;
    const chartY = y + 15;
    const chartW = 80;
    const chartH = 70;
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

    ctx.fillStyle = 'rgba(146, 208, 80, 0.7)';
    ctx.fillRect(cX + 2, cY - vBarVal, 10, vBarVal);

    ctx.fillStyle = 'rgba(192, 0, 0, 0.7)';
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
  col3Data.forEach((p, i) => {
    drawProfileRow(ctx, p, col3Left, panelTop + i * rowH);
  });

  // 5. Pie de página
  ctx.font = '12px Arial';
  ctx.fillStyle = '#555';
  ctx.textAlign = 'right';
  ctx.fillText(footnote, width - 50, height - 30);

  // Convertir a imagen y agregar al canvas
  const dataURL = tempCanvas.toDataURL('image/png');
  const { Image: FabricImage } = await import('fabric');

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const fabricImg = new FabricImage(img, {
        left: 60,
        top: 60,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        hoverCursor: 'move',
        name: 'humor-histogram-chart'
      });

      const targetWidth = 960;
      const scale = targetWidth / fabricImg.width;
      fabricImg.scaleX = scale;
      fabricImg.scaleY = scale;

      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      fabricImg.setCoords();
      canvas.requestRenderAll();
    } catch (err) {
      console.error('Error inserting histogram:', err);
    }
  };
  img.src = dataURL;
};
