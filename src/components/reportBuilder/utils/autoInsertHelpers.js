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
