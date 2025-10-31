import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Image as FabricImage } from 'fabric';
import '@/styles/reportBuilder/ChartModals.css';

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
    const [profiles, setProfiles] = useState(DEFAULT_PROFILES);
    const [metaLogoUrl, setMetaLogoUrl] = useState('');

    const updateProfileField = (index, field, value) => {
        setProfiles(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;
        drawChart(canvasRef.current, profiles, metaLogoUrl);
    }, [isOpen, profiles, metaLogoUrl]);

    const drawChart = (targetCanvas, profiles, logoUrl) => {
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

            // Partido (esquina inferior derecha del avatar) - más grande
            ctx.save();
            ctx.fillStyle = '#b71c1c';
            ctx.beginPath();
            ctx.roundRect(x + avatarRadius - 70, centerY + avatarRadius - 35, 110, 42, 20);
            ctx.fill();
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(profile.partido, x + avatarRadius + 30, centerY + avatarRadius - 14);
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

        // Periodo (abajo izquierda) - rectángulo más ancho
        ctx.save();
        ctx.fillStyle = '#111';
        ctx.font = 'bold 16px Arial';
        ctx.fillRect(30, height - 50, 450, 35);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 15px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Periodo: Del 5 de julio al 5 de octubre 2025', 45, height - 26);
        ctx.restore();

        // Fuente (abajo derecha) con logo
        ctx.font = '15px Arial';
        ctx.fillStyle = '#222';
        ctx.textAlign = 'right';
        ctx.fillText('Fuente:', width - 110, height - 28);

        // Logo de Meta
        if (logoUrl) {
            const logoImg = new window.Image();
            logoImg.crossOrigin = 'anonymous';
            logoImg.src = logoUrl;
            logoImg.onload = () => {
                ctx.drawImage(logoImg, width - 90, height - 42, 50, 26);
            };
        } else {
            ctx.fillText('Meta', width - 40, height - 28);
        }
    };

    const insertToCanvas = () => {
        if (!canvas) return;
        const tempCanvas = document.createElement('canvas');
        drawChart(tempCanvas, profiles, metaLogoUrl);

        // Esperar a que el logo cargue antes de exportar
        setTimeout(() => {
        const dataURL = tempCanvas.toDataURL('image/png');
        const imgElement = new window.Image();
        imgElement.onload = () => {
            // Insertar con escala fija para que se vea completo (sin reducir demasiado)
            const scale = 0.75;
            const left = 40;
            const top = 40;

            const fabricImg = new FabricImage(imgElement, {
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

            // Make absolutely sure the object is interactive
            try {
                fabricImg.selectable = true;
                fabricImg.evented = true;
                fabricImg.hasControls = true;
                fabricImg.hasBorders = true;
                fabricImg.hoverCursor = 'move';

                // Fix canvas offset / pointer handling in case it's been modified elsewhere
                if (canvas.upperCanvasEl) canvas.upperCanvasEl.style.pointerEvents = 'auto';
                if (canvas.lowerCanvasEl) canvas.lowerCanvasEl.style.pointerEvents = 'auto';
                canvas.calcOffset && canvas.calcOffset();

                fabricImg.bringToFront && fabricImg.bringToFront();
                fabricImg.setCoords && fabricImg.setCoords();
                canvas.setActiveObject(fabricImg);
                canvas.requestRenderAll ? canvas.requestRenderAll() : canvas.renderAll();
            } catch (err) {
                console.warn('Could not force interactive flags on fabric object', err);
            }

            // Close modal after insertion
            onClose();
        };
        imgElement.src = dataURL;
        }, 300); // Esperar para que el logo se cargue
    };

    if (!isOpen) return null;
    return (
        <div className="chart-modal-overlay" onClick={onClose}>
            <div className="chart-modal-container" onClick={e => e.stopPropagation()}>
                <h3 className="chart-modal-title">Benchmark de Difusión Oficial</h3>
                <button className="modal-close" onClick={onClose}><X size={20} /></button>

                <div>
                    <h4>Configuración</h4>

                    <div className="chart-form-grid-single">
                        {profiles.map((p, i) => (
                            <div key={i} className="chart-profile-card">
                                <h5 className="profile-heading">Perfil {i + 1}</h5>
                                <div className="grid-gap-8">
                                    <label className="chart-form-label">Nombre</label>
                                    <input className="chart-form-input" value={p.name} onChange={(e) => updateProfileField(i, 'name', e.target.value)} />
                                    <label className="chart-form-label">Partido / Tag</label>
                                    <input className="chart-form-input" value={p.partido} onChange={(e) => updateProfileField(i, 'partido', e.target.value)} />
                                    <label className="chart-form-label">Inversión</label>
                                    <input className="chart-form-input" value={p.inversion} onChange={(e) => updateProfileField(i, 'inversion', e.target.value)} />
                                    <label className="chart-form-label">No. Anuncios</label>
                                    <input className="chart-form-input" value={p.anuncios} onChange={(e) => updateProfileField(i, 'anuncios', e.target.value)} />
                                    <label className="chart-form-label">Avatar URL (opcional)</label>
                                    <input className="chart-form-input" value={p.avatarUrl} onChange={(e) => updateProfileField(i, 'avatarUrl', e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="canvas-preview-mt-20">
                        <h4>Vista Previa</h4>
                        <div className="preview-container-400">
                            <canvas ref={canvasRef}></canvas>
                        </div>
                    </div>
                </div>

                <div className="chart-modal-buttons">
                    <button className="chart-modal-button-cancel" onClick={onClose}>Cancelar</button>
                    <button className="chart-modal-button-insert" onClick={insertToCanvas}>Insertar en Canvas</button>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkDifusionOficialModal;
