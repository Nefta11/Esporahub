import React, { useState } from 'react';

// Datos iniciales del perfil
const initialData = {
    title: 'Perfil:',
    subtitle: 'Lorem Ipsum/Comparativo',
    footnote: '*Lorem ipsum',
    company: 'Lorem Ipsum',
    adjetivos: {
        title: 'Adjetivos',
        items: ['Lorem ipsum', 'Dolor sit amet', 'Consectetur', 'Adipiscing elit']
    },
    contraAdjetivos: {
        title: 'Contra Adjetivos',
        items: ['Sed do eiusmod', 'Tempor incididunt', 'Ut labore', 'Et dolore magna']
    },
    definiciones: [
        {
            term: 'Lorem',
            color: '#E8E8E8',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.'
        },
        {
            term: 'Ipsum',
            color: '#E57373',
            description: 'Sed posuere consectetur est at lobortis. Etiam porta sem malesuada magna mollis euismod.'
        },
        {
            term: 'Dolor',
            color: '#AED581',
            description: 'Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo.'
        },
        {
            term: 'Sit',
            color: '#FFD54F',
            description: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.'
        }
    ],
    personas: [
        {
            name: 'Lorem\nIpsum',
            photo: null,
            avatar: '',
            adjetivos: ['Lorem', 'Ipsum', 'Dolor', 'Sit'],
            mafioso: false
        },
        {
            name: 'Dolor\nSit',
            photo: null,
            avatar: '',
            adjetivos: ['Amet', 'Consectetur', 'Adipiscing', 'Elit'],
            mafioso: false
        },
        {
            name: 'Amet\nConsectetur',
            photo: null,
            avatar: '',
            adjetivos: ['Sed', 'Do', 'Eiusmod', 'Tempor'],
            mafioso: false
        },
        {
            name: 'Incididunt\nUt',
            photo: null,
            avatar: '',
            adjetivos: ['Labore', 'Et', 'Dolore', 'Magna'],
            mafioso: false
        },
        {
            name: 'Aliqua\nEnim',
            photo: null,
            avatar: '',
            adjetivos: ['Ad', 'Minim', 'Veniam', 'Quis'],
            mafioso: false
        },
        {
            name: 'Nostrud\nExercitation',
            photo: null,
            avatar: '',
            adjetivos: ['Ullamco', 'Laboris', 'Nisi', 'Ut'],
            mafioso: false
        }
    ]
};

const PerfilPersonasModal = ({ isOpen, onClose, canvas }) => {
    const [data, setData] = useState(initialData);
    const [selectedPersona, setSelectedPersona] = useState(null);

    if (!isOpen) return null;

    const handlePersonaChange = (index, field, value) => {
        const newPersonas = [...data.personas];
        newPersonas[index] = { ...newPersonas[index], [field]: value };
        setData({ ...data, personas: newPersonas });
    };

    const handleAdjetivoChange = (index, adjetivoIndex, value) => {
        const newPersonas = [...data.personas];
        newPersonas[index].adjetivos[adjetivoIndex] = value;
        setData({ ...data, personas: newPersonas });
    };

    const handleAddAdjetivo = (personaIndex) => {
        const newPersonas = [...data.personas];
        newPersonas[personaIndex].adjetivos.push('Nuevo adjetivo');
        setData({ ...data, personas: newPersonas });
    };

    const handleRemoveAdjetivo = (personaIndex, adjetivoIndex) => {
        const newPersonas = [...data.personas];
        if (newPersonas[personaIndex].adjetivos.length <= 1) {
            alert('Debe haber al menos 1 adjetivo por persona');
            return;
        }
        newPersonas[personaIndex].adjetivos.splice(adjetivoIndex, 1);
        setData({ ...data, personas: newPersonas });
    };

    const handleAvatarUpload = (index, e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const newPersonas = [...data.personas];
            newPersonas[index].avatar = ev.target.result;
            setData({ ...data, personas: newPersonas });
        };
        reader.readAsDataURL(file);
    };

    const handleAddPersona = () => {
        setData({
            ...data,
            personas: [...data.personas, {
                name: 'Nueva\nPersona',
                photo: null,
                avatar: '',
                adjetivos: ['Adjetivo 1'],
                mafioso: false
            }]
        });
    };

    const handleRemovePersona = (index) => {
        if (data.personas.length <= 1) {
            alert('Debe haber al menos 1 persona');
            return;
        }
        const newPersonas = data.personas.filter((_, i) => i !== index);
        setData({ ...data, personas: newPersonas });
    };

    const handleDefinicionChange = (index, field, value) => {
        const newDefiniciones = [...data.definiciones];
        newDefiniciones[index] = { ...newDefiniciones[index], [field]: value };
        setData({ ...data, definiciones: newDefiniciones });
    };

    const handleAdjetivoListChange = (type, index, value) => {
        if (type === 'adjetivos') {
            const newItems = [...data.adjetivos.items];
            newItems[index] = value;
            setData({ ...data, adjetivos: { ...data.adjetivos, items: newItems } });
        } else {
            const newItems = [...data.contraAdjetivos.items];
            newItems[index] = value;
            setData({ ...data, contraAdjetivos: { ...data.contraAdjetivos, items: newItems } });
        }
    };

    const drawPerfilChart = async () => {
        return await drawPerfilChartFromData(data);
    };

    const handleInsert = async () => {
        if (!canvas) return;
        const temp = await drawPerfilChart();
        const dataURL = temp.toDataURL('image/png');

        const { Image: FabricImage } = await import('fabric');
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const fabricImg = new FabricImage(img, {
                    left: 60,
                    top: 40,
                    selectable: true,
                    evented: true,
                    hasControls: true,
                    hasBorders: true,
                    hoverCursor: 'move',
                    name: 'perfil-personas'
                });

                const scale = 700 / fabricImg.width;
                fabricImg.scaleX = scale;
                fabricImg.scaleY = scale;

                canvas.add(fabricImg);
                canvas.setActiveObject(fabricImg);
                fabricImg.setCoords();
                canvas.requestRenderAll();
                onClose();
            } catch (err) {
                console.error('Insert error', err);
            }
        };
        img.src = dataURL;
    };

    return (
        <div className="chart-modal-overlay">
            <div className="chart-modal-container" style={{ maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 className="chart-modal-title">Estudio de Identificación y Definición del Perfil</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div className="chart-modal-field">
                        <label>Título Principal</label>
                        <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
                    </div>
                    <div className="chart-modal-field">
                        <label>Subtítulo (Perfil)</label>
                        <input value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} />
                    </div>
                    <div className="chart-modal-field">
                        <label>Empresa/Logo</label>
                        <input value={data.company} onChange={(e) => setData({ ...data, company: e.target.value })} />
                    </div>
                    <div className="chart-modal-field">
                        <label>Pie de Página</label>
                        <input value={data.footnote} onChange={(e) => setData({ ...data, footnote: e.target.value })} />
                    </div>
                </div>

                <hr style={{ margin: '20px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    {/* Adjetivos */}
                    <div style={{ border: '2px solid #2196F3', borderRadius: '8px', padding: '15px' }}>
                        <h3 style={{ marginTop: 0, color: '#2196F3' }}>Adjetivos Positivos</h3>
                        {data.adjetivos.items.map((item, i) => (
                            <div key={i} className="chart-modal-field">
                                <input
                                    value={item}
                                    onChange={(e) => handleAdjetivoListChange('adjetivos', i, e.target.value)}
                                    placeholder={`Adjetivo ${i + 1}`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Contra Adjetivos */}
                    <div style={{ border: '2px solid #E53935', borderRadius: '8px', padding: '15px' }}>
                        <h3 style={{ marginTop: 0, color: '#E53935' }}>Contra Adjetivos</h3>
                        {data.contraAdjetivos.items.map((item, i) => (
                            <div key={i} className="chart-modal-field">
                                <input
                                    value={item}
                                    onChange={(e) => handleAdjetivoListChange('contraAdjetivos', i, e.target.value)}
                                    placeholder={`Contra adjetivo ${i + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <hr style={{ margin: '20px 0' }} />

                <h3>Definiciones de Términos</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {data.definiciones.map((def, i) => (
                        <div key={i} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '10px', marginBottom: '10px' }}>
                                <div className="chart-modal-field" style={{ margin: 0 }}>
                                    <label>Término</label>
                                    <input
                                        value={def.term}
                                        onChange={(e) => handleDefinicionChange(i, 'term', e.target.value)}
                                    />
                                </div>
                                <div className="chart-modal-field" style={{ margin: 0 }}>
                                    <label>Color</label>
                                    <input
                                        type="color"
                                        value={def.color}
                                        onChange={(e) => handleDefinicionChange(i, 'color', e.target.value)}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                            </div>
                            <div className="chart-modal-field" style={{ margin: 0 }}>
                                <label>Descripción</label>
                                <textarea
                                    value={def.description}
                                    onChange={(e) => handleDefinicionChange(i, 'description', e.target.value)}
                                    rows="2"
                                    style={{ width: '100%', padding: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <hr style={{ margin: '20px 0' }} />

                <h3>Personas del Perfil</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                    {data.personas.map((persona, personaIndex) => (
                        <div key={personaIndex} style={{
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            padding: '15px',
                            backgroundColor: selectedPersona === personaIndex ? '#f8f9fa' : 'white'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '10px', marginBottom: '10px' }}>
                                <div className="chart-modal-field" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                        Persona {personaIndex + 1} (usar \n para salto de línea)
                                    </label>
                                    <input
                                        value={persona.name}
                                        onChange={(e) => handlePersonaChange(personaIndex, 'name', e.target.value)}
                                        placeholder="Nombre\nApellido"
                                        style={{ fontWeight: 'bold' }}
                                    />
                                </div>
                                <button
                                    onClick={() => handleRemovePersona(personaIndex)}
                                    style={{
                                        background: '#e74c3c',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        height: '36px',
                                        marginTop: '18px'
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>

                            <div className="chart-modal-field" style={{ margin: '0 0 10px 0' }}>
                                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                    Avatar:
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleAvatarUpload(personaIndex, e)}
                                    style={{ fontSize: '12px' }}
                                />
                            </div>

                            <div style={{ paddingLeft: '10px', borderLeft: '3px solid #3498db' }}>
                                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#555' }}>
                                    Adjetivos de esta persona:
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {persona.adjetivos.map((adj, adjIndex) => (
                                        <div key={adjIndex} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '8px' }}>
                                            <input
                                                value={adj}
                                                onChange={(e) => handleAdjetivoChange(personaIndex, adjIndex, e.target.value)}
                                                placeholder="Adjetivo"
                                                style={{ fontSize: '13px', padding: '6px 10px' }}
                                            />
                                            <button
                                                onClick={() => handleRemoveAdjetivo(personaIndex, adjIndex)}
                                                style={{
                                                    background: '#95a5a6',
                                                    color: 'white',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '6px 10px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px'
                                                }}
                                            >
                                                Quitar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleAddAdjetivo(personaIndex)}
                                    style={{
                                        background: '#3498db',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        marginTop: '8px',
                                        width: '100%'
                                    }}
                                >
                                    + Añadir Adjetivo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddPersona}
                    className="chart-modal-button-insert"
                    style={{ background: '#2ecc71', width: '100%', marginBottom: '15px' }}
                >
                    + Añadir Persona
                </button>

                <div className="chart-modal-buttons">
                    <button onClick={onClose} className="chart-modal-button-cancel">Cancelar</button>
                    <button onClick={handleInsert} className="chart-modal-button-insert">Insertar Perfil</button>
                </div>
            </div>
        </div>
    );
};

// Exportar initialData y drawPerfilChart para reutilización en autoInsert
export const initialPerfilPersonasData = initialData;

export const drawPerfilChartFromData = async (data) => {
    // Cargar todas las imágenes de avatares primero
    const loadedAvatars = await Promise.all(
        data.personas.map(async (persona) => {
            if (persona.avatar) {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(null);
                    img.src = persona.avatar;
                });
            }
            return null;
        })
    );

    const c = document.createElement('canvas');
    const width = 1200;
    const height = 680;
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title section
    ctx.fillStyle = '#666';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(data.title, 130, 45);

    ctx.fillStyle = '#000';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(data.subtitle, 50, 90);

    // Draw boxes for Adjetivos and Contra Adjetivos
    const boxX = 50;
    const boxY = 120;
    const boxWidth = 210;
    const boxHeight = 135;

    // Adjetivos box
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 15px Arial';
    ctx.fillText(data.adjetivos.title, boxX + 8, boxY + 22);

    ctx.fillStyle = '#2196F3';
    ctx.font = '12px Arial';
    data.adjetivos.items.forEach((item, i) => {
        ctx.fillText('• ' + item, boxX + 12, boxY + 45 + (i * 19));
    });

    // Contra Adjetivos box
    const boxX2 = boxX + boxWidth + 8;
    ctx.strokeRect(boxX2, boxY, boxWidth, boxHeight);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 15px Arial';
    ctx.fillText(data.contraAdjetivos.title, boxX2 + 8, boxY + 22);

    ctx.fillStyle = '#E53935';
    ctx.font = '12px Arial';
    data.contraAdjetivos.items.forEach((item, i) => {
        ctx.fillText('• ' + item, boxX2 + 12, boxY + 45 + (i * 19));
    });

    // Draw definitions
    let defY = boxY + boxHeight + 20;
    data.definiciones.forEach((def, i) => {
        // Color bar
        ctx.fillStyle = def.color;
        ctx.fillRect(45, defY, 8, 45);

        // Term
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(def.term, 60, defY + 12);

        // Description
        ctx.fillStyle = '#555';
        ctx.font = '10px Arial';
        const words = def.description.split(' ');
        let line = '';
        let lineY = defY + 28;
        words.forEach(word => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 420 && line !== '') {
                ctx.fillText(line, 60, lineY);
                line = word + ' ';
                lineY += 13;
            } else {
                line = testLine;
            }
        });
        ctx.fillText(line, 60, lineY);

        defY += 58;
    });

    // Draw personas in grid (3 columns, 2 rows)
    const startX = 540;
    const startY = 75;
    const personWidth = 200;
    const personHeight = 220;
    const gapX = 15;
    const gapY = 25;

    data.personas.forEach((persona, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = startX + (col * (personWidth + gapX));
        const y = startY + (row * (personHeight + gapY));

        // Draw person card
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, personWidth, personHeight);

        // Photo circle
        const centerX = x + personWidth / 2;
        const centerY = y + 38;
        const radius = 28;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Si hay avatar cargado, dibujarlo
        if (loadedAvatars[i]) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(loadedAvatars[i], centerX - radius, centerY - radius, radius * 2, radius * 2);
            ctx.restore();

            // Redibujar el borde después del clip
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Name
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        const nameLines = persona.name.split('\n');
        nameLines.forEach((line, lineIndex) => {
            ctx.fillText(line, x + personWidth / 2, y + 78 + (lineIndex * 14));
        });

        // Adjetivos list
        ctx.textAlign = 'left';
        ctx.font = '10px Arial';
        let adjetivoY = y + 113;
        persona.adjetivos.forEach((adj, adjIndex) => {
            const isMafioso = adj.toLowerCase().includes('mafioso');
            ctx.fillStyle = isMafioso ? '#E53935' : '#000';
            ctx.fillText('• ' + adj, x + 12, adjetivoY);
            adjetivoY += 17;
        });
    });

    // Legend
    const legendY = height - 75;
    const legendX = startX;
    ctx.fillStyle = '#666';
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Consolidación de adjetivos personales', legendX, legendY);

    // Legend items
    const items = [
        { color: '#AED581', text: 'Adjetivos recurrentes' },
        { color: '#FFD54F', text: 'Adjetivos esporádicos' },
        { color: '#E57373', text: 'Adjetivos inusuales' }
    ];

    items.forEach((item, i) => {
        const itemX = legendX + (i * 140);
        ctx.fillStyle = item.color;
        ctx.fillRect(itemX, legendY + 8, 12, 12);
        ctx.fillStyle = '#333';
        ctx.font = '9px Arial';
        ctx.fillText(item.text, itemX + 16, legendY + 18);
    });

    // Company logo/text
    ctx.fillStyle = '#999';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(data.company, width - 30, height - 30);

    // Footnote
    ctx.fillStyle = '#666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(data.footnote, width - 30, height - 15);

    return c;
};

export default PerfilPersonasModal;