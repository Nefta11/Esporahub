import { Image as FabricImage } from 'fabric';

const DONUT_CATEGORIES = [
  { key: 'conocimiento', label: 'Conocimiento', color: '#F7D154' },
  { key: 'adjetivacion', label: 'Adjetivación', color: '#B6C44A' },
  { key: 'resonancia_partidista', label: 'Resonancia partidista', color: '#B13B2E' },
  { key: 'beneficiarios', label: 'Beneficiarios', color: '#E97B2A' },
  { key: 'resonancia_demos', label: 'Resonancia demosegmentos', color: '#1CA6A3' },
  { key: 'resonancia_etno', label: 'Resonancia etnosegmentos', color: '#E94B8A' },
  { key: 'efemerides', label: 'Efemérides', color: '#2B9ACF' },
  { key: 'share_news', label: 'Share news', color: '#1B3B2B' },
];

const SOCIAL_NETWORKS = [
  { key: 'facebook', label: 'Facebook', icon: 'https://cdn.simpleicons.org/facebook/1877F2' },
  { key: 'x', label: 'X', icon: 'https://cdn.simpleicons.org/x/000000' },
  { key: 'instagram', label: 'Instagram', icon: 'https://cdn.simpleicons.org/instagram/E4405F' },
  { key: 'tiktok', label: 'TikTok', icon: 'https://cdn.simpleicons.org/tiktok/000000' },
  { key: 'youtube', label: 'YouTube', icon: 'https://cdn.simpleicons.org/youtube/FF0000' },
];

const defaultCharacters = [
  {
    name: 'Manuel Guerra',
    avatarUrl: 'https://placehold.co/100x100/EBF4FF/333333?text=MG',
    donutData: {
      facebook: [31, 15, 20, 18, 12, 6, 5, 7],
      x: [50, 0, 0, 0, 50, 0, 8, 5],
      instagram: [31, 28, 17, 16, 5, 4, 6, 8],
      tiktok: [71, 20, 2, 7, 0, 0, 9, 6],
      youtube: [0, 0, 0, 0, 0, 0, 10, 10],
    },
  },
  {
    name: 'Manuel Guerra Flores',
    avatarUrl: 'https://placehold.co/100x100/FFEBEB/333333?text=MF',
    donutData: {
      facebook: [17, 19, 22, 22, 4, 17, 7, 6],
      x: [7, 22, 37, 19, 7, 7, 5, 7],
      instagram: [17, 17, 12, 24, 16, 14, 8, 6],
      tiktok: [50, 43, 0, 7, 0, 0, 7, 7],
      youtube: [100, 0, 0, 0, 0, 0, 5, 5],
    },
  },
  {
    name: 'Waldo Fernández',
    avatarUrl: 'https://placehold.co/100x100/EBFFF5/333333?text=WF',
    donutData: {
      facebook: [40, 8, 22, 3, 7, 10, 9, 8],
      x: [58, 0, 12, 0, 23, 0, 7, 7],
      instagram: [9, 16, 27, 17, 12, 2, 8, 9],
      tiktok: [0, 50, 6, 0, 19, 0, 10, 10],
      youtube: [0, 0, 13, 0, 50, 0, 12, 12],
    },
  }
];

export const renderBenchmarkMatrix = async (canvas) => {
  if (!canvas) return;

  const characters = defaultCharacters;

  // Cargar íconos de redes sociales
  const iconPromises = SOCIAL_NETWORKS.map(network => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ key: network.key, img });
      img.onerror = () => resolve({ key: network.key, img: null });
      img.src = network.icon;
    });
  });

  const iconResults = await Promise.all(iconPromises);
  const socialIconImages = {};
  iconResults.forEach(({ key, img }) => {
    if (img) socialIconImages[key] = img;
  });

  // Crear canvas temporal
  const scale = 2.5;
  const tempCanvas = document.createElement('canvas');
  const padding = 15;
  const legendHeight = 35;
  const headerHeight = 50;
  const rowHeight = 95;
  const colWidth = 95;
  const nameColWidth = 110;

  const totalWidth = (nameColWidth + (SOCIAL_NETWORKS.length * colWidth) + (padding * 2)) * scale;
  const totalHeight = (legendHeight + headerHeight + (characters.length * rowHeight) + (padding * 2)) * scale;

  tempCanvas.width = totalWidth;
  tempCanvas.height = totalHeight;
  const ctx = tempCanvas.getContext('2d');
  ctx.scale(scale, scale);

  // Fondo blanco
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, totalWidth / scale, totalHeight / scale);

  let currentY = padding;

  // Dibujar leyenda
  ctx.font = '9px Arial';
  ctx.textBaseline = 'middle';
  let legendX = padding + 5;

  DONUT_CATEGORIES.forEach(cat => {
    ctx.fillStyle = cat.color;
    ctx.fillRect(legendX, currentY + 3, 9, 9);
    legendX += 12;
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'left';
    ctx.fillText(cat.label, legendX, currentY + 7.5);
    legendX += ctx.measureText(cat.label).width + 10;
  });

  currentY += legendHeight;

  // Dibujar íconos de redes sociales
  const iconSize = 34;
  SOCIAL_NETWORKS.forEach((net, idx) => {
    const x = nameColWidth + (idx * colWidth) + (colWidth - iconSize) / 2 + padding;
    const y = currentY + (headerHeight - iconSize) / 2;

    if (socialIconImages[net.key]) {
      ctx.drawImage(socialIconImages[net.key], x, y, iconSize, iconSize);
    }
  });

  currentY += headerHeight;

  // Dibujar filas de personajes
  for (const char of characters) {
    const rowY = currentY;

    // Cargar avatar
    const avatarSize = 48;
    const avatarX = padding + 8;
    const avatarY = rowY + (rowHeight - avatarSize) / 2;

    await new Promise((resolve) => {
      const avatarImg = new window.Image();
      avatarImg.crossOrigin = 'anonymous';
      avatarImg.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
        ctx.strokeStyle = '#b13b2e';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
        ctx.stroke();
        resolve();
      };
      avatarImg.onerror = resolve;
      avatarImg.src = char.avatarUrl;
    });

    // Nombre
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const nameX = avatarX + avatarSize + 10;
    const nameY = rowY + rowHeight / 2;
    const maxNameWidth = nameColWidth - avatarSize - 25;

    const words = char.name.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxNameWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    const lineHeight = 12;
    const startY = nameY - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, idx) => {
      ctx.fillText(line, nameX, startY + (idx * lineHeight));
    });

    // Dibujar donas
    SOCIAL_NETWORKS.forEach((net, netIdx) => {
      const donutCenterX = nameColWidth + (netIdx * colWidth) + colWidth / 2 + padding;
      const donutCenterY = rowY + rowHeight / 2;
      const radius = 24;
      const innerRadius = radius * 0.58;

      const data = char.donutData[net.key];
      const total = data.reduce((sum, val) => sum + val, 0);

      if (total === 0) {
        ctx.fillStyle = '#b0b0b0';
        ctx.beginPath();
        ctx.arc(donutCenterX, donutCenterY, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(donutCenterX, donutCenterY, innerRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#6b7280';
        ctx.font = 'bold 7px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Sin', donutCenterX, donutCenterY - 3);
        ctx.fillText('Publicaciones', donutCenterX, donutCenterY + 4);
      } else {
        let currentAngle = -Math.PI / 2;
        const labels = [];

        data.forEach((value, index) => {
          if (value <= 0) return;

          const sliceAngle = (value / total) * 2 * Math.PI;
          const endAngle = currentAngle + sliceAngle;

          ctx.fillStyle = DONUT_CATEGORIES[index].color;
          ctx.beginPath();
          ctx.arc(donutCenterX, donutCenterY, radius, currentAngle, endAngle);
          ctx.arc(donutCenterX, donutCenterY, innerRadius, endAngle, currentAngle, true);
          ctx.fill();

          const middleAngle = currentAngle + sliceAngle / 2;
          const labelRadius = radius + 14;
          const labelX = donutCenterX + Math.cos(middleAngle) * labelRadius;
          const labelY = donutCenterY + Math.sin(middleAngle) * labelRadius;

          labels.push({ value, x: labelX, y: labelY });
          currentAngle = endAngle;
        });

        // Dibujar etiquetas de porcentaje
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1f2937';
        labels.forEach(({ value, x, y }) => {
          ctx.fillText(`${value}%`, x, y);
        });
      }
    });

    currentY += rowHeight;
  }

  // Convertir a imagen y agregar al canvas
  const dataURL = tempCanvas.toDataURL('image/png');
  const imgElement = new window.Image();
  imgElement.onload = () => {
    const fabricImg = new FabricImage(imgElement, {
      left: 50,
      top: 120,
      scaleX: 0.35,
      scaleY: 0.35,
      name: 'benchmark-matrix'
    });
    canvas.add(fabricImg);
    canvas.renderAll();
  };
  imgElement.src = dataURL;
};
