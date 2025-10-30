import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const DEFAULT_PROFILES = [
    {
        name: 'Personaje 1',
        partido: 'Partido 1',
        avatarUrl: '',
        inversion: '$0',
        anuncios: '0',
    },
    {
        name: 'Personaje 2',
        partido: 'Partido 2',
        avatarUrl: '',
        inversion: '$64,392',
        anuncios: '15',
    }
];

const BenchmarkDifusionOficialModal = ({ isOpen, onClose, canvas }) => {
    const canvasRef = useRef(null);
    const profiles = DEFAULT_PROFILES;

    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;
        drawChart(canvasRef.current, profiles);
    }, [isOpen]);

    const drawChart = (targetCanvas, profiles) => {
        const width = 1200;
        const height = 500;
        targetCanvas.width = width;
        targetCanvas.height = height;
        const ctx = targetCanvas.getContext('2d');

        // Fondo blanco
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);

        // Título
        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = '#111';
        ctx.textAlign = 'left';
        ctx.fillText('a. Comparativa pauta oficial por personaje', 30, 45);
        ctx.font = 'italic 15px Arial';
        ctx.fillStyle = '#444';
        ctx.fillText('Inversión en Meta (MXN)', 30, 70);

        // Perfiles centrados
        const centerY = 220;
        const avatarRadius = 70;
        const profileSpacing = 350;
        const startX = width / 2 - profileSpacing / 2;

        profiles.forEach((profile, idx) => {
            const x = startX + idx * profileSpacing;
            // Avatar con borde
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, centerY, avatarRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#b71c1c';
            ctx.stroke();
            ctx.clip();
            ctx.fillStyle = '#ccc';
            ctx.fillRect(x - avatarRadius, centerY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
            ctx.restore();

            // Partido (esquina inferior derecha del avatar)
            ctx.save();
            ctx.fillStyle = '#b71c1c';
            ctx.beginPath();
            ctx.roundRect(x + avatarRadius - 60, centerY + avatarRadius - 30, 90, 32, 16);
            ctx.fill();
            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(profile.partido, x + avatarRadius + 20, centerY + avatarRadius - 14);
            ctx.restore();

            // Nombre (debajo del avatar)
            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = '#222';
            ctx.textAlign = 'center';
            ctx.fillText(profile.name, x, centerY + avatarRadius + 38);

            // Fanpage label
            ctx.font = '14px Arial';
            ctx.fillStyle = '#666';
            ctx.fillText('Fanpage', x, centerY + avatarRadius + 62);

            // Inversión y anuncios
            ctx.font = '15px Arial';
            ctx.fillStyle = '#222';
            ctx.textAlign = 'center';
            ctx.fillText(`Inversión: ${profile.inversion}`, x, centerY + avatarRadius + 90);
            ctx.fillText(`No. Anuncios: ${profile.anuncios}`, x, centerY + avatarRadius + 115);
        });

        // Periodo (abajo izquierda)
        ctx.save();
        ctx.fillStyle = '#111';
        ctx.font = 'bold 16px Arial';
        ctx.fillRect(30, height - 50, 370, 32);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 15px Arial';
        ctx.fillText('Periodo: Del 5 de julio al 5 de octubre 2025', 45, height - 28);
        ctx.restore();

        // Fuente (abajo derecha)
        ctx.font = '15px Arial';
        ctx.fillStyle = '#222';
        ctx.textAlign = 'right';
        ctx.fillText('Fuente: Meta', width - 40, height - 28);
    };

    const insertToCanvas = () => {
        if (!canvas) return;
        const tempCanvas = document.createElement('canvas');
        drawChart(tempCanvas, profiles);
        const dataURL = tempCanvas.toDataURL('image/png');
        const imgElement = new window.Image();
        imgElement.onload = () => {
            // Calcular escala para que la imagen quepa dentro del canvas sin recortes
            const imgWidth = imgElement.width;
            const imgHeight = imgElement.height;
            const canvasWidth = typeof canvas.getWidth === 'function' ? canvas.getWidth() : canvas.width || 960;
            const canvasHeight = typeof canvas.getHeight === 'function' ? canvas.getHeight() : canvas.height || 540;
            const margin = 40; // dejar margen alrededor
            const maxW = canvasWidth - margin * 2;
            const maxH = canvasHeight - margin * 2;
            const scale = Math.min(1, Math.min(maxW / imgWidth, maxH / imgHeight));

            const left = Math.round((canvasWidth - imgWidth * scale) / 2);
            const top = Math.round((canvasHeight - imgHeight * scale) / 2);

            const fabricImg = new window.fabric.Image(imgElement, {
                left,
                top,
                scaleX: scale,
                scaleY: scale,
                name: 'benchmark-difusion-oficial',
                selectable: true,
                hasControls: true,
                hasBorders: true,
                evented: true,
                lockRotation: false,
                lockScalingX: false,
                lockScalingY: false,
                lockMovementX: false,
                lockMovementY: false
            });

            // Asegurar que el objeto pueda moverse y redimensionarse
            fabricImg.setControlsVisibility && fabricImg.setControlsVisibility({
                mt: true, mb: true, ml: true, mr: true, bl: true, br: true, tl: true, tr: true
            });

            // Ensure origin/top-left and update coordinates so object is fully inside canvas
            fabricImg.set({ originX: 'left', originY: 'top' });
            canvas.add(fabricImg);
            fabricImg.bringToFront && fabricImg.bringToFront();
            fabricImg.setCoords && fabricImg.setCoords();
            canvas.setActiveObject(fabricImg);
            canvas.requestRenderAll ? canvas.requestRenderAll() : canvas.renderAll();
            onClose();
        };
        imgElement.src = dataURL;
    };

    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '95vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h3 className="modal-title">Benchmark de Difusión Oficial</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="chart-preview" style={{ marginTop: '20px' }}>
                        <h4>Vista Previa</h4>
                        <div className="preview-container" style={{ maxHeight: '400px', overflow: 'auto', background: '#f9f9f9', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
                            <canvas ref={canvasRef}></canvas>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancelar</button>
                    <button className="btn-primary" onClick={insertToCanvas}>Insertar en Canvas</button>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkDifusionOficialModal;
