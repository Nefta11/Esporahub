import React, { useState, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Image as FabricImage } from 'fabric';
import '@/styles/reportBuilder/ChartModals.css';

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
        name: 'Personaje 1',
        avatar: '',
    },
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    numPosts: 0,
    collage: [], // {src, file}
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

const BenchmarkAdjetivacionTableroModal = ({ isOpen, onClose, canvas, filminaTitle }) => {
    const [state, setState] = useState(initialState);
    const [collageFiles, setCollageFiles] = useState([]);
    const [topFiles, setTopFiles] = useState([null, null, null, null, null]);
    const previewRef = useRef(null);

    // Determinar tipo de análisis según filmina
    const getAnalysisType = () => {
        if (!filminaTitle) return { source: 'Propias', type: 'Posteado' };

        const isPropias = filminaTitle.includes('Propias');
        const isPosteado = filminaTitle.includes('posteado');

        return {
            source: isPropias ? 'Propias' : 'Externas',
            type: isPosteado ? 'Posteado' : 'Difundido',
            description: isPropias
                ? (isPosteado ? 'Posts orgánicos de cuentas oficiales' : 'Posts pagados (pauta) de cuentas oficiales')
                : (isPosteado ? 'Posts orgánicos de cuentas alternas' : 'Posts pagados (pauta) de cuentas alternas')
        };
    };

    const analysisType = getAnalysisType();

    // Handlers para inputs
    const handleProfileChange = (field, value) => {
        setState(s => ({ ...s, profile: { ...s.profile, [field]: value } }));
    };
    const handleMessageChange = e => setState(s => ({ ...s, message: e.target.value }));
    const handleNumPostsChange = e => setState(s => ({ ...s, numPosts: Number(e.target.value) }));
    const handleRadarChange = (idx, value) => {
        const newValue = Math.max(0, Math.min(100, Number(value) || 0));
        const radar = [...state.radar];
        radar[idx] = newValue;

        // Calcular la suma de todos los valores
        const sum = radar.reduce((acc, val) => acc + val, 0);

        // Si la suma excede 100, ajustar los demás valores proporcionalmente
        if (sum > 100) {
            const excess = sum - 100;
            const otherIndices = radar.map((_, i) => i).filter(i => i !== idx);
            const otherSum = otherIndices.reduce((acc, i) => acc + radar[i], 0);

            if (otherSum > 0) {
                // Distribuir el exceso proporcionalmente entre los otros valores
                otherIndices.forEach(i => {
                    const proportion = radar[i] / otherSum;
                    radar[i] = Math.max(0, Math.round(radar[i] - (excess * proportion)));
                });
            } else {
                // Si todos los demás están en 0, ajustar el valor actual
                radar[idx] = 100;
            }
        }

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
    const insertTableroToCanvas = async () => {
        if (!canvas) return;

        const width = 1200, height = 650;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const ctx = tempCanvas.getContext('2d');

        // Función para cargar imágenes
        const loadImage = (src) => {
            return new Promise((resolve) => {
                const img = new window.Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = src;
            });
        };

        // Cargar todas las imágenes primero
        const avatarImg = state.profile.avatar ? await loadImage(state.profile.avatar) : null;
        const collageImgs = await Promise.all(
            state.collage.slice(0, 12).map(imgObj => loadImage(imgObj.src))
        );
        const topPostImgs = await Promise.all(
            state.topPosts.map(post => post.src ? loadImage(post.src) : Promise.resolve(null))
        );
        const socialIconImgs = await Promise.all(
            SOCIAL_ICONS.map(ic => loadImage(ic.icon))
        );

        // Ahora dibujamos todo
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

        if (avatarImg) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(120, 110, 56, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatarImg, 64, 54, 112, 112);
            ctx.restore();
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

        // Wrap text
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

        // Tipo de análisis
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#b13b2e';
        ctx.fillText(`Tipo: ${analysisType.source} - ${analysisType.type}`, 420, 95);
        ctx.font = '13px Arial';
        ctx.fillStyle = '#555';
        wrapText(analysisType.description, 420, 115, 500, 18);

        // Collage
        const collageX = 420, collageY = 145, imgSize = 60, gap = 8;
        collageImgs.forEach((img, i) => {
            if (img) {
                ctx.drawImage(img, collageX + (i % 6) * (imgSize + gap), collageY + Math.floor(i / 6) * (imgSize + gap), imgSize, imgSize);
            }
        });

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

        // Top posts - más grandes
        state.topPosts.forEach((post, i) => {
            if (topPostImgs[i]) {
                ctx.drawImage(topPostImgs[i], 70 + i * 220, 390, 180, 160);
            } else {
                ctx.fillStyle = '#e0e0e0';
                ctx.fillRect(70 + i * 220, 390, 180, 160);
                ctx.font = 'bold 18px Arial';
                ctx.fillStyle = '#888';
                ctx.textAlign = 'center';
                ctx.fillText('Sin Publicación', 160 + i * 220, 470);
            }

            // Icono red - más grande y reposicionado
            const iconIndex = SOCIAL_ICONS.findIndex(ic => ic.key === post.network);
            if (iconIndex >= 0 && socialIconImgs[iconIndex]) {
                ctx.drawImage(socialIconImgs[iconIndex], 150 + i * 220, 565, 32, 32);
            }
        });
        ctx.restore();

        // Exportar a Fabric
        const dataURL = tempCanvas.toDataURL('image/png');
        const imgElement = new window.Image();
        imgElement.onload = () => {
            const fabricImg = new FabricImage(imgElement, {
                left: 50,
                top: 50,
                scaleX: 0.7,
                scaleY: 0.7,
                name: 'adjetivacion-tablero'
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
        <div className="chart-modal-overlay" onClick={onClose}>
            <div className="chart-modal-container modal-large" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="chart-modal-title">Tablero de Análisis de Contenido y Mensaje</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body modal-body-scrollable">
                    {/* Tipo de análisis */}
                    <div className="chart-profile-card analysis-type-card">
                        <div className="analysis-type-title">
                            Tipo de análisis: {analysisType.source} - {analysisType.type}
                        </div>
                        <div className="chart-modal-description">
                            {analysisType.description}
                        </div>
                    </div>
                    {/* Perfil */}
                    <div className="chart-profile-card">
                        <h3>Perfil y Mensaje</h3>
                        <div className="chart-form-grid">
                            <div className="chart-form-field">
                                <label className="chart-form-label">Nombre:</label>
                                <input type="text" value={state.profile.name} onChange={e => handleProfileChange('name', e.target.value)} className="chart-form-input" />
                            </div>
                            <div className="chart-form-field">
                                <label className="chart-form-label">Avatar:</label>
                                <input type="file" accept="image/*" onChange={e => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = ev => handleProfileChange('avatar', ev.target.result);
                                    reader.readAsDataURL(file);
                                }} className="chart-form-input" />
                            </div>
                        </div>
                        <div className="chart-form-field">
                            <label className="chart-form-label">Mensaje (Análisis IA):</label>
                            <textarea value={state.message} onChange={handleMessageChange} rows={4} className="chart-form-textarea" placeholder="Análisis estratégico del mensaje..." />
                        </div>
                    </div>
                    {/* Volumen y collage */}
                    <div className="chart-profile-card">
                        <h3>Volumen y Galería</h3>
                        <div className="chart-form-grid-single">
                            <div className="chart-form-field">
                                <label className="chart-form-label">Número de publicaciones:</label>
                                <input type="number" value={state.numPosts} onChange={handleNumPostsChange} className="chart-form-input" />
                            </div>
                        </div>
                        <div className="chart-form-field">
                            <label className="chart-form-label">Imágenes para collage:</label>
                            <input type="file" accept="image/*" multiple onChange={handleCollageUpload} className="chart-form-input" />
                        </div>
                        <div className="flex-wrap-gap-6-mt-8">
                            {state.collage.map((img, idx) => (
                                <div key={idx} className="position-relative">
                                    <img src={img.src} alt="collage" className="collage-thumbnail" />
                                    <button onClick={() => handleRemoveCollage(idx)} className="chart-remove-button delete-button-absolute"><Trash2 size={12} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Radar */}
                    <div className="chart-profile-card">
                        <div className="flex-row-gap-10-mb-8-center mb-12">
                            <h3 style={{ margin: 0 }}>Adjetivación (Tono):</h3>
                            <span className={`badge-total ${state.radar.reduce((a, b) => a + b, 0) === 100 ? 'valid' : 'invalid'}`}>
                                Total: {state.radar.reduce((a, b) => a + b, 0)}%
                            </span>
                        </div>
                        <div className="chart-form-grid-4col">
                            {RADAR_AXES.map((ax, idx) => (
                                <div key={ax} className="chart-form-field">
                                    <label className="chart-form-label text-center">{ax}</label>
                                    <input type="number" min={0} max={100} value={state.radar[idx]} onChange={e => handleRadarChange(idx, e.target.value)} className="chart-form-input" />
                                    <span className="text-center font-size-12">%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Top posts */}
                    <div className="chart-profile-card">
                        <h3>Publicaciones TOP</h3>
                        {/* Primera fila: 3 redes sociales */}
                        <div className="flex-row-gap-18-mt-8-center">
                            {state.topPosts.slice(0, 3).map((post, idx) => {
                                const socialIcon = SOCIAL_ICONS.find(ic => ic.key === post.network);
                                return (
                                    <div key={idx} className="flex-col-gap-6-center">
                                        <div className="flex-row-gap-6-mb-4-center">
                                            {socialIcon && <img src={socialIcon.icon} alt={post.network} className="icon-small" />}
                                            <span className="label-bold-14">{post.network}</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={e => handleTopUpload(idx, e)} className="chart-form-input w-120" />
                                        {post.src && <img src={post.src} alt="top" className="post-preview-image" />}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Segunda fila: 2 redes sociales */}
                        <div className="flex-row-gap-18-mt-12-center">
                            {state.topPosts.slice(3, 5).map((post, idx) => {
                                const actualIdx = idx + 3;
                                const socialIcon = SOCIAL_ICONS.find(ic => ic.key === post.network);
                                return (
                                    <div key={actualIdx} className="flex-col-gap-6-center">
                                        <div className="flex-row-gap-6-mb-4-center">
                                            {socialIcon && <img src={socialIcon.icon} alt={post.network} className="icon-small" />}
                                            <span className="label-bold-14">{post.network}</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={e => handleTopUpload(actualIdx, e)} className="chart-form-input w-120" />
                                        {post.src && <img src={post.src} alt="top" className="post-preview-image" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="chart-modal-buttons">
                    <button className="chart-modal-button-cancel" onClick={onClose}>Cancelar</button>
                    <button className="chart-modal-button-insert" onClick={insertTableroToCanvas}>Insertar Tablero en Canvas</button>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkAdjetivacionTableroModal;
