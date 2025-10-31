import React, { useState } from 'react';

// Datos iniciales del perfil
const initialData = {
    title: 'Perfil:',
    subtitle: 'Transformador/Impulsor',
    footnote: '*Adjetivación realizada el 06.Abril.2025',
    company: 'Rizoma',
    adjetivos: {
        title: 'Adjetivos',
        items: ['Transformador', 'Impulsor', 'Innovador', 'Fuerte/firme']
    },
    contraAdjetivos: {
        title: 'Contra Adjetivos',
        items: ['Mafioso', 'Impuesto', 'Ignorante', 'Lejano']
    },
    definiciones: [
        {
            term: 'Ineficaz',
            color: '#E8E8E8',
            description: 'Su gestión sigue siendo criticada por su falta de acción y la demora en resolver el problema de la basura.'
        },
        {
            term: 'Mafioso',
            color: '#E57373',
            description: 'Es visto como alguien con una mala reputación, evidentemente por su cercanía a la venta del filo y las grandes cantidades de presencia.'
        },
        {
            term: 'Incongruente',
            color: '#AED581',
            description: 'Gran parte de la población considera que tiene acuerdos secretos con el MAS, razón por la cual no ha sido perseguido o enunciado.'
        },
        {
            term: 'Experimentado',
            color: '#FFD54F',
            description: 'Reconocen su trayectoria política y comentan que es quien se ve mejor preparado.'
        }
    ],
    personas: [
        {
            name: 'Manfred\nReyes Villa',
            photo: null,
            adjetivos: ['Ineficaz', 'Mafioso', 'Incongruente', 'Experimentado'],
            mafioso: true
        },
        {
            name: 'Tuto\nQuiroga',
            photo: null,
            adjetivos: ['Traidor', 'Oportunista', 'Experimentado', 'Mafioso'],
            mafioso: true
        },
        {
            name: 'Samuel\nDoria',
            photo: null,
            adjetivos: ['Mafioso', 'Abusivo', 'Ambicioso', 'Demagogo'],
            mafioso: true
        },
        {
            name: 'Luis\nCamacho',
            photo: null,
            adjetivos: ['Mafioso', 'Oportunista', 'Ambicioso', 'Impuesto'],
            mafioso: true
        },
        {
            name: 'Andrónico\nRodriguez',
            photo: null,
            adjetivos: ['Traidor', 'Subordinado', 'Ineficaz', 'Mafioso'],
            mafioso: true
        },
        {
            name: 'Chi\nHyun Chung',
            photo: null,
            adjetivos: ['Ignorante', 'Oportunista', 'Mafioso', 'Incapaz'],
            mafioso: true
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

    const handleAddPersona = () => {
        setData({
            ...data,
            personas: [...data.personas, {
                name: 'Nueva\nPersona',
                photo: null,
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

    const drawPerfilChart = () => {
        const c = document.createElement('canvas');
        const width = 1600;
        const height = 900;
        c.width = width;
        c.height = height;
        const ctx = c.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Title section
        ctx.fillStyle = '#666';
        ctx.font = '32px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(data.title, 170, 60);

        ctx.fillStyle = '#000';
        ctx.font = 'bold 48px Arial';
        ctx.fillText(data.subtitle, 70, 120);

        // Draw boxes for Adjetivos and Contra Adjetivos
        const boxX = 70;
        const boxY = 160;
        const boxWidth = 280;
        const boxHeight = 180;

        // Adjetivos box
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(data.adjetivos.title, boxX + 10, boxY + 30);

        ctx.fillStyle = '#2196F3';
        ctx.font = '16px Arial';
        data.adjetivos.items.forEach((item, i) => {
            ctx.fillText('• ' + item, boxX + 15, boxY + 60 + (i * 25));
        });

        // Contra Adjetivos box
        const boxX2 = boxX + boxWidth + 10;
        ctx.strokeRect(boxX2, boxY, boxWidth, boxHeight);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(data.contraAdjetivos.title, boxX2 + 10, boxY + 30);

        ctx.fillStyle = '#E53935';
        ctx.font = '16px Arial';
        data.contraAdjetivos.items.forEach((item, i) => {
            ctx.fillText('• ' + item, boxX2 + 15, boxY + 60 + (i * 25));
        });

        // Draw definitions
        let defY = boxY + boxHeight + 30;
        data.definiciones.forEach((def, i) => {
            // Color bar
            ctx.fillStyle = def.color;
            ctx.fillRect(60, defY, 10, 60);

            // Term
            ctx.fillStyle = '#000';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(def.term, 80, defY + 15);

            // Description
            ctx.fillStyle = '#555';
            ctx.font = '13px Arial';
            const words = def.description.split(' ');
            let line = '';
            let lineY = defY + 35;
            words.forEach(word => {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > 600 && line !== '') {
                    ctx.fillText(line, 80, lineY);
                    line = word + ' ';
                    lineY += 18;
                } else {
                    line = testLine;
                }
            });
            ctx.fillText(line, 80, lineY);

            defY += 80;
        });

        // Draw personas in grid (3 columns, 2 rows)
        const startX = 750;
        const startY = 100;
        const personWidth = 260;
        const personHeight = 280;
        const gapX = 20;
        const gapY = 30;

        data.personas.forEach((persona, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = startX + (col * (personWidth + gapX));
            const y = startY + (row * (personHeight + gapY));

            // Draw person card
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, personWidth, personHeight);

            // Photo circle
            ctx.beginPath();
            ctx.arc(x + personWidth / 2, y + 50, 35, 0, Math.PI * 2);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = '#f0f0f0';
            ctx.fill();

            // Name
            ctx.fillStyle = '#000';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            const nameLines = persona.name.split('\n');
            nameLines.forEach((line, lineIndex) => {
                ctx.fillText(line, x + personWidth / 2, y + 105 + (lineIndex * 18));
            });

            // Adjetivos list
            ctx.textAlign = 'left';
            ctx.font = '13px Arial';
            let adjetivoY = y + 150;
            persona.adjetivos.forEach((adj, adjIndex) => {
                const isMafioso = adj.toLowerCase().includes('mafioso');
                ctx.fillStyle = isMafioso ? '#E53935' : '#000';
                ctx.fillText('• ' + adj, x + 15, adjetivoY);
                adjetivoY += 22;
            });
        });

        // Legend
        const legendY = height - 100;
        const legendX = startX;
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Consolidación de adjetivos personales', legendX, legendY);

        // Legend items
        const items = [
            { color: '#AED581', text: 'Adjetivos recurrentes' },
            { color: '#FFD54F', text: 'Adjetivos esporádicos' },
            { color: '#E57373', text: 'Adjetivos inusuales' }
        ];

        items.forEach((item, i) => {
            const itemX = legendX + (i * 180);
            ctx.fillStyle = item.color;
            ctx.fillRect(itemX, legendY + 10, 15, 15);
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText(item.text, itemX + 20, legendY + 22);
        });

        // Company logo/text
        ctx.fillStyle = '#999';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(data.company, width - 40, height - 40);

        // Footnote
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(data.footnote, width - 40, height - 20);

        return c;
    };

    const handleInsert = async () => {
        if (!canvas) return;
        const temp = drawPerfilChart();
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

                const scale = 960 / fabricImg.width;
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

export default PerfilPersonasModal;