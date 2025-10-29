import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Image as FabricImage } from 'fabric';

Chart.register(ArcElement, Tooltip, Legend);

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
            youtube: [100, 0, 0, 0, 0, 0, 0, 0],
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
            facebook: [40, 8, 22, 6, 3, 5, 0, 0],
            x: [58, 12, 27, 3, 0, 0, 0, 0],
            instagram: [50, 13, 13, 13, 6, 5, 0, 0],
            tiktok: [50, 13, 13, 13, 6, 5, 0, 0],
            youtube: [50, 13, 13, 13, 6, 5, 0, 0],
        },
    },
];

const DonutChartCell = ({ data, colors, labels, size = 80 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        // Destroy previous chart instance if exists
        if (canvasRef.current._chartInstance) {
            canvasRef.current._chartInstance.destroy();
        }
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderWidth: 0,
                }],
            },
            options: {
                cutout: '65%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
                animation: false,
                responsive: false,
                maintainAspectRatio: false,
            },
        });
        canvasRef.current._chartInstance = chart;
        return () => chart.destroy();
    }, [data, colors, labels]);

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
        const imgCanvas = await html2canvas(node, { backgroundColor: null, scale: 2 });
        const dataURL = imgCanvas.toDataURL('image/png');
        const imgElement = new window.Image();
        imgElement.onload = () => {
            const fabricImg = new FabricImage(imgElement, {
                left: 50,
                top: 50,
                scaleX: 0.8,
                scaleY: 0.8
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
                    <h3 className="modal-title">RRSS Propias: Benchmark de mensaje por contenido posteado</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    {/* Leyenda de categorías */}
                    <div style={{ display: 'flex', gap: 18, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
                        {DONUT_CATEGORIES.map(cat => (
                            <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 16, height: 16, borderRadius: 8, background: cat.color, display: 'inline-block' }}></span>
                                <span style={{ fontSize: 13 }}>{cat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Formulario para agregar personaje */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Nombre del personaje"
                            value={newCharName}
                            onChange={e => setNewCharName(e.target.value)}
                            style={{ width: 180, fontSize: 14, padding: 4, border: '1px solid #ccc', borderRadius: 4 }}
                        />
                        <input
                            type="text"
                            placeholder="URL del avatar (opcional)"
                            value={newCharAvatar}
                            onChange={e => setNewCharAvatar(e.target.value)}
                            style={{ width: 220, fontSize: 14, padding: 4, border: '1px solid #ccc', borderRadius: 4 }}
                        />
                        <button className="btn-primary" type="button" onClick={addCharacter} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Plus size={16} /> Agregar personaje
                        </button>
                    </div>

                    {/* Matriz de donas */}
                    <div ref={previewRef} style={{ background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px #0001', overflow: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ width: 160 }}></div>
                            {SOCIAL_NETWORKS.map(net => (
                                <div key={net.key} style={{ width: 110, textAlign: 'center' }}>
                                    {loadedSocialIcons[net.key] && <img src={net.icon} alt={net.label} style={{ width: 32, height: 32, marginBottom: 2 }} />}
                                    <div style={{ fontWeight: 600, fontSize: 15 }}>{net.label}</div>
                                </div>
                            ))}
                        </div>
                        {characters.map((char, charIdx) => (
                            <div key={charIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                                <div style={{ width: 160, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <img src={char.avatarUrl} alt={char.name} style={{ width: 48, height: 48, borderRadius: 24, objectFit: 'cover', border: '3px solid #b13b2e' }} />
                                    <input
                                        type="text"
                                        value={char.name}
                                        onChange={e => updateCharName(charIdx, e.target.value)}
                                        style={{ fontWeight: 700, fontSize: 16, border: '1px solid #eee', borderRadius: 4, padding: '2px 6px', width: 120 }}
                                    />
                                    <input
                                        type="text"
                                        value={char.avatarUrl}
                                        onChange={e => updateCharAvatar(charIdx, e.target.value)}
                                        style={{ fontSize: 12, border: '1px solid #eee', borderRadius: 4, padding: '2px 6px', width: 120 }}
                                        placeholder="URL avatar"
                                    />
                                    <button type="button" onClick={() => removeCharacter(charIdx)} style={{ background: 'none', border: 'none', color: '#b13b2e', cursor: 'pointer' }} title="Eliminar personaje"><Trash2 size={18} /></button>
                                </div>
                                {SOCIAL_NETWORKS.map((net, netIdx) => (
                                    <div key={net.key} style={{ width: 110, textAlign: 'center', position: 'relative' }}>
                                        <DonutChartCell
                                            data={char.donutData[net.key]}
                                            colors={DONUT_CATEGORIES.map(c => c.color)}
                                            labels={DONUT_CATEGORIES.map(c => c.label)}
                                            size={80}
                                        />
                                        {/* Inputs para editar valores */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                            {DONUT_CATEGORIES.map((cat, catIdx) => (
                                                <input
                                                    key={cat.key}
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    value={char.donutData[net.key][catIdx]}
                                                    onChange={e => updateDonutValue(charIdx, net.key, catIdx, e.target.value)}
                                                    style={{ width: 38, fontSize: 11, margin: '0 auto', border: '1px solid #eee', borderRadius: 3, textAlign: 'center' }}
                                                />
                                            ))}
                                        </div>
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
