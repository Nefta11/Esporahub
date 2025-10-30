import { Image as FabricImage } from 'fabric';

const defaultBenchmarkData = [
  {
    name: 'Personaje 1',
    avatarUrl: 'https://placehold.co/100x100/EBF4FF/333333?text=P1',
    facebook: { followers: '318.6K', posts: '155' },
    x: { followers: '1.3K', posts: '2' },
    instagram: { followers: '55.3K', posts: '103' },
    tiktok: { followers: '486.6K', posts: '41' },
    youtube: { followers: '406', posts: '0' },
  },
  {
    name: 'Personaje 2',
    avatarUrl: 'https://placehold.co/100x100/FFEBEB/333333?text=P2',
    facebook: { followers: '595K', posts: '54' },
    x: { followers: '49K', posts: '27' },
    instagram: { followers: '33.2K', posts: '41' },
    tiktok: { followers: '11.8K', posts: '14' },
    youtube: { followers: '1.5K', posts: '1' },
  },
  {
    name: 'Personaje 3',
    avatarUrl: 'https://placehold.co/100x100/EBFFF5/333333?text=P3',
    facebook: { followers: '1.4M', posts: '218' },
    x: { followers: '16.3K', posts: '26' },
    instagram: { followers: '19.3K', posts: '121' },
    tiktok: { followers: '149.6K', posts: '16' },
    youtube: { followers: '102K', posts: '32' },
  },
];

const SOCIAL_NETWORKS = [
  { key: 'facebook', label: 'Facebook', icon: 'https://cdn.simpleicons.org/facebook/1877F2' },
  { key: 'x', label: 'X', icon: 'https://cdn.simpleicons.org/x/000000' },
  { key: 'instagram', label: 'Instagram', icon: 'https://cdn.simpleicons.org/instagram/E4405F' },
  { key: 'tiktok', label: 'TikTok', icon: 'https://cdn.simpleicons.org/tiktok/000000' },
  { key: 'youtube', label: 'YouTube', icon: 'https://cdn.simpleicons.org/youtube/FF0000' },
];

export const renderBenchmarkTable = async (canvas, tableName) => {
  if (!canvas) return;

  const characters = defaultBenchmarkData;

  // Cargar íconos
  const iconPromises = SOCIAL_NETWORKS.map(network => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ key: network.key, img });
      img.onerror = () => resolve({ key: network.key, img: null });
      img.src = network.icon;
    });
  });

  const iconResults = await Promise.all(iconPromises);
  const iconsMap = {};
  iconResults.forEach(({ key, img }) => {
    if (img) iconsMap[key] = img;
  });

  const tempCanvas = document.createElement('canvas');
  const padding = 20;
  const headerHeight = 50;
  const rowHeight = 80;
  const colWidth = 130;
  const nameColWidth = 180;

  tempCanvas.width = nameColWidth + (SOCIAL_NETWORKS.length * colWidth) + (padding * 2);
  tempCanvas.height = padding + headerHeight + (characters.length * rowHeight) + padding;
  const ctx = tempCanvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  let currentY = padding;

  // Header con íconos
  SOCIAL_NETWORKS.forEach((net, idx) => {
    const x = nameColWidth + (idx * colWidth) + (colWidth / 2) - 16 + padding;
    const y = currentY + 8;
    if (iconsMap[net.key]) {
      ctx.drawImage(iconsMap[net.key], x, y, 32, 32);
    }
  });

  currentY += headerHeight;

  // Filas de personajes
  for (const char of characters) {
    const rowY = currentY;

    // Avatar
    const avatarSize = 50;
    const avatarX = padding + 10;
    const avatarY = rowY + (rowHeight - avatarSize) / 2;

    await new Promise((resolve) => {
      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';
      avatarImg.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
        ctx.strokeStyle = '#b13b2e';
        ctx.lineWidth = 3;
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
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(char.name, avatarX + avatarSize + 15, rowY + rowHeight / 2);

    // Datos de redes sociales
    SOCIAL_NETWORKS.forEach((net, idx) => {
      const centerX = nameColWidth + (idx * colWidth) + (colWidth / 2) + padding;
      const data = char[net.key];

      ctx.textAlign = 'center';
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(data.followers, centerX, rowY + 25);

      ctx.fillStyle = '#6b7280';
      ctx.font = '11px Arial';
      ctx.fillText('Seguidores', centerX, rowY + 40);

      ctx.fillStyle = '#1967D2';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(data.posts, centerX, rowY + 58);

      ctx.fillStyle = '#6b7280';
      ctx.font = '11px Arial';
      ctx.fillText('Posts', centerX, rowY + 72);
    });

    // Línea separadora
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, rowY + rowHeight);
    ctx.lineTo(tempCanvas.width - padding, rowY + rowHeight);
    ctx.stroke();

    currentY += rowHeight;
  }

  const dataURL = tempCanvas.toDataURL('image/png');
  const imgElement = new Image();
  imgElement.onload = () => {
    const fabricImg = new FabricImage(imgElement, {
      left: 50,
      top: 150,
      scaleX: 0.8,
      scaleY: 0.8,
      name: tableName
    });
    canvas.add(fabricImg);
    canvas.renderAll();
  };
  imgElement.src = dataURL;
};

export const autoInsertBenchmarkSocialMedia = async (canvas) => {
  if (!canvas) return;

  const characters = [
    {
      name: 'Personaje 1',
      avatarUrl: 'https://placehold.co/100x100/EBF4FF/333333?text=P1',
      facebook: { followers: '318.6K', posts: '155' },
      x: { followers: '1.3K', posts: '2' },
      instagram: { followers: '55.3K', posts: '103' },
      tiktok: { followers: '486.6K', posts: '41' },
      youtube: { followers: '406', posts: '0' },
    },
    {
      name: 'Personaje 2',
      avatarUrl: 'https://placehold.co/100x100/FFEBEB/333333?text=P2',
      facebook: { followers: '595K', posts: '54' },
      x: { followers: '49K', posts: '27' },
      instagram: { followers: '33.2K', posts: '41' },
      tiktok: { followers: '11.8K', posts: '14' },
      youtube: { followers: '1.5K', posts: '1' },
    },
    {
      name: 'Personaje 3',
      avatarUrl: 'https://placehold.co/100x100/EBFFF5/333333?text=P3',
      facebook: { followers: '1.4M', posts: '218' },
      x: { followers: '16.3K', posts: '26' },
      instagram: { followers: '19.3K', posts: '121' },
      tiktok: { followers: '149.6K', posts: '16' },
      youtube: { followers: '102K', posts: '32' },
    },
  ];

  // Cargar íconos
  const iconPromises = SOCIAL_NETWORKS.map(network => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ key: network.key, img });
      img.onerror = () => resolve({ key: network.key, img: null });
      img.src = network.icon;
    });
  });

  const iconResults = await Promise.all(iconPromises);
  const iconsMap = {};
  iconResults.forEach(({ key, img }) => {
    if (img) iconsMap[key] = img;
  });

  // Cargar avatares
  const avatarPromises = characters.map(char => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ url: char.avatarUrl, img });
      img.onerror = () => resolve({ url: char.avatarUrl, img: null });
      img.src = char.avatarUrl;
    });
  });

  const avatarResults = await Promise.all(avatarPromises);
  const avatarsMap = {};
  avatarResults.forEach(({ url, img }) => {
    if (img) avatarsMap[url] = img;
  });

  const tempCanvas = document.createElement('canvas');
  const TOP_HEADER_H = 70;
  const SUB_HEADER_H = 40;
  const ROW_H = 65;
  const ROW_NUM_W = 50;
  const PERSONAJE_W = 200;
  const DATA_SUB_W = 95;
  const DATA_COL_W = DATA_SUB_W * 2;
  const AVATAR_SIZE = 45;

  const totalWidth = ROW_NUM_W + PERSONAJE_W + (SOCIAL_NETWORKS.length * DATA_COL_W);
  const totalHeight = TOP_HEADER_H + SUB_HEADER_H + (characters.length * ROW_H);

  tempCanvas.width = totalWidth;
  tempCanvas.height = totalHeight;
  const ctx = tempCanvas.getContext('2d');

  const fontSize = 11;
  const fontBold = `bold ${fontSize + 1}px Arial`;
  const fontRegular = `${fontSize}px Arial`;
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  let currentY = 0;
  let currentX = 0;

  // Top header con íconos
  currentX = ROW_NUM_W + PERSONAJE_W;
  const iconSize = 28;
  const iconHeaderY = 12;
  const textHeaderY = iconHeaderY + iconSize + 12;
  SOCIAL_NETWORKS.forEach((network) => {
    const icon = iconsMap[network.key];
    const colSpan = DATA_COL_W;
    if (icon) {
      ctx.drawImage(icon, currentX + colSpan / 2 - iconSize / 2, iconHeaderY, iconSize, iconSize);
    }
    ctx.fillStyle = '#222';
    ctx.font = fontBold;
    ctx.textAlign = 'center';
    ctx.fillText(network.label, currentX + colSpan / 2, textHeaderY);
    currentX += DATA_COL_W;
  });
  currentY += TOP_HEADER_H;

  // Sub-header
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, currentY, totalWidth, SUB_HEADER_H);
  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, currentY);
  ctx.lineTo(totalWidth, currentY);
  ctx.stroke();
  ctx.fillStyle = '#555';
  ctx.font = `bold ${fontSize + 1}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('Personaje', ROW_NUM_W + PERSONAJE_W / 2, currentY + SUB_HEADER_H / 2);
  currentX = ROW_NUM_W + PERSONAJE_W;
  SOCIAL_NETWORKS.forEach((network) => {
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(currentX, currentY + SUB_HEADER_H);
    ctx.stroke();
    ctx.fillText('Seguidores', currentX + DATA_SUB_W / 2, currentY + SUB_HEADER_H / 2);
    ctx.fillText('No Publicaciones', currentX + DATA_SUB_W + DATA_SUB_W / 2, currentY + SUB_HEADER_H / 2);
    ctx.strokeStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(currentX + DATA_SUB_W, currentY);
    ctx.lineTo(currentX + DATA_SUB_W, currentY + SUB_HEADER_H);
    ctx.stroke();
    ctx.strokeStyle = '#d0d0d0';
    currentX += DATA_COL_W;
  });
  ctx.beginPath();
  ctx.moveTo(0, currentY + SUB_HEADER_H);
  ctx.lineTo(totalWidth, currentY + SUB_HEADER_H);
  ctx.stroke();
  currentY += SUB_HEADER_H;

  // Filas de personajes
  characters.forEach((char, index) => {
    const rowCenterY = currentY + ROW_H / 2;
    ctx.fillStyle = (index % 2 === 0) ? '#ffffff' : '#f9f9f9';
    ctx.fillRect(0, currentY, totalWidth, ROW_H);
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(ROW_NUM_W / 2, rowCenterY, 13, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = fontBold;
    ctx.textAlign = 'center';
    ctx.fillText(index + 1, ROW_NUM_W / 2, rowCenterY);
    const avatarX = ROW_NUM_W + 12;
    const avatarY = rowCenterY - AVATAR_SIZE / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + AVATAR_SIZE / 2, avatarY + AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, 2 * Math.PI);
    ctx.clip();
    const avatarImg = avatarsMap[char.avatarUrl];
    if (avatarImg) {
      ctx.drawImage(avatarImg, avatarX, avatarY, AVATAR_SIZE, AVATAR_SIZE);
    } else {
      ctx.fillStyle = '#eee';
      ctx.fillRect(avatarX, avatarY, AVATAR_SIZE, AVATAR_SIZE);
    }
    ctx.restore();
    ctx.fillStyle = '#333';
    ctx.font = fontBold;
    ctx.textAlign = 'left';
    const nameX = avatarX + AVATAR_SIZE + 10;
    ctx.fillText(char.name, nameX, rowCenterY);
    currentX = ROW_NUM_W + PERSONAJE_W;
    ctx.font = fontRegular;
    ctx.textAlign = 'center';
    SOCIAL_NETWORKS.forEach((network) => {
      const data = char[network.key];
      ctx.fillStyle = '#333';
      ctx.fillText(data?.followers || '-', currentX + DATA_SUB_W / 2, rowCenterY);
      ctx.fillStyle = '#777';
      ctx.fillText(data?.posts || '-', currentX + DATA_SUB_W + DATA_SUB_W / 2, rowCenterY);
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(currentX, currentY + ROW_H);
      ctx.stroke();
      currentX += DATA_COL_W;
    });
    ctx.strokeStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(0, currentY + ROW_H);
    ctx.lineTo(totalWidth, currentY + ROW_H);
    ctx.stroke();
    currentY += ROW_H;
  });

  const dataURL = tempCanvas.toDataURL('image/png');
  const imgElement = new Image();
  imgElement.onload = () => {
    const fabricImg = new FabricImage(imgElement, {
      left: 50,
      top: 150,
      scaleX: 0.8,
      scaleY: 0.8,
      name: 'benchmark-social-media'
    });
    canvas.add(fabricImg);
    canvas.renderAll();
  };
  imgElement.src = dataURL;
};

export const autoInsertBenchmarkSocialMediaExternas = async (canvas) => {
  if (!canvas) return;

  const characters = [
    {
      name: 'Personaje 1',
      avatarUrl: 'https://placehold.co/100x100/8C2E3A/FFFFFF?text=P1',
      facebook: { followers: '10.2M', posts: '150' },
      x: { followers: '10M', posts: '210' },
      instagram: { followers: '1.5M', posts: '90' },
      tiktok: { followers: '1.1M', posts: '45' },
      youtube: { followers: '4.5M', posts: '300' },
    },
    {
      name: 'Personaje 2',
      avatarUrl: 'https://placehold.co/100x100/8C2E3A/FFFFFF?text=P2',
      facebook: { followers: '6M', posts: '180' },
      x: { followers: '3.1M', posts: '250' },
      instagram: { followers: '1.2M', posts: '120' },
      tiktok: { followers: '2.5M', posts: '95' },
      youtube: { followers: '1M', posts: '80' },
    },
    {
      name: 'Personaje 3',
      avatarUrl: 'https://placehold.co/100x100/003366/FFFFFF?text=P3',
      facebook: { followers: '1.5M', posts: '160' },
      x: { followers: '1.8M', posts: '300' },
      instagram: { followers: '700K', posts: '110' },
      tiktok: { followers: '1.9M', posts: '130' },
      youtube: { followers: '350K', posts: '70' },
    },
  ];

  // Cargar íconos
  const iconPromises = SOCIAL_NETWORKS.map(network => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ key: network.key, img });
      img.onerror = () => resolve({ key: network.key, img: null });
      img.src = network.icon;
    });
  });

  const iconResults = await Promise.all(iconPromises);
  const iconsMap = {};
  iconResults.forEach(({ key, img }) => {
    if (img) iconsMap[key] = img;
  });

  // Cargar avatares
  const avatarPromises = characters.map(char => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ url: char.avatarUrl, img });
      img.onerror = () => resolve({ url: char.avatarUrl, img: null });
      img.src = char.avatarUrl;
    });
  });

  const avatarResults = await Promise.all(avatarPromises);
  const avatarsMap = {};
  avatarResults.forEach(({ url, img }) => {
    if (img) avatarsMap[url] = img;
  });

  const tempCanvas = document.createElement('canvas');
  const TOP_HEADER_H = 70;
  const SUB_HEADER_H = 40;
  const ROW_H = 65;
  const ROW_NUM_W = 50;
  const PERSONAJE_W = 200;
  const DATA_SUB_W = 95;
  const DATA_COL_W = DATA_SUB_W * 2;
  const AVATAR_SIZE = 45;

  const totalWidth = ROW_NUM_W + PERSONAJE_W + (SOCIAL_NETWORKS.length * DATA_COL_W);
  const totalHeight = TOP_HEADER_H + SUB_HEADER_H + (characters.length * ROW_H);

  tempCanvas.width = totalWidth;
  tempCanvas.height = totalHeight;
  const ctx = tempCanvas.getContext('2d');

  const fontSize = 11;
  const fontBold = `bold ${fontSize + 1}px Arial`;
  const fontRegular = `${fontSize}px Arial`;
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  let currentY = 0;
  let currentX = 0;

  // Top header con íconos
  currentX = ROW_NUM_W + PERSONAJE_W;
  const iconSize = 28;
  const iconHeaderY = 12;
  const textHeaderY = iconHeaderY + iconSize + 12;
  SOCIAL_NETWORKS.forEach((network) => {
    const icon = iconsMap[network.key];
    const colSpan = DATA_COL_W;
    if (icon) {
      ctx.drawImage(icon, currentX + colSpan / 2 - iconSize / 2, iconHeaderY, iconSize, iconSize);
    }
    ctx.fillStyle = '#222';
    ctx.font = fontBold;
    ctx.textAlign = 'center';
    ctx.fillText(network.label, currentX + colSpan / 2, textHeaderY);
    currentX += DATA_COL_W;
  });
  currentY += TOP_HEADER_H;

  // Sub-header
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, currentY, totalWidth, SUB_HEADER_H);
  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, currentY);
  ctx.lineTo(totalWidth, currentY);
  ctx.stroke();
  ctx.fillStyle = '#555';
  ctx.font = `bold ${fontSize + 1}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('Personaje', ROW_NUM_W + PERSONAJE_W / 2, currentY + SUB_HEADER_H / 2);
  currentX = ROW_NUM_W + PERSONAJE_W;
  SOCIAL_NETWORKS.forEach((network) => {
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(currentX, currentY + SUB_HEADER_H);
    ctx.stroke();
    ctx.fillText('Seguidores', currentX + DATA_SUB_W / 2, currentY + SUB_HEADER_H / 2);
    ctx.fillText('No Publicaciones', currentX + DATA_SUB_W + DATA_SUB_W / 2, currentY + SUB_HEADER_H / 2);
    ctx.strokeStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(currentX + DATA_SUB_W, currentY);
    ctx.lineTo(currentX + DATA_SUB_W, currentY + SUB_HEADER_H);
    ctx.stroke();
    ctx.strokeStyle = '#d0d0d0';
    currentX += DATA_COL_W;
  });
  ctx.beginPath();
  ctx.moveTo(0, currentY + SUB_HEADER_H);
  ctx.lineTo(totalWidth, currentY + SUB_HEADER_H);
  ctx.stroke();
  currentY += SUB_HEADER_H;

  // Filas de personajes
  characters.forEach((char, index) => {
    const rowCenterY = currentY + ROW_H / 2;
    ctx.fillStyle = (index % 2 === 0) ? '#ffffff' : '#f9f9f9';
    ctx.fillRect(0, currentY, totalWidth, ROW_H);
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(ROW_NUM_W / 2, rowCenterY, 13, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = fontBold;
    ctx.textAlign = 'center';
    ctx.fillText(index + 1, ROW_NUM_W / 2, rowCenterY);
    const avatarX = ROW_NUM_W + 12;
    const avatarY = rowCenterY - AVATAR_SIZE / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + AVATAR_SIZE / 2, avatarY + AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, 2 * Math.PI);
    ctx.clip();
    const avatarImg = avatarsMap[char.avatarUrl];
    if (avatarImg) {
      ctx.drawImage(avatarImg, avatarX, avatarY, AVATAR_SIZE, AVATAR_SIZE);
    } else {
      ctx.fillStyle = '#eee';
      ctx.fillRect(avatarX, avatarY, AVATAR_SIZE, AVATAR_SIZE);
    }
    ctx.restore();
    ctx.fillStyle = '#333';
    ctx.font = fontBold;
    ctx.textAlign = 'left';
    const nameX = avatarX + AVATAR_SIZE + 10;
    ctx.fillText(char.name, nameX, rowCenterY);
    currentX = ROW_NUM_W + PERSONAJE_W;
    ctx.font = fontRegular;
    ctx.textAlign = 'center';
    SOCIAL_NETWORKS.forEach((network) => {
      const data = char[network.key];
      ctx.fillStyle = '#333';
      ctx.fillText(data?.followers || '-', currentX + DATA_SUB_W / 2, rowCenterY);
      ctx.fillStyle = '#777';
      ctx.fillText(data?.posts || '-', currentX + DATA_SUB_W + DATA_SUB_W / 2, rowCenterY);
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(currentX, currentY + ROW_H);
      ctx.stroke();
      currentX += DATA_COL_W;
    });
    ctx.strokeStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(0, currentY + ROW_H);
    ctx.lineTo(totalWidth, currentY + ROW_H);
    ctx.stroke();
    currentY += ROW_H;
  });

  const dataURL = tempCanvas.toDataURL('image/png');
  const imgElement = new Image();
  imgElement.onload = () => {
    const fabricImg = new FabricImage(imgElement, {
      left: 50,
      top: 150,
      scaleX: 0.8,
      scaleY: 0.8,
      name: 'benchmark-social-media-externas'
    });
    canvas.add(fabricImg);
    canvas.renderAll();
  };
  imgElement.src = dataURL;
};

export const autoInsertDemografiaSociedadRed = async (canvas) => {
  if (!canvas) return;

  const bars = [
    { label: 'Internet', percent: 78, color: '#B13B2E', rightLabel: 'Clases A,B,C,D\nJóvenes' },
    { label: 'Anfibios', percent: 18, color: '#E97B2A', rightLabel: '' },
    { label: 'Medios Tradicionales', percent: 4, color: '#F7D154', rightLabel: 'Amas de casa\n3ra Edad' },
  ];

  const width = 700;
  const height = 450;
  const barWidth = 180;
  const leftPad = 40;
  const topPad = 40;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext('2d');

  // Fondo blanco
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  // Calcular altura total disponible para las barras
  const totalHeight = 350;

  // Dibujar barras apiladas verticalmente
  let currentY = topPad;

  bars.forEach((bar) => {
    const barHeight = (bar.percent / 100) * totalHeight;

    // Dibujar la barra
    ctx.fillStyle = bar.color;
    ctx.fillRect(leftPad, currentY, barWidth, barHeight);

    // Porcentaje dentro de la barra (centrado)
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bar.percent + '%', leftPad + barWidth / 2, currentY + barHeight / 2);

    // Etiqueta del concepto (a la derecha de la barra)
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = bar.color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const labelX = leftPad + barWidth + 30;
    const labelY = currentY + barHeight / 2;

    ctx.fillText(bar.label, labelX, labelY);

    // Línea de conexión (flecha)
    ctx.strokeStyle = bar.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftPad + barWidth + 10, labelY);
    ctx.lineTo(labelX - 10, labelY);
    ctx.stroke();

    // Flecha
    ctx.beginPath();
    ctx.moveTo(labelX - 10, labelY);
    ctx.lineTo(labelX - 18, labelY - 5);
    ctx.lineTo(labelX - 18, labelY + 5);
    ctx.closePath();
    ctx.fillStyle = bar.color;
    ctx.fill();

    // Etiqueta adicional (más a la derecha)
    if (bar.rightLabel) {
      ctx.font = '20px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'left';
      const lines = bar.rightLabel.split('\n');
      const rightLabelX = labelX + ctx.measureText(bar.label).width + 80;
      const startY = labelY - (lines.length - 1) * 12;

      lines.forEach((line, idx) => {
        ctx.fillText(line, rightLabelX, startY + idx * 24);
      });
    }

    currentY += barHeight;
  });

  const dataURL = tempCanvas.toDataURL('image/png');
  const imgElement = new Image();
  imgElement.onload = () => {
    const fabricImg = new FabricImage(imgElement, {
      left: 80,
      top: 150,
      scaleX: 0.9,
      scaleY: 0.9,
      name: 'demografia-sociedad-red'
    });
    canvas.add(fabricImg);
    canvas.renderAll();
  };
  imgElement.src = dataURL;
};
