import React, { useState } from 'react';

const defaultPositive = [
    'La población digital de Nuevo León busca en su próximo Gobernador la figura arquetípica de un Impulsor',
    'Quieren que posea un carácter fuerte para combatir inseguridad y criminalidad',
    'Buscan un enfoque renovado de la política que transforme la manera de abordar problemas del Estado'
];

const defaultNegative = [
    'Les enfadaría que haga mega obras sin dar cuentas claras sobre el gasto público',
    'No desean a alguien que se limite a aparecer en redes sociales mientras permanece ausente',
    'Les enojaría que sus promesas de campaña no llegaran a realizarse o fueran ineficientes'
];

const PerfilesIdentificacionModal = ({ isOpen, onClose, canvas }) => {
    const [title, setTitle] = useState('Estudio de Identificación y definición del Perfil');
    const [positive, setPositive] = useState(defaultPositive);
    const [negative, setNegative] = useState(defaultNegative);
    const [footnote, setFootnote] = useState('*Perfil realizado el 11.Diciembre.2024');

    if (!isOpen) return null;

    const drawCard = (positiveItems, negativeItems) => {
        const c = document.createElement('canvas');
        const width = 1400;
        const height = 720;
        c.width = width;
        c.height = height;
        const ctx = c.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Left rounded card background
        const cardX = 40;
        const cardY = 40;
        const cardW = 360;
        const cardH = 640;
        const radius = 24;
        ctx.fillStyle = '#f3f4f6';
        ctx.beginPath();
        ctx.moveTo(cardX + radius, cardY);
        ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardH, radius);
        ctx.arcTo(cardX + cardW, cardY + cardH, cardX, cardY + cardH, radius);
        ctx.arcTo(cardX, cardY + cardH, cardX, cardY, radius);
        ctx.arcTo(cardX, cardY, cardX + cardW, cardY, radius);
        ctx.closePath();
        ctx.fill();

        // Inner ring (simplified donut)
        const centerX = cardX + cardW / 2;
        const centerY = cardY + 140;
        const outerR = 90;
        const innerR = 45;

        const segments = 10;
        for (let i = 0; i < segments; i++) {
            const ang = (i / segments) * Math.PI * 2 - Math.PI / 2;
            const nx = Math.cos(ang);
            const ny = Math.sin(ang);
            const segColor = `hsl(${(i / segments) * 360},60%,45%)`;
            ctx.beginPath();
            ctx.fillStyle = segColor;
            ctx.moveTo(centerX + nx * innerR, centerY + ny * innerR);
            ctx.arc(centerX, centerY, outerR, ang, ang + (Math.PI * 2) / segments);
            ctx.lineTo(centerX + nx * innerR, centerY + ny * innerR);
            ctx.closePath();
            ctx.fill();
        }

        // Center emblem (polygon)
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        const polyR = 28;
        const points = 6;
        for (let i = 0; i < points; i++) {
            const a = (i / points) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + Math.cos(a) * polyR;
            const y = centerY + Math.sin(a) * polyR;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        // Left card text under ring
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        const subtitle = 'La población digital de Nuevo León busca en su próximo Gobernador la figura arquetípica de un';
        wrapText(ctx, subtitle, centerX, centerY + 120, cardW - 40, 18);

        ctx.fillStyle = '#5b21b6';
        ctx.font = 'bold 22px Arial';
        ctx.fillText('Impulsor', centerX, centerY + 190);

        // Middle and right columns
            const col1X = cardX + cardW + 60; // positive column
            const col2X = col1X + 520; // negative column
            // Move start further down to avoid overlapping header and give more space
            const colYStart = 160;

            // Positive header
            ctx.fillStyle = '#14532d';
            ctx.fillRect(col1X - 12, colYStart - 36, 360, 44);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('Positivo', col1X, colYStart - 8);

            // Negative header
            ctx.fillStyle = '#4c0519';
            ctx.fillRect(col2X - 12, colYStart - 36, 360, 44);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px Arial';
            ctx.fillText('Negativo', col2X, colYStart - 8);

            // Draw bullet lists
            ctx.fillStyle = '#111827';
            ctx.font = '15px Arial';
            const lineHeight = 30;
            // start lower so the first line doesn't collide with header
            let y = colYStart + 20;
            positiveItems.forEach((txt) => {
                ctx.textAlign = 'left';
                drawBulletText(ctx, txt, col1X, y, 340, lineHeight);
                y += estimateLines(txt, 340, ctx) * lineHeight + 12;
            });

            // Negative column list
            y = colYStart + 20;
            negativeItems.forEach((txt) => {
                ctx.textAlign = 'left';
                drawBulletText(ctx, txt, col2X, y, 340, lineHeight);
                y += estimateLines(txt, 340, ctx) * lineHeight + 12;
            });

        // Footer (logo placeholder and footnote)
        ctx.fillStyle = '#111827';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(footnote, width - 40, height - 30);

        return c;
    };

    // Helpers for wrapping text and bullets
    const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        let curY = y;
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, curY);
                line = words[n] + ' ';
                curY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, curY);
    };

    const drawBulletText = (ctx, text, x, y, maxWidth, lineHeight) => {
        // draw bullet
        ctx.beginPath();
        ctx.fillStyle = '#111827';
        ctx.arc(x + 6, y - 6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.textAlign = 'left';
        wrapText(ctx, text, x + 18, y, maxWidth - 18, lineHeight);
    };

    const estimateLines = (text, maxWidth, ctx) => {
        const words = text.split(' ');
        let line = '';
        let lines = 1;
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxWidth && n > 0) {
                line = words[n] + ' ';
                lines++;
            } else {
                line = testLine;
            }
        }
        return lines;
    };

    const handleInsert = async () => {
        const canvasEl = drawCard(positive, negative);
        const dataURL = canvasEl.toDataURL('image/png');
        const { Image: FabricImage } = await import('fabric');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const fImg = new FabricImage(img, {
                    left: 40,
                    top: 30,
                    selectable: true,
                    evented: true,
                    hasControls: true,
                    hasBorders: true,
                    name: 'perfil-identificacion'
                });

                // scale down if needed to fit editor width (target 960)
                const targetWidth = 920;
                const scale = targetWidth / fImg.width;
                fImg.scaleX = scale;
                fImg.scaleY = scale;

                if (canvas) {
                    canvas.add(fImg);
                    canvas.setActiveObject(fImg);
                    fImg.setCoords();
                    canvas.requestRenderAll();
                }

                onClose();
            } catch (err) {
                console.error('Insert error', err);
            }
        };
        img.src = dataURL;
    };

        // --- Form handlers for positive / negative lists ---
        const handleAddPositive = () => {
            setPositive(prev => [...prev, 'Nuevo ítem positivo']);
        };

        const handleRemovePositive = (index) => {
            setPositive(prev => prev.filter((_, i) => i !== index));
        };

        const handleChangePositive = (index, value) => {
            setPositive(prev => prev.map((v, i) => i === index ? value : v));
        };

        const handleAddNegative = () => {
            setNegative(prev => [...prev, 'Nuevo ítem negativo']);
        };

        const handleRemoveNegative = (index) => {
            setNegative(prev => prev.filter((_, i) => i !== index));
        };

        const handleChangeNegative = (index, value) => {
            setNegative(prev => prev.map((v, i) => i === index ? value : v));
        };

    return (
        <div className="chart-modal-overlay">
            <div className="chart-modal-container" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 className="chart-modal-title">{title}</h2>

                <div className="chart-modal-field">
                    <label>Título</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <label>Positivo (editar cada ítem)</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {positive.map((item, idx) => (
                                        <div key={`pos-${idx}`} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input
                                                style={{ flex: 1 }}
                                                value={item}
                                                onChange={(e) => handleChangePositive(idx, e.target.value)}
                                            />
                                            <button onClick={() => handleRemovePositive(idx)} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '6px 8px', cursor: 'pointer' }}>Eliminar</button>
                                        </div>
                                    ))}
                                    <button onClick={handleAddPositive} style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '8px', cursor: 'pointer', marginTop: '6px' }}>+ Añadir Positivo</button>
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <label>Negativo (editar cada ítem)</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {negative.map((item, idx) => (
                                        <div key={`neg-${idx}`} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input
                                                style={{ flex: 1 }}
                                                value={item}
                                                onChange={(e) => handleChangeNegative(idx, e.target.value)}
                                            />
                                            <button onClick={() => handleRemoveNegative(idx)} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '6px 8px', cursor: 'pointer' }}>Eliminar</button>
                                        </div>
                                    ))}
                                    <button onClick={handleAddNegative} style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '8px', cursor: 'pointer', marginTop: '6px' }}>+ Añadir Negativo</button>
                                </div>
                            </div>
                        </div>

                <div className="chart-modal-field">
                    <label>Pie de página</label>
                    <input value={footnote} onChange={(e) => setFootnote(e.target.value)} />
                </div>

                <div className="chart-modal-buttons" style={{ marginTop: '20px' }}>
                    <button onClick={onClose} className="chart-modal-button-cancel">Cancelar</button>
                    <button onClick={handleInsert} className="chart-modal-button-insert">Insertar Gráfico</button>
                </div>
            </div>
        </div>
    );
};

export default PerfilesIdentificacionModal;
