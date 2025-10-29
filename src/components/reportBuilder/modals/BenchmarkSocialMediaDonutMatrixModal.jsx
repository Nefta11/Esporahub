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

const SOCIAL_NETWORKS = [
    { key: 'facebook', label: 'Facebook', icon: 'https://cdn.simpleicons.org/facebook/1877F2' },
    { key: 'x', label: 'X', icon: 'https://cdn.simpleicons.org/x/000000' },
    { key: 'instagram', label: 'Instagram', icon: 'https://cdn.simpleicons.org/instagram/E4405F' },
    { key: 'tiktok', label: 'TikTok', icon: 'https://cdn.simpleicons.org/tiktok/000000' },
    { key: 'youtube', label: 'YouTube', icon: 'https://cdn.simpleicons.org/youtube/FF0000' },
];

const initialCharacters = [
    {
        name: 'Manuel Guerra',
        avatarUrl: 'https://placehold.co/100x100/EBF4FF/333333?text=MG',
        donutData: {
            facebook: [31, 15, 20, 18, 12, 6, 0, 0],
            x: [50, 0, 0, 0, 50, 0, 0, 0],
            instagram: [31, 28, 17, 16, 5, 4, 0, 0],
            tiktok: [71, 20, 2, 7, 0, 0, 0, 0],
            youtube: [0, 0, 0, 0, 0, 0, 0, 0],
        },
    },
    {
        name: 'Manuel Guerra Flores',
        avatarUrl: 'https://placehold.co/100x100/FFEBEB/333333?text=MF',
        donutData: {
            facebook: [17, 19, 22, 22, 4, 17, 0, 0],
            x: [7, 22, 37, 19, 7, 7, 0, 0],
            instagram: [17, 17, 12, 24, 16, 14, 0, 0],
            tiktok: [50, 43, 0, 7, 0, 0, 0, 0],
            youtube: [100, 0, 0, 0, 0, 0, 0, 0],
        },
    },
    {
        name: 'Waldo Fernández',
        avatarUrl: 'https://placehold.co/100x100/EBFFF5/333333?text=WF',
        donutData: {
            facebook: [40, 8, 22, 3, 7, 10, 6, 5],
            x: [58, 0, 12, 0, 23, 0, 8, 0],
            instagram: [9, 16, 27, 17, 12, 2, 4, 13],
            tiktok: [0, 50, 6, 0, 19, 0, 13, 13],
            youtube: [0, 0, 13, 0, 50, 0, 19, 13],
        },
    },
];

const DonutChartCell = ({ data, colors, labels, size = 140 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Limpiar canvas
        ctx.clearRect(0, 0, size, size);

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.28;
        const innerRadius = radius * 0.55;

        // Calcular total y filtrar valores no-cero
        const total = data.reduce((sum, val) => sum + val, 0);
        if (total === 0) {
            // Dibujar círculo gris si no hay datos
            ctx.fillStyle = '#d0d0d0';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#888';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Sin', centerX, centerY - 6);
            ctx.fillText('contenido', centerX, centerY + 6);
            return;
        }

        let currentAngle = -Math.PI / 2; // Empezar arriba

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
            const labelRadius = radius + 22;
            const labelX = centerX + Math.cos(middleAngle) * labelRadius;
            const labelY = centerY + Math.sin(middleAngle) * labelRadius;

            // Dibujar porcentaje
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${value}%`, labelX, labelY);

            currentAngle = endAngle;
        });

    }, [data, colors, labels, size]);

    return <canvas ref={canvasRef} width={size} height={size} style={{ width: size, height: size }} />;
};

const BenchmarkSocialMediaDonutMatrixModal = ({ isOpen, onClose, canvas }) => {
    const [characters, setCharacters] = useState(initialCharacters);
    const [newCharName, setNewCharName] = useState("");
    const [newCharAvatar, setNewCharAvatar] = useState("");
    const [loadedSocialIcons, setLoadedSocialIcons] = useState({});
    const [loadedAvatars, setLoadedAvatars] = useState({});
    const previewRef = useRef(null);

    // Cargar íconos de redes sociales
    useEffect(() => {
        const loadIcons = async () => {
            const iconPromises = SOCIAL_NETWORKS.map(network =>
                new Promise(resolve => {
                    const img = new window.Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => resolve({ key: network.key, img });
                    img.onerror = () => resolve({ key: network.key, img: null });
                    img.src = network.icon;
                })
            );
            const results = await Promise.all(iconPromises);
            const iconsMap = results.reduce((acc, { key, img }) => {
                if (img) acc[key] = img;
                return acc;
            }, {});
            setLoadedSocialIcons(iconsMap);
        };
        loadIcons();
    }, []);

    // Cargar avatares
    useEffect(() => {
        const loadAvatars = async () => {
            const avatarPromises = characters
                .map(char => char.avatarUrl)
                .filter(Boolean)
                .map(url =>
                    new Promise(resolve => {
                        const img = new window.Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => resolve({ url, img });
                        img.onerror = () => resolve({ url, img: null });
                        img.src = url;
                    })
                );
            const results = await Promise.all(avatarPromises);
            const avatarsMap = results.reduce((acc, { url, img }) => {
                if (img) acc[url] = img;
                return acc;
            }, {});
            setLoadedAvatars(prev => ({ ...prev, ...avatarsMap }));
        };
        if (characters.length > 0) loadAvatars();
    }, [characters]);

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
        const node = previewRef.current;
        // Renderizar la vista previa a imagen usando html2canvas
        const html2canvas = (await import('html2canvas')).default;
        const imgCanvas = await html2canvas(node, { backgroundColor: '#ffffff', scale: 2 });
        const dataURL = imgCanvas.toDataURL('image/png');
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
            setTimeout(onClose, 0);
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
                    {/* Leyenda de categorías */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', background: '#f8f8f8', padding: '12px 16px', borderRadius: 8 }}>
                        {DONUT_CATEGORIES.map(cat => (
                            <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 18, height: 18, borderRadius: 4, background: cat.color, display: 'inline-block' }}></span>
                                <span style={{ fontSize: 13, fontWeight: 500 }}>{cat.label}</span>
                            </div>
                        ))}
                    </div>

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

                    {/* Matriz de donas */}
                    <div ref={previewRef} style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                        {/* Header con íconos de redes sociales */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '2px solid #e0e0e0' }}>
                            <div style={{ width: 200 }}></div>
                            {SOCIAL_NETWORKS.map(net => (
                                <div key={net.key} style={{ width: 150, textAlign: 'center' }}>
                                    {loadedSocialIcons[net.key] && <img src={net.icon} alt={net.label} style={{ width: 40, height: 40, marginBottom: 6 }} />}
                                    <div style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>{net.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Filas de personajes */}
                        {characters.map((char, charIdx) => (
                            <div key={charIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 30, paddingBottom: 20, borderBottom: charIdx < characters.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                {/* Columna de personaje */}
                                <div style={{ width: 200, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={char.avatarUrl}
                                            alt={char.name}
                                            style={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '4px solid #b13b2e',
                                                background: '#fff'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeCharacter(charIdx)}
                                            style={{
                                                position: 'absolute',
                                                bottom: -4,
                                                right: -4,
                                                background: '#b13b2e',
                                                border: 'none',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 11,
                                                fontWeight: 'bold'
                                            }}
                                            title="Eliminar personaje"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            value={char.name}
                                            onChange={e => updateCharName(charIdx, e.target.value)}
                                            style={{
                                                fontWeight: 700,
                                                fontSize: 15,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 6,
                                                padding: '4px 8px',
                                                width: '100%',
                                                marginBottom: 4
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={char.avatarUrl}
                                            onChange={e => updateCharAvatar(charIdx, e.target.value)}
                                            style={{
                                                fontSize: 11,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 6,
                                                padding: '3px 6px',
                                                width: '100%',
                                                color: '#666'
                                            }}
                                            placeholder="URL avatar"
                                        />
                                    </div>
                                </div>

                                {/* Columnas de redes sociales con donas */}
                                {SOCIAL_NETWORKS.map((net) => (
                                    <div key={net.key} style={{ width: 150, textAlign: 'center', position: 'relative' }}>
                                        <DonutChartCell
                                            data={char.donutData[net.key]}
                                            colors={DONUT_CATEGORIES.map(c => c.color)}
                                            labels={DONUT_CATEGORIES.map(c => c.label)}
                                            size={140}
                                        />
                                        {/* Inputs para editar valores (ocultos en vista previa, visibles solo en edición) */}
                                        <details style={{ marginTop: 8 }}>
                                            <summary style={{ fontSize: 11, color: '#666', cursor: 'pointer', userSelect: 'none' }}>Editar valores</summary>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginTop: 6 }}>
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
                                                            border: '1px solid #ddd',
                                                            borderRadius: 4,
                                                            textAlign: 'center',
                                                            padding: '2px'
                                                        }}
                                                        title={cat.label}
                                                    />
                                                ))}
                                            </div>
                                        </details>
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