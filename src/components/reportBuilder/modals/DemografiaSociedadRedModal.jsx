import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Image as FabricImage } from 'fabric';

// Colores y datos iniciales
const BAR_COLORS = ['#B13B2E', '#E97B2A', '#F7D154'];
const INITIAL_BARS = [
    { label: 'Internet', percent: 78, color: BAR_COLORS[0], rightLabel: 'Clases A,B,C,D\nJóvenes' },
    { label: 'Anfibios', percent: 18, color: BAR_COLORS[1], rightLabel: '' },
    { label: 'Medios Tradicionales', percent: 4, color: BAR_COLORS[2], rightLabel: 'Amas de casa\n3ra Edad' },
];

const DemografiaSociedadRedModal = ({ isOpen, onClose, canvas }) => {
    const [bars, setBars] = useState(INITIAL_BARS);

    // Exportar gráfico al canvas
    const insertChartToCanvas = () => {
        if (!canvas) return;
        const width = 540, height = 340, barWidth = 90, barGap = 8, leftPad = 60, topPad = 60;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const ctx = tempCanvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);

        // Dibujar barras
        let y = topPad;
        bars.forEach((bar, i) => {
            const barHeight = (bar.percent / 100) * 180;
            ctx.fillStyle = bar.color;
            ctx.fillRect(leftPad, y, barWidth, barHeight);
            // Porcentaje
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(bar.percent + '%', leftPad + barWidth / 2, y + barHeight / 2 + 10);
            // Etiqueta izquierda
            ctx.save();
            ctx.translate(leftPad - 10, y + barHeight / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.font = 'bold 22px Arial';
            ctx.fillStyle = bar.color;
            ctx.textAlign = 'center';
            ctx.fillText(bar.label, 0, 0);
            ctx.restore();
            // Etiqueta derecha
            if (bar.rightLabel) {
                ctx.font = '16px Arial';
                ctx.fillStyle = '#7c2222';
                ctx.textAlign = 'left';
                bar.rightLabel.split('\n').forEach((line, idx) => {
                    ctx.fillText(line, leftPad + barWidth + 60, y + 30 + idx * 22);
                });
            }
            y += barHeight + barGap;
        });

        // Exportar a Fabric
        const dataURL = tempCanvas.toDataURL('image/png');
        const imgElement = new window.Image();
        imgElement.onload = () => {
            const fabricImg = new FabricImage(imgElement, {
                left: 50,
                top: 50,
                scaleX: 0.7,
                scaleY: 0.7
            });
            canvas.add(fabricImg);
            canvas.setActiveObject(fabricImg);
            canvas.renderAll();
            onClose();
        };
        imgElement.src = dataURL;
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()} style={{ maxWidth: 700, maxHeight: '95vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h3 className="modal-title">Demografía de la Sociedad Red</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    {/* Edición de barras */}
                    <div style={{ marginBottom: 20 }}>
                        {bars.map((bar, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <input type="text" value={bar.label} onChange={e => {
                                    const newBars = [...bars];
                                    newBars[idx].label = e.target.value;
                                    setBars(newBars);
                                }} style={{ width: 120, fontWeight: 600 }} />
                                <input type="number" min={0} max={100} value={bar.percent} onChange={e => {
                                    const newBars = [...bars];
                                    newBars[idx].percent = Number(e.target.value);
                                    setBars(newBars);
                                }} style={{ width: 60 }} />
                                <input type="text" value={bar.rightLabel} onChange={e => {
                                    const newBars = [...bars];
                                    newBars[idx].rightLabel = e.target.value;
                                    setBars(newBars);
                                }} style={{ width: 180 }} placeholder="Etiqueta derecha (opcional)" />
                                <input type="color" value={bar.color} onChange={e => {
                                    const newBars = [...bars];
                                    newBars[idx].color = e.target.value;
                                    setBars(newBars);
                                }} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancelar</button>
                    <button className="btn-primary" onClick={insertChartToCanvas}>Insertar gráfico en Canvas</button>
                </div>
            </div>
        </div>
    );
};

export default DemografiaSociedadRedModal;
