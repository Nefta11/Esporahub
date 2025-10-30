import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

// Utiliza la estructura y lógica de BenchmarkAdjetivacionTableroModal y BenchmarkSocialMediaModal como base
// pero adapta los módulos y layout para que se parezca a la imagen de referencia

const initialProfiles = [
    { name: 'Manuel Guerra', avatarUrl: '', tag: 'Morena', message: '', audience: '', posts: '', imageUrl: '' },
    { name: 'Clara Luz', avatarUrl: '', tag: 'Morena', message: '', audience: '', posts: '', imageUrl: '' },
    { name: 'Waldo Fernández', avatarUrl: '', tag: 'Morena', message: '', audience: '', posts: '', imageUrl: '' },
];

const BenchmarkIntegradoTableroModal = ({ isOpen, onClose, canvas, filminaTitle }) => {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [radarData, setRadarData] = useState([5, 6, 7, 8, 7, 6, 5, 4]);
    const [radarLabels, setRadarLabels] = useState([
        'Eficacia', 'Gestión', 'Visibilidad', 'Infraestructura',
        'Seguridad', 'Programas', 'Credibilidad', 'Institucional'
    ]);
    const canvasRef = useRef(null);

    // Dibuja el dashboard en el canvas de preview
    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        const width = 900;
        const height = 420;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        ctx.clearRect(0, 0, width, height);

        // Fondo
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);

        // Radar chart
        drawRadar(ctx, 180, 210, 90, radarData, radarLabels);

        // Perfiles y mensajes
        profiles.forEach((profile, idx) => {
            const y = 40 + idx * 120;
            // Avatar
            ctx.save();
            ctx.beginPath();
            ctx.arc(60, y + 30, 30, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();
            if (profile.avatarUrl) {
                const img = new window.Image();
                img.src = profile.avatarUrl;
                img.onload = () => ctx.drawImage(img, 30, y, 60, 60);
            } else {
                ctx.fillStyle = '#eee';
                ctx.fillRect(30, y, 60, 60);
            }
            ctx.restore();
            // Nombre
            ctx.font = 'bold 15px Arial';
            ctx.fillStyle = '#333';
            ctx.fillText(profile.name, 100, y + 25);
            // Tag
            ctx.font = '12px Arial';
            ctx.fillStyle = '#b71c1c';
            ctx.fillText(profile.tag, 100, y + 45);
        });

        // Mensajes y collage
        profiles.forEach((profile, idx) => {
            const y = 20 + idx * 120;
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(250, y, 600, 100, 18);
            ctx.fillStyle = '#f5f5f5';
            ctx.fill();
            ctx.restore();
            ctx.font = 'bold 17px Arial';
            ctx.fillStyle = '#222';
            ctx.fillText(`Número de publicaciones: ${profile.posts || ''}`, 270, y + 30);
            ctx.font = '14px Arial';
            ctx.fillStyle = '#444';
            ctx.fillText(`Población objetivo: ${profile.audience || ''}`, 270, y + 55);
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#222';
            ctx.fillText('Mensaje central:', 270, y + 75);
            ctx.font = '13px Arial';
            ctx.fillStyle = '#333';
            wrapText(ctx, profile.message, 390, y + 75, 440, 18);
            // Collage imagen
            if (profile.imageUrl) {
                const img = new window.Image();
                img.src = profile.imageUrl;
                img.onload = () => ctx.drawImage(img, 800, y + 10, 80, 80);
            }
        });
    }, [profiles, radarData, radarLabels, isOpen]);

    // Radar chart drawing helper
    function drawRadar(ctx, cx, cy, r, data, labels) {
        const N = data.length;
        ctx.save();
        // Web
        ctx.strokeStyle = '#bbb';
        for (let k = 1; k <= 5; ++k) {
            ctx.beginPath();
            for (let i = 0; i < N; ++i) {
                const angle = (2 * Math.PI * i) / N - Math.PI / 2;
                const x = cx + Math.cos(angle) * (r * k / 5);
                const y = cy + Math.sin(angle) * (r * k / 5);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        // Axes
        ctx.strokeStyle = '#888';
        for (let i = 0; i < N; ++i) {
            const angle = (2 * Math.PI * i) / N - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
            ctx.stroke();
            // Label
            ctx.font = '11px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labels[i], cx + Math.cos(angle) * (r + 22), cy + Math.sin(angle) * (r + 22));
        }
        // Data
        ctx.beginPath();
        for (let i = 0; i < N; ++i) {
            const angle = (2 * Math.PI * i) / N - Math.PI / 2;
            const x = cx + Math.cos(angle) * (r * data[i] / 10);
            const y = cy + Math.sin(angle) * (r * data[i] / 10);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(33, 150, 243, 0.18)';
        ctx.fill();
        ctx.strokeStyle = '#2196f3';
        ctx.stroke();
        ctx.restore();
    }

    // Text wrapping helper
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        if (!text) return;
        const words = text.split(' ');
        let line = '';
        let yy = y;
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, x, yy);
                line = words[n] + ' ';
                yy += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, yy);
    }

    // Handlers para editar perfiles
    const updateProfile = (idx, field, value) => {
        const newProfiles = [...profiles];
        newProfiles[idx][field] = value;
        setProfiles(newProfiles);
    };

    // Exportar al canvas principal
    const insertToCanvas = () => {
        if (!canvas) return;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 900;
        tempCanvas.height = 420;
        const ctx = tempCanvas.getContext('2d');
        drawRadar(ctx, 180, 210, 90, radarData, radarLabels);
        profiles.forEach((profile, idx) => {
            // ...igual que en el preview...
        });
        // Redibujar todo el dashboard
        // (Reutiliza el mismo código que en el useEffect de preview)
        // ...
        // Convertir a imagen y agregar a Fabric.js
        const dataURL = tempCanvas.toDataURL('image/png');
        const imgElement = new window.Image();
        imgElement.onload = () => {
            const fabricImg = new window.fabric.Image(imgElement, {
                left: 40,
                top: 40,
                scaleX: 1,
                scaleY: 1
            });
            canvas.add(fabricImg);
            canvas.setActiveObject(fabricImg);
            canvas.renderAll();
            setTimeout(onClose, 0);
        };
        imgElement.src = dataURL;
    };

    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()} style={{ maxWidth: '1200px', maxHeight: '95vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h3 className="modal-title">Benchmark de mensaje integrado</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <button className="btn-primary" style={{ marginBottom: 16 }} onClick={() => setProfiles([...profiles, { name: '', avatarUrl: '', tag: '', message: '', audience: '', posts: '', imageUrl: '' }])}>
                        <Plus size={16} /> Agregar Perfil
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {profiles.map((profile, idx) => (
                            <div key={idx} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, background: '#fcfcfc' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 40px', gap: 10, alignItems: 'center', marginBottom: '10px' }}>
                                    <input type="text" placeholder="Nombre" value={profile.name} onChange={e => updateProfile(idx, 'name', e.target.value)} className="input-field" />
                                    <input type="text" placeholder="Avatar URL" value={profile.avatarUrl} onChange={e => updateProfile(idx, 'avatarUrl', e.target.value)} className="input-field" />
                                    <input type="text" placeholder="Tag" value={profile.tag} onChange={e => updateProfile(idx, 'tag', e.target.value)} className="input-field" />
                                    <input type="text" placeholder="Imagen URL" value={profile.imageUrl} onChange={e => updateProfile(idx, 'imageUrl', e.target.value)} className="input-field" />
                                    <button className="btn-danger btn-icon" onClick={() => setProfiles(profiles.filter((_, i) => i !== idx))} disabled={profiles.length <= 1}><Trash2 size={16} /></button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 8 }}>
                                    <input type="text" placeholder="Población objetivo" value={profile.audience} onChange={e => updateProfile(idx, 'audience', e.target.value)} className="input-field" />
                                    <input type="text" placeholder="N° publicaciones" value={profile.posts} onChange={e => updateProfile(idx, 'posts', e.target.value)} className="input-field" />
                                </div>
                                <textarea placeholder="Mensaje central" value={profile.message} onChange={e => updateProfile(idx, 'message', e.target.value)} className="input-field" style={{ width: '100%', minHeight: 40 }} />
                            </div>
                        ))}
                    </div>
                    <div className="chart-preview" style={{ marginTop: '20px' }}>
                        <h4>Vista Previa</h4>
                        <div className="preview-container" style={{ maxHeight: '420px', overflow: 'auto', background: '#f4f4f4', border: '1px solid #ccc' }}>
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
