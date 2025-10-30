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

const initialState = {
    profile: {
        name: 'Manuel Guerra',
        avatar: '',
    },
    message: '',
    totalReach: '1.2M',
    totalEngagement: '850K',
    demographics: {
        gender: [
            { label: 'Masculino', value: 52 },
            { label: 'Femenino', value: 48 },
        ],
        age: [
            { label: '18-24', value: 25 },
            { label: '25-34', value: 35 },
            { label: '35-44', value: 22 },
            { label: '45+', value: 18 },
        ],
        location: [
            { label: 'México', value: 45 },
            { label: 'USA', value: 30 },
            { label: 'España', value: 15 },
            { label: 'Otros', value: 10 },
        ],
    },
    topPosts: [
        { src: '', network: 'facebook' },
        { src: '', network: 'instagram' },
        { src: '', network: 'tiktok' },
        { src: '', network: 'x' },
        { src: '', network: 'youtube' },
    ],
};

const BenchmarkAudienciaTableroModal = ({ isOpen, onClose, canvas, filminaTitle }) => {
    const [state, setState] = useState(initialState);
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
    const handleReachChange = e => setState(s => ({ ...s, totalReach: e.target.value }));
    const handleEngagementChange = e => setState(s => ({ ...s, totalEngagement: e.target.value }));

    const handleDemographicChange = (category, index, value) => {
        const newValue = Math.max(0, Math.min(100, Number(value) || 0));
        const demographics = { ...state.demographics };
        demographics[category][index].value = newValue;

        // Ajustar automáticamente para que sume 100%
        const sum = demographics[category].reduce((acc, item) => acc + item.value, 0);
        if (sum > 100) {
            const excess = sum - 100;
            const otherIndices = demographics[category].map((_, i) => i).filter(i => i !== index);
            const otherSum = otherIndices.reduce((acc, i) => acc + demographics[category][i].value, 0);

            if (otherSum > 0) {
                otherIndices.forEach(i => {
                    const proportion = demographics[category][i].value / otherSum;
                    demographics[category][i].value = Math.max(0, Math.round(demographics[category][i].value - (excess * proportion)));
                });
            } else {
                demographics[category][index].value = 100;
            }
        }

        setState(s => ({ ...s, demographics }));
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

        const width = 1200, height = 700;
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

        // Métricas y Demographics
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(400, 40, 760, 260, 30);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText('Alcance Total: ' + state.totalReach, 420, 70);
        ctx.fillText('Engagement Total: ' + state.totalEngagement, 420, 100);

        // Tipo de análisis
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#1967D2';
        ctx.fillText(`Tipo: ${analysisType.source} - ${analysisType.type}`, 420, 130);
        ctx.font = '13px Arial';
        ctx.fillStyle = '#555';
        wrapText(analysisType.description, 420, 150, 500, 18);

        // Demographics - Gender
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText('Género:', 420, 190);
        ctx.font = '12px Arial';
        state.demographics.gender.forEach((item, i) => {
            ctx.fillText(`${item.label}: ${item.value}%`, 420, 210 + i * 20);
        });

        // Demographics - Age
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Edad:', 600, 190);
        ctx.font = '12px Arial';
        state.demographics.age.forEach((item, i) => {
            ctx.fillText(`${item.label}: ${item.value}%`, 600, 210 + i * 20);
        });

        // Demographics - Location
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Ubicación:', 780, 190);
        ctx.font = '12px Arial';
        state.demographics.location.forEach((item, i) => {
            ctx.fillText(`${item.label}: ${item.value}%`, 780, 210 + i * 20);
        });

        ctx.restore();

        // Contenidos TOP
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(40, 320, 1120, 350, 30);
        ctx.fill();
        ctx.stroke();
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText('Publicaciones con Mayor Alcance:', 60, 355);

        // Top posts
        state.topPosts.forEach((post, i) => {
            if (topPostImgs[i]) {
                ctx.drawImage(topPostImgs[i], 70 + i * 220, 390, 180, 200);
            } else {
                ctx.fillStyle = '#e0e0e0';
                ctx.fillRect(70 + i * 220, 390, 180, 200);
                ctx.font = 'bold 18px Arial';
                ctx.fillStyle = '#888';
                ctx.textAlign = 'center';
                ctx.fillText('Sin Publicación', 160 + i * 220, 490);
            }

            // Icono red
            const iconIndex = SOCIAL_ICONS.findIndex(ic => ic.key === post.network);
            if (iconIndex >= 0 && socialIconImgs[iconIndex]) {
                ctx.drawImage(socialIconImgs[iconIndex], 150 + i * 220, 605, 32, 32);
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

    const getTotalPercentage = (category) => {
        return state.demographics[category].reduce((acc, item) => acc + item.value, 0);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()} style={{ maxWidth: 1300, maxHeight: '98vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h3 className="modal-title">Tablero de Análisis de Audiencia</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
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

                    {/* Métricas */}
                    <div style={{ marginBottom: 18 }}>
                        <label>Alcance Total:</label>
                        <input type="text" value={state.totalReach} onChange={handleReachChange} style={{ width: 120, marginRight: 20 }} placeholder="1.2M" />
                        <label>Engagement Total:</label>
                        <input type="text" value={state.totalEngagement} onChange={handleEngagementChange} style={{ width: 120 }} placeholder="850K" />
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
                                    color: getTotalPercentage('gender') === 100 ? '#059669' : '#dc2626',
                                    backgroundColor: getTotalPercentage('gender') === 100 ? '#d1fae5' : '#fee2e2',
                                    padding: '4px 12px',
                                    borderRadius: 6
                                }}>
                                    Total: {getTotalPercentage('gender')}%
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {state.demographics.gender.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: 13 }}>{item.label}</span>
                                        <input type="number" min={0} max={100} value={item.value} onChange={e => handleDemographicChange('gender', idx, e.target.value)} style={{ width: 60 }} />
                                        <span>%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Edad */}
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <label>Edad:</label>
                                <span style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: getTotalPercentage('age') === 100 ? '#059669' : '#dc2626',
                                    backgroundColor: getTotalPercentage('age') === 100 ? '#d1fae5' : '#fee2e2',
                                    padding: '4px 12px',
                                    borderRadius: 6
                                }}>
                                    Total: {getTotalPercentage('age')}%
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {state.demographics.age.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: 13 }}>{item.label}</span>
                                        <input type="number" min={0} max={100} value={item.value} onChange={e => handleDemographicChange('age', idx, e.target.value)} style={{ width: 60 }} />
                                        <span>%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ubicación */}
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <label>Ubicación:</label>
                                <span style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: getTotalPercentage('location') === 100 ? '#059669' : '#dc2626',
                                    backgroundColor: getTotalPercentage('location') === 100 ? '#d1fae5' : '#fee2e2',
                                    padding: '4px 12px',
                                    borderRadius: 6
                                }}>
                                    Total: {getTotalPercentage('location')}%
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {state.demographics.location.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: 13 }}>{item.label}</span>
                                        <input type="number" min={0} max={100} value={item.value} onChange={e => handleDemographicChange('location', idx, e.target.value)} style={{ width: 60 }} />
                                        <span>%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top posts */}
                    <div style={{ marginBottom: 18 }}>
                        <label>Publicaciones con Mayor Alcance:</label>
                        <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
                            {state.topPosts.map((post, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <input type="file" accept="image/*" onChange={e => handleTopUpload(idx, e)} />
                                    <select value={post.network} onChange={e => handleTopNetworkChange(idx, e.target.value)}>
                                        {SOCIAL_ICONS.map(ic => (
                                            <option key={ic.key} value={ic.key}>{ic.key.charAt(0).toUpperCase() + ic.key.slice(1)}</option>
                                        ))}
                                    </select>
                                    {post.src && <img src={post.src} alt="top" style={{ width: 80, height: 90, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }} />}
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

export default BenchmarkAudienciaTableroModal;
