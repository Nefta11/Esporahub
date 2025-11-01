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

  // Crear canvas temporal con las mismas dimensiones del modal
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 600;

  // Calcular altura necesaria (igual que en el modal)
  let totalHeight = 40;
  tables.forEach(table => {
    totalHeight += 50 + (table.rows.length * 35) + 40;
  });
  tempCanvas.height = totalHeight;

  const tempCtx = tempCanvas.getContext('2d');

  // Fondo blanco
  tempCtx.fillStyle = '#ffffff';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Configuración (igual que en el modal)
  const startX = 40;
  let currentY = 40;
  const tableSpacing = 40;
  const columnWidths = [140, 100, 100];
  const rowHeight = 35;

  tables.forEach((table) => {
    // Título de la tabla
    tempCtx.fillStyle = '#000000';
    tempCtx.font = 'bold 20px Arial';
    tempCtx.textAlign = 'left';
    tempCtx.fillText(table.title, startX, currentY);
    currentY += 10;

    // Encabezados
    tempCtx.fillStyle = '#9E9E9E';
    tempCtx.fillRect(startX + columnWidths[0], currentY, columnWidths[1], 30);
    tempCtx.fillRect(startX + columnWidths[0] + columnWidths[1], currentY, columnWidths[2], 30);

    tempCtx.fillStyle = '#ffffff';
    tempCtx.font = 'bold 14px Arial';
    tempCtx.textAlign = 'center';
    tempCtx.fillText('General', startX + columnWidths[0] + columnWidths[1] / 2, currentY + 20);
    tempCtx.fillText('Digital', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] / 2, currentY + 20);

    currentY += 30;

    // Filas
    table.rows.forEach((row, rowIndex) => {
      // Fondo de las celdas de datos
      const bgColor = rowIndex % 2 === 0 ? '#E0E0E0' : '#F5F5F5';
      tempCtx.fillStyle = bgColor;
      tempCtx.fillRect(startX + columnWidths[0], currentY, columnWidths[1], rowHeight);
      tempCtx.fillRect(startX + columnWidths[0] + columnWidths[1], currentY, columnWidths[2], rowHeight);

      // Label (con color)
      tempCtx.fillStyle = row.color;
      tempCtx.font = 'bold 16px Arial';
      tempCtx.textAlign = 'left';
      tempCtx.fillText(row.label, startX, currentY + 22);

      // Valores
      tempCtx.fillStyle = '#000000';
      tempCtx.font = '16px Arial';
      tempCtx.textAlign = 'center';
      tempCtx.fillText(row.general, startX + columnWidths[0] + columnWidths[1] / 2, currentY + 22);
      tempCtx.fillText(row.digital, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] / 2, currentY + 22);

      // Bordes
      tempCtx.strokeStyle = '#ffffff';
      tempCtx.lineWidth = 2;
      tempCtx.strokeRect(startX + columnWidths[0], currentY, columnWidths[1], rowHeight);
      tempCtx.strokeRect(startX + columnWidths[0] + columnWidths[1], currentY, columnWidths[2], rowHeight);

      currentY += rowHeight;
    });

    currentY += tableSpacing;
  });

  // Convertir a imagen y agregar al canvas
  const dataURL = tempCanvas.toDataURL('image/png');
  const imgElement = new Image();

  imgElement.onload = () => {
    const fabricImg = new FabricImage(imgElement, {
      left: 100,
      top: 100,
      scaleX: 0.5,
      scaleY: 0.5,
      name: 'demographics-table'
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
  title: 'Lorem ipsum',
  subtitle: 'Lorem ipsum',
  influencers: [
    {
      name: 'Lorem ipsum',
      username: 'Lorem ipsum',
      platform: 'TikTok',
      followers: '0',
      topic: 'Lorem ipsum'
    },
    {
      name: 'Lorem ipsum',
      username: 'Lorem ipsum',
      platform: 'TikTok',
      followers: '0',
      topic: 'Lorem ipsum'
    },
    {
      name: 'Lorem ipsum',
      username: 'Lorem ipsum',
      platform: 'TikTok',
      followers: '0',
      topic: 'Lorem ipsum'
    },
    {
      name: 'Lorem ipsum',
      username: 'Lorem ipsum',
      platform: 'TikTok',
      followers: '0',
      topic: 'Lorem ipsum'
    },
    {
      name: 'Lorem ipsum',
      username: 'Lorem ipsum',
      platform: 'TikTok',
      followers: '0',
      topic: 'Lorem ipsum'
    },
    {
      name: 'Lorem ipsum',
      username: 'Lorem ipsum',
      platform: 'TikTok',
      followers: '0',
      topic: 'Lorem ipsum'
    },
    {
      name: 'Lorem ipsum',
      username: 'Lorem ipsum',
      platform: 'TikTok',
      followers: '0',
      topic: 'Lorem ipsum'
    },
    {
      name: 'Lorem ipsum',
      username: 'Lorem ipsum',
      platform: 'TikTok',
      followers: '0',
      topic: 'Lorem ipsum'
    },
    {
      name: 'Lorem ipsum',
      username: 'Lorem ipsum',
      platform: 'TikTok',
      followers: '0',
      topic: 'Lorem ipsum'
    },
    {
      name: 'Lorem ipsum',
      username: 'Lorem ipsum',
      platform: 'Youtube',
      followers: '0',
      topic: 'Lorem ipsum'
    }
  ]
};

// Auto-insertar tabla de influencers
export const autoInsertInfluencersTable = async (canvas) => {
  if (!canvas) return;

  const { title, subtitle, influencers } = defaultInfluencersData;

  // Crear canvas temporal con las mismas dimensiones que en el modal
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 1100;
  tempCanvas.height = 150 + (influencers.length * 50);
  const tempCtx = tempCanvas.getContext('2d');

  // Fondo blanco
  tempCtx.fillStyle = '#ffffff';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Configuración igual que el modal
  const startX = 30;
  let currentY = 30;
  const rowHeight = 50;
  const headerHeight = 60;
  const columnWidths = [180, 180, 160, 120, 250];

  // Título
  if (title) {
    tempCtx.fillStyle = '#4A3F7A';
    tempCtx.font = 'bold 24px Arial';
    tempCtx.textAlign = 'left';
    tempCtx.fillText(title, startX, currentY + 20);
    currentY += 35;
  }

  // Subtítulo
  if (subtitle) {
    tempCtx.fillStyle = '#666666';
    tempCtx.font = '16px Arial';
    tempCtx.fillText(subtitle, startX, currentY + 15);
    currentY += 30;
  }

  // Encabezados de tabla
  const headers = ['Nombre', 'Username', 'Red más popular', 'Seguidores', 'Tema'];
  tempCtx.fillStyle = '#4A3F7A';
  tempCtx.fillRect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), headerHeight);

  tempCtx.fillStyle = '#ffffff';
  tempCtx.font = 'bold 16px Arial';
  tempCtx.textAlign = 'center';

  let currentX = startX;
  headers.forEach((header, index) => {
    tempCtx.fillText(header, currentX + columnWidths[index] / 2, currentY + headerHeight / 2 + 6);
    currentX += columnWidths[index];
  });

  currentY += headerHeight;

  // Filas de datos
  influencers.forEach((influencer, index) => {
    // Fondo de fila alternado
    const bgColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff';
    tempCtx.fillStyle = bgColor;
    tempCtx.fillRect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight);

    // Borde superior
    tempCtx.strokeStyle = '#e0e0e0';
    tempCtx.lineWidth = 1;
    tempCtx.beginPath();
    tempCtx.moveTo(startX, currentY);
    tempCtx.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY);
    tempCtx.stroke();

    // Datos
    tempCtx.fillStyle = '#000000';
    tempCtx.font = '15px Arial';
    tempCtx.textAlign = 'left';

    currentX = startX;

    // Nombre
    tempCtx.fillText(influencer.name, currentX + 10, currentY + rowHeight / 2 + 5);
    currentX += columnWidths[0];

    // Username
    tempCtx.fillText(influencer.username, currentX + 10, currentY + rowHeight / 2 + 5);
    currentX += columnWidths[1];

    // Plataforma
    tempCtx.textAlign = 'center';
    tempCtx.fillText(influencer.platform, currentX + columnWidths[2] / 2, currentY + rowHeight / 2 + 5);
    currentX += columnWidths[2];

    // Seguidores
    tempCtx.fillText(influencer.followers, currentX + columnWidths[3] / 2, currentY + rowHeight / 2 + 5);
    currentX += columnWidths[3];

    // Tema
    tempCtx.textAlign = 'left';
    tempCtx.fillText(influencer.topic, currentX + 10, currentY + rowHeight / 2 + 5);

    currentY += rowHeight;
  });

  // Borde inferior de la tabla
  tempCtx.strokeStyle = '#4A3F7A';
  tempCtx.lineWidth = 3;
  tempCtx.beginPath();
  tempCtx.moveTo(startX, currentY);
  tempCtx.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY);
  tempCtx.stroke();

  // Convertir canvas a imagen y agregar al canvas principal
  const dataURL = tempCanvas.toDataURL('image/png');
  const imgElement = new Image();

  imgElement.onload = () => {
    const fabricImg = new FabricImage(imgElement, {
      left: 50,
      top: 50,
      scaleX: 0.65,
      scaleY: 0.65,
      name: 'influencers-table'
    });
    canvas.add(fabricImg);
    canvas.setActiveObject(fabricImg);
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
  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('Awareness', 40, 60);

  // Leyenda (centrada)
  const legendX = 600;
  const legendY = 50;

  ctx.fillStyle = '#14B8A6';
  ctx.fillRect(legendX, legendY, 20, 20);
  ctx.font = '16px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('Alcance', legendX + 30, legendY + 15);

  ctx.fillStyle = '#0D7377';
  ctx.fillRect(legendX + 150, legendY, 20, 20);
  ctx.fillText('Impresiones', legendX + 180, legendY + 15);

  // Calcular máximo valor para escala
  const maxValue = Math.max(...profiles.map(p => Math.max(p.alcance, p.impresiones)));
  const scale = maxValue > 0 ? 650 / maxValue : 0;

  // Configuración de barras
  const barHeight = 35;
  const profileSpacing = 110;
  const startY = 140;
  const startX = 120;

  profiles.forEach((profile, index) => {
    const yPos = startY + (index * profileSpacing);

    // Avatar
    if (profile.avatar) {
      const img = new Image();
      img.src = profile.avatar;
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(70, yPos + 20, 35, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 35, yPos - 15, 70, 70);
        ctx.restore();

        // Borde del avatar
        ctx.beginPath();
        ctx.arc(70, yPos + 20, 35, 0, 2 * Math.PI);
        ctx.strokeStyle = profile.color;
        ctx.lineWidth = 3;
        ctx.stroke();
      };
    } else {
      // Círculo placeholder
      ctx.beginPath();
      ctx.arc(70, yPos + 20, 35, 0, 2 * Math.PI);
      ctx.fillStyle = '#E5E7EB';
      ctx.fill();
      ctx.strokeStyle = profile.color;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Nombre
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText(profile.name, 70, yPos + 70);

    // Barra de Alcance (verde claro)
    const alcanceWidth = profile.alcance * scale;
    ctx.fillStyle = '#14B8A6';
    ctx.fillRect(startX, yPos, alcanceWidth, barHeight);

    // Valor de Alcance
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText(profile.alcance.toLocaleString(), startX + alcanceWidth + 10, yPos + 22);

    // Barra de Impresiones (verde oscuro)
    const impresionesWidth = profile.impresiones * scale;
    ctx.fillStyle = '#0D7377';
    ctx.fillRect(startX, yPos + barHeight + 8, impresionesWidth, barHeight);

    // Valor de Impresiones
    ctx.fillText(profile.impresiones.toLocaleString(), startX + impresionesWidth + 10, yPos + barHeight + 30);
  });

  // Grid lines
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  const gridSteps = 5;
  for (let i = 0; i <= gridSteps; i++) {
    const x = startX + (650 / gridSteps) * i;
    ctx.beginPath();
    ctx.moveTo(x, 100);
    ctx.lineTo(x, height - 40);
    ctx.stroke();

    // Etiquetas del eje X
    const value = maxValue > 0 ? Math.round((maxValue / gridSteps) * i) : 0;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'center';
    ctx.fillText(value.toLocaleString(), x, height - 20);
  }

  // Importar fabric.Image
  const { Image: FabricImage } = await import('fabric');

  const fabricImg = new FabricImage(canvasElement, {
    left: 50,
    top: 50,
    scaleX: 0.8,
    scaleY: 0.8,
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

  // Mejorar calidad con escala 2.2x (elementos 10% más grandes)
  const baseWidth = 480;
  const baseHeight = 270;
  const scale = 2.2;
  const width = baseWidth * scale;
  const height = baseHeight * scale;
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const ctx = canvasElement.getContext('2d');
  
  // Activar antialiasing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fondo blanco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Título principal (escalado)
  ctx.font = `bold ${9 * scale}px Arial`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('Top Of Mind', 15 * scale, 18 * scale);

  // Perfiles con avatares - mejor distribuidos y centrados (escalado)
  const avatarY = 12 * scale;
  const avatarSpacing = 60 * scale; // Más espacio entre avatares
  const startAvatarX = 95 * scale; // Más a la derecha para evitar superposición

  profiles.forEach((profile, index) => {
    const x = startAvatarX + (index * avatarSpacing);

    // Círculo placeholder para avatar (escalado)
    ctx.beginPath();
    ctx.arc(x, avatarY, 10 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#E5E7EB';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    // Nombre (escalado)
    const nameLines = profile.name.split('\n');
    ctx.font = `bold ${4.5 * scale}px Arial`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    nameLines.forEach((line, i) => {
      ctx.fillText(line, x, avatarY + (15 * scale) + (i * 5 * scale));
    });
  });

  // Leyenda (escalado)
  const legendY = 32 * scale;
  const legendItems = [
    { text: 'Positivo', color: '#10B981', symbol: '+' },
    { text: 'Neutro', color: '#FFA500', symbol: '●' },
    { text: 'Negativo', color: '#DC2626', symbol: '−' }
  ];

  let legendX = width - (125 * scale);
  legendItems.forEach((item) => {
    ctx.fillStyle = item.color;
    ctx.font = `bold ${7 * scale}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(item.symbol, legendX, legendY);
    
    ctx.font = `${5.5 * scale}px Arial`;
    ctx.fillStyle = '#000000';
    ctx.fillText(item.text, legendX + (10 * scale), legendY);
    
    legendX += (40 * scale);
  });

  // Temas con barras (escalado)
  const startY = 45 * scale;
  const barHeight = 17.5 * scale;
  const spacing = 2.5 * scale;
  const maxWidth = 350 * scale;
  const maxValue = Math.max(...topics.map(t => t.value), 1);

  topics.forEach((topic, index) => {
    const y = startY + (index * (barHeight + spacing));
    
    // Texto del tema (máximo 2 líneas) (escalado)
    ctx.font = `${4.5 * scale}px Arial`; // Ligeramente más grande
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    
    const words = topic.text.split(' ');
    const maxTextWidth = 335 * scale;
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
    
    // Mostrar máximo 2 líneas (escalado)
    lines.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, 40 * scale, y + (5 * scale) + (i * 5 * scale));
    });

    // Barra de color según sentimiento (escalado)
    const barWidth = maxValue > 0 ? (topic.value / maxValue) * maxWidth : 0;
    let barColor;
    if (topic.sentiment === 'positive') {
      barColor = '#10B981';
    } else if (topic.sentiment === 'negative') {
      barColor = '#DC2626';
    } else {
      barColor = '#FFA500';
    }
    
    ctx.fillStyle = barColor;
    ctx.fillRect(40 * scale, y + (12.5 * scale), barWidth, 5 * scale);

    // Valor numérico (escalado)
    ctx.font = `bold ${5.5 * scale}px Arial`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'right';
    ctx.fillText(topic.value.toLocaleString(), width - (10 * scale), y + (16.5 * scale));

    // Símbolo de sentimiento (escalado)
    ctx.font = `bold ${7 * scale}px Arial`;
    ctx.fillStyle = barColor;
    ctx.textAlign = 'center';
    let symbol = '●';
    if (topic.sentiment === 'positive') symbol = '+';
    if (topic.sentiment === 'negative') symbol = '−';
    ctx.fillText(symbol, width - (25 * scale), y + (16.5 * scale));
  });

  // Importar fabric.Image
  const { Image: FabricImage } = await import('fabric');

  const fabricImg = new FabricImage(canvasElement, {
    left: 50,
    top: 50,
    selectable: true,
    hasControls: true,
    name: 'top-of-mind-chart',
    scaleX: 0.9 / scale, // 10% más grande que el tamaño base (0.9 en lugar de 1)
    scaleY: 0.9 / scale  // Mantiene alta resolución en tamaño correcto
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

  // Aumentar resolución para mejor calidad (escala 3x)
  const baseWidth = 960;
  const baseHeight = 540;
  const scale = 3;
  const width = baseWidth * scale;
  const height = baseHeight * scale;

  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const ctx = canvasElement.getContext('2d');

  // Activar antialiasing y suavizado
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fondo blanco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Título principal (escalado)
  ctx.font = `bold ${27 * scale}px Arial`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('Top of Choice', 45 * scale, 54 * scale);

  // Línea central vertical (escalada) - DEFINIR PRIMERO
  const centerX = width / 2;

  // Leyendas superiores (escaladas y centradas)
  const legendY = 105 * scale;
  
  // "No votaría por..." (Rojo) - centrado en el lado izquierdo
  const leftLegendX = centerX / 2; // Centro del cuadrante izquierdo
  ctx.beginPath();
  ctx.arc(leftLegendX - (90 * scale), legendY, 12 * scale, 0, 2 * Math.PI);
  ctx.fillStyle = '#C62828';
  ctx.fill();
  ctx.font = `${18 * scale}px Arial`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText('No votaría por...', leftLegendX - (60 * scale), legendY + (6 * scale));

  // "Votaría por..." (Verde) - centrado en el lado derecho
  const rightLegendX = centerX + (centerX / 2); // Centro del cuadrante derecho
  ctx.beginPath();
  ctx.arc(rightLegendX - (75 * scale), legendY, 12 * scale, 0, 2 * Math.PI);
  ctx.fillStyle = '#2E7D32';
  ctx.fill();
  ctx.fillText('Votaría por...', rightLegendX - (45 * scale), legendY + (6 * scale));

  // Dibujar la línea central vertical
  ctx.strokeStyle = '#CCCCCC';
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(centerX, 150 * scale);
  ctx.lineTo(centerX, height - (90 * scale));
  ctx.stroke();

  // Configuración de barras (escaladas)
  const startY = 180 * scale;
  const barHeight = 90 * scale;
  const spacing = 135 * scale;
  const maxBarWidth = 540 * scale;

  profiles.forEach((profile, index) => {
    const y = startY + (index * (barHeight + spacing));
    const avatarY = y + (barHeight / 2);
    const avatarRadius = 36 * scale;
    
    // Barra "No votaría" (izquierda, roja)
    const noVotariaWidth = (profile.noVotaria / 100) * maxBarWidth;
    ctx.fillStyle = '#C62828';
    ctx.fillRect(centerX - noVotariaWidth, y, noVotariaWidth, barHeight);

    // Porcentaje "No votaría" - solo mostrar si hay suficiente espacio (evitar superposición con avatar)
    const minBarWidthForText = 80 * scale; // Ancho mínimo para mostrar texto sin superposición
    if (profile.noVotaria > 0 && noVotariaWidth > minBarWidthForText) {
      ctx.font = `bold ${30 * scale}px Arial`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(`${profile.noVotaria}%`, centerX - (noVotariaWidth / 2), y + (barHeight / 2) + (9 * scale));
    }

    // Barra "Sí votaría" (derecha, verde)
    const siVotariaWidth = (profile.siVotaria / 100) * maxBarWidth;
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(centerX, y, siVotariaWidth, barHeight);

    // Porcentaje "Sí votaría" - solo mostrar si hay suficiente espacio (evitar superposición con avatar)
    if (profile.siVotaria > 0 && siVotariaWidth > minBarWidthForText) {
      ctx.font = `bold ${30 * scale}px Arial`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(`${profile.siVotaria}%`, centerX + (siVotariaWidth / 2), y + (barHeight / 2) + (9 * scale));
    }

    // Avatar placeholder
    ctx.beginPath();
    ctx.arc(centerX, avatarY, avatarRadius, 0, 2 * Math.PI);
    ctx.fillStyle = profile.color || '#E5E7EB';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6 * scale;
    ctx.stroke();

    // Nombre del perfil debajo del avatar
    const nameLines = profile.name.split('\n');
    ctx.font = `bold ${15 * scale}px Arial`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    nameLines.forEach((line, i) => {
      ctx.fillText(line, centerX, avatarY + (60 * scale) + (i * (18 * scale)));
    });
  });

  // Importar fabric.Image
  const { Image: FabricImage } = await import('fabric');

  const fabricImg = new FabricImage(canvasElement, {
    left: 0,
    top: 0,
    selectable: true,
    hasControls: true,
    name: 'top-of-choice-chart',
    scaleX: 0.5 / scale, // Reducido a la mitad del tamaño base (50% de 960px = 480px)
    scaleY: 0.5 / scale, // Mantiene la alta resolución en tamaño más pequeño
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

  // Mantener tamaño original para evitar recortes (igual que el modal)
  const width = 2000;
  const height = 1080;
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const ctx = canvasElement.getContext('2d');

  // Configuración de alta calidad
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Background
  ctx.fillStyle = '#F5F5F5';
  ctx.fillRect(0, 0, width, height);

  // Title con mejor calidad
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Amplificadores de la conversación', 40, 60);

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

  // Column configuration - ajustado para mejor distribución
  const startY = 100;
  const avatarCol = 30;
  const avatarWidth = 180;
  const colWidth = 570;
  const mediosX = avatarCol + avatarWidth;
  const outletsX = mediosX + colWidth;
  const influenciadoresX = outletsX + colWidth;
  const rowHeight = 195; // Aumentado 40% más para mayor espacio vertical
  const headerHeight = 60;
  const avatarRadius = 55; // Radio del círculo del avatar

  // Draw column headers con mejor diseño
  const headers = [
    { title: 'Medios', x: mediosX },
    { title: 'Outlets', x: outletsX, subtitle: 'Impacto' },
    { title: 'Influenciadores', x: influenciadoresX, subtitle: 'Seguidores' },
  ];

  headers.forEach((header) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(header.x, startY, colWidth, headerHeight);
    ctx.strokeStyle = '#00BCD4';
    ctx.lineWidth = 3;
    ctx.strokeRect(header.x, startY, colWidth, headerHeight);

    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText(header.title, header.x + 20, startY + 38);

    if (header.subtitle) {
      ctx.font = '20px Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(header.subtitle, header.x + colWidth - 40, startY + 38);
    }
  });

  let currentY = startY + headerHeight;

  // Draw each profile
  profiles.forEach((profile, profileIndex) => {
    // Calcular el número real de filas necesarias para cada columna
    const mediosRows = profile.medios.length || 0;
    const outletsRows = profile.outlets.length || 0;
    const influenciadoresRows = profile.influenciadores.length || 0;
    
    // Si outlets está vacío, cuenta como 1 fila para el mensaje
    const effectiveOutletsRows = outletsRows === 0 ? 1 : outletsRows;
    
    const maxRows = Math.max(
      mediosRows || 1,
      effectiveOutletsRows,
      influenciadoresRows || 1
    );
    const sectionHeight = maxRows * rowHeight;

    // Draw avatar column background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(avatarCol, currentY, avatarWidth, sectionHeight);
    ctx.strokeStyle = '#00BCD4';
    ctx.lineWidth = 3;
    ctx.strokeRect(avatarCol, currentY, avatarWidth, sectionHeight);

    // Draw avatar circle con mejor calidad
    const avatarCenterY = currentY + sectionHeight / 2;
    ctx.beginPath();
    ctx.arc(avatarCol + avatarWidth / 2, avatarCenterY, avatarRadius, 0, 2 * Math.PI);
    ctx.fillStyle = profile.color;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw profile name con mejor tipografía
    const nameLines = profile.name.split('\n');
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    const nameY = avatarCenterY + avatarRadius + 25;
    nameLines.forEach((line, i) => {
      ctx.fillText(line, avatarCol + avatarWidth / 2, nameY + i * 22);
    });

    // Draw Medios column con mejor diseño
    for (let i = 0; i < maxRows; i++) {
      const y = currentY + i * rowHeight;
      const medio = profile.medios[i];
      
      // Solo dibujar celda si hay datos o si es necesario para mantener estructura
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(mediosX, y, colWidth, rowHeight);
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 2;
      ctx.strokeRect(mediosX, y, colWidth, rowHeight);

      if (medio && medio.medio) {
        // Green tag for medio name - mejor diseño
        ctx.font = 'bold 18px Arial, sans-serif';
        const medioText = medio.medio || '';
        const tagWidth = Math.max(ctx.measureText(medioText).width + 30, 100);
        
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(mediosX + 15, y + 70, tagWidth, 36);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.fillText(medioText, mediosX + 30, y + 95);

        // Title - mejor espaciado y en nueva línea
        ctx.font = '16px Arial, sans-serif';
        ctx.fillStyle = '#000000';
        const titleStartX = mediosX + tagWidth + 25;
        const maxTitleWidth = colWidth - tagWidth - 110;
        let titulo = medio.titulo || '';
        
        // Truncar título si es muy largo
        while (ctx.measureText(titulo).width > maxTitleWidth && titulo.length > 0) {
          titulo = titulo.slice(0, -1);
        }
        if (titulo.length < (medio.titulo || '').length) {
          titulo = titulo.trim() + '...';
        }
        
        ctx.fillText(titulo, titleStartX, y + 88);

        // Impact number - mejor posición y más pequeño
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText((medio.impacto || 0).toString(), mediosX + colWidth - 40, y + 102);
        ctx.textAlign = 'left';
      }
    }

    // Draw Outlets column con mejor diseño
    if (profile.outlets.length === 0) {
      // "Sin datos para el análisis" message - ocupar toda la sección
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(outletsX, currentY, colWidth, sectionHeight);
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 2;
      ctx.strokeRect(outletsX, currentY, colWidth, sectionHeight);

      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillStyle = '#CCCCCC';
      ctx.textAlign = 'center';
      ctx.fillText('Sin datos para', outletsX + colWidth / 2, avatarCenterY - 15);
      ctx.fillText('el análisis', outletsX + colWidth / 2, avatarCenterY + 20);
      ctx.textAlign = 'left';
    } else {
      for (let i = 0; i < maxRows; i++) {
        const y = currentY + i * rowHeight;
        const outlet = profile.outlets[i];
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(outletsX, y, colWidth, rowHeight);
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 2;
        ctx.strokeRect(outletsX, y, colWidth, rowHeight);

        if (outlet && outlet.outlet) {
          // Colored tag for outlet - mejor diseño
          const outletColors = {
            'SDP Noticias': '#FF4444',
            'Notigram': '#4CAF50',
            'Contacto Politico': '#2196F3',
            'Contacto Hoy': '#2196F3',
            'LJA.MX': '#FF9800',
          };
          
          ctx.font = 'bold 16px Arial, sans-serif';
          const outletText = outlet.outlet || '';
          const outletTextWidth = ctx.measureText(outletText).width;
          const tagWidth = Math.max(outletTextWidth + 24, 90);
          
          ctx.fillStyle = outletColors[outlet.outlet] || '#9E9E9E';
          ctx.fillRect(outletsX + 15, y + 70, tagWidth, 36);
          
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.fillText(outletText, outletsX + 15 + tagWidth / 2, y + 94);
          ctx.textAlign = 'left';

          // Title - mejor espaciado
          ctx.font = '16px Arial, sans-serif';
          ctx.fillStyle = '#000000';
          const titleStartX = outletsX + tagWidth + 25;
          const maxTitleWidth = colWidth - tagWidth - 110;
          let titulo = outlet.titulo || '';
          
          while (ctx.measureText(titulo).width > maxTitleWidth && titulo.length > 0) {
            titulo = titulo.slice(0, -1);
          }
          if (titulo.length < (outlet.titulo || '').length) {
            titulo = titulo.trim() + '...';
          }
          
          ctx.fillText(titulo, titleStartX, y + 88);

          // Impact number - mejor posición
          ctx.font = 'bold 20px Arial, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText((outlet.impacto || 0).toString(), outletsX + colWidth - 40, y + 102);
          ctx.textAlign = 'left';
        }
      }
    }

    // Draw Influenciadores column con mejor diseño
    for (let i = 0; i < maxRows; i++) {
      const y = currentY + i * rowHeight;
      const influencer = profile.influenciadores[i];
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(influenciadoresX, y, colWidth, rowHeight);
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 2;
      ctx.strokeRect(influenciadoresX, y, colWidth, rowHeight);

      if (influencer && influencer.user) {
        // Username con mejor tipografía
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.fillStyle = '#E91E63';
        ctx.textAlign = 'left';
        ctx.fillText(influencer.user || '', influenciadoresX + 20, y + 102);

        // Followers count con mejor formato
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'right';
        const followers = influencer.followers || 0;
        ctx.fillText(followers.toLocaleString('en-US'), influenciadoresX + colWidth - 40, y + 102);
        ctx.textAlign = 'left';
      }
    }

    currentY += sectionHeight;
  });

  // Convert to fabric and insert con alta calidad
  const dataURL = canvasElement.toDataURL('image/png', 1.0);
  const { Image: FabricImage } = await import('fabric');
  const img = new Image();
  img.onload = () => {
    const fabricImg = new FabricImage(img, {
      left: 50,
      top: 50,
      scaleX: 0.42, // Misma escala que el modal
      scaleY: 0.42,
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

  // Aumentar resolución para mejor calidad (x2)
  const scale = 2;
  const width = 960;
  const height = 540;
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width * scale;
  canvasElement.height = height * scale;
  canvasElement.style.width = width + 'px';
  canvasElement.style.height = height + 'px';
  const ctx = canvasElement.getContext('2d');
  
  // Escalar el contexto para mejor renderizado
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Title
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Estudio de activación por tema', 40, 40);

  // Subtitle "Alta Activación" and "Baja Activación"
  ctx.font = '14px Arial, sans-serif';
  ctx.fillStyle = '#2E7D32';
  ctx.fillText('Alta Activación', 40, 70);
  
  ctx.fillStyle = '#C62828';
  ctx.textAlign = 'right';
  ctx.fillText('Baja Activación', width - 40, 70);
  ctx.textAlign = 'left';

  // Vertical indicator line
  const lineX = width - 60;
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(lineX, 90);
  ctx.lineTo(lineX, 105);
  ctx.stroke();

  ctx.strokeStyle = '#C62828';
  ctx.beginPath();
  ctx.moveTo(lineX, height - 70);
  ctx.lineTo(lineX, height - 55);
  ctx.stroke();

  // Draw gradient line indicator on the right
  const gradientHeight = height - 165;
  const gradient = ctx.createLinearGradient(0, 105, 0, 105 + gradientHeight);
  gradient.addColorStop(0, '#4CAF50');
  gradient.addColorStop(0.5, '#FFC107');
  gradient.addColorStop(1, '#C62828');
  
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(lineX, 105);
  ctx.lineTo(lineX, 105 + gradientHeight);
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
  const startY = 105;
  const chartHeight = gradientHeight;
  const barHeight = 38;
  const spacing = (chartHeight - (temas.length * barHeight)) / (temas.length + 1);

  // Sort temas by activation (descending)
  const sortedTemas = [...temas].sort((a, b) => b.activacion - a.activacion);

  // Draw bars
  sortedTemas.forEach((tema, index) => {
    const y = startY + spacing + index * (barHeight + spacing);
    const maxBarWidth = width - 200;
    const barWidth = Math.max((tema.activacion / 100) * maxBarWidth, 0);

    // Draw bar background with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(100, y, maxBarWidth, barHeight);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    ctx.strokeRect(100, y, maxBarWidth, barHeight);

    // Draw colored bar
    if (barWidth > 0) {
      ctx.fillStyle = tema.color;
      ctx.fillRect(100, y, barWidth, barHeight);
    }

    // Draw tema label
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    
    // Sombra para el texto
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(tema.tema, 108, y + 24);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw percentage on the right of the bar
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'left';
    const percentX = 100 + maxBarWidth + 12;
    ctx.fillText(`${tema.activacion}%`, percentX, y + 24);
  });

  // Convert to fabric and insert
  const dataURL = canvasElement.toDataURL('image/png', 1.0);
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

// Auto-insert for "Histograma del Humor Social"
export const autoInsertHumorHistogram = async (canvas) => {
  if (!canvas) return;

  // Datos de ejemplo para el histograma (usando datos genéricos de Lorem Ipsum)
  const candidateData = [
    {
      id: 'p1',
      name: 'Lorem Ipsum',
      avatar: '',
      ringColor: '#A6343C',
      sentiment: 'Incertidumbre',
      percentage: '0%',
      matrix: { x: 0, y: 0 },
      chart: { v: 0.1, h: -0.1, norm_w: 0.5, norm_h: 0.6, norm_dot: [-0.1, -0.1] }
    },
    {
      id: 'p2',
      name: 'Dolor Sit',
      avatar: '',
      ringColor: '#00843D',
      sentiment: 'Aceptación',
      percentage: '0%',
      matrix: { x: 0, y: 0 },
      chart: { v: 0.1, h: 0.1, norm_w: 0.5, norm_h: 0.6, norm_dot: [0.1, 0.1] }
    },
  ];

  const title = 'Histograma del Humor Social';
  const footnote = '*Histograma del Humor Social realizado el 11.Diciembre.2024';

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

  // Precargar todos los avatares
  const avatarImages = await Promise.all(
    candidateData.map(profile => {
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

  const drawProfileRow = (ctx, profile, x, y, avatarImg) => {
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

    // Dibujar avatar/logo si existe
    if (avatarImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX + avatarR - 5, avatarY + avatarR - 5, 12, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImg, avatarX + avatarR - 17, avatarY + avatarR - 17, 24, 24);
      ctx.restore();

      // Borde del avatar pequeño
      ctx.beginPath();
      ctx.arc(avatarX + avatarR - 5, avatarY + avatarR - 5, 12, 0, Math.PI * 2);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Placeholder si no hay avatar
      ctx.beginPath();
      ctx.arc(avatarX + avatarR - 5, avatarY + avatarR - 5, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#999';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

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
