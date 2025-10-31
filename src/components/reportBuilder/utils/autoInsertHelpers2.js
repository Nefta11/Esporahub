// Auto-insertar helpers para Histograma del Humor Social y otros gráficos adicionales

// Auto-insertar Histograma del Humor Social
export const autoInsertHumorHistogram = async (canvas) => {
  if (!canvas) return;

  // Datos de ejemplo para el histograma (usando datos genéricos de Lorem Ipsum)
  const candidateData = [
    {
      id: "p1",
      name: "Lorem Ipsum",
      party: "P1",
      avatar: "",
      ringColor: "#A6343C",
      sentiment: "Incertidumbre",
      percentage: "0%",
      matrix: { x: 0, y: 0 },
      chart: {
        v: 0.1,
        h: -0.1,
        norm_w: 0.5,
        norm_h: 0.6,
        norm_dot: [-0.1, -0.1],
      },
    },
    {
      id: "p2",
      name: "Dolor Sit",
      party: "P2",
      avatar: "",
      ringColor: "#00843D",
      sentiment: "Aceptación",
      percentage: "0%",
      matrix: { x: 0, y: 0 },
      chart: { v: 0.1, h: 0.1, norm_w: 0.5, norm_h: 0.6, norm_dot: [0.1, 0.1] },
    },
  ];

  const title = "Histograma del Humor Social";
  const footnote =
    "*Histograma del Humor Social realizado el 11.Diciembre.2024";

  // Datos de la matriz de emociones
  const emotionLabels = [
    ["Cólera", "Odio", "Miedo", "Entusiasmo", "Amor", "Euforia"],
    [
      "Repulsión",
      "Enojo",
      "Irritación",
      "Motivación",
      "Admiración",
      "Fascinación",
    ],
    [
      "Desprecio",
      "Impotencia",
      "Indignación",
      "Curiosidad",
      "Alegría",
      "Orgullo",
    ],
    [
      "Vergüenza",
      "Desconfianza",
      "Vulnerabilidad",
      "Satisfacción",
      "Confianza",
      "Esperanza",
    ],
    ["Desdén", "Duda", "Incertidumbre", "Aceptación", "Lealtad", "Optimismo"],
    ["Depresión", "Desolación", "Inquietud", "Seguridad", "Tranquilidad", ""],
  ];

  const getGridColor = (r, c) => {
    const lightness = 35 + (5 - r) * 5;
    if (c < 3 && r < 3) return `hsl(0, 60%, ${lightness + 5}%)`;
    if (c >= 3 && r < 3) return `hsl(120, 60%, ${lightness}%)`;
    if (c < 3 && r >= 3) return `hsl(0, 65%, ${lightness - 5}%)`;
    if (c >= 3 && r >= 3) return `hsl(80, 60%, ${lightness - 5}%)`;
    return "#888";
  };

  // Precargar todos los avatares
  const avatarImages = await Promise.all(
    candidateData.map((profile) => {
      if (profile.avatar) {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = profile.avatar;
        });
      }
      return Promise.resolve(null);
    })
  );

  // Crear canvas temporal
  const tempCanvas = document.createElement("canvas");
  const width = 1700;
  const height = 900;
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext("2d");

  // 1. Fondo
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // 2. Título
  ctx.fillStyle = "#111";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "left";
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
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x + cellW / 2, y + cellH / 2);
      }
    }
  }

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, gridTop);
  ctx.lineTo(centerX, gridTop + gridHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(gridLeft, centerY);
  ctx.lineTo(gridLeft + gridWidth, centerY);
  ctx.stroke();

  ctx.fillStyle = "#111";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    "Alta actividad (+)",
    centerX + gridWidth / 4,
    gridTop + gridHeight + 20
  );
  ctx.fillText(
    "Baja actividad (-)",
    centerX - gridWidth / 4,
    gridTop + gridHeight + 20
  );
  ctx.save();
  ctx.translate(gridLeft - 20, centerY);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Agrada (+)", gridHeight / 4, 0);
  ctx.fillText("Desagrado (-)", -gridHeight / 4, 0);
  ctx.restore();

  candidateData.forEach((cand) => {
    const px = centerX + (cand.matrix.x / 3) * (gridWidth / 2);
    const py = centerY - (cand.matrix.y / 3) * (gridHeight / 2);
    ctx.beginPath();
    ctx.arc(px, py, 18, 0, Math.PI * 2);
    ctx.fillStyle = cand.ringColor;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
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

  const drawProfileRow = (ctx, profile, x, y, avatarImg) => {
    const avatarR = 30;
    const avatarX = x + avatarR + 10;
    const avatarY = y + avatarR + 10;

    // Dibujar avatar/logo en el círculo grande si existe
    if (avatarImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      // Dibujar la imagen centrada en el círculo grande
      ctx.drawImage(
        avatarImg,
        avatarX - avatarR,
        avatarY - avatarR,
        avatarR * 2,
        avatarR * 2
      );
      ctx.restore();
    }

    // Borde del círculo grande con color del anillo
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.fillStyle = avatarImg ? "transparent" : profile.ringColor;
    if (!avatarImg) ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = profile.ringColor;
    ctx.stroke();

    // Círculo pequeño para la letra del partido (P1, P2, etc.)
    ctx.beginPath();
    ctx.arc(avatarX + avatarR - 5, avatarY + avatarR - 5, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = profile.ringColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dibujar letra del partido en el círculo pequeño
    ctx.fillStyle = "#333";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      profile.party || "",
      avatarX + avatarR - 5,
      avatarY + avatarR - 5
    );

    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#111";
    ctx.textAlign = "left";
    ctx.fillText(profile.name, x + avatarR * 2 + 20, avatarY - 10);

    ctx.font = "bold 11px Arial";
    ctx.fillStyle = "#555";
    ctx.fillText(profile.percentage || "0%", x + avatarR * 2 + 20, avatarY + 5);

    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "left";
    ctx.fillText(profile.sentiment, x + 10, avatarY + 65);

    const chartX = x + 120;
    const chartY = y + 15;
    const chartW = 80;
    const chartH = 70;
    const cX = chartX + chartW / 2;
    const cY = chartY + chartH / 2;

    ctx.strokeStyle = "#ccc";
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

    ctx.fillStyle = "rgba(146, 208, 80, 0.7)";
    ctx.fillRect(cX + 2, cY - vBarVal, 10, vBarVal);

    ctx.fillStyle = "rgba(192, 0, 0, 0.7)";
    ctx.fillRect(cX, cY - 2, hBarVal, 10);

    const normW = profile.chart.norm_w * (chartW / 2);
    const normH = profile.chart.norm_h * (chartH / 2);
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.strokeRect(cX - normW / 2, cY - normH / 2, normW, normH);
    ctx.setLineDash([]);

    const [dotX, dotY] = profile.chart.norm_dot;
    ctx.beginPath();
    ctx.arc(
      cX + dotX * (chartW / 2),
      cY - dotY * (chartH / 2),
      3,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#0070C0";
    ctx.fill();
  };

  col1Data.forEach((p, i) => {
    const avatarImg = avatarImages[candidateData.indexOf(p)];
    drawProfileRow(ctx, p, col1Left, panelTop + i * rowH, avatarImg);
  });
  col2Data.forEach((p, i) => {
    const avatarImg = avatarImages[candidateData.indexOf(p)];
    drawProfileRow(ctx, p, col2Left, panelTop + i * rowH, avatarImg);
  });
  col3Data.forEach((p, i) => {
    const avatarImg = avatarImages[candidateData.indexOf(p)];
    drawProfileRow(ctx, p, col3Left, panelTop + i * rowH, avatarImg);
  });

  // 5. Pie de página
  ctx.font = "12px Arial";
  ctx.fillStyle = "#555";
  ctx.textAlign = "right";
  ctx.fillText(footnote, width - 50, height - 30);

  // Convertir a imagen y agregar al canvas
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
        hoverCursor: "move",
        name: "humor-histogram-chart",
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
      console.error("Error inserting histogram:", err);
    }
  };
  img.src = dataURL;
};

// Auto-insert an Arquetipos ring (Perfiles y Arquetipos)
export const autoInsertPerfilesArquetipos = async (canvas) => {
  if (!canvas) return;

  // Datos iniciales basados en la imagen - 2 sub-tipos por arquetipo
  const data = {
    title: "Arquetipos | Sub-arquetipos",
    footnote: "*Fuente: arquetipos de marca",
    axes: {
      top: "CAMBIO",
      right: "CERCANÍA",
      bottom: "ESTABILIDAD",
      left: "CONOCIMIENTO",
    },
    archeTypes: [
      {
        name: "Impulsor",
        color: "#F6C358",
        subTypes: ["Visionario", "Catalizador"],
      },
      {
        name: "Justiciero",
        color: "#F39C12",
        subTypes: ["Defensor", "Activista"],
      },
      {
        name: "Generoso",
        color: "#F08A5D",
        subTypes: ["Altruista", "Humanitario"],
      },
      {
        name: "Amigo",
        color: "#E94E77",
        subTypes: ["Leal", "Fiel"],
      },
      {
        name: "Protector",
        color: "#D7263D",
        subTypes: ["Guardián", "Vigilante"],
      },
      {
        name: "Héroe",
        color: "#8E44AD",
        subTypes: ["Valiente", "Salvador"],
      },
      {
        name: "Conciliador",
        color: "#2E9CCA",
        subTypes: ["Mediador", "Pacificador"],
      },
      {
        name: "Líder",
        color: "#3D6B9B",
        subTypes: ["Director", "Soberano"],
      },
      {
        name: "Ejecutivo",
        color: "#2E8B57",
        subTypes: ["Organizado", "Eficaz"],
      },
      {
        name: "Mentor",
        color: "#1F8A70",
        subTypes: ["Maestro", "Orientador"],
      },
      {
        name: "Estratega",
        color: "#27AE60",
        subTypes: ["Planificador", "Táctico"],
      },
      {
        name: "Transformador",
        color: "#9ACD32",
        subTypes: ["Mago", "Renovador"],
      },
    ],
  };

  // Draw a ring chart similar to the modal but for auto-insert
  const tempCanvas = document.createElement("canvas");
  const width = 1400;
  const height = 1000;
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Title
  ctx.fillStyle = "#111";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "left";
  ctx.fillText(data.title, 40, 50);

  // Ring parameters - anillo más grande
  const centerX = width / 2;
  const centerY = height / 2 + 40;
  const outerR = 300;
  const innerR = 200;

  // Draw segments by archetype (not by subtype)
  data.archeTypes.forEach((archetype, archetypeIndex) => {
    const numSubTypes = archetype.subTypes.length;
    const archetypeAngle = (Math.PI * 2) / data.archeTypes.length;

    const startAngle = -Math.PI / 2 + archetypeIndex * archetypeAngle;
    const endAngle = startAngle + archetypeAngle;

    // Draw the full archetype segment
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerR, startAngle, endAngle, false);
    ctx.arc(centerX, centerY, innerR, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = archetype.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    // Draw sub-types as a vertical list inside the segment
    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = (outerR + innerR) / 2;
    const labelX = centerX + Math.cos(midAngle) * labelRadius;
    const labelY = centerY + Math.sin(midAngle) * labelRadius;

    ctx.save();
    ctx.translate(labelX, labelY);

    // Ajustar rotación para que el texto siga la curva correctamente
    let textAngle = midAngle + Math.PI / 2;

    // Si el texto está en la parte inferior del círculo, voltear para que sea legible
    if (midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2) {
      textAngle = midAngle - Math.PI / 2;
    }

    ctx.rotate(textAngle);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 9px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Dibujar cada sub-tipo en una línea vertical
    const lineHeight = 12;
    const totalHeight = (numSubTypes - 1) * lineHeight;
    const startY = -totalHeight / 2;

    archetype.subTypes.forEach((subType, subIndex) => {
      const yPos = startY + subIndex * lineHeight;
      ctx.fillText(subType, 0, yPos);
    });

    ctx.restore();

    // Draw archetype name outside the ring
    const archetypeRadius = outerR + 50;
    const archetypeX = centerX + Math.cos(midAngle) * archetypeRadius;
    const archetypeY = centerY + Math.sin(midAngle) * archetypeRadius;

    ctx.fillStyle = "#333";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(archetype.name, archetypeX, archetypeY);
  });

  // Draw crosshair grid
  const gridExtend = 60;
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);

  // Vertical line
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - outerR - gridExtend);
  ctx.lineTo(centerX, centerY + outerR + gridExtend);
  ctx.stroke();

  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(centerX - outerR - gridExtend, centerY);
  ctx.lineTo(centerX + outerR + gridExtend, centerY);
  ctx.stroke();

  ctx.setLineDash([]);

  // Draw axes labels with arrows
  ctx.fillStyle = "#666";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";

  // Top label (CAMBIO)
  ctx.fillText(
    "+" + data.axes.top.toUpperCase(),
    centerX - 80,
    centerY - outerR - 80
  );

  // Right label (CERCANÍA)
  ctx.save();
  ctx.translate(centerX + outerR + 80, centerY - 80);
  ctx.rotate(Math.PI / 2);
  ctx.fillText("+" + data.axes.right.toUpperCase(), 0, 0);
  ctx.restore();

  // Bottom label (ESTABILIDAD)
  ctx.fillText(
    "+" + data.axes.bottom.toUpperCase(),
    centerX - 100,
    centerY + outerR + 80
  );

  // Left label (CONOCIMIENTO)
  ctx.save();
  ctx.translate(centerX - outerR - 80, centerY - 80);
  ctx.rotate(Math.PI / 2);
  ctx.fillText("+" + data.axes.left.toUpperCase(), 0, 0);
  ctx.restore();

  // Draw axis scale markers
  ctx.font = "12px Arial";
  ctx.fillStyle = "#999";

  // Horizontal scale
  ctx.textBaseline = "middle";
  ctx.fillText("-2", centerX - outerR - 50, centerY + 20);
  ctx.fillText("-1", centerX - outerR / 2 - 25, centerY + 20);
  ctx.fillText("0", centerX, centerY + 20);
  ctx.fillText("+1", centerX + outerR / 2 + 25, centerY + 20);
  ctx.fillText("+2", centerX + outerR + 50, centerY + 20);

  // Vertical scale
  ctx.textAlign = "right";
  ctx.fillText("+2", centerX - 20, centerY - outerR - 50);
  ctx.fillText("+1", centerX - 20, centerY - outerR / 2 - 25);
  ctx.fillText("0", centerX - 20, centerY);
  ctx.fillText("-1", centerX - 20, centerY + outerR / 2 + 25);
  ctx.fillText("-2", centerX - 20, centerY + outerR + 50);

  // Footnote
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

      const targetWidth = 960;
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
