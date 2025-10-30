import { Image as FabricImage } from 'fabric';
import { renderBenchmarkMatrix } from './benchmarkMatrixRenderer';

// Datos por defecto para Demographics Table
export const defaultDemographicsData = [
  {
    title: 'Género:',
    rows: [
      { label: 'Masculino:', general: '49.7%', digital: '49.2%', color: '#E91E63' },
      { label: 'Femenino:', general: '50.3%', digital: '50.8%', color: '#E91E63' }
    ]
  },
  {
    title: 'Edades:',
    rows: [
      { label: '15 - 19:', general: '8.2 %', digital: '9.0 %', color: '#E91E63' },
      { label: '20 - 29:', general: '17.5 %', digital: '20.1 %', color: '#E91E63' },
      { label: '30 - 39:', general: '16 %', digital: '17.6 %', color: '#E91E63' },
      { label: '40 - 49:', general: '14 %', digital: '14.3 %', color: '#E91E63' },
      { label: '50 - 59:', general: '10.2 %', digital: '9.4 %', color: '#E91E63' },
      { label: '60 - 85+:', general: '10.1 %', digital: '8.8 %', color: '#E91E63' }
    ]
  },
  {
    title: 'Clase Social:',
    rows: [
      { label: 'Alta:', general: '7%', digital: '10%', color: '#E91E63' },
      { label: 'Media:', general: '61%', digital: '71%', color: '#E91E63' },
      { label: 'Baja:', general: '32%', digital: '19%', color: '#E91E63' }
    ]
  },
  {
    title: 'Distribución:',
    rows: [
      { label: 'Urbana:', general: '94.5%', digital: '92%', color: '#E91E63' },
      { label: 'Rural:', general: '5.5%', digital: '8%', color: '#E91E63' }
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
    registeredUsers: '2.76M',
    activeDailyUsers: '1.79 M',
    activeHoursDaily: '1.15 Hrs',
    platformUsers: '2.1 M'
  },
  {
    name: 'YouTube',
    logoUrl: 'https://cdn.simpleicons.org/youtube/FF0000',
    color: '#FF0000',
    registeredUsers: '2.24M',
    activeDailyUsers: '1.43 M',
    activeHoursDaily: '1.33 Hrs',
    platformUsers: '1.9 M'
  },
  {
    name: 'TikTok',
    logoUrl: 'https://cdn.simpleicons.org/tiktok/000000',
    color: '#000000',
    registeredUsers: '2.18M',
    activeDailyUsers: '1.96 M',
    activeHoursDaily: '1.28 Hrs',
    platformUsers: '2.5 M'
  },
  {
    name: 'Instagram',
    logoUrl: 'https://cdn.simpleicons.org/instagram/E4405F',
    color: '#E4405F',
    registeredUsers: '1.23M',
    activeDailyUsers: '0.86 M',
    activeHoursDaily: '1.11 Hrs',
    platformUsers: '1.0 M'
  },
  {
    name: 'X (Twitter)',
    logoUrl: 'https://cdn.simpleicons.org/x/000000',
    color: '#000000',
    registeredUsers: '0.46M',
    activeDailyUsers: '0.27 M',
    activeHoursDaily: '0.40 Hrs',
    platformUsers: '0.1 M'
  },
  {
    name: 'Whatsapp',
    logoUrl: 'https://cdn.simpleicons.org/whatsapp/25D366',
    color: '#25D366',
    registeredUsers: '2.45M',
    activeDailyUsers: '2.01 M',
    activeHoursDaily: '3.00 Hrs',
    platformUsers: '5.5 M'
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
    { name: 'Michel Chávez', username: '@lis.michihn', platform: 'TikTok', followers: '37.7M', topic: 'Música, entretenimiento' },
    { name: 'Braulio Rod', username: '@brauliorodrg', platform: 'TikTok', followers: '6.8M', topic: 'Comedia, sketch' },
    { name: 'Melissa Muro', username: '@melissamuroo', platform: 'TikTok', followers: '2.3M', topic: 'Vlog, cocina, humor' },
    { name: 'Diana Montoya', username: '@montoyadiana_', platform: 'TikTok', followers: '2.1M', topic: 'Belleza' },
    { name: 'Marbella Beltrán', username: '@marbellalb', platform: 'TikTok', followers: '1.8M', topic: 'Moda, belleza' }
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
    name: 'Manuel Guerra',
    avatar: '',
  },
  message: 'Análisis estratégico del contenido y mensaje comunicacional',
  numPosts: 301,
  collage: [],
  radar: [28, 23, 18, 17, 14],
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
    name: 'Manuel Guerra',
    avatar: '',
  },
  message: 'Análisis de audiencia y alcance',
  numPosts: 301,
  collage: [],
  demographics: {
    gender: [
      { label: 'Masculino', value: 52 },
      { label: 'Femenino', value: 48 },
    ],
    age: [25, 35, 22, 18], // Array simple para el radar
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
      name: 'Manuel Guerra',
      avatarUrl: '',
      tag: 'Morena',
      message: 'Consolida una estrategia digital orientada a visibilizar avances en infraestructura, seguridad y programas públicos, con el objetivo de fortalecer la imagen institucional, mientras busca conectar con audiencias más sensibles a la eficacia gubernamental.',
      audience: 'Animalistas',
      posts: '301',
      imageUrl: ''
    },
    {
      name: 'Clara Luz',
      avatarUrl: '',
      tag: 'Morena',
      message: 'Articula una estrategia digital centrada en la visibilidad institucional, con un enfoque prioritario en audiencias clave como mujeres, familias y personas beneficiarias de programas sociales.',
      audience: 'Religiosos',
      posts: '137',
      imageUrl: ''
    },
    {
      name: 'Waldo Fernández',
      avatarUrl: '',
      tag: 'Morena',
      message: 'Desarrolla una estrategia sobria, estructurada y coherente con su perfil legislativo, centrada en reforzar su imagen institucional, mientras incorpora temas clave que le permitan conectar y activar en el territorio.',
      audience: 'Morena Duro',
      posts: '413',
      imageUrl: ''
    }
  ];

  const radarData = [7, 8, 6, 5, 6, 7, 8, 7];
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

  // Radar chart
  drawRadarChart(ctx, 230, 350, 170, radarData, radarLabels);

  // Perfiles
  initialProfiles.forEach((profile, idx) => {
    const cardY = 40 + idx * 215;
    const cardX = 520;
    const cardWidth = 850;
    const cardHeight = 190;

    // Fondo de tarjeta
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 15);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Avatar
    const avatarX = cardX - 70;
    const avatarY = cardY + cardHeight / 2;
    const avatarRadius = 55;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#b71c1c';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.clip();
    ctx.fillStyle = '#ccc';
    ctx.fillRect(avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
    ctx.restore();

    // Tag
    ctx.save();
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.roundRect(avatarX - 30, avatarY + avatarRadius + 5, 60, 20, 10);
    ctx.fill();
    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(profile.tag, avatarX, avatarY + avatarRadius + 15);
    ctx.restore();

    // Nombre
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(profile.name, avatarX + avatarRadius + 15, avatarY);

    // Contenido
    const contentX = cardX + 25;
    const contentY = cardY + 20;

    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(`Número de publicaciones: ${profile.posts}`, contentX, contentY);
    ctx.fillText(`Población objetivo: ${profile.audience}`, contentX, contentY + 30);
    ctx.fillText('Mensaje central:', contentX, contentY + 60);

    ctx.font = '13px Arial';
    ctx.fillStyle = '#444';
    wrapTextHelper(ctx, profile.message, contentX, contentY + 85, cardWidth - 200, 18, 4);

    // Placeholder imagen
    const imgX = cardX + cardWidth - 165;
    const imgY = cardY + 20;
    const imgWidth = 140;
    const imgHeight = 150;
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.strokeRect(imgX, imgY, imgWidth, imgHeight);
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
