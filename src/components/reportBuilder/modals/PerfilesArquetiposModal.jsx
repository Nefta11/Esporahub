import React, { useState } from 'react';

// Datos iniciales con nombres tipo Lorem Ipsum
const initialSections = [
    { label: 'Lorem', color: '#F6C358' },
    { label: 'Ipsum', color: '#F39C12' },
    { label: 'Dolor', color: '#F08A5D' },
    { label: 'Sit', color: '#E94E77' },
    { label: 'Amet', color: '#D7263D' },
    { label: 'Consectetur', color: '#8E44AD' },
    { label: 'Adipiscing', color: '#2E9CCA' },
    { label: 'Elit', color: '#3D6B9B' },
    { label: 'Sed', color: '#2E8B57' },
    { label: 'Do', color: '#1F8A70' },
    { label: 'Eiusmod', color: '#27AE60' },
    { label: 'Tempor', color: '#9ACD32' }
];

const PerfilesArquetiposModal = ({ isOpen, onClose, canvas }) => {
    const [title, setTitle] = useState('Arquetipos | Sub-arquetipos');
    const [footnote, setFootnote] = useState('*Fuente: ejemplo de arquetipos');
    const [sections, setSections] = useState(initialSections);

    if (!isOpen) return null;

    const handleSectionChange = (index, field, value) => {
        const newSections = [...sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setSections(newSections);
    };

    const handleAddSection = () => {
        setSections([...sections, { label: 'Nueva Sección', color: '#CCCCCC' }]);
    };

    const handleRemoveSection = (index) => {
        if (sections.length <= 3) {
            alert('Debe haber al menos 3 secciones');
            return;
        }
        setSections(sections.filter((_, i) => i !== index));
    };

    const drawRingChart = () => {
        const c = document.createElement('canvas');
        const width = 1400;
        const height = 900;
        c.width = width;
        c.height = height;
        const ctx = c.getContext('2d');

        // background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // title
        ctx.fillStyle = '#111';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(title, 40, 50);

        // ring parameters
        const centerX = width / 2;
        const centerY = height / 2 + 20;
        const outerR = 300;
        const innerR = 220;

        const full = Math.PI * 2;
        const per = full / sections.length;

        // draw ring segments
        sections.forEach((s, i) => {
            const start = -Math.PI / 2 + i * per;
            const end = start + per;

            // outer arc
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerR, start, end, false);
            // inner arc (reverse)
            ctx.arc(centerX, centerY, innerR, end, start, true);
            ctx.closePath();
            ctx.fillStyle = s.color;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // label along mid-angle
            const mid = (start + end) / 2;
            const labelR = (outerR + innerR) / 2;
            const lx = centerX + Math.cos(mid) * (labelR + 12);
            const ly = centerY + Math.sin(mid) * (labelR + 12);
            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate(mid + Math.PI / 2);
            ctx.fillStyle = '#222';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(s.label, 0, 0);
            ctx.restore();
        });

        // crosshair grid like in image
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - outerR - 40);
        ctx.lineTo(centerX, centerY + outerR + 40);
        ctx.moveTo(centerX - outerR - 40, centerY);
        ctx.lineTo(centerX + outerR + 40, centerY);
        ctx.stroke();

        // footnote
        ctx.font = '12px Arial';
        ctx.fillStyle = '#555';
        ctx.textAlign = 'right';
        ctx.fillText(footnote, width - 40, height - 30);

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

                // scale to fit editor canvas width (960)
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
            <div className="chart-modal-container" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 className="chart-modal-title">Perfiles y Arquetipos</h2>

                <div className="chart-modal-field">
                    <label>Título</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="chart-modal-field">
                    <label>Pie de Página</label>
                    <input value={footnote} onChange={(e) => setFootnote(e.target.value)} />
                </div>

                <hr style={{ margin: '20px 0' }} />

                <h3 style={{ marginTop: '0' }}>Secciones del Anillo</h3>

                <div style={{ display: 'grid', gap: '10px', marginBottom: '15px' }}>
                    {sections.map((section, index) => (
                        <div key={index} style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 100px 80px',
                            gap: '10px',
                            alignItems: 'center',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}>
                            <div className="chart-modal-field" style={{ margin: 0 }}>
                                <label style={{ fontSize: '11px', marginBottom: '4px' }}>Sección {index + 1}</label>
                                <input
                                    value={section.label}
                                    onChange={(e) => handleSectionChange(index, 'label', e.target.value)}
                                    placeholder="Nombre sección"
                                />
                            </div>
                            <div className="chart-modal-field" style={{ margin: 0 }}>
                                <label style={{ fontSize: '11px', marginBottom: '4px' }}>Color</label>
                                <input
                                    type="color"
                                    value={section.color}
                                    onChange={(e) => handleSectionChange(index, 'color', e.target.value)}
                                    style={{ width: '100%', height: '36px' }}
                                />
                            </div>
                            <button
                                onClick={() => handleRemoveSection(index)}
                                style={{
                                    background: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    height: '36px',
                                    marginTop: '16px'
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddSection}
                    className="chart-modal-button-insert"
                    style={{ background: '#2ecc71', width: '100%', marginBottom: '15px' }}
                >
                    + Añadir Sección
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
