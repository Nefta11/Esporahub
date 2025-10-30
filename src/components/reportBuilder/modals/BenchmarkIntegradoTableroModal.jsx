import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Image as FabricImage } from 'fabric';

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
    },
];

const BenchmarkIntegradoTableroModal = ({ isOpen, onClose, canvas }) => {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [radarData, setRadarData] = useState([7, 8, 6, 5, 6, 7, 8, 7]);
    const [radarLabels, setRadarLabels] = useState([
        'Eficacia', 'Gestión', 'Visibilidad', 'Infraestructura',
        'Seguridad', 'Programas', 'Credibilidad', 'Institucional'
    ]);
    const canvasRef = useRef(null);

    // Dibuja el dashboard en el canvas de preview
    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;
        drawDashboard(canvasRef.current);
    }, [profiles, radarData, radarLabels, isOpen]);

    function drawDashboard(targetCanvas) {
        const ctx = targetCanvas.getContext('2d');
        const width = 1400;
        const height = 700;
        targetCanvas.width = width;
        targetCanvas.height = height;
        ctx.clearRect(0, 0, width, height);

        // Fondo
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        // Radar chart en la izquierda (más grande y reposicionado)
        drawRadar(ctx, 230, 350, 170, radarData, radarLabels);

        // Perfiles en la derecha (más espaciados)
        profiles.forEach((profile, idx) => {
            const cardY = 40 + idx * 215;
            const cardX = 520;
            const cardWidth = 850;
            const cardHeight = 190;

            // Fondo de la tarjeta con sombra
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

            // Avatar circular (más grande)
            const avatarX = cardX - 70;
            const avatarY = cardY + cardHeight / 2;
            const avatarRadius = 55;

            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX, avatarY, avatarRadius, 0, 2 * Math.PI);
            ctx.closePath();

            // Borde del avatar
            ctx.strokeStyle = '#b71c1c';
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.clip();
            if (profile.avatarUrl) {
                const img = new window.Image();
                img.crossOrigin = 'anonymous';
                img.src = profile.avatarUrl;
                img.onload = () => {
                    ctx.drawImage(img, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
                };
            } else {
                ctx.fillStyle = '#ccc';
                ctx.fillRect(avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
            }
            ctx.restore();

            // Tag debajo del avatar
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

            // Nombre junto al avatar
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(profile.name, avatarX + avatarRadius + 15, avatarY);

            // Contenido de la tarjeta
            const contentX = cardX + 25;
            const contentY = cardY + 20;

            // Número de publicaciones
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#1a1a1a';
            ctx.fillText(`Número de publicaciones: ${profile.posts}`, contentX, contentY);

            // Población objetivo
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#1a1a1a';
            ctx.fillText(`Población objetivo: ${profile.audience}`, contentX, contentY + 30);

            // Mensaje central (título)
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#1a1a1a';
            ctx.fillText('Mensaje central:', contentX, contentY + 60);

            // Mensaje central (texto) - más espacio y mejor formato
            ctx.font = '13px Arial';
            ctx.fillStyle = '#444';
            wrapText(ctx, profile.message, contentX, contentY + 85, cardWidth - 200, 18, 4);

            // Imagen de ejemplo en la esquina superior derecha (más grande)
            if (profile.imageUrl) {
                const imgX = cardX + cardWidth - 165;
                const imgY = cardY + 20;
                const imgWidth = 140;
                const imgHeight = 150;

                ctx.save();
                ctx.fillStyle = '#fff';
                ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
                ctx.strokeStyle = '#ddd';
                ctx.lineWidth = 2;
                ctx.strokeRect(imgX, imgY, imgWidth, imgHeight);

                const img = new window.Image();
                img.crossOrigin = 'anonymous';
                img.src = profile.imageUrl;
                img.onload = () => {
                    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
                };
                ctx.restore();
            } else {
                // Placeholder para imagen (más grande)
                const imgX = cardX + cardWidth - 165;
                const imgY = cardY + 20;
                const imgWidth = 140;
                const imgHeight = 150;

                ctx.fillStyle = '#f0f0f0';
                ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
                ctx.strokeStyle = '#ddd';
                ctx.lineWidth = 2;
                ctx.strokeRect(imgX, imgY, imgWidth, imgHeight);
            }
        });
    }

    // Radar chart drawing helper
    function drawRadar(ctx, cx, cy, r, data, labels) {
        const N = data.length;
        ctx.save();

        // Círculos concéntricos de fondo
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

        // Ejes radiales
        ctx.strokeStyle = '#bbb';
        ctx.lineWidth = 1;
        for (let i = 0; i < N; ++i) {
            const angle = (2 * Math.PI * i) / N - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
            ctx.stroke();
        }

        // Etiquetas (más grandes y legibles)
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#1a1a1a';
        for (let i = 0; i < N; ++i) {
            const angle = (2 * Math.PI * i) / N - Math.PI / 2;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labels[i], cx + Math.cos(angle) * (r + 40), cy + Math.sin(angle) * (r + 40));
        }

        // Polígono de datos con gradiente de colores
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

        // Gradiente circular de colores
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

    // Text wrapping helper con límite de líneas
    function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 999) {
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

    // Handlers para editar perfiles
    const updateProfile = (idx, field, value) => {
        const newProfiles = [...profiles];
        newProfiles[idx][field] = value;
        setProfiles(newProfiles);
    };

    const addProfile = () => {
        setProfiles([...profiles, {
            name: '',
            avatarUrl: '',
            tag: '',
            message: '',
            audience: '',
            posts: '',
            imageUrl: ''
        }]);
    };

    const removeProfile = (idx) => {
        if (profiles.length <= 1) return;
        setProfiles(profiles.filter((_, i) => i !== idx));
    };

    // Exportar al canvas principal
    const insertToCanvas = () => {
        if (!canvas) return;

        const tempCanvas = document.createElement('canvas');
        drawDashboard(tempCanvas);

        const dataURL = tempCanvas.toDataURL('image/png');
        const imgElement = new window.Image();
        imgElement.onload = () => {
            const fabricImg = new FabricImage(imgElement, {
                left: 40,
                top: 40,
                scaleX: 0.6,
                scaleY: 0.6,
                name: 'benchmark-integrado'
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
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()} style={{ maxWidth: '1250px', maxHeight: '95vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h3 className="modal-title">Benchmark de Mensaje Integrado</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <button className="btn-primary" style={{ marginBottom: 16 }} onClick={addProfile}>
                        <Plus size={16} /> Agregar Perfil
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {profiles.map((profile, idx) => (
                            <div key={idx} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, background: '#fcfcfc' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 40px', gap: 10, alignItems: 'center', marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={profile.name}
                                        onChange={e => updateProfile(idx, 'name', e.target.value)}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Avatar URL"
                                        value={profile.avatarUrl}
                                        onChange={e => updateProfile(idx, 'avatarUrl', e.target.value)}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tag"
                                        value={profile.tag}
                                        onChange={e => updateProfile(idx, 'tag', e.target.value)}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Imagen URL"
                                        value={profile.imageUrl}
                                        onChange={e => updateProfile(idx, 'imageUrl', e.target.value)}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <button
                                        className="btn-danger btn-icon"
                                        onClick={() => removeProfile(idx)}
                                        disabled={profiles.length <= 1}
                                        style={{ padding: '8px', borderRadius: '4px', border: 'none', background: '#dc3545', color: '#fff', cursor: profiles.length <= 1 ? 'not-allowed' : 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                                    <input
                                        type="text"
                                        placeholder="Población objetivo"
                                        value={profile.audience}
                                        onChange={e => updateProfile(idx, 'audience', e.target.value)}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="N° publicaciones"
                                        value={profile.posts}
                                        onChange={e => updateProfile(idx, 'posts', e.target.value)}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <textarea
                                    placeholder="Mensaje central"
                                    value={profile.message}
                                    onChange={e => updateProfile(idx, 'message', e.target.value)}
                                    style={{ width: '100%', minHeight: 60, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif' }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="chart-preview" style={{ marginTop: '20px' }}>
                        <h4>Vista Previa</h4>
                        <div className="preview-container" style={{ maxHeight: '550px', overflow: 'auto', background: '#f9f9f9', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
                            <canvas ref={canvasRef}></canvas>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancelar</button>
                    <button className="btn-primary" onClick={insertToCanvas}>Insertar en Canvas</button>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkIntegradoTableroModal;