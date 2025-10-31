import React, { useState } from 'react';

// Datos iniciales basados en la imagen - 2 sub-tipos por arquetipo
const initialData = {
    title: 'Arquetipos | Sub-arquetipos',
    footnote: '*Fuente: arquetipos de marca',
    axes: {
        top: 'CAMBIO',
        right: 'CERCANÍA',
        bottom: 'ESTABILIDAD',
        left: 'CONOCIMIENTO'
    },
    archeTypes: [
        {
            name: 'Impulsor',
            color: '#F6C358',
            subTypes: ['Visionario', 'Catalizador']
        },
        {
            name: 'Justiciero',
            color: '#F39C12',
            subTypes: ['Defensor', 'Activista']
        },
        {
            name: 'Generoso',
            color: '#F08A5D',
            subTypes: ['Altruista', 'Humanitario']
        },
        {
            name: 'Amigo',
            color: '#E94E77',
            subTypes: ['Leal', 'Fiel']
        },
        {
            name: 'Protector',
            color: '#D7263D',
            subTypes: ['Guardián', 'Vigilante']
        },
        {
            name: 'Héroe',
            color: '#8E44AD',
            subTypes: ['Valiente', 'Salvador']
        },
        {
            name: 'Conciliador',
            color: '#2E9CCA',
            subTypes: ['Mediador', 'Pacificador']
        },
        {
            name: 'Líder',
            color: '#3D6B9B',
            subTypes: ['Director', 'Soberano']
        },
        {
            name: 'Ejecutivo',
            color: '#2E8B57',
            subTypes: ['Organizado', 'Eficaz']
        },
        {
            name: 'Mentor',
            color: '#1F8A70',
            subTypes: ['Maestro', 'Orientador']
        },
        {
            name: 'Estratega',
            color: '#27AE60',
            subTypes: ['Planificador', 'Táctico']
        },
        {
            name: 'Transformador',
            color: '#9ACD32',
            subTypes: ['Mago', 'Renovador']
        }
    ]
};

const PerfilesArquetiposModal = ({ isOpen, onClose, canvas }) => {
    const [data, setData] = useState(initialData);
    const [selectedArchetype, setSelectedArchetype] = useState(null);

    if (!isOpen) return null;

    const handleArchetypeChange = (index, field, value) => {
        const newArcheTypes = [...data.archeTypes];
        newArcheTypes[index] = { ...newArcheTypes[index], [field]: value };
        setData({ ...data, archeTypes: newArcheTypes });
    };

    const handleSubTypeChange = (archetypeIndex, subIndex, value) => {
        const newArcheTypes = [...data.archeTypes];
        newArcheTypes[archetypeIndex].subTypes[subIndex] = value;
        setData({ ...data, archeTypes: newArcheTypes });
    };

    const handleAddSubType = (archetypeIndex) => {
        const newArcheTypes = [...data.archeTypes];
        newArcheTypes[archetypeIndex].subTypes.push('Nuevo Sub-tipo');
        setData({ ...data, archeTypes: newArcheTypes });
    };

    const handleRemoveSubType = (archetypeIndex, subIndex) => {
        const newArcheTypes = [...data.archeTypes];
        if (newArcheTypes[archetypeIndex].subTypes.length <= 1) {
            alert('Debe haber al menos 1 sub-tipo por arquetipo');
            return;
        }
        newArcheTypes[archetypeIndex].subTypes.splice(subIndex, 1);
        setData({ ...data, archeTypes: newArcheTypes });
    };

    const handleAddArchetype = () => {
        setData({
            ...data,
            archeTypes: [...data.archeTypes, {
                name: 'Nuevo Arquetipo',
                color: '#CCCCCC',
                subTypes: ['Sub-tipo 1']
            }]
        });
    };

    const handleRemoveArchetype = (index) => {
        if (data.archeTypes.length <= 3) {
            alert('Debe haber al menos 3 arquetipos');
            return;
        }
        const newArcheTypes = data.archeTypes.filter((_, i) => i !== index);
        setData({ ...data, archeTypes: newArcheTypes });
    };

    const drawRingChart = () => {
        const c = document.createElement('canvas');
        const width = 1400;
        const height = 1000;
        c.width = width;
        c.height = height;
        const ctx = c.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Title
        ctx.fillStyle = '#111';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(data.title, 40, 50);

        // Ring parameters - anillo más grande
        const centerX = width / 2;
        const centerY = height / 2 + 40;
        const outerR = 300; // Aumentado de 280 a 300
        const innerR = 200; // Aumentado de 180 a 200

        // Draw segments by archetype (not by subtype)
        data.archeTypes.forEach((archetype, archetypeIndex) => {
            const numSubTypes = archetype.subTypes.length;
            const archetypeAngle = (Math.PI * 2) / data.archeTypes.length;

            const startAngle = -Math.PI / 2 + (archetypeIndex * archetypeAngle);
            const endAngle = startAngle + archetypeAngle;

            // Draw the full archetype segment
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerR, startAngle, endAngle, false);
            ctx.arc(centerX, centerY, innerR, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = archetype.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Draw sub-types as a vertical list inside the segment
            const midAngle = (startAngle + endAngle) / 2;
            const labelRadius = (outerR + innerR) / 2;
            const labelX = centerX + Math.cos(midAngle) * labelRadius;
            const labelY = centerY + Math.sin(midAngle) * labelRadius;

            ctx.save();
            ctx.translate(labelX, labelY);

            // Ajustar rotación para que el texto siga la curva correctamente
            let textAngle = midAngle + Math.PI / 2;

            // Si el texto está en la parte inferior del círculo, voltear para que sea legible
            if (midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2) {
                textAngle = midAngle - Math.PI / 2;
            }

            ctx.rotate(textAngle);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Dibujar cada sub-tipo en una línea vertical
            const lineHeight = 12;
            const totalHeight = (numSubTypes - 1) * lineHeight;
            const startY = -totalHeight / 2;

            archetype.subTypes.forEach((subType, subIndex) => {
                const yPos = startY + (subIndex * lineHeight);
                ctx.fillText(subType, 0, yPos);
            });

            ctx.restore();

            // Draw archetype name outside the ring
            const archetypeRadius = outerR + 50;
            const archetypeX = centerX + Math.cos(midAngle) * archetypeRadius;
            const archetypeY = centerY + Math.sin(midAngle) * archetypeRadius;

            ctx.fillStyle = '#333';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(archetype.name, archetypeX, archetypeY);
        });

        // Draw crosshair grid
        const gridExtend = 60;
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - outerR - gridExtend);
        ctx.lineTo(centerX, centerY + outerR + gridExtend);
        ctx.stroke();

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(centerX - outerR - gridExtend, centerY);
        ctx.lineTo(centerX + outerR + gridExtend, centerY);
        ctx.stroke();

        ctx.setLineDash([]);

        // Draw axes labels with arrows
        ctx.fillStyle = '#666';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';

        // Top label (CAMBIO)
        ctx.fillText('+' + data.axes.top.toUpperCase(), centerX - 80, centerY - outerR - 80);

        // Right label (CERCANÍA)
        ctx.save();
        ctx.translate(centerX + outerR + 80, centerY - 80);
        ctx.rotate(Math.PI / 2);
        ctx.fillText('+' + data.axes.right.toUpperCase(), 0, 0);
        ctx.restore();

        // Bottom label (ESTABILIDAD)
        ctx.fillText('+' + data.axes.bottom.toUpperCase(), centerX - 100, centerY + outerR + 80);

        // Left label (CONOCIMIENTO)
        ctx.save();
        ctx.translate(centerX - outerR - 80, centerY - 80);
        ctx.rotate(Math.PI / 2);
        ctx.fillText('+' + data.axes.left.toUpperCase(), 0, 0);
        ctx.restore();

        // Draw axis scale markers
        ctx.font = '12px Arial';
        ctx.fillStyle = '#999';

        // Horizontal scale
        ctx.textBaseline = 'middle';
        ctx.fillText('-2', centerX - outerR - 50, centerY + 20);
        ctx.fillText('-1', centerX - outerR / 2 - 25, centerY + 20);
        ctx.fillText('0', centerX, centerY + 20);
        ctx.fillText('+1', centerX + outerR / 2 + 25, centerY + 20);
        ctx.fillText('+2', centerX + outerR + 50, centerY + 20);

        // Vertical scale
        ctx.textAlign = 'right';
        ctx.fillText('+2', centerX - 20, centerY - outerR - 50);
        ctx.fillText('+1', centerX - 20, centerY - outerR / 2 - 25);
        ctx.fillText('0', centerX - 20, centerY);
        ctx.fillText('-1', centerX - 20, centerY + outerR / 2 + 25);
        ctx.fillText('-2', centerX - 20, centerY + outerR + 50);

        // Footnote
        ctx.font = '12px Arial';
        ctx.fillStyle = '#555';
        ctx.textAlign = 'right';
        ctx.fillText(data.footnote, width - 40, height - 30);

        return c;
    };

    const handleInsert = async () => {
        if (!canvas) return;
        const temp = drawRingChart();
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
                    name: 'perfiles-arquetipos'
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
            <div className="chart-modal-container" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 className="chart-modal-title">Perfiles y Arquetipos</h2>

                <div className="chart-modal-field">
                    <label>Título</label>
                    <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
                </div>

                <div className="chart-modal-field">
                    <label>Pie de Página</label>
                    <input value={data.footnote} onChange={(e) => setData({ ...data, footnote: e.target.value })} />
                </div>

                <hr style={{ margin: '20px 0' }} />

                <h3 style={{ marginTop: '0', marginBottom: '15px' }}>Etiquetas de Ejes</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <div className="chart-modal-field">
                        <label>Eje Superior</label>
                        <input value={data.axes.top} onChange={(e) => setData({ ...data, axes: { ...data.axes, top: e.target.value } })} />
                    </div>
                    <div className="chart-modal-field">
                        <label>Eje Derecho</label>
                        <input value={data.axes.right} onChange={(e) => setData({ ...data, axes: { ...data.axes, right: e.target.value } })} />
                    </div>
                    <div className="chart-modal-field">
                        <label>Eje Inferior</label>
                        <input value={data.axes.bottom} onChange={(e) => setData({ ...data, axes: { ...data.axes, bottom: e.target.value } })} />
                    </div>
                    <div className="chart-modal-field">
                        <label>Eje Izquierdo</label>
                        <input value={data.axes.left} onChange={(e) => setData({ ...data, axes: { ...data.axes, left: e.target.value } })} />
                    </div>
                </div>

                <hr style={{ margin: '20px 0' }} />

                <h3 style={{ marginTop: '0' }}>Arquetipos y Sub-arquetipos</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '15px' }}>
                    {data.archeTypes.map((archetype, archetypeIndex) => (
                        <div key={archetypeIndex} style={{
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            padding: '15px',
                            backgroundColor: selectedArchetype === archetypeIndex ? '#f8f9fa' : 'white'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px', gap: '10px', marginBottom: '10px' }}>
                                <div className="chart-modal-field" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Arquetipo {archetypeIndex + 1}</label>
                                    <input
                                        value={archetype.name}
                                        onChange={(e) => handleArchetypeChange(archetypeIndex, 'name', e.target.value)}
                                        placeholder="Nombre del arquetipo"
                                        style={{ fontWeight: 'bold' }}
                                    />
                                </div>
                                <div className="chart-modal-field" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Color</label>
                                    <input
                                        type="color"
                                        value={archetype.color}
                                        onChange={(e) => handleArchetypeChange(archetypeIndex, 'color', e.target.value)}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                                <button
                                    onClick={() => handleRemoveArchetype(archetypeIndex)}
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

                            <div style={{ paddingLeft: '10px', borderLeft: '3px solid ' + archetype.color }}>
                                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#555' }}>
                                    Sub-arquetipos:
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {archetype.subTypes.map((subType, subIndex) => (
                                        <div key={subIndex} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '8px' }}>
                                            <input
                                                value={subType}
                                                onChange={(e) => handleSubTypeChange(archetypeIndex, subIndex, e.target.value)}
                                                placeholder="Nombre del sub-tipo"
                                                style={{ fontSize: '13px', padding: '6px 10px' }}
                                            />
                                            <button
                                                onClick={() => handleRemoveSubType(archetypeIndex, subIndex)}
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
                                    onClick={() => handleAddSubType(archetypeIndex)}
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
                                    + Añadir Sub-tipo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddArchetype}
                    className="chart-modal-button-insert"
                    style={{ background: '#2ecc71', width: '100%', marginBottom: '15px' }}
                >
                    + Añadir Arquetipo
                </button>

                <div className="chart-modal-buttons">
                    <button onClick={onClose} className="chart-modal-button-cancel">Cancelar</button>
                    <button onClick={handleInsert} className="chart-modal-button-insert">Insertar Arquetipos</button>
                </div>
            </div>
        </div>
    );
};

export default PerfilesArquetiposModal;