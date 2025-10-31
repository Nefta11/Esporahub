import React, { useState } from 'react';
import { autoInsertPerfilIdentificacion } from '../utils/autoInsertHelpers2';

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
        const colYStart = 210; // aún más abajo para evitar empalme

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
    ctx.font = '14px Arial';
    const lineHeight = 34;
    // start lower so the first line doesn't collide with header
    let y = colYStart + 64;
    const loremPositive = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
            'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.',
            'Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo.'
        ];
        loremPositive.forEach((txt) => {
            ctx.textAlign = 'left';
            drawBulletText(ctx, txt, col1X, y, 340, lineHeight);
            y += estimateLines(txt, 340, ctx) * lineHeight + 16;
        });

    // Negative column list
    y = colYStart + 164;
    const loremNegative = [
            'Sed posuere consectetur est at lobortis. Etiam porta sem malesuada magna mollis euismod.',
            'Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
            'Maecenas sed diam eget risus varius blandit sit amet non magna.'
        ];
        loremNegative.forEach((txt) => {
            ctx.textAlign = 'left';
            drawBulletText(ctx, txt, col2X, y, 340, lineHeight);
            y += estimateLines(txt, 340, ctx) * lineHeight + 16;
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
        // Delegate insertion to shared helper so the canvas insertion logic is centralized
        try {
            await autoInsertPerfilIdentificacion(canvas, { positive, negative, footnote, title });
            onClose();
        } catch (err) {
            console.error('Error inserting via helper', err);
        }
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(30, 41, 59, 0.35)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '22px',
                boxShadow: '0 8px 32px rgba(30,41,59,0.18)',
                padding: '38px 38px 28px 38px',
                maxWidth: '950px',
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                border: '1.5px solid #e5e7eb',
                position: 'relative',
            }}>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: 18,
                    color: '#1e293b',
                    letterSpacing: '-1px',
                    textAlign: 'center',
                }}>{title}</h2>

                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, color: '#334155', fontSize: 15 }}>Título</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 8,
                            border: '1.5px solid #cbd5e1',
                            marginTop: 4,
                            fontSize: 16,
                            outline: 'none',
                            marginBottom: 2,
                            background: '#f8fafc',
                            transition: 'border 0.2s',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '24px', marginBottom: 18 }}>
                    <div style={{ flex: 1, background: '#f3f4f6', borderRadius: 12, padding: 18 }}>
                        <label style={{ fontWeight: 600, color: '#166534', fontSize: 15, marginBottom: 6, display: 'block' }}>Positivo (editar cada ítem)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {positive.map((item, idx) => (
                                <div key={`pos-${idx}`} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                        style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            borderRadius: 7,
                                            border: '1.2px solid #cbd5e1',
                                            fontSize: 15,
                                            background: '#fff',
                                            outline: 'none',
                                            transition: 'border 0.2s',
                                        }}
                                        value={item}
                                        onChange={(e) => handleChangePositive(idx, e.target.value)}
                                    />
                                    <button onClick={() => handleRemovePositive(idx)}
                                        style={{
                                            background: '#ef4444',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 6,
                                            padding: '7px 14px',
                                            fontWeight: 600,
                                            fontSize: 14,
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                        }}
                                    >Eliminar</button>
                                </div>
                            ))}
                            <button onClick={handleAddPositive}
                                style={{
                                    background: '#22c55e',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 7,
                                    padding: '10px',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    cursor: 'pointer',
                                    marginTop: '8px',
                                    transition: 'background 0.2s',
                                }}
                            >+ Añadir Positivo</button>
                        </div>
                    </div>

                    <div style={{ flex: 1, background: '#f3f4f6', borderRadius: 12, padding: 18 }}>
                        <label style={{ fontWeight: 600, color: '#b91c1c', fontSize: 15, marginBottom: 6, display: 'block' }}>Negativo (editar cada ítem)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {negative.map((item, idx) => (
                                <div key={`neg-${idx}`} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                        style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            borderRadius: 7,
                                            border: '1.2px solid #cbd5e1',
                                            fontSize: 15,
                                            background: '#fff',
                                            outline: 'none',
                                            transition: 'border 0.2s',
                                        }}
                                        value={item}
                                        onChange={(e) => handleChangeNegative(idx, e.target.value)}
                                    />
                                    <button onClick={() => handleRemoveNegative(idx)}
                                        style={{
                                            background: '#ef4444',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 6,
                                            padding: '7px 14px',
                                            fontWeight: 600,
                                            fontSize: 14,
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                        }}
                                    >Eliminar</button>
                                </div>
                            ))}
                            <button onClick={handleAddNegative}
                                style={{
                                    background: '#22c55e',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 7,
                                    padding: '10px',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    cursor: 'pointer',
                                    marginTop: '8px',
                                    transition: 'background 0.2s',
                                }}
                            >+ Añadir Negativo</button>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, color: '#334155', fontSize: 15 }}>Pie de página</label>
                    <input value={footnote} onChange={(e) => setFootnote(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 8,
                            border: '1.5px solid #cbd5e1',
                            marginTop: 4,
                            fontSize: 16,
                            outline: 'none',
                            background: '#f8fafc',
                            transition: 'border 0.2s',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 28 }}>
                    <button onClick={onClose}
                        style={{
                            background: '#f1f5f9',
                            color: '#334155',
                            border: 'none',
                            borderRadius: 8,
                            padding: '12px 28px',
                            fontWeight: 600,
                            fontSize: 16,
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                    >Cancelar</button>
                    <button onClick={handleInsert}
                        style={{
                            background: 'linear-gradient(90deg,#2563eb 0%,#7c3aed 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '12px 32px',
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(124,60,237,0.08)',
                            transition: 'background 0.2s',
                        }}
                    >Insertar Gráfico</button>
                </div>
            </div>
        </div>
    );
};

export default PerfilesIdentificacionModal;
