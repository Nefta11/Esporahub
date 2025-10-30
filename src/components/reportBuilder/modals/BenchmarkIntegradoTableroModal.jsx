import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Image as FabricImage } from 'fabric';

const BenchmarkIntegradoTableroModal = ({ isOpen, onClose, canvas }) => {
    // minimal local state and refs required by the component
    const [profiles, setProfiles] = useState([
        { name: '', avatarUrl: '', tag: '', message: '', audience: '', posts: '', imageUrl: '' }
    ]);
    const canvasRef = useRef(null);
    const radarData = [6, 7, 5, 8, 6]; // sample defaults
    const radarLabels = ['Alcance', 'Engagement', 'Frecuencia', 'Calidad', 'Consistencia'];

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

        // Radar chart alineado a la izquierda y centrado verticalmente
        const radarCenterX = 200;
        const radarCenterY = height / 2;
        const radarRadius = 120;
        drawRadar(ctx, radarCenterX, radarCenterY, radarRadius, radarData, radarLabels);

        // Perfiles y tarjetas alineados a la derecha del radar
        const profileStartX = 370;
        const cardStartX = profileStartX + 110;
        const cardWidth = 750;
        const cardHeight = 120;
        const avatarRadius = 45;
        const verticalSpacing = 30;
        const totalProfiles = profiles.length;
        // Calcular el espacio vertical total ocupado
        const totalCardsHeight = totalProfiles * cardHeight + (totalProfiles - 1) * verticalSpacing;
        // Centrar verticalmente
        const firstCardY = (height - totalCardsHeight) / 2;

        profiles.forEach((profile, idx) => {
            const cardY = firstCardY + idx * (cardHeight + verticalSpacing);

            // Avatar circular alineado a la izquierda de la tarjeta
            const avatarX = profileStartX;
            const avatarY = cardY + cardHeight / 2;

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

            // Nombre y tag alineados a la derecha del avatar
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'left';
            ctx.fillText(profile.name, avatarX + avatarRadius + 12, avatarY - 8);
            ctx.font = '13px Arial';
            ctx.fillStyle = '#b71c1c';
            ctx.fillText(profile.tag, avatarX + avatarRadius + 12, avatarY + 14);

            // Tarjeta de mensaje a la derecha del avatar
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.10)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.roundRect(cardStartX, cardY, cardWidth, cardHeight, 18);
            ctx.fill();
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            // Texto dentro de la tarjeta
            let textX = cardStartX + 24;
            let textY = cardY + 32;
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#222';
            ctx.textAlign = 'left';
            ctx.fillText(`Número de publicaciones: ${profile.posts || ''}`, textX, textY);
            textY += 22;
            ctx.font = '15px Arial';
            ctx.fillStyle = '#444';
            ctx.fillText(`Población objetivo: ${profile.audience || ''}`, textX, textY);
            textY += 22;
            ctx.font = 'bold 15px Arial';
            ctx.fillStyle = '#222';
            ctx.fillText('Mensaje central:', textX, textY);
            textY += 20;
            ctx.font = '14px Arial';
            ctx.fillStyle = '#333';
            wrapText(ctx, profile.message, textX, textY, cardWidth - 160, 18, 4);

            // Imagen/collage a la derecha de la tarjeta
            if (profile.imageUrl) {
                const img = new window.Image();
                img.src = profile.imageUrl;
                img.onload = () => ctx.drawImage(img, cardStartX + cardWidth - 90, cardY + 20, 70, 70);
            } else {
                // Placeholder
                ctx.save();
                ctx.strokeStyle = '#bbb';
                ctx.lineWidth = 2;
                ctx.strokeRect(cardStartX + cardWidth - 90, cardY + 20, 70, 70);
                ctx.restore();
            }
        });
    } // <-- cierre correcto de drawDashboard

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