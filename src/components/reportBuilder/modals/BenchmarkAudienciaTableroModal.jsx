import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Image as FabricImage } from 'fabric';

const SOCIAL_ICONS = [
    { key: 'facebook', icon: 'https://cdn.simpleicons.org/facebook/1877F2' },
    { key: 'instagram', icon: 'https://cdn.simpleicons.org/instagram/E4405F' },
    { key: 'tiktok', icon: 'https://cdn.simpleicons.org/tiktok/000000' },
    { key: 'x', icon: 'https://cdn.simpleicons.org/x/000000' },
    { key: 'youtube', icon: 'https://cdn.simpleicons.org/youtube/FF0000' },
];

const DEMOGRAPHIC_CATEGORIES = [
    'Género',
    'Edad',
    'Ubicación',
    'Intereses',
];

const RADAR_AXES_AGE = [
    '18-24',
    '25-34',
    '35-44',
    '45+',
];

const initialState = {
    profile: {
        name: 'Personaje 1',
        avatar: '',
    },
    message: '',
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

const BenchmarkAudienciaTableroModal = ({ isOpen, onClose, canvas, filminaTitle }) => {
    const [state, setState] = useState(initialState);
    const [collageFiles, setCollageFiles] = useState([]);
    const [topFiles, setTopFiles] = useState([null, null, null, null, null]);

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

    // Handlers
    const handleProfileChange = (field, value) => {
        setState(s => ({ ...s, profile: { ...s.profile, [field]: value } }));
    };
    const handleMessageChange = e => setState(s => ({ ...s, message: e.target.value }));
    const handleNumPostsChange = e => setState(s => ({ ...s, numPosts: Number(e.target.value) }));

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

    const handleGenderChange = (index, value) => {
        const newValue = Math.max(0, Math.min(100, Number(value) || 0));
        const gender = [...state.demographics.gender];
        gender[index].value = newValue;

        // Ajustar automáticamente para que sume 100%
        const sum = gender.reduce((acc, item) => acc + item.value, 0);
        if (sum > 100) {
            const excess = sum - 100;
            const otherIndex = index === 0 ? 1 : 0;
            gender[otherIndex].value = Math.max(0, gender[otherIndex].value - excess);
        }

        setState(s => ({ ...s, demographics: { ...s.demographics, gender } }));
    };

    const handleAgeChange = (idx, value) => {
        const newValue = Math.max(0, Math.min(100, Number(value) || 0));
        const age = [...state.demographics.age];
        age[idx] = newValue;

        // Calcular la suma
        const sum = age.reduce((acc, val) => acc + val, 0);

        // Ajustar si excede 100%
        if (sum > 100) {
            const excess = sum - 100;
            const otherIndices = age.map((_, i) => i).filter(i => i !== idx);
            const otherSum = otherIndices.reduce((acc, i) => acc + age[i], 0);

            if (otherSum > 0) {
                otherIndices.forEach(i => {
                    const proportion = age[i] / otherSum;
                    age[i] = Math.max(0, Math.round(age[i] - (excess * proportion)));
                });
            } else {
                age[idx] = 100;
            }
        }

        setState(s => ({ ...s, demographics: { ...s.demographics, age } }));
    };

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

        const width = 1200, height = 720;
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

        // Dibujar
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
        wrapText(state.message || 'Análisis de audiencia y alcance', 55, 230, 290, 20);
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

        // Tipo de análisis
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#1967D2';
        ctx.fillText(`Tipo: ${analysisType.source} - ${analysisType.type}`, 420, 95);
        ctx.font = '13px Arial';
        ctx.fillStyle = '#555';
        wrapText(analysisType.description, 420, 115, 500, 18);

        // Collage - con más espacio
        const collageX = 420, collageY = 155, imgSize = 60, gap = 8;
        collageImgs.forEach((img, i) => {
            if (img) {
                ctx.drawImage(img, collageX + (i % 6) * (imgSize + gap), collageY + Math.floor(i / 6) * (imgSize + gap), imgSize, imgSize);
            }
        });

        // Demographics - Gender (separado del radar)
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText('Género:', 950, 70);
        ctx.font = '14px Arial';
        state.demographics.gender.forEach((item, i) => {
            ctx.fillText(`${item.label}: ${item.value}%`, 950, 95 + i * 22);
        });

        // Radar de Edad - más abajo para no encimarse
        drawRadar(ctx, 1000, 230, 70, state.demographics.age, RADAR_AXES_AGE);
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

        // Top posts
        state.topPosts.forEach((post, i) => {
            if (topPostImgs[i]) {
                ctx.drawImage(topPostImgs[i], 70 + i * 220, 410, 180, 200);
            } else {
                ctx.fillStyle = '#e0e0e0';
                ctx.fillRect(70 + i * 220, 410, 180, 200);
                ctx.font = 'bold 18px Arial';
                ctx.fillStyle = '#888';
                ctx.textAlign = 'center';
                ctx.fillText('Sin Publicación', 160 + i * 220, 510);
            }

            // Icono red
            const iconIndex = SOCIAL_ICONS.findIndex(ic => ic.key === post.network);
            if (iconIndex >= 0 && socialIconImgs[iconIndex]) {
                ctx.drawImage(socialIconImgs[iconIndex], 150 + i * 220, 625, 32, 32);
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
                name: 'audiencia-tablero'
            });
            canvas.add(fabricImg);
            canvas.setActiveObject(fabricImg);
            canvas.renderAll();
            onClose();
        };
        imgElement.src = dataURL;
    };

    if (!isOpen) return null;

    const getTotalGender = () => {
        return state.demographics.gender.reduce((acc, item) => acc + item.value, 0);
    };

    const getTotalAge = () => {
        return state.demographics.age.reduce((acc, val) => acc + val, 0);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()} style={{ maxWidth: 1300, maxHeight: '98vh', overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div className="modal-header">
                    <h3 className="modal-title">Tablero de Análisis de Audiencia</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body" style={{ overflowY: 'auto', maxHeight: 'calc(98vh - 140px)', paddingRight: '10px' }}>
                    {/* Tipo de análisis */}
                    <div style={{ backgroundColor: '#f0f9ff', border: '2px solid #1967D2', borderRadius: 8, padding: 12, marginBottom: 18 }}>
                        <div style={{ fontWeight: 'bold', fontSize: 16, color: '#1967D2', marginBottom: 4 }}>
                            Tipo de análisis: {analysisType.source} - {analysisType.type}
                        </div>
                        <div style={{ fontSize: 13, color: '#555' }}>
                            {analysisType.description}
                        </div>
                    </div>

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
                            <label>Insights de Audiencia:</label>
                            <textarea value={state.message} onChange={handleMessageChange} rows={4} style={{ width: '100%' }} placeholder="Análisis de audiencia y comportamiento..." />
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

                    {/* Demographics */}
                    <div style={{ marginBottom: 18 }}>
                        <h4>Demografía de Audiencia:</h4>

                        {/* Género */}
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <label>Género:</label>
                                <span style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: getTotalGender() === 100 ? '#059669' : '#dc2626',
                                    backgroundColor: getTotalGender() === 100 ? '#d1fae5' : '#fee2e2',
                                    padding: '4px 12px',
                                    borderRadius: 6
                                }}>
                                    Total: {getTotalGender()}%
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {state.demographics.gender.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: 13 }}>{item.label}</span>
                                        <input type="number" min={0} max={100} value={item.value} onChange={e => handleGenderChange(idx, e.target.value)} style={{ width: 60 }} />
                                        <span>%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Edad (Radar) */}
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <label>Edad (se graficará en radar):</label>
                                <span style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: getTotalAge() === 100 ? '#059669' : '#dc2626',
                                    backgroundColor: getTotalAge() === 100 ? '#d1fae5' : '#fee2e2',
                                    padding: '4px 12px',
                                    borderRadius: 6
                                }}>
                                    Total: {getTotalAge()}%
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {RADAR_AXES_AGE.map((ax, idx) => (
                                    <div key={ax} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: 13 }}>{ax}</span>
                                        <input type="number" min={0} max={100} value={state.demographics.age[idx]} onChange={e => handleAgeChange(idx, e.target.value)} style={{ width: 60 }} />
                                        <span>%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top posts */}
                    <div style={{ marginBottom: 18 }}>
                        <label>Publicaciones con Mayor Alcance:</label>
                        {/* Primera fila: 3 redes sociales */}
                        <div style={{ display: 'flex', gap: 18, marginTop: 8, justifyContent: 'center' }}>
                            {state.topPosts.slice(0, 3).map((post, idx) => {
                                const socialIcon = SOCIAL_ICONS.find(ic => ic.key === post.network);
                                return (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                            {socialIcon && <img src={socialIcon.icon} alt={post.network} style={{ width: 20, height: 20 }} />}
                                            <span style={{ fontWeight: 'bold', fontSize: 14, textTransform: 'capitalize' }}>{post.network}</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={e => handleTopUpload(idx, e)} />
                                        {post.src && <img src={post.src} alt="top" style={{ width: 100, height: 110, objectFit: 'cover', borderRadius: 4, border: '2px solid #ccc' }} />}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Segunda fila: 2 redes sociales */}
                        <div style={{ display: 'flex', gap: 18, marginTop: 12, justifyContent: 'center' }}>
                            {state.topPosts.slice(3, 5).map((post, idx) => {
                                const actualIdx = idx + 3;
                                const socialIcon = SOCIAL_ICONS.find(ic => ic.key === post.network);
                                return (
                                    <div key={actualIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                            {socialIcon && <img src={socialIcon.icon} alt={post.network} style={{ width: 20, height: 20 }} />}
                                            <span style={{ fontWeight: 'bold', fontSize: 14, textTransform: 'capitalize' }}>{post.network}</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={e => handleTopUpload(actualIdx, e)} />
                                        {post.src && <img src={post.src} alt="top" style={{ width: 100, height: 110, objectFit: 'cover', borderRadius: 4, border: '2px solid #ccc' }} />}
                                    </div>
                                );
                            })}
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

export default BenchmarkAudienciaTableroModal;
