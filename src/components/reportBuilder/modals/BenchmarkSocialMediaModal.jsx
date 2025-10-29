import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
// La siguiente línea se elimina porque "fabric" no se puede resolver como un módulo
// import { Image as FabricImage } from 'fabric';

// Constantes de redes sociales
const SOCIAL_NETWORKS = [
    { key: 'facebook', label: 'Facebook', icon: 'https://cdn.simpleicons.org/facebook/1877F2' },
    { key: 'x', label: 'X', icon: 'https://cdn.simpleicons.org/x/000000' },
    { key: 'instagram', label: 'Instagram', icon: 'https://cdn.simpleicons.org/instagram/E4405F' },
    { key: 'tiktok', label: 'TikTok', icon: 'https://cdn.simpleicons.org/tiktok/000000' },
    { key: 'youtube', label: 'YouTube', icon: 'https://cdn.simpleicons.org/youtube/FF0000' },
];

// Datos iniciales de ejemplo
const initialCharacters = [
    {
        name: 'Manuel Guerra',
        avatarUrl: 'https://placehold.co/100x100/EBF4FF/333333?text=MG',
        facebook: { followers: '318.6K', posts: '155' },
        x: { followers: '1.3K', posts: '2' },
        instagram: { followers: '55.3K', posts: '103' },
        tiktok: { followers: '486.6K', posts: '41' },
        youtube: { followers: '406', posts: '0' },
    },
    {
        name: 'Manuel Guerra Flores',
        avatarUrl: 'https://placehold.co/100x100/FFEBEB/333333?text=MF',
        facebook: { followers: '595K', posts: '54' },
        x: { followers: '49K', posts: '27' },
        instagram: { followers: '33.2K', posts: '41' },
        tiktok: { followers: '11.8K', posts: '14' },
        youtube: { followers: '1.5K', posts: '1' },
    },
    {
        name: 'Waldo Fernandez',
        avatarUrl: 'https://placehold.co/100x100/EBFFF5/333333?text=WF',
        facebook: { followers: '1.4M', posts: '218' },
        x: { followers: '16.3K', posts: '26' },
        instagram: { followers: '19.3K', posts: '121' },
        tiktok: { followers: '149.6K', posts: '16' },
        youtube: { followers: '102K', posts: '32' },
    },
];

// Función para cargar una imagen
const loadImage = (src) => {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null); // Resuelve null si falla
        img.src = src;
    });
};

const BenchmarkSocialMediaModal = ({ isOpen, onClose, canvas }) => {
    const [characters, setCharacters] = useState(initialCharacters);
    const [loadedSocialIcons, setLoadedSocialIcons] = useState({});
    const [loadedAvatars, setLoadedAvatars] = useState({});
    const canvasRef = useRef(null);

    // Cargar íconos de redes sociales (una sola vez)
    useEffect(() => {
        const loadIcons = async () => {
            const iconPromises = SOCIAL_NETWORKS.map(network =>
                loadImage(network.icon).then(img => ({ key: network.key, img }))
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

    // Cargar avatares de personajes (cada vez que 'characters' cambia)
    useEffect(() => {
        const loadAvatars = async () => {
            const avatarPromises = characters
                .map(char => char.avatarUrl)
                .filter(Boolean) // Filtrar URLs vacías
                .map(url =>
                    loadImage(url).then(img => ({ url, img }))
                );

            const results = await Promise.all(avatarPromises);
            const avatarsMap = results.reduce((acc, { url, img }) => {
                if (img) acc[url] = img;
                return acc;
            }, {});
            setLoadedAvatars(prevAvatars => ({ ...prevAvatars, ...avatarsMap }));
        };
        if (characters.length > 0) {
            loadAvatars();
        }
    }, [characters]);

    // Función de Dibujo Principal
    const drawTable = (ctx, canvasWidth, canvasHeight, isPreview) => {
        // --- 1. Configuración de Layout ---
        const fontSize = isPreview ? 10 : 12;
        const fontBold = `bold ${fontSize + 2}px Arial`;
        const fontRegular = `${fontSize}px Arial`;
        ctx.textBaseline = 'middle';

        const TOP_HEADER_H = 40;
        const SUB_HEADER_H = 30;
        const ROW_H = 60;
        const ROW_NUM_W = 40;
        const PERSONAJE_W = 180;
        const DATA_SUB_W = 70;
        const DATA_COL_W = DATA_SUB_W * 2;
        const AVATAR_SIZE = 40;

        // --- 2. Limpiar Canvas ---
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        let currentY = 0;
        let currentX = 0;

        // --- 3. Dibujar Encabezado Superior (Iconos y nombres, bien alineados y sin encimar) ---
        currentX = ROW_NUM_W + PERSONAJE_W;
        const iconHeaderY = 10;
        const textHeaderY = 34;
        SOCIAL_NETWORKS.forEach((network) => {
            const icon = loadedSocialIcons[network.key];
            const colSpan = DATA_COL_W;
            const iconWidth = 28;
            const iconHeight = 28;
            // Centrar ícono
            if (icon) {
                ctx.drawImage(icon, currentX + colSpan / 2 - iconWidth / 2, iconHeaderY, iconWidth, iconHeight);
            }
            // Centrar texto debajo del ícono
            ctx.fillStyle = '#222';
            ctx.font = fontBold;
            ctx.textAlign = 'center';
            ctx.fillText(network.label, currentX + colSpan / 2, textHeaderY);
            currentX += DATA_COL_W;
        });
        currentY += TOP_HEADER_H;

        // --- 4. Dibujar Sub-Encabezado (Seguidores, Publicaciones) ---
        ctx.fillStyle = '#f0f0f0'; // Fondo gris claro para sub-encabezado
        ctx.fillRect(0, currentY, canvasWidth, SUB_HEADER_H);
        ctx.fillStyle = '#555';
        ctx.font = fontBold;

        ctx.textAlign = 'center';
        ctx.fillText('Personaje', ROW_NUM_W + PERSONAJE_W / 2, currentY + SUB_HEADER_H / 2);

        currentX = ROW_NUM_W + PERSONAJE_W;
        SOCIAL_NETWORKS.forEach(() => {
            ctx.fillText('Seguidores', currentX + DATA_SUB_W / 2, currentY + SUB_HEADER_H / 2);
            ctx.fillText('No Publicaciones', currentX + DATA_SUB_W + DATA_SUB_W / 2, currentY + SUB_HEADER_H / 2);
            currentX += DATA_COL_W;
        });
        currentY += SUB_HEADER_H;

        // --- 5. Dibujar Filas de Personajes ---
        characters.forEach((char, index) => {
            const rowCenterY = currentY + ROW_H / 2;
            
            // Fondo de fila alterno
            ctx.fillStyle = (index % 2 === 0) ? '#ffffff' : '#f9f9f9';
            ctx.fillRect(0, currentY, canvasWidth, ROW_H);

            // 5a. Número de Fila
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(ROW_NUM_W / 2, rowCenterY, 12, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = fontBold;
            ctx.textAlign = 'center';
            ctx.fillText(index + 1, ROW_NUM_W / 2, rowCenterY);

            // 5b. Personaje (Avatar y Nombre)
            const avatarX = ROW_NUM_W + 15;
            const avatarY = rowCenterY - AVATAR_SIZE / 2;
            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX + AVATAR_SIZE / 2, avatarY + AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, 2 * Math.PI);
            ctx.clip();
            const avatarImg = loadedAvatars[char.avatarUrl];
            if (avatarImg) {
                ctx.drawImage(avatarImg, avatarX, avatarY, AVATAR_SIZE, AVATAR_SIZE);
            } else {
                ctx.fillStyle = '#eee';
                ctx.fillRect(avatarX, avatarY, AVATAR_SIZE, AVATAR_SIZE);
            }
            ctx.restore();
            
            ctx.fillStyle = '#333';
            ctx.font = fontBold;
            ctx.textAlign = 'left';
            ctx.fillText(char.name, avatarX + AVATAR_SIZE + 10, rowCenterY);

            // 5c. Datos de Redes Sociales
            currentX = ROW_NUM_W + PERSONAJE_W;
            ctx.font = fontRegular;
            ctx.textAlign = 'center';
            SOCIAL_NETWORKS.forEach((network) => {
                const data = char[network.key];
                ctx.fillStyle = '#333';
                ctx.fillText(data?.followers || '-', currentX + DATA_SUB_W / 2, rowCenterY);
                ctx.fillStyle = '#777';
                ctx.fillText(data?.posts || '-', currentX + DATA_SUB_W + DATA_SUB_W / 2, rowCenterY);
                currentX += DATA_COL_W;
            });

            currentY += ROW_H;
        });
    };

    // Actualizar Vista Previa
    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            
            // Definir dimensiones
            const TOP_HEADER_H = 40;
            const SUB_HEADER_H = 30;
            const ROW_H = 60;
            const ROW_NUM_W = 40;
            const PERSONAJE_W = 180;
            const DATA_COL_W = 140; // 70 * 2
            
            const totalWidth = ROW_NUM_W + PERSONAJE_W + (SOCIAL_NETWORKS.length * DATA_COL_W);
            const totalHeight = TOP_HEADER_H + SUB_HEADER_H + (characters.length * ROW_H);

            // Ajustar tamaño del canvas
            canvas.width = totalWidth;
            canvas.height = totalHeight;

            const ctx = canvas.getContext('2d');
            drawTable(ctx, totalWidth, totalHeight, true);
        }
    }, [characters, isOpen, loadedSocialIcons, loadedAvatars]); // Depender de las imágenes cargadas

    // Añadir personaje
    const addCharacter = () => {
        const newCharacter = {
            name: 'Nuevo Personaje',
            avatarUrl: '',
            ...SOCIAL_NETWORKS.reduce((acc, net) => {
                acc[net.key] = { followers: '', posts: '' };
                return acc;
            }, {})
        };
        setCharacters([...characters, newCharacter]);
    };

    // Eliminar personaje
    const removeCharacter = (index) => {
        if (characters.length > 1) {
            setCharacters(characters.filter((_, i) => i !== index));
        }
    };

    // Actualizar campo
    const updateCharacter = (index, field, value, subfield) => {
        const newChars = [...characters];
        if (subfield) {
            newChars[index][field] = { ...newChars[index][field], [subfield]: value };
        } else {
            newChars[index][field] = value;
        }
        setCharacters(newChars);
    };

    // Insertar tabla en el canvas principal
    const insertTableToCanvas = async () => {
        if (!canvas) return;

        // Definir dimensiones
        const TOP_HEADER_H = 40;
        const SUB_HEADER_H = 30;
        const ROW_H = 60;
        const ROW_NUM_W = 40;
        const PERSONAJE_W = 180;
        const DATA_COL_W = 140; // 70 * 2

        const totalWidth = ROW_NUM_W + PERSONAJE_W + (SOCIAL_NETWORKS.length * DATA_COL_W);
        const totalHeight = TOP_HEADER_H + SUB_HEADER_H + (characters.length * ROW_H);

        // Crear canvas temporal
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = totalWidth;
        tempCanvas.height = totalHeight;
        const tempCtx = tempCanvas.getContext('2d');

        // Dibujar la tabla (versión no-preview, con fuentes más grandes)
        drawTable(tempCtx, totalWidth, totalHeight, false);

        // Convertir canvas a imagen y agregar al canvas principal
        const dataURL = tempCanvas.toDataURL('image/png');
        const imgElement = new window.Image();
        imgElement.onload = () => {
            const FabricImage = window.fabric ? window.fabric.Image : null;
            if (!FabricImage) {
                alert("No se encontró Fabric.js. Asegúrate de que la librería esté cargada.");
                onClose();
                return;
            }
            // Igual que SocialMediaUsageModal: escala amigable y solo activar
            const fabricImg = new FabricImage(imgElement, {
                left: 50,
                top: 50,
                scaleX: 0.6,
                scaleY: 0.6
            });
            canvas.add(fabricImg);
            canvas.setActiveObject(fabricImg);
            canvas.renderAll();
            setTimeout(onClose, 0);
        };
        imgElement.src = dataURL;
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()} style={{ maxWidth: '1100px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h3 className="modal-title">RRSS Propias: Benchmark Cuantitativo</h3>
                    <button className="modal-close" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="segments-section">
                        <div className="section-header">
                            <h4>Personajes</h4>
                            <button className="btn-primary btn-sm" onClick={addCharacter}>
                                <Plus size={16} /> Agregar Personaje
                            </button>
                        </div>
                        {characters.length === 0 && (
                            <div style={{ color: '#888', fontSize: 14, margin: 20 }}>No hay personajes. Agrega uno para comenzar.</div>
                        )}
                        
                        {/* Formulario de Personajes */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {characters.map((char, idx) => (
                                <div key={idx} style={{ padding: 15, border: '1px solid #ddd', borderRadius: 8, background: '#fcfcfc' }}>
                                    {/* Fila 1: Nombre, Avatar, Borrar */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: 10, alignItems: 'center', marginBottom: '10px' }}>
                                        <input type="text" placeholder="Nombre" value={char.name} onChange={e => updateCharacter(idx, 'name', e.target.value)} className="input-field" />
                                        <input type="text" placeholder="Avatar URL" value={char.avatarUrl} onChange={e => updateCharacter(idx, 'avatarUrl', e.target.value)} className="input-field" />
                                        <button className="btn-danger btn-icon" onClick={() => removeCharacter(idx)} disabled={characters.length <= 1}><Trash2 size={16} /></button>
                                    </div>
                                    
                                    {/* Fila 2: Datos de Redes Sociales */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                                        {SOCIAL_NETWORKS.map(network => (
                                            <div key={network.key} style={{ background: '#f0f0f0', padding: 8, borderRadius: 4 }}>
                                                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: 4 }}>{network.label}</label>
                                                <div style={{ display: 'flex', gap: 5 }}>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Seguidores" 
                                                        value={char[network.key]?.followers || ''} 
                                                        onChange={e => updateCharacter(idx, network.key, e.target.value, 'followers')} 
                                                        className="input-field"
                                                        style={{ fontSize: '12px', padding: '4px 6px' }}
                                                    />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Posts" 
                                                        value={char[network.key]?.posts || ''} 
                                                        onChange={e => updateCharacter(idx, network.key, e.target.value, 'posts')} 
                                                        className="input-field"
                                                        style={{ fontSize: '12px', padding: '4px 6px' }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Vista Previa */}
                    <div className="chart-preview" style={{ marginTop: '20px' }}>
                        <h4>Vista Previa</h4>
                        <div className="preview-container" style={{ 
                            maxHeight: '400px', 
                            overflowY: 'auto', 
                            overflowX: 'auto', 
                            background: '#f4f4f4', 
                            border: '1px solid #ccc' 
                        }}>
                            <canvas ref={canvasRef}></canvas>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={handleClose}>
                        Cancelar
                    </button>
                    <button className="btn-primary" onClick={insertTableToCanvas}>
                        Insertar Tabla en Canvas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkSocialMediaModal;

