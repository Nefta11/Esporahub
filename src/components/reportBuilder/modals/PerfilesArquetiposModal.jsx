import React, { useState } from 'react';

const PerfilesArquetiposModal = ({ isOpen, onClose, canvas }) => {
    const [title, setTitle] = useState('Arquetipos | Sub-arquetipos');

    if (!isOpen) return null;

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

        // sample sections around the ring with colors and labels
        const sections = [
            { label: 'Transformador', color: '#F6C358' },
            { label: 'Impulsor', color: '#F39C12' },
            { label: 'Justiciero', color: '#F08A5D' },
            { label: 'Generoso', color: '#E94E77' },
            { label: 'Amigo', color: '#D7263D' },
            { label: 'Protector', color: '#8E44AD' },
            { label: 'Héroe', color: '#2E9CCA' },
            { label: 'Conciliador', color: '#3D6B9B' },
            { label: 'Líder', color: '#2E8B57' },
            { label: 'Ejecutivo', color: '#1F8A70' },
            { label: 'Mentor', color: '#27AE60' },
            { label: 'Estratega', color: '#9ACD32' }
        ];

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
        ctx.fillText('*Fuente: ejemplo de arquetipos', width - 40, height - 30);

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
            <div className="chart-modal-container">
                <h2 className="chart-modal-title">{title}</h2>
                <div className="chart-modal-field">
                    <label>Título</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 12 }}>
                    <button onClick={onClose} className="chart-modal-button-cancel">Cancelar</button>
                    <button onClick={handleInsert} className="chart-modal-button-insert">Insertar Arquetipos</button>
                </div>
            </div>
        </div>
    );
};

export default PerfilesArquetiposModal;
