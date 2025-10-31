// Auto-insertar Benchmark de Difusión Oficial (RRSS Propias)
export const autoInsertBenchmarkDifusionOficial = async (canvas) => {
  if (!canvas) return;

  // Datos de ejemplo
  const profiles = [
    {
      name: 'Personaje 1',
      partido: 'Partido 1',
      avatarUrl: '', // Puedes poner una url real si tienes
      inversion: '$0',
      anuncios: '0',
    },
    {
      name: 'Personaje 2',
      partido: 'Partido 2',
      avatarUrl: '',
      inversion: '$0',
      anuncios: '0',
    }
  ];

  const tempCanvas = document.createElement('canvas');
  const width = 1200;
  const height = 500;
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext('2d');

  // Fondo blanco
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  // Título
  ctx.font = 'bold 22px Arial';
  ctx.fillStyle = '#111';
  ctx.textAlign = 'left';
  ctx.fillText('a. Comparativa pauta oficial por personaje', 30, 45);
  ctx.font = 'italic 15px Arial';
  ctx.fillStyle = '#444';
  ctx.fillText('Inversión en Meta (MXN)', 30, 70);

  // Perfiles centrados
  const centerY = 220;
  const avatarRadius = 70;
  const profileSpacing = 350;
  const startX = width / 2 - profileSpacing / 2;

  profiles.forEach((profile, idx) => {
    const x = startX + idx * profileSpacing;
    // Avatar con borde
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, centerY, avatarRadius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#b71c1c';
    ctx.stroke();
    ctx.clip();
    ctx.fillStyle = '#ccc';
    ctx.fillRect(x - avatarRadius, centerY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
    ctx.restore();

    // Partido (esquina inferior derecha del avatar)
    ctx.save();
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.roundRect(x + avatarRadius - 60, centerY + avatarRadius - 30, 90, 32, 16);
    ctx.fill();
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(profile.partido, x + avatarRadius + 20, centerY + avatarRadius - 14);
    ctx.restore();

    // Nombre (debajo del avatar)
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.fillText(profile.name, x, centerY + avatarRadius + 38);

    // Fanpage label
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('Fanpage', x, centerY + avatarRadius + 62);

    // Inversión y anuncios
    ctx.font = '15px Arial';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.fillText(`Inversión: ${profile.inversion}`, x, centerY + avatarRadius + 90);
    ctx.fillText(`No. Anuncios: ${profile.anuncios}`, x, centerY + avatarRadius + 115);
  });

  // Periodo (abajo izquierda) - rectángulo más ancho
  ctx.save();
  ctx.fillStyle = '#111';
  ctx.font = 'bold 16px Arial';
  ctx.fillRect(30, height - 50, 450, 35);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 15px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Periodo: Del 5 de julio al 5 de octubre 2025', 45, height - 26);
  ctx.restore();

  // Fuente (abajo derecha) con logo
  ctx.font = '15px Arial';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'right';
  ctx.fillText('Fuente:', width - 110, height - 28);

  // Logo de Meta
  const logoUrl = 'https://cdn.simpleicons.org/meta/0081FB';
  if (logoUrl) {
    const logoImg = new window.Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = logoUrl;
    logoImg.onload = () => {
      ctx.drawImage(logoImg, width - 90, height - 42, 50, 26);
    };
  }

  // Exportar (con delay para que el logo cargue)
  setTimeout(() => {
    const dataURL = tempCanvas.toDataURL('image/png');
    const imgElement = new Image();
    imgElement.onload = () => {
      // Usar escala fija para que se vea completo
      const scale = 0.75;
      const left = 40;
      const top = 40;

    const fabricImg = new FabricImage(imgElement, {
      left,
      top,
      scaleX: scale,
      scaleY: scale,
      name: 'benchmark-difusion-oficial',
      selectable: true,
      hasControls: true,
      hasBorders: true,
      evented: true,
      lockRotation: false,
      lockScalingX: false,
      lockScalingY: false,
      lockMovementX: false,
      lockMovementY: false
    });
    // Ensure correct origin and coords so it doesn't appear cropped and is movable
    fabricImg.set({ originX: 'left', originY: 'top' });
    fabricImg.setControlsVisibility && fabricImg.setControlsVisibility({
      mt: true, mb: true, ml: true, mr: true, bl: true, br: true, tl: true, tr: true
    });
    canvas.add(fabricImg);

    // Defensive: make sure object and canvas are configured to allow interaction
    try {
      fabricImg.selectable = true;
      fabricImg.evented = true;
      fabricImg.hasControls = true;
      fabricImg.hasBorders = true;
      fabricImg.hoverCursor = 'move';
      if (canvas.upperCanvasEl) canvas.upperCanvasEl.style.pointerEvents = 'auto';
      if (canvas.lowerCanvasEl) canvas.lowerCanvasEl.style.pointerEvents = 'auto';
      canvas.calcOffset && canvas.calcOffset();
      fabricImg.bringToFront && fabricImg.bringToFront();
      fabricImg.setCoords && fabricImg.setCoords();
      canvas.setActiveObject && canvas.setActiveObject(fabricImg);
      canvas.requestRenderAll ? canvas.requestRenderAll() : canvas.renderAll();
    } catch (err) {
      console.warn('autoInsert: could not fully enable interaction on inserted object', err);
    }
    };
    imgElement.src = dataURL;
  }, 300); // Esperar para que el logo cargue
};
import { Image as FabricImage } from 'fabric';
import { renderBenchmarkMatrix } from './benchmarkMatrixRenderer';

// Datos por defecto para Demographics Table
export const defaultDemographicsData = [
  {
    title: 'Género:',
    rows: [
      { label: 'Masculino:', general: '0%', digital: '0%', color: '#E91E63' },
      { label: 'Femenino:', general: '0%', digital: '0%', color: '#E91E63' }
    ]
  },
  {
    title: 'Edades:',
    rows: [
      { label: '15 - 19:', general: '0%', digital: '0%', color: '#E91E63' },
      { label: '20 - 29:', general: '0%', digital: '0%', color: '#E91E63' },
      { label: '30 - 39:', general: '0%', digital: '0%', color: '#E91E63' },
      { label: '40 - 49:', general: '0%', digital: '0%', color: '#E91E63' },
      { label: '50 - 59:', general: '0%', digital: '0%', color: '#E91E63' },
      { label: '60 - 85+:', general: '0%', digital: '0%', color: '#E91E63' }
    ]
  },
  {
    title: 'Clase Social:',
    rows: [
      { label: 'Alta:', general: '0%', digital: '0%', color: '#E91E63' },
      { label: 'Media:', general: '0%', digital: '0%', color: '#E91E63' },
      { label: 'Baja:', general: '0%', digital: '0%', color: '#E91E63' }
    ]
  },
  {
    title: 'Distribución:',
    rows: [
      { label: 'Urbana:', general: '0%', digital: '0%', color: '#E91E63' },
      { label: 'Rural:', general: '0%', digital: '0%', color: '#E91E63' }
    ]
  }
];

// Auto-insertar tabla demográfica
export const autoInsertDemographicsTable = async (canvas) => {
  if (!canvas) return;

  const tables = defaultDemographicsData;

  // Crear canvas temporal
  const tempCanvas = document.createElement('canvas');
  const padding = 20;
  const titleHeight = 30;
  const rowHeight = 28;
  const columnWidths = [150, 120, 120];
  const tableSpacing = 25;

  let totalHeight = padding;
  tables.forEach(table => {
    totalHeight += titleHeight + (table.rows.length * rowHeight) + tableSpacing;
  });

  tempCanvas.width = columnWidths.reduce((a, b) => a + b, 0) + (padding * 2);
  tempCanvas.height = totalHeight;
  const ctx = tempCanvas.getContext('2d');

  // Fondo blanco
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  let currentY = padding;

  tables.forEach((table, tableIndex) => {
    // Título de la tabla
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(table.title, padding, currentY + 20);

    currentY += titleHeight;

    // Headers
    const headers = ['', 'General', 'Digital'];
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(padding, currentY, columnWidths.reduce((a, b) => a + b, 0), 24);

    ctx.fillStyle = '#374151';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    let headerX = padding;
    headers.forEach((header, idx) => {
      if (idx > 0) {
        ctx.fillText(header, headerX + columnWidths[idx] / 2, currentY + 16);
      }
      headerX += columnWidths[idx];
    });

    currentY += 24;

    // Filas
    table.rows.forEach((row, rowIndex) => {
      const rowY = currentY + (rowIndex * rowHeight);

      // Fondo alternado
      if (rowIndex % 2 === 0) {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = '#f9fafb';
      }
      ctx.fillRect(padding, rowY, columnWidths.reduce((a, b) => a + b, 0), rowHeight);

      // Borde
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(padding, rowY, columnWidths.reduce((a, b) => a + b, 0), rowHeight);

      // Label
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(row.label, padding + 10, rowY + 18);

      // General value
      ctx.fillStyle = row.color;
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(row.general, padding + columnWidths[0] + columnWidths[1] / 2, rowY + 18);

      // Digital value
      ctx.fillText(row.digital, padding + columnWidths[0] + columnWidths[1] + columnWidths[2] / 2, rowY + 18);
    });

    currentY += table.rows.length * rowHeight + tableSpacing;
  });

  // Convertir a imagen y agregar al canvas
  const dataURL = tempCanvas.toDataURL('image/png');
  const imgElement = new Image();

  imgElement.onload = () => {
    const fabricImg = new FabricImage(imgElement, {
      left: 50,
      top: 150,
      scaleX: 0.8,
      scaleY: 0.8,
      name: 'demographics-table' // Identificador para detectar si ya existe
    });
    canvas.add(fabricImg);
    canvas.renderAll();
  };

  imgElement.src = dataURL;
};

// Datos por defecto para Social Media Usage
export const defaultSocialMediaUsageData = [
  {
    name: 'Facebook',
    logoUrl: 'https://cdn.simpleicons.org/facebook/1877F2',
    color: '#1877F2',
    registeredUsers: '0',
    activeDailyUsers: '0',
    activeHoursDaily: '0 Hrs',
    platformUsers: '0'
  },
  {
    name: 'YouTube',
    logoUrl: 'https://cdn.simpleicons.org/youtube/FF0000',
    color: '#FF0000',
    registeredUsers: '0',
    activeDailyUsers: '0',
    activeHoursDaily: '0 Hrs',
    platformUsers: '0'
  },
  {
    name: 'TikTok',
    logoUrl: 'https://cdn.simpleicons.org/tiktok/000000',
    color: '#000000',
    registeredUsers: '0',
    activeDailyUsers: '0',
    activeHoursDaily: '0 Hrs',
    platformUsers: '0'
  },
  {
    name: 'Instagram',
    logoUrl: 'https://cdn.simpleicons.org/instagram/E4405F',
    color: '#E4405F',
    registeredUsers: '0',
    activeDailyUsers: '0',
    activeHoursDaily: '0 Hrs',
    platformUsers: '0'
  },
  {
    name: 'X (Twitter)',
    logoUrl: 'https://cdn.simpleicons.org/x/000000',
    color: '#000000',
    registeredUsers: '0',
    activeDailyUsers: '0',
    activeHoursDaily: '0 Hrs',
    platformUsers: '0'
  },
  {
    name: 'Whatsapp',
    logoUrl: 'https://cdn.simpleicons.org/whatsapp/25D366',
    color: '#25D366',
    registeredUsers: '0',
    activeDailyUsers: '0',
    activeHoursDaily: '0 Hrs',
    platformUsers: '0'
  }
];

// Auto-insertar tabla de uso de redes sociales
export const autoInsertSocialMediaUsageTable = async (canvas) => {
  if (!canvas) return;

  const platforms = defaultSocialMediaUsageData;

  // Cargar logos primero
  const logoPromises = platforms.map((platform) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ url: platform.logoUrl, img });
      img.onerror = () => resolve({ url: platform.logoUrl, img: null });
      img.src = platform.logoUrl;
    });
  });

  const results = await Promise.all(logoPromises);
  const logosMap = {};
  results.forEach(({ url, img }) => {
    if (img) logosMap[url] = img;
  });

  // Crear canvas temporal (versión reducida)
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 1200;
  tempCanvas.height = 100 + (platforms.length * 90);
  const tempCtx = tempCanvas.getContext('2d');

  // Renderizar tabla...
  tempCtx.fillStyle = '#ffffff';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  const startX = 20;
  const startY = 40;
  const rowHeight = 90;
  const columnWidths = [260, 220, 220, 220, 220];

  // Headers
  const headers = ['', 'Usuarios registrados', 'Usuarios activos diarios', 'Horas activas diarias', 'Usuarios datos en plataforma'];
  tempCtx.fillStyle = '#f5f5f5';
  tempCtx.fillRect(startX, startY, columnWidths.reduce((a, b) => a + b, 0), 60);

  tempCtx.fillStyle = '#000000';
  tempCtx.font = 'bold 16px Arial';
  tempCtx.textAlign = 'center';

  let currentX = startX;
  headers.forEach((header, index) => {
    if (index === 0) {
      currentX += columnWidths[index];
      return;
    }
    const words = header.split(' ');
    let line = '';
    let lineCount = 0;
    const maxWidth = columnWidths[index] - 20;
    const lineHeight = 18;

    words.forEach((word, wordIndex) => {
      const testLine = line + word + ' ';
      const metrics = tempCtx.measureText(testLine);

      if (metrics.width > maxWidth && line !== '') {
        tempCtx.fillText(line.trim(), currentX + columnWidths[index] / 2, startY + 20 + (lineCount * lineHeight));
        line = word + ' ';
        lineCount++;
      } else {
        line = testLine;
      }

      if (wordIndex === words.length - 1) {
        tempCtx.fillText(line.trim(), currentX + columnWidths[index] / 2, startY + 20 + (lineCount * lineHeight));
      }
    });

    currentX += columnWidths[index];
  });

  // Filas de datos
  let currentY = startY + 60;
  platforms.forEach((platform, index) => {
    const bgColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
    tempCtx.fillStyle = bgColor;
    tempCtx.fillRect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight);

    tempCtx.strokeStyle = '#e0e0e0';
    tempCtx.lineWidth = 2;
    tempCtx.beginPath();
    tempCtx.moveTo(startX, currentY);
    tempCtx.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY);
    tempCtx.stroke();

    // Logo y nombre
    const logo = logosMap[platform.logoUrl];
    if (logo) {
      tempCtx.drawImage(logo, startX + 20, currentY + 25, 40, 40);
    }

    tempCtx.fillStyle = platform.color;
    tempCtx.font = 'bold 20px Arial';
    tempCtx.textAlign = 'left';
    tempCtx.fillText(platform.name, startX + 70, currentY + 55);

    // Valores
    tempCtx.fillStyle = '#000000';
    tempCtx.font = 'bold 22px Arial';
    tempCtx.textAlign = 'center';

    currentX = startX + columnWidths[0];
    tempCtx.fillText(platform.registeredUsers, currentX + columnWidths[1] / 2, currentY + 38);
    tempCtx.font = '14px Arial';
    tempCtx.fillText('Usuarios registrados', currentX + columnWidths[1] / 2, currentY + 65);

    currentX += columnWidths[1];
    tempCtx.font = 'bold 22px Arial';
    tempCtx.fillText(platform.activeDailyUsers, currentX + columnWidths[2] / 2, currentY + 38);
    tempCtx.font = '14px Arial';
    tempCtx.fillText('Usuarios activos diarios', currentX + columnWidths[2] / 2, currentY + 65);

    currentX += columnWidths[2];
    tempCtx.font = 'bold 22px Arial';
    tempCtx.fillText(platform.activeHoursDaily, currentX + columnWidths[3] / 2, currentY + 38);
    tempCtx.font = '14px Arial';
    tempCtx.fillText('Horas activas diarias', currentX + columnWidths[3] / 2, currentY + 65);

    currentX += columnWidths[3];
    tempCtx.font = 'bold 22px Arial';
    tempCtx.fillText(platform.platformUsers, currentX + columnWidths[4] / 2, currentY + 38);
    tempCtx.font = '14px Arial';
    tempCtx.fillText('Usuarios datos en plataforma', currentX + columnWidths[4] / 2, currentY + 65);

    // Líneas verticales
    tempCtx.strokeStyle = '#e0e0e0';
    tempCtx.lineWidth = 2;
    currentX = startX + columnWidths[0];

    for (let i = 1; i < columnWidths.length; i++) {
      if (i === columnWidths.length - 1) {
        tempCtx.setLineDash([6, 6]);
        tempCtx.strokeStyle = '#ff0000';
        tempCtx.lineWidth = 3;
      } else {
        tempCtx.setLineDash([]);
        tempCtx.strokeStyle = '#e0e0e0';
        tempCtx.lineWidth = 2;
      }

      tempCtx.beginPath();
      tempCtx.moveTo(currentX, currentY);
      tempCtx.lineTo(currentX, currentY + rowHeight);
      tempCtx.stroke();
      currentX += columnWidths[i];
    }

    tempCtx.setLineDash([]);
    currentY += rowHeight;
  });

  // Convertir a imagen
  const dataURL = tempCanvas.toDataURL('image/png');
  const imgElement = new Image();

  imgElement.onload = () => {
    const fabricImg = new FabricImage(imgElement, {
      left: 50,
      top: 150,
      scaleX: 0.6,
      scaleY: 0.6,
      name: 'social-media-usage-table'
    });
    canvas.add(fabricImg);
    canvas.renderAll();
  };

  imgElement.src = dataURL;
};

// Datos por defecto para Influencers
export const defaultInfluencersData = {
  title: 'Influencers (alcance local): Baja California',
  subtitle: 'Periodo de análisis: 09 al 29 de abril',
  influencers: [
    { name: 'Influencer 1', username: '@influencer1', platform: 'TikTok', followers: '0', topic: 'Música, entretenimiento' },
    { name: 'Influencer 2', username: '@influencer2', platform: 'TikTok', followers: '0', topic: 'Comedia, sketch' },
    { name: 'Influencer 3', username: '@influencer3', platform: 'TikTok', followers: '0', topic: 'Vlog, cocina, humor' },
    { name: 'Influencer 4', username: '@influencer4', platform: 'TikTok', followers: '0', topic: 'Belleza' },
    { name: 'Influencer 5', username: '@influencer5', platform: 'TikTok', followers: '0', topic: 'Moda, belleza' }
  ]
};

// Auto-insertar tabla de influencers
export const autoInsertInfluencersTable = async (canvas) => {
  if (!canvas) return;

  const { title, subtitle, influencers } = defaultInfluencersData;
  const tempCanvas = document.createElement('canvas');
  const padding = 20;
  const titleHeight = 40;
  const subtitleHeight = 30;
  const headerHeight = 35;
  const rowHeight = 45;
  const columnWidths = [200, 150, 100, 120, 200];

  tempCanvas.width = columnWidths.reduce((a, b) => a + b, 0) + (padding * 2);
  tempCanvas.height = padding + titleHeight + subtitleHeight + headerHeight + (influencers.length * rowHeight) + padding;
  const ctx = tempCanvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  let currentY = padding;
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(title, padding, currentY + 25);
  currentY += titleHeight;

  ctx.fillStyle = '#6b7280';
  ctx.font = '14px Arial';
  ctx.fillText(subtitle, padding, currentY + 18);
  currentY += subtitleHeight;

  const headers = ['Nombre', 'Usuario', 'Plataforma', 'Seguidores', 'Temática'];
  ctx.fillStyle = '#1967D2';
  ctx.fillRect(padding, currentY, columnWidths.reduce((a, b) => a + b, 0), headerHeight);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  let headerX = padding;
  headers.forEach((header, idx) => {
    ctx.fillText(header, headerX + columnWidths[idx] / 2, currentY + 22);
    headerX += columnWidths[idx];
  });

  currentY += headerHeight;

  influencers.forEach((influencer, rowIndex) => {
    const rowY = currentY + (rowIndex * rowHeight);
    ctx.fillStyle = rowIndex % 2 === 0 ? '#ffffff' : '#f9fafb';
    ctx.fillRect(padding, rowY, columnWidths.reduce((a, b) => a + b, 0), rowHeight);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, rowY, columnWidths.reduce((a, b) => a + b, 0), rowHeight);

    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(influencer.name, padding + 10, rowY + 28);

    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(influencer.username, padding + columnWidths[0] + columnWidths[1] / 2, rowY + 28);

    ctx.fillStyle = '#1967D2';
    ctx.font = 'bold 11px Arial';
    ctx.fillText(influencer.platform, padding + columnWidths[0] + columnWidths[1] + columnWidths[2] / 2, rowY + 28);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(influencer.followers, padding + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] / 2, rowY + 28);

    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(influencer.topic, padding + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + 10, rowY + 28);
  });

  const dataURL = tempCanvas.toDataURL('image/png');
  const imgElement = new Image();
  imgElement.onload = () => {
    const fabricImg = new FabricImage(imgElement, {
      left: 50,
      top: 150,
      scaleX: 0.9,
      scaleY: 0.9,
      name: 'influencers-table'
    });
    canvas.add(fabricImg);
    canvas.renderAll();
  };
  imgElement.src = dataURL;
};

// Auto-insertar Benchmark Matrix (placeholder)
export const autoInsertBenchmarkMatrix = async (canvas) => {
  // Usar la función completa de renderizado
  await renderBenchmarkMatrix(canvas);
};

// Datos por defecto para Tablero de Adjetivación
const SOCIAL_ICONS = [
  { key: 'facebook', icon: 'https://cdn.simpleicons.org/facebook/1877F2' },
  { key: 'instagram', icon: 'https://cdn.simpleicons.org/instagram/E4405F' },
  { key: 'tiktok', icon: 'https://cdn.simpleicons.org/tiktok/000000' },
  { key: 'x', icon: 'https://cdn.simpleicons.org/x/000000' },
  { key: 'youtube', icon: 'https://cdn.simpleicons.org/youtube/FF0000' },
];

const RADAR_AXES = [
  'Formal',
  'Serio',
  'Colaborativo',
  'Activo',
  'Cercano',
];

const defaultAdjetivacionData = {
  profile: {
    name: 'Personaje 1',
    avatar: '',
  },
  message: 'Análisis estratégico del contenido y mensaje comunicacional',
  numPosts: 0,
  collage: [],
  radar: [0, 0, 0, 0, 0],
  topPosts: [
    { src: '', network: 'facebook' },
    { src: '', network: 'instagram' },
    { src: '', network: 'tiktok' },
    { src: '', network: 'x' },
    { src: '', network: 'youtube' },
  ],
};

function drawRadar(ctx, centerX, centerY, radius, values, axes) {
  ctx.save();
  ctx.strokeStyle = '#b0b0b0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < axes.length; i++) {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
  }
  ctx.stroke();
  // Draw axes labels
  ctx.font = 'bold 13px Arial';
  ctx.fillStyle = '#333';
  for (let i = 0; i < axes.length; i++) {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (radius + 18);
    const y = centerY + Math.sin(angle) * (radius + 18);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(axes[i], x, y);
  }
  // Draw radar area
  ctx.beginPath();
  for (let i = 0; i < values.length; i++) {
    const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
    const r = radius * (values[i] / 100);
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(180, 60, 180, 0.25)';
  ctx.fill();
  ctx.strokeStyle = '#b43cb4';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Draw values
  ctx.font = 'bold 13px Arial';
  ctx.fillStyle = '#b43cb4';
  for (let i = 0; i < values.length; i++) {
    const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
    const r = radius * (values[i] / 100) + 18;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(values[i] + '%', x, y);
  }
  ctx.restore();
}

// Auto-insertar Tablero de Adjetivación
export const autoInsertAdjetivacionTablero = async (canvas) => {
  if (!canvas) return;

  const state = defaultAdjetivacionData;
  const width = 1200, height = 650;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext('2d');

  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, width, height);

  // Perfil
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#b13b2e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(120, 110, 60, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 22px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'left';
  ctx.fillText(state.profile.name, 200, 110);
  ctx.font = 'bold 13px Arial';
  ctx.fillStyle = '#b13b2e';
  ctx.fillText('PERFIL', 200, 140);
  ctx.restore();

  // Mensaje
  ctx.save();
  ctx.fillStyle = '#e5e5e5';
  ctx.fillRect(40, 180, 320, 120);
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('Mensaje:', 55, 205);
  ctx.font = '14px Arial';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Función para envolver texto
  const wrapText = (text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };
  wrapText(state.message, 55, 230, 290, 20);
  ctx.restore();

  // Volumen y collage
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(400, 40, 760, 220, 30);
  ctx.fill();
  ctx.stroke();
  ctx.font = 'bold 22px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('Número de publicaciones: ' + state.numPosts, 420, 70);

  // Radar
  drawRadar(ctx, 1000, 150, 70, state.radar, RADAR_AXES);
  ctx.restore();

  // Contenidos TOP - Ahora más grande
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(40, 320, 1120, 300, 30);
  ctx.fill();
  ctx.stroke();
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('Publicaciones TOP:', 60, 355);

  // Top posts placeholders - más grandes
  state.topPosts.forEach((post, i) => {
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(70 + i * 220, 390, 180, 160);
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('Sin Publicación', 160 + i * 220, 470);

    // Icono red social - más grande y reposicionado
    const icon = SOCIAL_ICONS.find(ic => ic.key === post.network);
    if (icon) {
      const netImg = new Image();
      netImg.crossOrigin = 'anonymous';
      netImg.onload = () => {
        ctx.drawImage(netImg, 150 + i * 220, 565, 32, 32);
      };
      netImg.src = icon.icon;
    }
  });
  ctx.restore();

  // Exportar a Fabric
  setTimeout(() => {
    const dataURL = tempCanvas.toDataURL('image/png');
    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: 50,
        top: 50,
        scaleX: 0.7,
        scaleY: 0.7,
        name: 'adjetivacion-tablero'
      });
      canvas.add(fabricImg);
      canvas.renderAll();
    };
    imgElement.src = dataURL;
  }, 400);
};

// Datos por defecto para Tablero de Audiencia
const RADAR_AXES_AGE = [
  '18-24',
  '25-34',
  '35-44',
  '45+',
];

const defaultAudienciaData = {
  profile: {
    name: 'Personaje 1',
    avatar: '',
  },
  message: 'Análisis de audiencia y alcance',
  numPosts: 0,
  collage: [],
  demographics: {
    gender: [
      { label: 'Masculino', value: 0 },
      { label: 'Femenino', value: 0 },
    ],
    age: [0, 0, 0, 0], // Array simple para el radar
  },
  topPosts: [
    { src: '', network: 'facebook' },
    { src: '', network: 'instagram' },
    { src: '', network: 'tiktok' },
    { src: '', network: 'x' },
    { src: '', network: 'youtube' },
  ],
};

function drawRadarAge(ctx, centerX, centerY, radius, values, axes) {
  ctx.save();
  ctx.strokeStyle = '#b0b0b0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < axes.length; i++) {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
  }
  ctx.stroke();
  // Draw axes labels
  ctx.font = 'bold 13px Arial';
  ctx.fillStyle = '#333';
  for (let i = 0; i < axes.length; i++) {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (radius + 18);
    const y = centerY + Math.sin(angle) * (radius + 18);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(axes[i], x, y);
  }
  // Draw radar area
  ctx.beginPath();
  for (let i = 0; i < values.length; i++) {
    const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
    const r = radius * (values[i] / 100);
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(25, 103, 210, 0.25)';
  ctx.fill();
  ctx.strokeStyle = '#1967D2';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Draw values
  ctx.font = 'bold 13px Arial';
  ctx.fillStyle = '#1967D2';
  for (let i = 0; i < values.length; i++) {
    const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
    const r = radius * (values[i] / 100) + 18;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(values[i] + '%', x, y);
  }
  ctx.restore();
}

// Auto-insertar Tablero de Audiencia
export const autoInsertAudienciaTablero = async (canvas) => {
  if (!canvas) return;

  const state = defaultAudienciaData;
  const width = 1200, height = 720;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext('2d');

  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, width, height);

  // Perfil
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#1967D2';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(120, 110, 60, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 22px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'left';
  ctx.fillText(state.profile.name, 200, 110);
  ctx.font = 'bold 13px Arial';
  ctx.fillStyle = '#1967D2';
  ctx.fillText('PERFIL DE AUDIENCIA', 200, 140);
  ctx.restore();

  // Mensaje
  ctx.save();
  ctx.fillStyle = '#e5e5e5';
  ctx.fillRect(40, 180, 320, 120);
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('Insights:', 55, 205);
  ctx.font = '14px Arial';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const wrapText = (text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };
  wrapText(state.message, 55, 230, 290, 20);
  ctx.restore();

  // Volumen y collage - Card más grande
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(400, 40, 760, 292, 30);
  ctx.fill();
  ctx.stroke();
  ctx.font = 'bold 22px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('Número de publicaciones: ' + state.numPosts, 420, 70);

  // Tipo de análisis (placeholder)
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#1967D2';
  ctx.fillText('Tipo: Propias - Posteado', 420, 95);
  ctx.font = '13px Arial';
  ctx.fillStyle = '#555';
  ctx.fillText('Posts orgánicos de cuentas oficiales', 420, 115);

  // Collage placeholders - con más espacio
  const collageX = 420, collageY = 155, imgSize = 60, gap = 8;
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(collageX + (i % 6) * (imgSize + gap), collageY + Math.floor(i / 6) * (imgSize + gap), imgSize, imgSize);
  }

  // Demographics - Gender (separado del radar)
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('Género:', 950, 70);
  ctx.font = '14px Arial';
  state.demographics.gender.forEach((item, i) => {
    ctx.fillText(`${item.label}: ${item.value}%`, 950, 95 + i * 22);
  });

  // Radar de Edad - más abajo para no encimarse
  drawRadarAge(ctx, 1000, 230, 70, state.demographics.age, RADAR_AXES_AGE);
  ctx.restore();

  // Contenidos TOP - bajado para no encimarse
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(40, 340, 1120, 350, 30);
  ctx.fill();
  ctx.stroke();
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('Publicaciones con Mayor Alcance:', 60, 375);

  // Top posts placeholders
  state.topPosts.forEach((post, i) => {
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(70 + i * 220, 410, 180, 200);
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('Sin Publicación', 160 + i * 220, 510);

    // Icono red social
    const icon = SOCIAL_ICONS.find(ic => ic.key === post.network);
    if (icon) {
      const netImg = new Image();
      netImg.crossOrigin = 'anonymous';
      netImg.onload = () => {
        ctx.drawImage(netImg, 150 + i * 220, 625, 32, 32);
      };
      netImg.src = icon.icon;
    }
  });
  ctx.restore();

  // Exportar a Fabric
  setTimeout(() => {
    const dataURL = tempCanvas.toDataURL('image/png');
    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: 50,
        top: 50,
        scaleX: 0.7,
        scaleY: 0.7,
        name: 'audiencia-tablero'
      });
      canvas.add(fabricImg);
      canvas.renderAll();
    };
    imgElement.src = dataURL;
  }, 400);
};

// Auto-insertar Benchmark Integrado
export const autoInsertBenchmarkIntegrado = async (canvas) => {
  if (!canvas) return;

  const initialProfiles = [
    {
      name: 'Personaje 1',
      avatarUrl: '',
      tag: 'Partido 1',
      message: 'Consolida una estrategia digital orientada a visibilizar avances en infraestructura, seguridad y programas públicos, con el objetivo de fortalecer la imagen institucional, mientras busca conectar con audiencias más sensibles a la eficacia gubernamental.',
      audience: 'Audiencia 1',
      posts: '0',
      imageUrl: ''
    },
    {
      name: 'Personaje 2',
      avatarUrl: '',
      tag: 'Partido 2',
      message: 'Articula una estrategia digital centrada en la visibilidad institucional, con un enfoque prioritario en audiencias clave como mujeres, familias y personas beneficiarias de programas sociales.',
      audience: 'Audiencia 2',
      posts: '0',
      imageUrl: ''
    },
    {
      name: 'Personaje 3',
      avatarUrl: '',
      tag: 'Partido 3',
      message: 'Desarrolla una estrategia sobria, estructurada y coherente con su perfil legislativo, centrada en reforzar su imagen institucional, mientras incorpora temas clave que le permitan conectar y activar en el territorio.',
      audience: 'Audiencia 3',
      posts: '0',
      imageUrl: ''
    }
  ];

  const radarData = [0, 0, 0, 0, 0, 0, 0, 0];
  const radarLabels = [
    'Eficacia', 'Gestión', 'Visibilidad', 'Infraestructura',
    'Seguridad', 'Programas', 'Credibilidad', 'Institucional'
  ];

  // Crear canvas temporal
  const tempCanvas = document.createElement('canvas');
  const width = 1400;
  const height = 700;
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext('2d');

  // Fondo
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, width, height);

  // Radar chart alineado a la izquierda y centrado verticalmente
  const radarCenterX = 230;
  const radarCenterY = height / 2;
  const radarRadius = 170;
  drawRadarChart(ctx, radarCenterX, radarCenterY, radarRadius, radarData, radarLabels);

  // Ajuste de layout para evitar encimado
  const totalProfiles = initialProfiles.length;
  const avatarRadius = 60;
  const cardHeight = 190;
  const verticalSpacing = 44;
  const totalCardsHeight = totalProfiles * cardHeight + (totalProfiles - 1) * verticalSpacing;
  // Centrar el bloque de perfiles respecto al canvas
  const firstCardY = (height - totalCardsHeight) / 2;
  // Alineación horizontal
  const profileStartX = radarCenterX + radarRadius + 60; // a la derecha del radar
  const cardStartX = profileStartX + avatarRadius + 40;
  const cardWidth = 780;

  initialProfiles.forEach((profile, idx) => {
    // Centrar cada avatar y tarjeta respecto al bloque
    const cardY = firstCardY + idx * (cardHeight + verticalSpacing);
    const avatarX = profileStartX;
    const avatarY = cardY + cardHeight / 2;

    // Avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#ccc';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#b71c1c';
    ctx.stroke();
    ctx.restore();

    // Tag debajo del avatar
    ctx.save();
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.roundRect(avatarX - 35, avatarY + avatarRadius + 8, 70, 24, 12);
    ctx.fill();
    ctx.font = 'bold 13px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(profile.tag, avatarX, avatarY + avatarRadius + 20);
    ctx.restore();

    // Nombre debajo del tag
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(profile.name, avatarX, avatarY + avatarRadius + 38);

    // Tarjeta de mensaje a la derecha del avatar
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.10)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.roundRect(cardStartX, cardY, cardWidth, cardHeight, 22);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

  // Texto dentro de la tarjeta (más padding y más espacio)
  let textX = cardStartX + 60;
  let textY = cardY + 38;
  ctx.font = 'bold 17px Arial';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'left';
  ctx.fillText(`Número de publicaciones: ${profile.posts || ''}`, textX, textY);
  textY += 26;
  ctx.font = '16px Arial';
  ctx.fillStyle = '#444';
  ctx.fillText(`Población objetivo: ${profile.audience || ''}`, textX, textY);
  textY += 26;
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#222';
  ctx.fillText('Mensaje central:', textX, textY);
  textY += 22;
  ctx.font = '15px Arial';
  ctx.fillStyle = '#333';
  wrapTextHelper(ctx, profile.message, textX, textY, cardWidth - 160, 20, 8);

    // Imagen/collage a la derecha de la tarjeta
    if (profile.imageUrl) {
      const img = new window.Image();
      img.src = profile.imageUrl;
      img.onload = () => ctx.drawImage(img, cardStartX + cardWidth - 70, cardY + 30, 55, 55);
    } else {
      // Placeholder
      ctx.save();
      ctx.strokeStyle = '#bbb';
      ctx.lineWidth = 2;
      ctx.strokeRect(cardStartX + cardWidth - 70, cardY + 30, 55, 55);
      ctx.restore();
    }
  });

  // Exportar
  const dataURL = tempCanvas.toDataURL('image/png');
  const imgElement = new Image();
  imgElement.onload = () => {
    const fabricImg = new FabricImage(imgElement, {
      left: 40,
      top: 40,
      scaleX: 0.6,
      scaleY: 0.6,
      name: 'benchmark-integrado'
    });
    canvas.add(fabricImg);
    canvas.renderAll();
  };
  imgElement.src = dataURL;

  // Helper para radar
  function drawRadarChart(ctx, cx, cy, r, data, labels) {
    const N = data.length;
    ctx.save();

    // Círculos concéntricos
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let k = 1; k <= 5; ++k) {
      ctx.beginPath();
      for (let i = 0; i <= N; ++i) {
        const angle = (2 * Math.PI * i) / N - Math.PI / 2;
        const x = cx + Math.cos(angle) * (r * k / 5);
        const y = cy + Math.sin(angle) * (r * k / 5);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Ejes
    ctx.strokeStyle = '#bbb';
    for (let i = 0; i < N; ++i) {
      const angle = (2 * Math.PI * i) / N - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx.stroke();
    }

    // Etiquetas
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#1a1a1a';
    for (let i = 0; i < N; ++i) {
      const angle = (2 * Math.PI * i) / N - Math.PI / 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], cx + Math.cos(angle) * (r + 40), cy + Math.sin(angle) * (r + 40));
    }

    // Polígono
    ctx.beginPath();
    for (let i = 0; i <= N; ++i) {
      const angle = (2 * Math.PI * i) / N - Math.PI / 2;
      const value = data[i % N];
      const x = cx + Math.cos(angle) * (r * value / 10);
      const y = cy + Math.sin(angle) * (r * value / 10);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const gradient = ctx.createConicGradient(0, cx, cy);
    gradient.addColorStop(0, '#ffd54f');
    gradient.addColorStop(0.25, '#ff9800');
    gradient.addColorStop(0.5, '#f44336');
    gradient.addColorStop(0.75, '#2196f3');
    gradient.addColorStop(1, '#ffd54f');

    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // Helper para texto
  function wrapTextHelper(ctx, text, x, y, maxWidth, lineHeight, maxLines = 999) {
    if (!text) return;
    const words = text.split(' ');
    let line = '';
    let yy = y;
    let lineCount = 0;

    for (let n = 0; n < words.length && lineCount < maxLines; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, yy);
        line = words[n] + ' ';
        yy += lineHeight;
        lineCount++;
      } else {
        line = testLine;
      }
    }
    if (lineCount < maxLines) {
      ctx.fillText(line, x, yy);
    }
  }
};

// Auto-insertar gráfica de Awareness
export const autoInsertAwarenessChart = async (canvas) => {
  if (!canvas) return;

  const profiles = [
    { name: 'Personaje 1', avatar: '', alcance: 0, impresiones: 0, color: '#0D7377' },
    { name: 'Personaje 2', avatar: '', alcance: 0, impresiones: 0, color: '#0D7377' },
    { name: 'Personaje 3', avatar: '', alcance: 0, impresiones: 0, color: '#0D7377' },
  ];

  const width = 480;
  const height = 270;
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const ctx = canvasElement.getContext('2d');

  // Fondo blanco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Título
  ctx.font = 'bold 14px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('Awareness', 20, 30);

  // Leyenda
  const legendX = 360;
  const legendY = 25;
  
  ctx.fillStyle = '#14B8A6';
  ctx.fillRect(legendX, legendY, 10, 10);
  ctx.font = '8px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('Alcance', legendX + 15, legendY + 8);

  ctx.fillStyle = '#0D7377';
  ctx.fillRect(legendX + 60, legendY, 10, 10);
  ctx.fillText('Impresiones', legendX + 75, legendY + 8);

  // Calcular máximo valor para escala
  const maxValue = Math.max(...profiles.map(p => Math.max(p.alcance, p.impresiones)));
  const scale = maxValue > 0 ? 325 / maxValue : 0;

  // Configuración de barras
  const barHeight = 17;
  const profileSpacing = 55;
  const startY = 70;
  const startX = 60;

  profiles.forEach((profile, index) => {
    const yPos = startY + (index * profileSpacing);

    // Círculo placeholder para avatar
    ctx.beginPath();
    ctx.arc(35, yPos + 10, 17, 0, 2 * Math.PI);
    ctx.fillStyle = '#E5E7EB';
    ctx.fill();
    ctx.strokeStyle = profile.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Nombre (multilinea)
    ctx.font = 'bold 7px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    const nameLines = profile.name.split('\n');
    nameLines.forEach((line, i) => {
      ctx.fillText(line, 35, yPos + 35 + (i * 8));
    });

    // Barra de Alcance (verde claro)
    const alcanceWidth = profile.alcance * scale;
    ctx.fillStyle = '#14B8A6';
    ctx.fillRect(startX, yPos, alcanceWidth, barHeight);

    // Valor de Alcance
    ctx.font = 'bold 7px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText(profile.alcance.toLocaleString(), startX + alcanceWidth + 5, yPos + 11);

    // Barra de Impresiones (verde oscuro)
    const impresionesWidth = profile.impresiones * scale;
    ctx.fillStyle = '#0D7377';
    ctx.fillRect(startX, yPos + barHeight + 4, impresionesWidth, barHeight);

    // Valor de Impresiones
    ctx.fillText(profile.impresiones.toLocaleString(), startX + impresionesWidth + 5, yPos + barHeight + 15);
  });

  // Grid lines
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 0.5;
  const gridSteps = 5;
  for (let i = 0; i <= gridSteps; i++) {
    const x = startX + (325 / gridSteps) * i;
    ctx.beginPath();
    ctx.moveTo(x, 50);
    ctx.lineTo(x, height - 20);
    ctx.stroke();

    // Etiquetas del eje X
    const value = maxValue > 0 ? Math.round((maxValue / gridSteps) * i) : 0;
    ctx.font = '6px Arial';
    ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'center';
    ctx.fillText(value.toLocaleString(), x, height - 10);
  }

  // Importar fabric.Image
  const { Image: FabricImage } = await import('fabric');

  const fabricImg = new FabricImage(canvasElement, {
    left: 0,
    top: 0,
    selectable: true,
    hasControls: true,
    name: 'awareness-chart'
  });

  canvas.add(fabricImg);
  canvas.renderAll();
};

// Auto-insertar gráfica de Top of Mind
export const autoInsertTopOfMindChart = async (canvas) => {
  if (!canvas) return;

  const profiles = [
    { name: 'Personaje 1', avatar: '' },
    { name: 'Personaje 2', avatar: '' },
    { name: 'Personaje 3', avatar: '' },
  ];

  const topics = [
    { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', value: 0, sentiment: 'positive' },
    { text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', value: 0, sentiment: 'negative' },
    { text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', value: 0, sentiment: 'positive' },
    { text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', value: 0, sentiment: 'negative' },
    { text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', value: 0, sentiment: 'negative' },
    { text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.', value: 0, sentiment: 'negative' },
    { text: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.', value: 0, sentiment: 'negative' },
    { text: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.', value: 0, sentiment: 'neutral' },
    { text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.', value: 0, sentiment: 'negative' },
    { text: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.', value: 0, sentiment: 'negative' },
  ];

  const width = 480;
  const height = 270;
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const ctx = canvasElement.getContext('2d');

  // Fondo blanco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Título principal
  ctx.font = 'bold 9px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('Top Of Mind', 15, 18);

  // Perfiles con avatares (parte superior)
  const avatarY = 10;
  const avatarSpacing = 50;
  const startAvatarX = 65;

  profiles.forEach((profile, index) => {
    const x = startAvatarX + (index * avatarSpacing);

    // Círculo placeholder para avatar
    ctx.beginPath();
    ctx.arc(x, avatarY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#E5E7EB';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Nombre
    const nameLines = profile.name.split('\n');
    ctx.font = 'bold 4.5px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    nameLines.forEach((line, i) => {
      ctx.fillText(line, x, avatarY + 15 + (i * 5));
    });
  });

  // Leyenda
  const legendY = 30;
  const legendItems = [
    { text: 'Positivo', color: '#10B981', symbol: '+' },
    { text: 'Neutro', color: '#F59E0B', symbol: '●' },
    { text: 'Negativo', color: '#EF4444', symbol: '−' }
  ];

  let legendX = width - 125;
  legendItems.forEach((item) => {
    ctx.fillStyle = item.color;
    ctx.font = 'bold 7px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(item.symbol, legendX, legendY);
    
    ctx.font = '5.5px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(item.text, legendX + 10, legendY);
    
    legendX += 40;
  });

  // Temas con barras
  const startY = 43;
  const barHeight = 17.5;
  const spacing = 2.5;
  const maxWidth = 350;
  const maxValue = Math.max(...topics.map(t => t.value));

  topics.forEach((topic, index) => {
    const y = startY + (index * (barHeight + spacing));
    
    // Texto del tema (máximo 2 líneas)
    ctx.font = '4px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    
    const words = topic.text.split(' ');
    const maxTextWidth = 335;
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && currentLine !== '') {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine.trim());
    
    // Mostrar máximo 2 líneas
    lines.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, 40, y + 5 + (i * 5));
    });

    // Barra de color según sentimiento
    const barWidth = (topic.value / maxValue) * maxWidth;
    let barColor;
    switch (topic.sentiment) {
      case 'positive':
        barColor = '#10B981';
        break;
      case 'negative':
        barColor = '#EF4444';
        break;
      case 'neutral':
        barColor = '#F59E0B';
        break;
      default:
        barColor = '#6B7280';
    }
    
    ctx.fillStyle = barColor;
    ctx.fillRect(40, y + 12.5, barWidth, 5);

    // Valor numérico
    ctx.font = 'bold 5.5px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'right';
    ctx.fillText(topic.value.toLocaleString(), width - 10, y + 16.5);

    // Símbolo de sentimiento
    ctx.font = 'bold 7px Arial';
    ctx.fillStyle = barColor;
    ctx.textAlign = 'center';
    let symbol = '●';
    if (topic.sentiment === 'positive') symbol = '+';
    if (topic.sentiment === 'negative') symbol = '−';
    ctx.fillText(symbol, width - 25, y + 16.5);
  });

  // Importar fabric.Image
  const { Image: FabricImage } = await import('fabric');

  const fabricImg = new FabricImage(canvasElement, {
    left: 0,
    top: 0,
    selectable: true,
    hasControls: true,
    name: 'top-of-mind-chart'
  });

  canvas.add(fabricImg);
  canvas.renderAll();
};

// Auto-insertar Top of Heart
export const autoInsertTopOfHeartChart = async (canvas) => {
  if (!canvas) return;

  const profiles = [
    { name: 'Personaje 1', avatar: '', color: '#8B4513' },
    { name: 'Personaje 2', avatar: '', color: '#2196F3' },
    { name: 'Personaje 3', avatar: '', color: '#FF9800' },
  ];

  const archetypes = [
    { name: 'Trabajador', scores: [0, 0, 0] },
    { name: 'Innovador', scores: [0, 0, 0] },
    { name: 'Tenaz', scores: [0, 0, 0] },
    { name: 'Pragmático', scores: [0, 0, 0] },
  ];

  const width = 480;
  const height = 270;
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const ctx = canvasElement.getContext('2d');

  // Fondo blanco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Título principal
  ctx.font = 'bold 9px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('Top of Heart', 15, 18);

  // Configuración de la tabla
  const startX = 80;
  const startY = 35;
  const columnWidth = 80;
  const rowHeight = 45;
  const circleRadius = 6;
  const maxCircles = 5;

  // Dibujar encabezados de arquetipos
  ctx.font = 'bold 7px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  archetypes.forEach((archetype, index) => {
    const x = startX + (index * columnWidth) + (columnWidth / 2);
    ctx.fillText(archetype.name, x, startY - 10);
  });

  // Dibujar línea horizontal superior
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX + (archetypes.length * columnWidth), startY);
  ctx.stroke();

  // Dibujar cada perfil
  profiles.forEach((profile, profileIndex) => {
    const y = startY + 10 + (profileIndex * rowHeight);

    // Avatar del perfil
    ctx.beginPath();
    ctx.arc(35, y + 10, 12, 0, 2 * Math.PI);
    ctx.fillStyle = profile.color || '#E5E7EB';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Nombre del perfil
    const nameLines = profile.name.split('\n');
    ctx.font = 'bold 4px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    nameLines.forEach((line, i) => {
      ctx.fillText(line, 50, y + 8 + (i * 5));
    });

    // Dibujar círculos para cada arquetipo
    archetypes.forEach((archetype, archetypeIndex) => {
      const score = archetype.scores[profileIndex];
      const fullCircles = Math.floor(score);
      const hasHalfCircle = (score % 1) >= 0.5;
      
      const colX = startX + (archetypeIndex * columnWidth);
      const circlesStartX = colX + 15;

      // Dibujar círculos completos
      for (let i = 0; i < maxCircles; i++) {
        const cx = circlesStartX + (i * (circleRadius * 2 + 3));
        
        ctx.beginPath();
        ctx.arc(cx, y + 10, circleRadius, 0, 2 * Math.PI);
        
        if (i < fullCircles) {
          // Círculo lleno
          ctx.fillStyle = profile.color || '#E5E7EB';
          ctx.fill();
        } else if (i === fullCircles && hasHalfCircle) {
          // Medio círculo
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, y + 10, circleRadius, 0, 2 * Math.PI);
          ctx.clip();
          ctx.fillStyle = profile.color || '#E5E7EB';
          ctx.fillRect(cx - circleRadius, y + 10 - circleRadius, circleRadius, circleRadius * 2);
          ctx.restore();
        } else {
          // Círculo vacío
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        }
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    // Línea horizontal separadora
    if (profileIndex < profiles.length - 1) {
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(startX, y + rowHeight - 10);
      ctx.lineTo(startX + (archetypes.length * columnWidth), y + rowHeight - 10);
      ctx.stroke();
    }
  });

  // Línea horizontal inferior
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  const finalY = startY + 10 + (profiles.length * rowHeight);
  ctx.moveTo(startX, finalY);
  ctx.lineTo(startX + (archetypes.length * columnWidth), finalY);
  ctx.stroke();

  // Escala de referencia (abajo derecha)
  const legendY = height - 25;
  const legendX = width - 130;
  ctx.font = '5px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('Escala:', legendX, legendY);

  // Dibujar círculos de la leyenda
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(legendX + 28 + (i * 12), legendY - 2, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  ctx.fillText('= 100% menciones', legendX + 88, legendY);

  // Importar fabric.Image
  const { Image: FabricImage } = await import('fabric');

  const fabricImg = new FabricImage(canvasElement, {
    left: 0,
    top: 0,
    selectable: true,
    hasControls: true,
    name: 'top-of-heart-chart'
  });

  canvas.add(fabricImg);
  canvas.renderAll();
};

// Auto-insertar Top of Choice
export const autoInsertTopOfChoiceChart = async (canvas) => {
  if (!canvas) return;

  const profiles = [
    { name: 'Personaje 1', avatar: '', color: '#8B4513', noVotaria: 0, siVotaria: 0 },
    { name: 'Personaje 2', avatar: '', color: '#2196F3', noVotaria: 0, siVotaria: 0 },
    { name: 'Personaje 3', avatar: '', color: '#FF9800', noVotaria: 0, siVotaria: 0 },
  ];

  const width = 480;
  const height = 270;
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const ctx = canvasElement.getContext('2d');

  // Fondo blanco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Título principal
  ctx.font = 'bold 9px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('Top of Choice', 15, 18);

  // Leyendas superiores
  const legendY = 35;
  
  // "No votaría por..." (Rojo)
  ctx.beginPath();
  ctx.arc(100, legendY, 4, 0, 2 * Math.PI);
  ctx.fillStyle = '#C62828';
  ctx.fill();
  ctx.font = '6px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('No votaría por...', 110, legendY + 2);

  // "Votaría por..." (Verde)
  ctx.beginPath();
  ctx.arc(width - 110, legendY, 4, 0, 2 * Math.PI);
  ctx.fillStyle = '#2E7D32';
  ctx.fill();
  ctx.fillText('Votaría por...', width - 100, legendY + 2);

  // Línea central vertical
  const centerX = width / 2;
  ctx.strokeStyle = '#CCCCCC';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX, 50);
  ctx.lineTo(centerX, height - 30);
  ctx.stroke();

  // Configuración de barras
  const startY = 60;
  const barHeight = 35;
  const spacing = 20;
  const maxBarWidth = 180;

  profiles.forEach((profile, index) => {
    const y = startY + (index * (barHeight + spacing));

    // Avatar y nombre en el centro
    const avatarY = y + (barHeight / 2);
    
    // Avatar
    ctx.beginPath();
    ctx.arc(centerX, avatarY, 12, 0, 2 * Math.PI);
    ctx.fillStyle = profile.color || '#E5E7EB';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Nombre del perfil debajo del avatar
    const nameLines = profile.name.split('\n');
    ctx.font = 'bold 5px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    nameLines.forEach((line, i) => {
      ctx.fillText(line, centerX, avatarY + 20 + (i * 6));
    });

    // Barra "No votaría" (izquierda, roja)
    const noVotariaWidth = (profile.noVotaria / 100) * maxBarWidth;
    ctx.fillStyle = '#C62828';
    ctx.fillRect(centerX - noVotariaWidth, y, noVotariaWidth, barHeight);

    // Porcentaje "No votaría"
    if (profile.noVotaria > 0) {
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(`${profile.noVotaria}%`, centerX - (noVotariaWidth / 2), y + (barHeight / 2) + 4);
    }

    // Barra "Sí votaría" (derecha, verde)
    const siVotariaWidth = (profile.siVotaria / 100) * maxBarWidth;
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(centerX, y, siVotariaWidth, barHeight);

    // Porcentaje "Sí votaría"
    if (profile.siVotaria > 0) {
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(`${profile.siVotaria}%`, centerX + (siVotariaWidth / 2), y + (barHeight / 2) + 4);
    }
  });

  // Importar fabric.Image
  const { Image: FabricImage } = await import('fabric');

  const fabricImg = new FabricImage(canvasElement, {
    left: 0,
    top: 0,
    selectable: true,
    hasControls: true,
    name: 'top-of-choice-chart'
  });

  canvas.add(fabricImg);
  canvas.renderAll();
};

// Auto-insertar Top of Voice
export const autoInsertTopOfVoiceChart = async (canvas) => {
  if (!canvas) return;

  const profiles = [
    { name: 'Personaje 1', avatar: '', color: '#8B4513', percentage: 0, mentions: 0 },
    { name: 'Personaje 2', avatar: '', color: '#2196F3', percentage: 0, mentions: 0 },
    { name: 'Personaje 3', avatar: '', color: '#FF9800', percentage: 0, mentions: 0 },
  ];

  const totalMentions = 0;
  const width = 480;
  const height = 270;
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const ctx = canvasElement.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  ctx.font = 'bold 9px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('Top of Voice', 15, 18);

  const centerX = 150;
  const centerY = 135;
  const radius = 80;
  const innerRadius = 55;
  let currentAngle = -Math.PI / 2;

  profiles.forEach((profile) => {
    const sliceAngle = (profile.percentage / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
    ctx.closePath();
    ctx.fillStyle = profile.color;
    ctx.fill();

    const labelAngle = currentAngle + sliceAngle / 2;
    const labelRadius = (radius + innerRadius) / 2;
    const labelX = centerX + Math.cos(labelAngle) * labelRadius;
    const labelY = centerY + Math.sin(labelAngle) * labelRadius;
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${profile.percentage}%`, labelX, labelY);
    currentAngle += sliceAngle;
  });

  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(totalMentions.toLocaleString(), centerX, centerY - 10);
  ctx.font = 'bold 9px Arial';
  ctx.fillText('Menciones', centerX, centerY + 8);

  const dotY = centerY + 20;
  const dotSpacing = 4;
  const dotsCount = 15;
  const dotsStartX = centerX - ((dotsCount - 1) * dotSpacing) / 2;
  ctx.fillStyle = '#00BCD4';
  for (let i = 0; i < dotsCount; i++) {
    ctx.beginPath();
    ctx.arc(dotsStartX + (i * dotSpacing), dotY, 1.5, 0, 2 * Math.PI);
    ctx.fill();
  }

  const legendX = 320;
  const legendStartY = 50;
  const legendSpacing = 60;

  profiles.forEach((profile, index) => {
    const y = legendStartY + (index * legendSpacing);
    const progressRadius = 20;
    const progressCenterX = legendX;
    const progressCenterY = y;

    ctx.beginPath();
    ctx.arc(progressCenterX, progressCenterY, progressRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 6;
    ctx.stroke();

    const progressAngle = (profile.percentage / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(progressCenterX, progressCenterY, progressRadius, -Math.PI / 2, -Math.PI / 2 + progressAngle);
    ctx.strokeStyle = profile.color;
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.font = 'bold 8px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${profile.percentage}%`, progressCenterX, progressCenterY);

    const avatarX = progressCenterX + 35;
    const avatarRadius = 12;
    ctx.beginPath();
    ctx.arc(avatarX, progressCenterY, avatarRadius, 0, 2 * Math.PI);
    ctx.fillStyle = profile.color;
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();

    const nameLines = profile.name.split('\n');
    ctx.font = 'bold 6px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    nameLines.forEach((line, i) => {
      ctx.fillText(line, avatarX + 18, progressCenterY - 3 + (i * 7));
    });
  });

  ctx.font = '5px Arial';
  ctx.fillStyle = '#666666';
  ctx.textAlign = 'left';
  ctx.fillText('Proporción de menciones totales en redes sociales sobre cada candidato durante', 260, height - 20);
  ctx.fillText('el periodo analizado', 260, height - 12);

  const { Image: FabricImage } = await import('fabric');
  const fabricImg = new FabricImage(canvasElement, {
    left: 0,
    top: 0,
    selectable: true,
    hasControls: true,
    name: 'top-of-voice-chart'
  });

  canvas.add(fabricImg);
  canvas.renderAll();
};

// Auto-insert for "Amplificadores de la conversación"
export const autoInsertAmplificadoresChart = async (canvas) => {
  if (!canvas) return;

  const width = 960;
  const height = 540;
  const canvasElement = document.createElement('canvas');
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

  // Sample data matching the reference image
  const profiles = [
    {
      name: 'Personaje 1',
      color: '#8B4513',
      medios: [
        { medio: 'Medio 1', titulo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', impacto: 0 },
        { medio: 'Medio 2', titulo: 'Sed do eiusmod tempor incididunt ut labore et dolore', impacto: 0 },
      ],
      outlets: [
        { outlet: 'Outlet 1', titulo: 'Ut enim ad minim veniam, quis nostrud exercitation', impacto: 0 },
        { outlet: 'Outlet 2', titulo: 'Duis aute irure dolor in reprehenderit in voluptate', impacto: 0 },
      ],
      influenciadores: [
        { user: 'influencer1', followers: 0 },
        { user: 'influencer2', followers: 0 },
      ],
    },
    {
      name: 'Personaje 2',
      color: '#2196F3',
      medios: [],
      outlets: [],
      influenciadores: [],
    },
    {
      name: 'Personaje 3',
      color: '#FF9800',
      medios: [],
      outlets: [],
      influenciadores: [],
    },
  ];

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
        ctx.fillText(influencer.user, influenciadoresX + 10, y + 20);

        // Followers count
        ctx.font = 'bold 11px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'right';
        ctx.fillText(influencer.followers.toLocaleString('en-US'), influenciadoresX + colWidth - 10, y + 20);
        ctx.textAlign = 'left';
      }
    }

    currentY += sectionHeight;
  });

  // Convert to fabric and insert
  const dataURL = canvasElement.toDataURL('image/png');
  const { Image: FabricImage } = await import('fabric');
  const img = new Image();
  img.onload = () => {
    const fabricImg = new FabricImage(img, {
      left: 0,
      top: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      selectable: true,
      hasControls: true,
      name: 'amplificadores-chart'
    });
    canvas.add(fabricImg);
    canvas.setActiveObject(fabricImg);
    canvas.renderAll();
  };
  img.src = dataURL;
};

// Auto-insert for "Estudio de activación por tema"
export const autoInsertActivacionPorTema = async (canvas) => {
  if (!canvas) return;

  const width = 960;
  const height = 540;
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const ctx = canvasElement.getContext('2d');

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Title
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Estudio de activación por tema', 30, 35);

  // Subtitle "Alta Activación" and "Baja Activación"
  ctx.font = 'bold 14px Arial';
  ctx.fillStyle = '#2E7D32';
  ctx.fillText('Alta Activación', 30, 60);
  
  ctx.fillStyle = '#C62828';
  ctx.textAlign = 'right';
  ctx.fillText('Baja Activación', width - 30, 60);
  ctx.textAlign = 'left';

  // Vertical indicator line
  const lineX = width - 50;
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(lineX, 80);
  ctx.lineTo(lineX, 90);
  ctx.stroke();

  ctx.strokeStyle = '#C62828';
  ctx.beginPath();
  ctx.moveTo(lineX, height - 80);
  ctx.lineTo(lineX, height - 70);
  ctx.stroke();

  // Draw gradient line indicator on the right
  const gradientHeight = height - 170;
  const gradient = ctx.createLinearGradient(0, 90, 0, 90 + gradientHeight);
  gradient.addColorStop(0, '#4CAF50');
  gradient.addColorStop(1, '#C62828');
  
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(lineX, 90);
  ctx.lineTo(lineX, 90 + gradientHeight);
  ctx.stroke();

  // Sample data
  const temas = [
    { tema: 'Enojo', activacion: 0, color: '#8B0000' },
    { tema: 'Indignación', activacion: 0, color: '#CD5C5C' },
    { tema: 'Vergüenza', activacion: 0, color: '#DC143C' },
    { tema: 'Desconfianza', activacion: 0, color: '#F08080' },
    { tema: 'Desprecio', activacion: 0, color: '#8B4513' },
    { tema: 'Indiferencia', activacion: 0, color: '#CD853F' },
    { tema: 'Desaprobación', activacion: 0, color: '#D2B48C' },
    { tema: 'Descontento', activacion: 0, color: '#F5DEB3' },
  ];

  // Chart configuration
  const startY = 90;
  const chartHeight = gradientHeight;
  const barHeight = 35;
  const spacing = (chartHeight - (temas.length * barHeight)) / (temas.length + 1);

  // Sort temas by activation (descending)
  const sortedTemas = [...temas].sort((a, b) => b.activacion - a.activacion);

  // Draw bars
  sortedTemas.forEach((tema, index) => {
    const y = startY + spacing + index * (barHeight + spacing);
    const maxBarWidth = width - 180;
    const barWidth = (tema.activacion / 100) * maxBarWidth;

    // Draw bar background
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(90, y, maxBarWidth, barHeight);
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    ctx.strokeRect(90, y, maxBarWidth, barHeight);

    // Draw colored bar
    ctx.fillStyle = tema.color;
    ctx.fillRect(90, y, barWidth, barHeight);

    // Draw tema label
    ctx.font = 'bold 13px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText(tema.tema, 95, y + 22);

    // Draw percentage on the right of the bar
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    const percentX = 90 + barWidth + 10;
    ctx.fillText(`${tema.activacion}%`, percentX, y + 22);
  });

  // Convert to fabric and insert
  const dataURL = canvasElement.toDataURL('image/png');
  const { Image: FabricImage } = await import('fabric');
  const img = new Image();
  img.onload = () => {
    const fabricImg = new FabricImage(img, {
      left: 0,
      top: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      selectable: true,
      hasControls: true,
      name: 'activacion-por-tema-chart'
    });
    canvas.add(fabricImg);
    canvas.setActiveObject(fabricImg);
    canvas.renderAll();
  };
  img.src = dataURL;
};

// Auto-insert for "Análisis de humor social"
export const autoInsertHumorSocial = async (canvas) => {
  if (!canvas) return;
  
  const width = 960;
  const height = 540;
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const ctx = canvasElement.getContext('2d');
  
  // Fondo blanco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  
  // Título
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('c. Coordenadas del Humor Social. Benchmark', 25, 35);
  ctx.font = '12px Arial';
  ctx.fillText('Nuevo León', 25, 55);
  
  // Fecha en la esquina superior derecha
  ctx.fillStyle = '#000000';
  ctx.fillRect(850, 20, 90, 25);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('03-Septiembre', 895, 35);
  
  // Configuración de la matriz
  const gridLeft = 100;
  const gridTop = 90;
  const gridWidth = 450;
  const gridHeight = 420;
  const cellWidth = gridWidth / 6;
  const cellHeight = gridHeight / 6;
  const centerX = gridLeft + gridWidth / 2;
  const centerY = gridTop + gridHeight / 2;
  
  // Matriz de emociones 6×6
  const emotions = [
    ['Cultura', 'Odio', 'Miedo', 'Entusiasmo', 'Amor', 'Euforia'],
    ['Reacción', 'Enojo', 'Irritación', 'Ilusión', 'Admiración', 'Fascinación'],
    ['Desprecio', 'Desdicha', 'Antipatía', 'Gratitud', 'Afín', 'Júbilo'],
    ['Vergüenza', 'Desconfianza', 'Rechazo', 'Simetría', 'Benéfico', 'Esperanza'],
    ['', 'Desconfiado', 'Indeciso', 'Bienestar', 'Confianza', 'Esperanza'],
    ['Depresión', 'Desprecio', 'Indiferencia', 'Arrepentido', 'Gratitud', 'Optimismo']
  ];
  
  // Dibujar celdas con gradiente de color
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const x = gridLeft + col * cellWidth;
      const y = gridTop + row * cellHeight;
      
      // Gradiente: rojo (izquierda/desagradable) a verde (derecha/agradable)
      // Más oscuro arriba (alta actividad) a más claro abajo (baja actividad)
      const hue = (col / 6) * 120; // 0 (rojo) a 120 (verde)
      const lightness = 30 + ((6 - row) / 6) * 40; // 30% a 70%
      ctx.fillStyle = `hsl(${hue}, 60%, ${lightness}%)`;
      ctx.fillRect(x, y, cellWidth, cellHeight);
      
      // Borde blanco
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellWidth, cellHeight);
      
      // Texto de emoción
      if (emotions[row][col]) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emotions[row][col], x + cellWidth / 2, y + cellHeight / 2);
      }
    }
  }
  
  // Ejes centrales
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  // Eje vertical
  ctx.beginPath();
  ctx.moveTo(centerX, gridTop);
  ctx.lineTo(centerX, gridTop + gridHeight);
  ctx.stroke();
  // Eje horizontal
  ctx.beginPath();
  ctx.moveTo(gridLeft, centerY);
  ctx.lineTo(gridLeft + gridWidth, centerY);
  ctx.stroke();
  
  // Etiquetas de ejes
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  
  // Alta actividad (arriba, rotado)
  ctx.save();
  ctx.translate(centerX - 10, gridTop + 50);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Alta actividad', 0, 0);
  ctx.fillText('(+)', 40, 0);
  ctx.restore();
  
  // Baja actividad (abajo, rotado)
  ctx.save();
  ctx.translate(centerX - 10, gridTop + gridHeight - 50);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Baja actividad', 0, 0);
  ctx.fillText('(-)', -40, 0);
  ctx.restore();
  
  // Desagradable (izquierda)
  ctx.fillStyle = '#8B0000';
  ctx.textAlign = 'center';
  ctx.save();
  ctx.translate(gridLeft + 50, centerY + 10);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Desagradable', 0, 0);
  ctx.restore();
  
  // Agradable (derecha)
  ctx.fillStyle = '#006400';
  ctx.save();
  ctx.translate(gridLeft + gridWidth - 50, centerY + 10);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Agradable', 0, 0);
  ctx.restore();
  
  // Números de escala
  ctx.fillStyle = '#666666';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  for (let i = -3; i <= 3; i++) {
    const xPos = centerX + (i * cellWidth);
    ctx.fillText(i.toString(), xPos, gridTop - 10);
  }
  
  // Panel derecho con candidatos
  const panelLeft = 580;
  const panelTop = 80;
  const avatarSize = 45;
  const rowHeight = 48;
  
  // Candidatos de ejemplo con colores
  const candidates = [
    { name: 'Personaje 1', x: 0, y: 0, color: '#DC143C', sentiments: [0, 0, 0] },
    { name: 'Personaje 2', x: 0, y: 0, color: '#8B0000', sentiments: [0, 0, 0] },
    { name: 'Personaje 3', x: 0, y: 0, color: '#FF69B4', sentiments: [0, 0, 0] },
    { name: 'Personaje 4', x: 0, y: 0, color: '#FF6347', sentiments: [0, 0, 0] },
    { name: 'Personaje 5', x: 0, y: 0, color: '#DDA0DD', sentiments: [0, 0, 0] },
    { name: 'Personaje 6', x: 0, y: 0, color: '#DC143C', sentiments: [0, 0, 0] },
    { name: 'Personaje 7', x: 0, y: 0, color: '#4169E1', sentiments: [0, 0, 0] },
    { name: 'Personaje 8', x: 0, y: 0, color: '#FF8C00', sentiments: [0, 0, 0] },
    { name: 'Personaje 9', x: 0, y: 0, color: '#FF8C00', sentiments: [0, 0, 0] }
  ];
  
  // Dibujar avatares en la matriz
  candidates.forEach(candidate => {
    const avatarX = centerX + (candidate.x * cellWidth);
    const avatarY = centerY - (candidate.y * cellHeight);
    
    // Círculo del avatar
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, 18, 0, 2 * Math.PI);
    ctx.fillStyle = candidate.color;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Borde exterior
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  
  // Panel lateral derecho
  candidates.forEach((candidate, index) => {
    const yPos = panelTop + index * rowHeight;
    
    // Avatar en el panel
    ctx.beginPath();
    ctx.arc(panelLeft + 25, yPos + 20, 18, 0, 2 * Math.PI);
    ctx.fillStyle = candidate.color;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Nombre del candidato
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 9px Arial';
    ctx.textAlign = 'left';
    const nameLines = candidate.name.split('\n');
    nameLines.forEach((line, i) => {
      ctx.fillText(line, panelLeft + 50, yPos + 15 + (i * 10));
    });
    
    // Barras de sentimiento
    const barStartX = panelLeft + 130;
    const barY = yPos + 20;
    const barHeight = 8;
    const maxBarWidth = 200;
    
    // Colores para las barras: positivo (verde claro), negativo (rojo claro), neutro (gris)
    const barColors = ['#FFB6C1', '#E0E0E0', '#D3D3D3'];
    
    candidate.sentiments.forEach((value, i) => {
      const barWidth = value * maxBarWidth;
      ctx.fillStyle = barColors[i];
      ctx.fillRect(barStartX, barY + (i * 10) - 10, barWidth, barHeight);
      ctx.strokeStyle = '#CCCCCC';
      ctx.strokeRect(barStartX, barY + (i * 10) - 10, barWidth, barHeight);
    });
    
    // Línea vertical divisoria
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(barStartX + maxBarWidth / 2, barY - 12);
    ctx.lineTo(barStartX + maxBarWidth / 2, barY + 18);
    ctx.stroke();
  });
  
  // Leyenda de barras (arriba del panel)
  ctx.fillStyle = '#000000';
  ctx.font = '9px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Inopinilumbre', panelLeft + 130, panelTop - 10);
  ctx.fillText('Desaprobación', panelLeft + 130, panelTop + 40);
  ctx.fillText('Incertidumbre', panelLeft + 130, panelTop + 90);
  ctx.fillText('Vulnerabilidad', panelLeft + 130, panelTop + 250);
  ctx.fillText('Pesimismo', panelLeft + 130, panelTop + 300);
  
  const dataURL = canvasElement.toDataURL('image/png');
  const { Image: FabricImage } = await import('fabric');
  const img = new Image();
  img.onload = () => {
    const fabricImg = new FabricImage(img, {
      left: 0,
      top: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      selectable: true,
      hasControls: true,
      name: 'humor-social-chart'
    });
    canvas.add(fabricImg);
    canvas.setActiveObject(fabricImg);
    canvas.renderAll();
  };
  img.src = dataURL;
};
