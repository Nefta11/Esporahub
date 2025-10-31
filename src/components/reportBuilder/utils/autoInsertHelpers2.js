// Auto-insert helpers for report builder: humor histogram, perfiles/arquetipos, perfil identificación

// Auto-insert Histograma del Humor Social
export const autoInsertHumorHistogram = async (canvas) => {
  if (!canvas) return;

  // Example data (placeholder)
  const candidateData = [
    {
      id: "p1",
      name: "Lorem Ipsum",
      party: "P1",
      avatar: "",
      ringColor: "#A6343C",
      sentiment: "Incertidumbre",
      percentage: "12%",
      chart: { v: 0.1, h: -0.1, norm_w: 0.5, norm_h: 0.6, norm_dot: [-0.1, -0.1] },
    },
    {
      id: "p2",
      name: "Dolor Sit",
      party: "P2",
      avatar: "",
      ringColor: "#00843D",
      sentiment: "Aceptación",
      percentage: "8%",
      chart: { v: 0.1, h: 0.1, norm_w: 0.5, norm_h: 0.6, norm_dot: [0.1, 0.1] },
    },
    {
      id: "p3",
      name: "Amet Consect",
      party: "P3",
      avatar: "",
      ringColor: "#0070C0",
      sentiment: "Rechazo",
      percentage: "5%",
      chart: { v: -0.2, h: 0.05, norm_w: 0.3, norm_h: 0.4, norm_dot: [0.05, -0.2] },
    },
    {
      id: "p4",
      name: "Sit Amet",
      party: "P4",
      avatar: "",
      ringColor: "#F39C12",
      sentiment: "Esperanza",
      percentage: "18%",
      chart: { v: 0.3, h: 0.2, norm_w: 0.6, norm_h: 0.5, norm_dot: [0.2, 0.3] },
    },
    {
      id: "p5",
      name: "Consectetur",
      party: "P5",
      avatar: "",
      ringColor: "#8E44AD",
      sentiment: "Neutral",
      percentage: "3%",
      chart: { v: -0.05, h: -0.15, norm_w: 0.4, norm_h: 0.45, norm_dot: [-0.15, -0.05] },
    },
  ];

  const width = 1400;
  const height = 900;
  const tempCanvas = document.createElement("canvas");
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
  ctx.fillText("Histograma del Humor Social", 40, 50);

  // Layout: three columns of rows
  const panelTop = 110;
  const rowH = 110;
  const col1Left = 60;
  const col2Left = 520;
  const col3Left = 980;

  function drawProfileRow(ctx, profile, x, y) {
    const avatarR = 34;
    const avatarX = x;
    const avatarY = y;

    // ring
    ctx.beginPath();
    ctx.arc(avatarX + avatarR, avatarY + avatarR, avatarR + 6, 0, Math.PI * 2);
    ctx.fillStyle = profile.ringColor || "#ccc";
    ctx.fill();

    // inner circle (avatar placeholder)
    ctx.beginPath();
    ctx.arc(avatarX + avatarR, avatarY + avatarR, avatarR, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // small party circle
    ctx.beginPath();
    ctx.arc(avatarX + avatarR + 20, avatarY + avatarR + 20, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = profile.ringColor || "#aaa";
    ctx.stroke();

    // party text
    ctx.fillStyle = "#333";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(profile.party || "", avatarX + avatarR + 20, avatarY + avatarR + 20);

    // name and percentage
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#111";
    ctx.textAlign = "left";
    ctx.fillText(profile.name, x + avatarR * 2 + 10, avatarY + 12);

    ctx.font = "11px Arial";
    ctx.fillStyle = "#555";
    ctx.fillText(profile.percentage || "0%", x + avatarR * 2 + 10, avatarY + 32);

    // small chart box
    const chartX = x + 120;
    const chartY = y + 10;
    const chartW = 120;
    const chartH = 70;

    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(chartX, chartY, chartW, chartH);
    ctx.stroke();

    // vertical bar based on v
    const cX = chartX + chartW / 2;
    const cY = chartY + chartH / 2;
    const vBarVal = (profile.chart?.v || 0) * (chartH / 2);
    const hBarVal = (profile.chart?.h || 0) * (chartW / 2);

    ctx.fillStyle = "rgba(146,208,80,0.8)";
    if (vBarVal > 0) ctx.fillRect(cX - 6, cY - vBarVal, 12, vBarVal);
    else ctx.fillRect(cX - 6, cY, 12, Math.abs(vBarVal));

    ctx.fillStyle = "rgba(192,0,0,0.8)";
    if (hBarVal > 0) ctx.fillRect(cX, cY - 6, hBarVal, 12);
    else ctx.fillRect(cX + hBarVal, cY - 6, Math.abs(hBarVal), 12);
  }

  // split into 3 columns
  const col1 = candidateData.slice(0, 2);
  const col2 = candidateData.slice(2, 4);
  const col3 = candidateData.slice(4, 6);

  col1.forEach((p, i) => drawProfileRow(ctx, p, col1Left, panelTop + i * rowH));
  col2.forEach((p, i) => drawProfileRow(ctx, p, col2Left, panelTop + i * rowH));
  col3.forEach((p, i) => drawProfileRow(ctx, p, col3Left, panelTop + i * rowH));

  // Footer
  ctx.font = "12px Arial";
  ctx.fillStyle = "#555";
  ctx.textAlign = "right";
  ctx.fillText("*Datos de muestra", width - 40, height - 30);

  // Convert to image and insert into Fabric canvas
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

  // Ring params
  const centerX = width / 2;
  const centerY = height / 2 + 40;
  const outerR = 300;
  const innerR = 200;

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
    const archetypeRadius = outerR + 50;
    const archetypeX = centerX + Math.cos(midAngle) * archetypeRadius;
    const archetypeY = centerY + Math.sin(midAngle) * archetypeRadius;
    ctx.fillStyle = "#333";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(archetype.name, archetypeX, archetypeY);
  });

  // grid
  const gridExtend = 60;
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
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.fillText("+" + data.axes.top.toUpperCase(), centerX - 80, centerY - outerR - 80);
  ctx.save();
  ctx.translate(centerX + outerR + 80, centerY - 80);
  ctx.rotate(Math.PI / 2);
  ctx.fillText("+" + data.axes.right.toUpperCase(), 0, 0);
  ctx.restore();
  ctx.fillText("+" + data.axes.bottom.toUpperCase(), centerX - 100, centerY + outerR + 80);
  ctx.save();
  ctx.translate(centerX - outerR - 80, centerY - 80);
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
  const col1X = 40 + 360 + 60;
  const col2X = col1X + 520;
    const colYStart = 210; // aún más abajo para evitar empalme
  const lineHeight = 34; // más espacio

  const tempCanvas = document.createElement("canvas");
  const width = 1400;
  const height = 720;
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Left rounded card
  const cardX = 40;
  const cardY = 40;
  const cardW = 360;
  const cardH = 640;
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
  const centerY = cardY + 140;
  const outerR = 90;
  const innerR = 45;
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
  const polyR = 28;
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
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  const subtitle =
    "La población digital de Nuevo León busca en su próximo Gobernador la figura arquetípica de un";
  wrapText(ctx, subtitle, centerX, centerY + 120, cardW - 40, 18);
  ctx.fillStyle = "#5b21b6";
  ctx.font = "bold 22px Arial";
  ctx.fillText("Impulsor", centerX, centerY + 190);

  // Middle and right columns
  // Headers
  ctx.fillStyle = "#14532d";
  ctx.fillRect(col1X - 12, colYStart - 36, 360, 44);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Positivo", col1X, colYStart - 8);

  ctx.fillStyle = "#4c0519";
  ctx.fillRect(col2X - 12, colYStart - 36, 360, 44);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Arial";
  ctx.fillText("Negativo", col2X, colYStart - 8);

  // Bulleted lists
  ctx.fillStyle = "#111827";
  ctx.font = "14px Arial";
  let y = colYStart + 20;
    const loremPositive = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.",
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
      "Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo."
    ];
    loremPositive.forEach((txt) => {
      drawBulletText(ctx, txt, col1X, y, 340, lineHeight);
      y += estimateLines(txt, 340, ctx) * lineHeight + 16;
    });

  y = colYStart + 20;
    const loremNegative = [
      "Sed posuere consectetur est at lobortis. Etiam porta sem malesuada magna mollis euismod.",
      "Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
      "Maecenas sed diam eget risus varius blandit sit amet non magna."
    ];
    loremNegative.forEach((txt) => {
      drawBulletText(ctx, txt, col2X, y, 340, lineHeight);
      y += estimateLines(txt, 340, ctx) * lineHeight + 16;
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

      const targetWidth = 920;
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

  const data = {
    title: 'Perfil:',
    subtitle: 'Transformador/Impulsor',
    footnote: '*Adjetivación realizada el 06.Abril.2025',
    company: 'Rizoma',
    adjetivos: {
      title: 'Adjetivos',
      items: ['Transformador', 'Impulsor', 'Innovador', 'Fuerte/firme']
    },
    contraAdjetivos: {
      title: 'Contra Adjetivos',
      items: ['Mafioso', 'Impuesto', 'Ignorante', 'Lejano']
    },
    definiciones: [
      {
        term: 'Ineficaz',
        color: '#E8E8E8',
        description: 'Su gestión sigue siendo criticada por su falta de acción y la demora en resolver el problema de la basura.'
      },
      {
        term: 'Mafioso',
        color: '#E57373',
        description: 'Es visto como alguien con una mala reputación, evidentemente por su cercanía a la venta del filo y las grandes cantidades de presencia.'
      },
      {
        term: 'Incongruente',
        color: '#AED581',
        description: 'Gran parte de la población considera que tiene acuerdos secretos con el MAS, razón por la cual no ha sido perseguido o enunciado.'
      },
      {
        term: 'Experimentado',
        color: '#FFD54F',
        description: 'Reconocen su trayectoria política y comentan que es quien se ve mejor preparado.'
      }
    ],
    personas: [
      {
        name: 'Manfred\nReyes Villa',
        photo: null,
        adjetivos: ['Ineficaz', 'Mafioso', 'Incongruente', 'Experimentado'],
        mafioso: true
      },
      {
        name: 'Tuto\nQuiroga',
        photo: null,
        adjetivos: ['Traidor', 'Oportunista', 'Experimentado', 'Mafioso'],
        mafioso: true
      },
      {
        name: 'Samuel\nDoria',
        photo: null,
        adjetivos: ['Mafioso', 'Abusivo', 'Ambicioso', 'Demagogo'],
        mafioso: true
      },
      {
        name: 'Luis\nCamacho',
        photo: null,
        adjetivos: ['Mafioso', 'Oportunista', 'Ambicioso', 'Impuesto'],
        mafioso: true
      },
      {
        name: 'Andrónico\nRodriguez',
        photo: null,
        adjetivos: ['Traidor', 'Subordinado', 'Ineficaz', 'Mafioso'],
        mafioso: true
      },
      {
        name: 'Chi\nHyun Chung',
        photo: null,
        adjetivos: ['Ignorante', 'Oportunista', 'Mafioso', 'Incapaz'],
        mafioso: true
      }
    ]
  };

  const tempCanvas = document.createElement('canvas');
  const width = 1600;
  const height = 900;
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Title section
  ctx.fillStyle = '#666';
  ctx.font = '32px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(data.title, 170, 60);

  ctx.fillStyle = '#000';
  ctx.font = 'bold 48px Arial';
  ctx.fillText(data.subtitle, 70, 120);

  // Draw boxes for Adjetivos and Contra Adjetivos
  const boxX = 70;
  const boxY = 160;
  const boxWidth = 280;
  const boxHeight = 180;

  // Adjetivos box
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
  ctx.fillStyle = '#000';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(data.adjetivos.title, boxX + 10, boxY + 30);

  ctx.fillStyle = '#2196F3';
  ctx.font = '16px Arial';
  data.adjetivos.items.forEach((item, i) => {
    ctx.fillText('• ' + item, boxX + 15, boxY + 60 + (i * 25));
  });

  // Contra Adjetivos box
  const boxX2 = boxX + boxWidth + 10;
  ctx.strokeRect(boxX2, boxY, boxWidth, boxHeight);
  ctx.fillStyle = '#000';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(data.contraAdjetivos.title, boxX2 + 10, boxY + 30);

  ctx.fillStyle = '#E53935';
  ctx.font = '16px Arial';
  data.contraAdjetivos.items.forEach((item, i) => {
    ctx.fillText('• ' + item, boxX2 + 15, boxY + 60 + (i * 25));
  });

  // Draw definitions
  let defY = boxY + boxHeight + 30;
  data.definiciones.forEach((def, i) => {
    // Color bar
    ctx.fillStyle = def.color;
    ctx.fillRect(60, defY, 10, 60);

    // Term
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(def.term, 80, defY + 15);

    // Description
    ctx.fillStyle = '#555';
    ctx.font = '13px Arial';
    const words = def.description.split(' ');
    let line = '';
    let lineY = defY + 35;
    words.forEach(word => {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 600 && line !== '') {
        ctx.fillText(line, 80, lineY);
        line = word + ' ';
        lineY += 18;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, 80, lineY);

    defY += 80;
  });

  // Draw personas in grid (3 columns, 2 rows)
  const startX = 750;
  const startY = 100;
  const personWidth = 260;
  const personHeight = 280;
  const gapX = 20;
  const gapY = 30;

  data.personas.forEach((persona, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = startX + (col * (personWidth + gapX));
    const y = startY + (row * (personHeight + gapY));

    // Draw person card
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, personWidth, personHeight);

    // Photo circle
    ctx.beginPath();
    ctx.arc(x + personWidth / 2, y + 50, 35, 0, Math.PI * 2);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#f0f0f0';
    ctx.fill();

    // Name
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    const nameLines = persona.name.split('\n');
    nameLines.forEach((line, lineIndex) => {
      ctx.fillText(line, x + personWidth / 2, y + 105 + (lineIndex * 18));
    });

    // Adjetivos list
    ctx.textAlign = 'left';
    ctx.font = '13px Arial';
    let adjetivoY = y + 150;
    persona.adjetivos.forEach((adj, adjIndex) => {
      const isMafioso = adj.toLowerCase().includes('mafioso');
      ctx.fillStyle = isMafioso ? '#E53935' : '#000';
      ctx.fillText('• ' + adj, x + 15, adjetivoY);
      adjetivoY += 22;
    });
  });

  // Legend
  const legendY = height - 100;
  const legendX = startX;
  ctx.fillStyle = '#666';
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Consolidación de adjetivos personales', legendX, legendY);

  // Legend items
  const items = [
    { color: '#AED581', text: 'Adjetivos recurrentes' },
    { color: '#FFD54F', text: 'Adjetivos esporádicos' },
    { color: '#E57373', text: 'Adjetivos inusuales' }
  ];

  items.forEach((item, i) => {
    const itemX = legendX + (i * 180);
    ctx.fillStyle = item.color;
    ctx.fillRect(itemX, legendY + 10, 15, 15);
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(item.text, itemX + 20, legendY + 22);
  });

  // Company logo/text
  ctx.fillStyle = '#999';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(data.company, width - 40, height - 40);

  // Footnote
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(data.footnote, width - 40, height - 20);

  // Convert and insert
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

      const scale = 960 / fabricImg.width;
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

