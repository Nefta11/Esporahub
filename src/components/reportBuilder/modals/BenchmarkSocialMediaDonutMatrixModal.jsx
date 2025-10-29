import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Image as FabricImage } from 'fabric';

// Categorías y colores
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

// Solo las redes sociales principales para las columnas de gráficos
const SOCIAL_NETWORKS = [
    { key: 'facebook', label: 'Facebook', icon: 'https://cdn.simpleicons.org/facebook/1877F2' },
    { key: 'x', label: 'X', icon: 'https://cdn.simpleicons.org/x/000000' },
    { key: 'instagram', label: 'Instagram', icon: 'https://cdn.simpleicons.org/instagram/E4405F' },
    { key: 'tiktok', label: 'TikTok', icon: 'https://cdn.simpleicons.org/tiktok/000000' },
    { key: 'youtube', label: 'YouTube', icon: 'https://cdn.simpleicons.org/youtube/FF0000' },
];

// Para la leyenda y los íconos de arriba, incluir todas
const SOCIAL_NETWORKS_FOR_LEGEND = [
    ...SOCIAL_NETWORKS,
    { key: 'efemerides', label: 'Efemérides', icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' },
    { key: 'share_news', label: 'Share news', icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828961.png' },
];

const initialCharacters = [
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
    },
];

const DonutChartCell = ({ data, colors, labels, size = 80 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Limpiar canvas
        ctx.clearRect(0, 0, size, size);

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.32;
        const innerRadius = radius * 0.58;

        // Calcular total y filtrar valores no-cero
        const total = data.reduce((sum, val) => sum + val, 0);
        if (total === 0) {
            // Dibujar círculo gris si no hay datos
            ctx.fillStyle = '#b0b0b0';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#6b7280';
            ctx.font = 'bold 7px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Sin', centerX, centerY - 4);
            ctx.fillText('Publicaciones', centerX, centerY + 4);
            return;
        }

        let currentAngle = -Math.PI / 2; // Empezar arriba
        const labelPositions = [];

        // Primera pasada: dibujar segmentos y calcular posiciones
        data.forEach((value, index) => {
            if (value <= 0) return;

            const sliceAngle = (value / total) * 2 * Math.PI;
            const endAngle = currentAngle + sliceAngle;

            // Dibujar segmento
            ctx.fillStyle = colors[index];
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
            ctx.arc(centerX, centerY, innerRadius, endAngle, currentAngle, true);
            ctx.closePath();
            ctx.fill();

            // Calcular posición del porcentaje
            const middleAngle = currentAngle + sliceAngle / 2;
            const labelRadius = radius + 13;
            const labelX = centerX + Math.cos(middleAngle) * labelRadius;
            const labelY = centerY + Math.sin(middleAngle) * labelRadius;

            labelPositions.push({ value, x: labelX, y: labelY });

            currentAngle = endAngle;
        });

        // Segunda pasada: dibujar porcentajes
        labelPositions.forEach(({ value, x, y }) => {
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${value}%`, x, y);
        });

    }, [data, colors, labels, size]);

    return <canvas ref={canvasRef} width={size} height={size} style={{ width: size, height: size }} />;
};

// Migrar personajes para asegurar que todos tengan donutData para todas las redes
function migrateCharacters(characters) {
    return characters.map(char => {
        const newDonutData = { ...char.donutData };
        SOCIAL_NETWORKS.forEach(net => {
            if (!newDonutData[net.key] || !Array.isArray(newDonutData[net.key])) {
                newDonutData[net.key] = Array(DONUT_CATEGORIES.length).fill(0);
            } else if (newDonutData[net.key].length < DONUT_CATEGORIES.length) {
                // Si la red existe pero tiene menos categorías, rellenar
                newDonutData[net.key] = [
                    ...newDonutData[net.key],
                    ...Array(DONUT_CATEGORIES.length - newDonutData[net.key].length).fill(0)
                ];
            }
        });
        return { ...char, donutData: newDonutData };
    });
}

const BenchmarkSocialMediaDonutMatrixModal = ({ isOpen, onClose, canvas }) => {
    const [characters, setCharacters] = useState(() => migrateCharacters(initialCharacters));
    const [newCharName, setNewCharName] = useState("");
    const [newCharAvatar, setNewCharAvatar] = useState("");
    const [socialIconImages, setSocialIconImages] = useState({});
    const previewRef = useRef(null);

    // Cargar íconos de redes sociales como imágenes y migrar personajes si cambian las redes
    useEffect(() => {
        const loadImages = async () => {
            const imagePromises = SOCIAL_NETWORKS.map(network => {
                return new Promise((resolve) => {
                    const img = new window.Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => resolve({ key: network.key, img });
                    img.onerror = () => {
                        console.error(`Failed to load ${network.label} icon`);
                        resolve({ key: network.key, img: null });
                    };
                    img.src = network.icon;
                });
            });

            const results = await Promise.all(imagePromises);
            const imagesMap = {};
            results.forEach(({ key, img }) => {
                if (img) imagesMap[key] = img;
            });
            setSocialIconImages(imagesMap);
        };

        if (isOpen) {
            // Migrar personajes para asegurar que todos tengan todas las redes
            setCharacters(prev => migrateCharacters(prev));
            loadImages();
        }
    }, [isOpen]);

    // Actualizar valor de segmento
    const updateDonutValue = (charIdx, netKey, catIdx, value) => {
        const newChars = [...characters];
        const arr = [...newChars[charIdx].donutData[netKey]];
        arr[catIdx] = Number(value);
        newChars[charIdx].donutData[netKey] = arr;
        setCharacters(newChars);
    };

    // Editar nombre de personaje
    const updateCharName = (charIdx, value) => {
        const newChars = [...characters];
        newChars[charIdx].name = value;
        setCharacters(newChars);
    };

    // Editar avatar de personaje
    const updateCharAvatar = (charIdx, value) => {
        const newChars = [...characters];
        newChars[charIdx].avatarUrl = value;
        setCharacters(newChars);
    };

    // Eliminar personaje
    const removeCharacter = (charIdx) => {
        const newChars = characters.filter((_, idx) => idx !== charIdx);
        setCharacters(newChars);
    };

    // Agregar personaje
    const addCharacter = () => {
        if (!newCharName.trim()) return;
        const emptyDonutData = {};
        SOCIAL_NETWORKS.forEach(net => {
            emptyDonutData[net.key] = Array(DONUT_CATEGORIES.length).fill(0);
        });
        setCharacters([
            ...characters,
            {
                name: newCharName,
                avatarUrl: newCharAvatar || 'https://placehold.co/100x100/EEE/333?text=?',
                donutData: emptyDonutData
            }
        ]);
        setNewCharName("");
        setNewCharAvatar("");
    };

    // Insertar imagen de la matriz al canvas principal
    const insertMatrixToCanvas = async () => {
        if (!canvas) return;

        // Crear un canvas temporal con dimensiones correctas
        const scale = 2.5; // Mayor escala para mejor calidad
        const tempCanvas = document.createElement('canvas');
    const padding = 30;
    const extraBottomPadding = 40; // Más espacio para evitar corte
        const legendHeight = 38;
        const headerHeight = 70;
        const rowHeight = 110;
        const colWidth = 110;
        const nameColWidth = 140;

    // El ancho debe ajustarse al último ícono/texto visible de la leyenda
    // Calculamos el ancho real de la leyenda sumando el espacio de la columna de nombre y el de cada ícono
    const legendIconWidth = 90; // Debe coincidir con el width de cada ícono en el header
    const totalWidth = (nameColWidth + (SOCIAL_NETWORKS_FOR_LEGEND.length * legendIconWidth) + (padding * 2)) * scale;
    const totalHeight = (legendHeight + headerHeight + (characters.length * rowHeight) + padding + extraBottomPadding) * scale;

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
        const iconSize = 40;
        await Promise.all(SOCIAL_NETWORKS.map(async (net, idx) => {
            const x = nameColWidth + (idx * colWidth) + (colWidth - iconSize) / 2 + padding;
            const y = currentY + (headerHeight - iconSize) / 2;

            if (socialIconImages[net.key]) {
                ctx.drawImage(socialIconImages[net.key], x, y, iconSize, iconSize);
            }
        }));

        currentY += headerHeight;

        // Dibujar filas de personajes
        for (const char of characters) {
            const rowY = currentY;

            // Avatar
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

            // Nombre - dividido en líneas si es necesario
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
                top: 50,
                scaleX: 0.35,
                scaleY: 0.35
            });
            canvas.add(fabricImg);
            canvas.setActiveObject(fabricImg);
            canvas.renderAll();
            onClose();
        };
        imgElement.src = dataURL;
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()} style={{ maxWidth: '1400px', maxHeight: '95vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h3 className="modal-title">RRSS Propias: Benchmark de mensaje por contenido posteado</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    {/* Formulario para agregar personaje */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', background: '#f0f7ff', padding: '12px 16px', borderRadius: 8 }}>
                        <input
                            type="text"
                            placeholder="Nombre del personaje"
                            value={newCharName}
                            onChange={e => setNewCharName(e.target.value)}
                            style={{ width: 200, fontSize: 14, padding: '6px 10px', border: '1px solid #ccc', borderRadius: 6 }}
                        />
                        <input
                            type="text"
                            placeholder="URL del avatar (opcional)"
                            value={newCharAvatar}
                            onChange={e => setNewCharAvatar(e.target.value)}
                            style={{ width: 280, fontSize: 14, padding: '6px 10px', border: '1px solid #ccc', borderRadius: 6 }}
                        />
                        <button className="btn-primary" type="button" onClick={addCharacter} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px' }}>
                            <Plus size={16} /> Agregar personaje
                        </button>
                    </div>

                    {/* Vista de edición con controles */}
                    <div style={{ marginBottom: 20 }}>
                        {characters.map((char, charIdx) => (
                            <div key={charIdx} style={{
                                background: '#f9fafb',
                                padding: 12,
                                borderRadius: 8,
                                marginBottom: 12,
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                                    <input
                                        type="text"
                                        value={char.name}
                                        onChange={e => updateCharName(charIdx, e.target.value)}
                                        style={{
                                            fontWeight: 600,
                                            fontSize: 14,
                                            border: '1px solid #d1d5db',
                                            borderRadius: 4,
                                            padding: '6px 10px',
                                            flex: 1,
                                            background: '#fff'
                                        }}
                                        placeholder="Nombre"
                                    />
                                    <input
                                        type="text"
                                        value={char.avatarUrl}
                                        onChange={e => updateCharAvatar(charIdx, e.target.value)}
                                        style={{
                                            fontSize: 12,
                                            border: '1px solid #d1d5db',
                                            borderRadius: 4,
                                            padding: '6px 10px',
                                            flex: 2,
                                            color: '#6b7280'
                                        }}
                                        placeholder="URL del avatar"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeCharacter(charIdx)}
                                        style={{
                                            background: '#ef4444',
                                            border: 'none',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            padding: '6px 12px',
                                            borderRadius: 6,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            fontWeight: 500
                                        }}
                                    >
                                        <Trash2 size={14} /> Eliminar
                                    </button>
                                </div>

                                {/* Controles para editar valores por red social */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                                    {SOCIAL_NETWORKS.map((net) => (
                                        <div key={net.key} style={{ background: '#fff', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}>
                                            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, textAlign: 'center' }}>{net.label}</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                                                {DONUT_CATEGORIES.map((cat, catIdx) => (
                                                    <input
                                                        key={cat.key}
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        value={char.donutData[net.key][catIdx]}
                                                        onChange={e => updateDonutValue(charIdx, net.key, catIdx, e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            fontSize: 10,
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: 3,
                                                            textAlign: 'center',
                                                            padding: '3px',
                                                            background: '#fff'
                                                        }}
                                                        title={cat.label}
                                                        placeholder={cat.label.substring(0, 4)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Vista previa limpia para exportar (SIN controles de edición) */}
                    <div ref={previewRef} style={{
                        background: '#ffffff',
                        padding: '12px 10px',
                        display: 'inline-block',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        {/* Leyenda de categorías - estilo compacto horizontal */}
                        <div style={{
                            display: 'flex',
                            gap: 10,
                            marginBottom: 10,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            paddingBottom: 8
                        }}>
                            {DONUT_CATEGORIES.map(cat => (
                                <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 2,
                                        background: cat.color,
                                        display: 'inline-block'
                                    }}></span>
                                    <span style={{ fontSize: 9, fontWeight: 500, color: '#1f2937' }}>{cat.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Header con íconos de redes sociales y leyenda extendida */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                            <div style={{ width: 100 }}></div>
                            {SOCIAL_NETWORKS_FOR_LEGEND.map(net => (
                                <div key={net.key} style={{
                                    width: 90,
                                    textAlign: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 38
                                }}>
                                    {socialIconImages[net.key] ? (
                                        <img
                                            src={socialIconImages[net.key].src}
                                            alt={net.label}
                                            title={net.label}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                display: 'block',
                                                margin: '0 auto'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: 32,
                                            height: 32,
                                            background: '#e5e7eb',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 8,
                                            fontWeight: 600,
                                            color: '#6b7280'
                                        }}>
                                            {net.label.substring(0, 2)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Filas de personajes - SOLO VISUALIZACIÓN */}
                        {characters.map((char, charIdx) => (
                            <div key={charIdx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: 18 // Más espacio entre filas
                            }}>
                                {/* Columna de personaje */}
                                <div style={{ width: 100, display: 'flex', alignItems: 'center', gap: 8, paddingRight: 8 }}>
                                    <div style={{ position: 'relative', flexShrink: 0 }}>
                                        <img
                                            src={char.avatarUrl}
                                            alt={char.name}
                                            crossOrigin="anonymous"
                                            style={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '3px solid #b13b2e',
                                                background: '#fff'
                                            }}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: 700,
                                            fontSize: 10,
                                            color: '#1f2937',
                                            lineHeight: 1.2,
                                            wordBreak: 'break-word',
                                            marginTop: 6 // Separación extra entre nombre y gráficos
                                        }}>
                                            {char.name}
                                        </div>
                                    </div>
                                </div>

                                {/* Columnas de redes sociales con donas - SOLO VISUALIZACIÓN */}
                                {SOCIAL_NETWORKS.map((net) => (
                                    <div key={net.key} style={{
                                        width: 90,
                                        textAlign: 'center',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <DonutChartCell
                                            data={char.donutData[net.key]}
                                            colors={DONUT_CATEGORIES.map(c => c.color)}
                                            labels={DONUT_CATEGORIES.map(c => c.label)}
                                            size={75}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancelar</button>
                    <button className="btn-primary" onClick={insertMatrixToCanvas}>Insertar Matriz en Canvas</button>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkSocialMediaDonutMatrixModal;