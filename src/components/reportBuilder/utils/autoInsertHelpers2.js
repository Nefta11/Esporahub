// Auto-insert helpers for report builder: humor histogram, perfiles/arquetipos, perfil identificación

// Definición de la Matriz de Emociones
const emotionLabels = [
  ['Cólera', 'Odio', 'Miedo', 'Entusiasmo', 'Amor', 'Euforia'],
  ['Repulsión', 'Enojo', 'Irritación', 'Motivación', 'Admiración', 'Fascinación'],
  ['Desprecio', 'Impotencia', 'Indignación', 'Curiosidad', 'Alegría', 'Orgullo'],
  ['Vergüenza', 'Desconfianza', 'Vulnerabilidad', 'Satisfacción', 'Confianza', 'Esperanza'],
  ['Desdén', 'Duda', 'Incertidumbre', 'Aceptación', 'Lealtad', 'Optimismo'],
  ['Depresión', 'Desolación', 'Inquietud', 'Seguridad', 'Tranquilidad', '']
];

// Función para obtener colores de la matriz
const getGridColor = (r, c) => {
  const lightness = 35 + (5 - r) * 5;
  if (c < 3 && r < 3) return `hsl(0, 60%, ${lightness + 5}%)`;
  if (c >= 3 && r < 3) return `hsl(120, 60%, ${lightness}%)`;
  if (c < 3 && r >= 3) return `hsl(0, 65%, ${lightness - 5}%)`;
  if (c >= 3 && r >= 3) return `hsl(80, 60%, ${lightness - 5}%)`;
  return '#888';
};

// Auto-insert Histograma del Humor Social
export const autoInsertHumorHistogram = async (canvas) => {
  if (!canvas) return;

  const candidateData = [
    {
      id: 'personaje1',
      name: 'Lorem Ipsum',
      party: 'P1',
      avatar: '',
      ringColor: '#A6343C',
      sentiment: 'Incertidumbre',
      percentage: '0%',
      matrix: { x: 0, y: 0 },
      chart: { v: 0.1, h: -0.1, norm_w: 0.5, norm_h: 0.6, norm_dot: [-0.1, -0.1] }
    },
    {
      id: 'personaje2',
      name: 'Dolor Sit',
      party: 'P2',
      avatar: '',
      ringColor: '#00843D',
      sentiment: 'Aceptación',
      percentage: '0%',
      matrix: { x: 0, y: 0 },
      chart: { v: 0.1, h: 0.1, norm_w: 0.5, norm_h: 0.6, norm_dot: [0.1, 0.1] }
    }
  ];

  const title = 'Histograma del Humor Social';
  const footnote = '*Histograma del Humor Social realizado el 11.Diciembre.2024';

  const c = document.createElement('canvas');
  const width = 1300;
  const height = 680;
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d');

  // 1. Fondo
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // 2. Título
  ctx.fillStyle = '#111';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(title, 40, 45);

  // --- 3. Matriz de Emociones (Izquierda) ---
  const gridLeft = 40;
  const gridTop = 90;
  const gridWidth = 460;
  const gridHeight = 460;
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
        ctx.font = 'bold 8px Arial';
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
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Alta actividad (+)', centerX + gridWidth / 4, gridTop + gridHeight + 16);
  ctx.fillText('Baja actividad (-)', centerX - gridWidth / 4, gridTop + gridHeight + 16);
  ctx.save();
  ctx.translate(gridLeft - 16, centerY);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Agrada (+)', gridHeight / 4, 0);
  ctx.fillText('Desagrado (-)', -gridHeight / 4, 0);
  ctx.restore();

  candidateData.forEach((cand) => {
    const px = centerX + (cand.matrix.x / 3) * (gridWidth / 2);
    const py = centerY - (cand.matrix.y / 3) * (gridHeight / 2);
    ctx.beginPath();
    ctx.arc(px, py, 14, 0, Math.PI * 2);
    ctx.fillStyle = cand.ringColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  });

  // --- 4. Columnas de Perfiles (Derecha) - 3 COLUMNAS ---
  const col1Left = 530;
  const col2Left = 780;
  const col3Left = 1030;
  const panelTop = 75;
  const rowH = 95;

  const itemsPerCol = Math.ceil(candidateData.length / 3);
  const col1Data = candidateData.slice(0, itemsPerCol);
  const col2Data = candidateData.slice(itemsPerCol, itemsPerCol * 2);
  const col3Data = candidateData.slice(itemsPerCol * 2);

  const drawProfileRow = (ctx, profile, x, y) => {
    const avatarR = 24;
    const avatarX = x + avatarR + 8;
    const avatarY = y + avatarR + 8;

    // Borde del círculo grande con color del anillo
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.fillStyle = profile.ringColor;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = profile.ringColor;
    ctx.stroke();

    // Círculo pequeño para la letra del partido
    ctx.beginPath();
    ctx.arc(avatarX + avatarR - 4, avatarY + avatarR - 4, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = profile.ringColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(profile.party || '', avatarX + avatarR - 4, avatarY + avatarR - 4);

    // Nombre
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#111';
    ctx.textAlign = 'left';
    ctx.fillText(profile.name, x + avatarR * 2 + 16, avatarY - 8);

    // Porcentaje
    ctx.font = 'bold 9px Arial';
    ctx.fillStyle = '#555';
    ctx.fillText(profile.percentage || '0%', x + avatarR * 2 + 16, avatarY + 4);

    // Sentimiento
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText(profile.sentiment, x + 8, avatarY + 50);

    // Mini-Gráfico
    const chartX = x + 100;
    const chartY = y + 12;
    const chartW = 60;
    const chartH = 55;
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
    ctx.fillRect(cX + 1, cY - vBarVal, 8, vBarVal);

    ctx.fillStyle = 'rgba(192, 0, 0, 0.7)';
    ctx.fillRect(cX, cY - 1, hBarVal, 8);

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

  col1Data.forEach((p, i) => drawProfileRow(ctx, p, col1Left, panelTop + i * rowH));
  col2Data.forEach((p, i) => drawProfileRow(ctx, p, col2Left, panelTop + i * rowH));
  col3Data.forEach((p, i) => drawProfileRow(ctx, p, col3Left, panelTop + i * rowH));

  // --- 5. Pie de página ---
  ctx.font = '10px Arial';
  ctx.fillStyle = '#555';
  ctx.textAlign = 'right';
  ctx.fillText(footnote, width - 40, height - 25);

  // Convert to image and insert into Fabric canvas
  const dataURL = c.toDataURL('image/png');
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

      const targetWidth = 850;
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

// Auto-insert an Arquetipos ring (Perfiles y Arquetipos)
export const autoInsertPerfilesArquetipos = async (canvas) => {
  if (!canvas) return;

  const data = {
    title: "Arquetipos | Sub-arquetipos",
    footnote: "*Fuente: arquetipos de marca",
    axes: { top: "CAMBIO", right: "CERCANÍA", bottom: "ESTABILIDAD", left: "CONOCIMIENTO" },
    archeTypes: [
      { name: "Impulsor", color: "#F6C358", subTypes: ["Visionario", "Catalizador"] },
      { name: "Justiciero", color: "#F39C12", subTypes: ["Defensor", "Activista"] },
      { name: "Generoso", color: "#F08A5D", subTypes: ["Altruista", "Humanitario"] },
      { name: "Amigo", color: "#E94E77", subTypes: ["Leal", "Fiel"] },
      { name: "Protector", color: "#D7263D", subTypes: ["Guardián", "Vigilante"] },
      { name: "Héroe", color: "#8E44AD", subTypes: ["Valiente", "Salvador"] },
      { name: "Conciliador", color: "#2E9CCA", subTypes: ["Mediador", "Pacificador"] },
      { name: "Líder", color: "#3D6B9B", subTypes: ["Director", "Soberano"] },
      { name: "Ejecutivo", color: "#2E8B57", subTypes: ["Organizado", "Eficaz"] },
      { name: "Mentor", color: "#1F8A70", subTypes: ["Maestro", "Orientador"] },
      { name: "Estratega", color: "#27AE60", subTypes: ["Planificador", "Táctico"] },
      { name: "Transformador", color: "#9ACD32", subTypes: ["Mago", "Renovador"] },
    ],
  };

  const tempCanvas = document.createElement("canvas");
  const width = 1000;
  const height = 720;
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Title
  ctx.fillStyle = "#111";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "left";
  ctx.fillText(data.title, 40, 40);

  // Ring params
  const centerX = width / 2;
  const centerY = height / 2 + 20;
  const outerR = 220;
  const innerR = 150;

  data.archeTypes.forEach((archetype, archetypeIndex) => {
    const archetypeAngle = (Math.PI * 2) / data.archeTypes.length;
    const startAngle = -Math.PI / 2 + archetypeIndex * archetypeAngle;
    const endAngle = startAngle + archetypeAngle;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerR, startAngle, endAngle, false);
    ctx.arc(centerX, centerY, innerR, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = archetype.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    // label
    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = (outerR + innerR) / 2;
    const labelX = centerX + Math.cos(midAngle) * labelRadius;
    const labelY = centerY + Math.sin(midAngle) * labelRadius;
    ctx.save();
    ctx.translate(labelX, labelY);
    let textAngle = midAngle + Math.PI / 2;
    if (midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2) textAngle = midAngle - Math.PI / 2;
    ctx.rotate(textAngle);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 9px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lineHeight = 12;
    const totalHeight = (archetype.subTypes.length - 1) * lineHeight;
    const startY = -totalHeight / 2;
    archetype.subTypes.forEach((subType, subIndex) => {
      const yPos = startY + subIndex * lineHeight;
      ctx.fillText(subType, 0, yPos);
    });
    ctx.restore();

    // archetype name outside
    const archetypeRadius = outerR + 40;
    const archetypeX = centerX + Math.cos(midAngle) * archetypeRadius;
    const archetypeY = centerY + Math.sin(midAngle) * archetypeRadius;
    ctx.fillStyle = "#333";
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(archetype.name, archetypeX, archetypeY);
  });

  // grid
  const gridExtend = 45;
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - outerR - gridExtend);
  ctx.lineTo(centerX, centerY + outerR + gridExtend);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX - outerR - gridExtend, centerY);
  ctx.lineTo(centerX + outerR + gridExtend, centerY);
  ctx.stroke();
  ctx.setLineDash([]);

  // axes labels
  ctx.fillStyle = "#666";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("+" + data.axes.top.toUpperCase(), centerX - 60, centerY - outerR - 60);
  ctx.save();
  ctx.translate(centerX + outerR + 60, centerY - 60);
  ctx.rotate(Math.PI / 2);
  ctx.fillText("+" + data.axes.right.toUpperCase(), 0, 0);
  ctx.restore();
  ctx.fillText("+" + data.axes.bottom.toUpperCase(), centerX - 70, centerY + outerR + 60);
  ctx.save();
  ctx.translate(centerX - outerR - 60, centerY - 60);
  ctx.rotate(Math.PI / 2);
  ctx.fillText("+" + data.axes.left.toUpperCase(), 0, 0);
  ctx.restore();

  // footnote
  ctx.font = "12px Arial";
  ctx.fillStyle = "#555";
  ctx.textAlign = "right";
  ctx.fillText(data.footnote, width - 40, height - 30);

  const dataURL = tempCanvas.toDataURL("image/png");
  const { Image: FabricImage } = await import("fabric");
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    try {
      const fabricImg = new FabricImage(img, {
        left: 60,
        top: 60,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        name: "perfiles-arquetipos",
      });

      const targetWidth = 700;
      const scale = targetWidth / fabricImg.width;
      fabricImg.scaleX = scale;
      fabricImg.scaleY = scale;

      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      fabricImg.setCoords();
      canvas.requestRenderAll();
    } catch (err) {
      console.error("Error inserting perfiles arquetipos:", err);
    }
  };
  img.src = dataURL;
};

// Auto-insert for "Estudio de Identificación y definición del Perfil"
export const autoInsertPerfilIdentificacion = async (canvas, data = {}) => {
  if (!canvas) return;

  // allow caller to pass positive/negative/footnote/title
  const positive = data.positive || [
    "La población digital de Nuevo León busca en su próximo Gobernador la figura arquetípica de un Impulsor",
    "Quieren que posea un carácter fuerte para combatir problemas de inseguridad y criminalidad",
    "Buscan un enfoque renovado de la política que transforme la manera de abordar los problemas del Estado",
  ];

  const negative = data.negative || [
    "Les enfadaría que haga mega obras sin dar cuentas claras sobre el gasto público",
    "No desean a alguien que se limite a aparecer en redes sociales mientras permanece ausente",
    "Les enojaría que sus promesas de campaña no llegaran a realizarse o fueran ineficientes",
  ];

  // Ajustes para evitar empalme de textos
  const col1X = 330;
  const col2X = col1X + 380;
  const colYStart = 160;
  const lineHeight = 28;

  const tempCanvas = document.createElement("canvas");
  const width = 1100;
  const height = 600;
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Left rounded card
  const cardX = 30;
  const cardY = 30;
  const cardW = 280;
  const cardH = 540;
  const radius = 24;
  ctx.fillStyle = "#f3f4f6";
  ctx.beginPath();
  ctx.moveTo(cardX + radius, cardY);
  ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardH, radius);
  ctx.arcTo(cardX + cardW, cardY + cardH, cardX, cardY + cardH, radius);
  ctx.arcTo(cardX, cardY + cardH, cardX, cardY, radius);
  ctx.arcTo(cardX, cardY, cardX + cardW, cardY, radius);
  ctx.closePath();
  ctx.fill();

  // Donut ring
  const centerX = cardX + cardW / 2;
  const centerY = cardY + 110;
  const outerR = 70;
  const innerR = 35;
  const segments = 10;
  for (let i = 0; i < segments; i++) {
    const ang = (i / segments) * Math.PI * 2 - Math.PI / 2;
    const nx = Math.cos(ang);
    const ny = Math.sin(ang);
    const segColor = `hsl(${(i / segments) * 360},60%,45%)`;
    ctx.beginPath();
    ctx.fillStyle = segColor;
    ctx.moveTo(centerX + nx * innerR, centerY + ny * innerR);
    ctx.arc(centerX, centerY, outerR, ang, ang + (Math.PI * 2) / segments);
    ctx.lineTo(centerX + nx * innerR, centerY + ny * innerR);
    ctx.closePath();
    ctx.fill();
  }

  // center emblem
  ctx.fillStyle = "#fef3c7";
  ctx.beginPath();
  const polyR = 22;
  const points = 6;
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2 - Math.PI / 2;
    const x = centerX + Math.cos(a) * polyR;
    const y = centerY + Math.sin(a) * polyR;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Text below ring
  ctx.fillStyle = "#6b7280";
  ctx.font = "11px Arial";
  ctx.textAlign = "center";
  const subtitle =
    "La población digital de Nuevo León busca en su próximo Gobernador la figura arquetípica de un";
  wrapText(ctx, subtitle, centerX, centerY + 95, cardW - 30, 14);
  ctx.fillStyle = "#5b21b6";
  ctx.font = "bold 18px Arial";
  ctx.fillText("Impulsor", centerX, centerY + 150);

  // Middle and right columns
  // Headers
  ctx.fillStyle = "#14532d";
  ctx.fillRect(col1X - 10, colYStart - 30, 280, 36);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Positivo", col1X, colYStart - 8);

  ctx.fillStyle = "#4c0519";
  ctx.fillRect(col2X - 10, colYStart - 30, 280, 36);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px Arial";
  ctx.fillText("Negativo", col2X, colYStart - 8);

  // Bulleted lists
  ctx.fillStyle = "#111827";
  ctx.font = "11px Arial";
  let y = colYStart + 20;
    const loremPositive = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.",
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
      "Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo."
    ];
    loremPositive.forEach((txt) => {
      drawBulletText(ctx, txt, col1X, y, 260, lineHeight);
      y += estimateLines(txt, 260, ctx) * lineHeight + 12;
    });

  y = colYStart + 20;
    const loremNegative = [
      "Sed posuere consectetur est at lobortis. Etiam porta sem malesuada magna mollis euismod.",
      "Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
      "Maecenas sed diam eget risus varius blandit sit amet non magna."
    ];
    loremNegative.forEach((txt) => {
      drawBulletText(ctx, txt, col2X, y, 260, lineHeight);
      y += estimateLines(txt, 260, ctx) * lineHeight + 12;
    });

  // Footer
  ctx.font = "12px Arial";
  ctx.fillStyle = "#555";
  ctx.textAlign = "right";
  const foot = data.footnote || "*Perfil realizado el 11.Diciembre.2024";
  ctx.fillText(foot, width - 40, height - 30);

  // helpers
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let curY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + " ";
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }

  function drawBulletText(ctx, text, x, y, maxWidth, lineHeight) {
    ctx.beginPath();
    ctx.fillStyle = "#111827";
    ctx.arc(x + 6, y - 6, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.textAlign = "left";
    wrapText(ctx, text, x + 18, y, maxWidth - 18, lineHeight);
  }

  function estimateLines(text, maxWidth, ctx) {
    const words = text.split(" ");
    let line = "";
    let lines = 1;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && n > 0) {
        line = words[n] + " ";
        lines++;
      } else {
        line = testLine;
      }
    }
    return lines;
  }

  // Convert and insert
  const dataURL = tempCanvas.toDataURL("image/png");
  const { Image: FabricImage } = await import("fabric");
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    try {
      const fImg = new FabricImage(img, {
        left: 40,
        top: 30,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        name: "perfil-identificacion",
      });

      const targetWidth = 800;
      const scale = targetWidth / fImg.width;
      fImg.scaleX = scale;
      fImg.scaleY = scale;

      canvas.add(fImg);
      canvas.setActiveObject(fImg);
      fImg.setCoords();
      canvas.requestRenderAll();
    } catch (err) {
      console.error("Error inserting perfil identificacion", err);
    }
  };
  img.src = dataURL;
};

// Auto-insert for "Análisis Comparativo de Perfil" (Perfil Personas)
export const autoInsertPerfilPersonas = async (canvas) => {
  if (!canvas) return;

  const { initialPerfilPersonasData, drawPerfilChartFromData } = await import('../modals/PerfilPersonasModal.jsx');
  const tempCanvas = await drawPerfilChartFromData(initialPerfilPersonasData);
  const dataURL = tempCanvas.toDataURL('image/png');

  const { Image: FabricImage } = await import('fabric');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const fabricImg = new FabricImage(img, {
        left: 60,
        top: 40,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        hoverCursor: 'move',
        name: 'perfil-personas'
      });

      const scale = 700 / fabricImg.width;
      fabricImg.scaleX = scale;
      fabricImg.scaleY = scale;

      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      fabricImg.setCoords();
      canvas.requestRenderAll();
    } catch (err) {
      console.error('Error inserting perfil personas:', err);
    }
  };
  img.src = dataURL;
};

// Auto-insert for "Identificación de los dilemas rentables"
export const autoInsertDilemasRentables = async (canvas) => {
  if (!canvas) return;

  const { initialDilemasData, drawDilemasChartFromData } = await import('../modals/DilemasRentablesModal.jsx');
  const canvasElement = drawDilemasChartFromData(initialDilemasData.izquierda, initialDilemasData.derecha);
  const dataURL = canvasElement.toDataURL('image/png', 1.0);

  const { Image: FabricImage } = await import('fabric');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const fabricImg = new FabricImage(img, {
        left: 50,
        top: 30,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        hoverCursor: 'move',
        scaleX: 0.38,
        scaleY: 0.38,
        name: 'dilemas-rentables-chart'
      });

      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      fabricImg.setCoords();
      canvas.requestRenderAll();
    } catch (err) {
      console.error('Error inserting dilemas rentables:', err);
    }
  };
  img.src = dataURL;
};
