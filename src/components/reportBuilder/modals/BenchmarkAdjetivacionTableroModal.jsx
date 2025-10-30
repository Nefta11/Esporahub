import React, { useState, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Image as FabricImage } from 'fabric';

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

const initialState = {
    profile: {
        name: 'Manuel Guerra',
        avatar: '',
    },
    message: '',
    numPosts: 301,
    collage: [], // {src, file}
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

const BenchmarkAdjetivacionTableroModal = ({ isOpen, onClose, canvas }) => {
    const [state, setState] = useState(initialState);
    const [collageFiles, setCollageFiles] = useState([]);
    const [topFiles, setTopFiles] = useState([null, null, null, null, null]);
    const previewRef = useRef(null);

    // Handlers para inputs
    const handleProfileChange = (field, value) => {
        setState(s => ({ ...s, profile: { ...s.profile, [field]: value } }));
    };
    const handleMessageChange = e => setState(s => ({ ...s, message: e.target.value }));
    const handleNumPostsChange = e => setState(s => ({ ...s, numPosts: Number(e.target.value) }));
    const handleRadarChange = (idx, value) => {
        const radar = [...state.radar];
        radar[idx] = Number(value);
        setState(s => ({ ...s, radar }));
    };
    // Collage
    const handleCollageUpload = e => {
        const files = Array.from(e.target.files);
        const readers = files.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = ev => resolve({ src: ev.target.result, file });
                reader.readAsDataURL(file);
            });
        });
        Promise.all(readers).then(images => {
            setState(s => ({ ...s, collage: [...s.collage, ...images] }));
            setCollageFiles(f => [...f, ...files]);
        });
    };
    const handleRemoveCollage = idx => {
        setState(s => ({ ...s, collage: s.collage.filter((_, i) => i !== idx) }));
        setCollageFiles(f => f.filter((_, i) => i !== idx));
    };
    // Top posts
    const handleTopUpload = (idx, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const newTop = [...state.topPosts];
            newTop[idx] = { ...newTop[idx], src: ev.target.result };
            setState(s => ({ ...s, topPosts: newTop }));
            const newFiles = [...topFiles];
            newFiles[idx] = file;
            setTopFiles(newFiles);
        };
        reader.readAsDataURL(file);
    };
    const handleTopNetworkChange = (idx, value) => {
        const newTop = [...state.topPosts];
        newTop[idx].network = value;
        setState(s => ({ ...s, topPosts: newTop }));
    };

    // Exportar tablero a canvas
    const insertTableroToCanvas = () => {
        if (!canvas) return;
        const width = 1200, height = 600;
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
        if (state.profile.avatar) {
            const img = new window.Image();
            img.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(120, 110, 56, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, 64, 54, 112, 112);
                ctx.restore();
            };
            img.src = state.profile.avatar;
        }
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
        ctx.wrapText = function (text, x, y, maxWidth, lineHeight) {
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
        ctx.wrapText(state.message, 55, 230, 290, 20);
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
        // Collage
        const collageX = 420, collageY = 90, imgSize = 60, gap = 8;
        state.collage.slice(0, 12).forEach((imgObj, i) => {
            const img = new window.Image();
            img.onload = () => {
                ctx.drawImage(img, collageX + (i % 6) * (imgSize + gap), collageY + Math.floor(i / 6) * (imgSize + gap), imgSize, imgSize);
            };
            img.src = imgObj.src;
        });
        // Radar
        drawRadar(ctx, 1000, 150, 70, state.radar, RADAR_AXES);
        ctx.restore();
        // Contenidos TOP
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(40, 320, 1120, 210, 30);
        ctx.fill();
        ctx.stroke();
        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText('Publicaciones TOP:', 60, 350);
        // Top posts
        state.topPosts.forEach((post, i) => {
            if (post.src) {
                const img = new window.Image();
                img.onload = () => {
                    ctx.drawImage(img, 70 + i * 220, 380, 140, 120);
                };
                img.src = post.src;
            } else {
                ctx.fillStyle = '#e0e0e0';
                ctx.fillRect(70 + i * 220, 380, 140, 120);
                ctx.font = 'bold 16px Arial';
                ctx.fillStyle = '#888';
                ctx.fillText('Sin Publicación', 140 + i * 220, 440);
            }
            // Icono red
            const icon = SOCIAL_ICONS.find(ic => ic.key === post.network);
            if (icon) {
                const netImg = new window.Image();
                netImg.onload = () => {
                    ctx.drawImage(netImg, 120 + i * 220, 510, 28, 28);
                };
                netImg.src = icon.icon;
            }
        });
        ctx.restore();
        // Footer: iconos de redes
        ctx.save();
        SOCIAL_ICONS.forEach((ic, i) => {
            const img = new window.Image();
            img.onload = () => {
                ctx.drawImage(img, 1040 + i * 30, 550, 28, 28);
            };
            img.src = ic.icon;
        });
        ctx.restore();
        // Exportar a Fabric
        setTimeout(() => {
            const dataURL = tempCanvas.toDataURL('image/png');
            const imgElement = new window.Image();
            imgElement.onload = () => {
                const fabricImg = new FabricImage(imgElement, {
                    left: 50,
                    top: 50,
                    scaleX: 0.7,
                    scaleY: 0.7
                });
                canvas.add(fabricImg);
                canvas.setActiveObject(fabricImg);
                canvas.renderAll();
                onClose();
            };
            imgElement.src = dataURL;
        }, 400);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()} style={{ maxWidth: 1300, maxHeight: '98vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h3 className="modal-title">Tablero de Análisis de Contenido y Mensaje</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    {/* Perfil */}
                    <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
                        <div>
                            <label>Nombre:</label>
                            <input type="text" value={state.profile.name} onChange={e => handleProfileChange('name', e.target.value)} style={{ width: 180, marginRight: 10 }} />
                            <label>Avatar:</label>
                            <input type="file" accept="image/*" onChange={e => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = ev => handleProfileChange('avatar', ev.target.result);
                                reader.readAsDataURL(file);
                            }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Mensaje (Análisis IA):</label>
                            <textarea value={state.message} onChange={handleMessageChange} rows={4} style={{ width: '100%' }} placeholder="Análisis estratégico del mensaje..." />
                        </div>
                    </div>
                    {/* Volumen y collage */}
                    <div style={{ marginBottom: 18 }}>
                        <label>Número de publicaciones:</label>
                        <input type="number" value={state.numPosts} onChange={handleNumPostsChange} style={{ width: 80, marginRight: 20 }} />
                        <label>Imágenes para collage:</label>
                        <input type="file" accept="image/*" multiple onChange={handleCollageUpload} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                            {state.collage.map((img, idx) => (
                                <div key={idx} style={{ position: 'relative' }}>
                                    <img src={img.src} alt="collage" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }} />
                                    <button onClick={() => handleRemoveCollage(idx)} style={{ position: 'absolute', top: -8, right: -8, background: '#fff', border: '1px solid #ccc', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer' }}><Trash2 size={12} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Radar */}
                    <div style={{ marginBottom: 18 }}>
                        <label>Adjetivación (Tono):</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {RADAR_AXES.map((ax, idx) => (
                                <div key={ax} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 13 }}>{ax}</span>
                                    <input type="number" min={0} max={100} value={state.radar[idx]} onChange={e => handleRadarChange(idx, e.target.value)} style={{ width: 50 }} />
                                    <span>%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Top posts */}
                    <div style={{ marginBottom: 18 }}>
                        <label>Publicaciones TOP:</label>
                        <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
                            {state.topPosts.map((post, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <input type="file" accept="image/*" onChange={e => handleTopUpload(idx, e)} />
                                    <select value={post.network} onChange={e => handleTopNetworkChange(idx, e.target.value)}>
                                        {SOCIAL_ICONS.map(ic => (
                                            <option key={ic.key} value={ic.key}>{ic.key.charAt(0).toUpperCase() + ic.key.slice(1)}</option>
                                        ))}
                                    </select>
                                    {post.src && <img src={post.src} alt="top" style={{ width: 80, height: 70, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }} />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancelar</button>
                    <button className="btn-primary" onClick={insertTableroToCanvas}>Insertar Tablero en Canvas</button>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkAdjetivacionTableroModal;
