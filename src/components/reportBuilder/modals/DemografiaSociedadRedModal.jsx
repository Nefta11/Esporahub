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

        const width = 700;
        const height = 450;
        const barWidth = 180;
        const leftPad = 40;
        const topPad = 40;
        const labelOffset = 60;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const ctx = tempCanvas.getContext('2d');

        // Fondo blanco
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);

        // Calcular altura total disponible para las barras
        const totalHeight = 350;
        const barGap = 3; // Espacio entre barras

        // Dibujar barras apiladas verticalmente
        let currentY = topPad;

        bars.forEach((bar, i) => {
            const barHeight = (bar.percent / 100) * totalHeight;

            // Dibujar la barra
            ctx.fillStyle = bar.color;
            ctx.fillRect(leftPad, currentY, barWidth, barHeight);

            // Porcentaje dentro de la barra (centrado verticalmente en la barra)
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(bar.percent + '%', leftPad + barWidth / 2, currentY + barHeight / 2);

            // Calcular posición Y para la etiqueta (centrada en esta barra específica)
            const labelY = currentY + barHeight / 2;

            // Etiqueta del concepto (a la derecha de la barra, alineada con el centro de ESTA barra)
            ctx.font = 'bold 32px Arial';
            ctx.fillStyle = bar.color;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            const labelX = leftPad + barWidth + 30;

            ctx.fillText(bar.label, labelX, labelY);

            // Línea de conexión (flecha desde el centro de la barra)
            ctx.strokeStyle = bar.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(leftPad + barWidth + 10, labelY);
            ctx.lineTo(labelX - 10, labelY);
            ctx.stroke();

            // Flecha
            ctx.beginPath();
            ctx.moveTo(labelX - 10, labelY);
            ctx.lineTo(labelX - 18, labelY - 5);
            ctx.lineTo(labelX - 18, labelY + 5);
            ctx.closePath();
            ctx.fillStyle = bar.color;
            ctx.fill();

            // Etiqueta adicional (más a la derecha, alineada con esta barra)
            if (bar.rightLabel) {
                ctx.font = '20px Arial';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                const lines = bar.rightLabel.split('\n');
                const rightLabelX = labelX + ctx.measureText(bar.label).width + 80;

                // Si hay múltiples líneas, centrarlas alrededor de labelY
                const lineHeight = 24;
                const totalTextHeight = lines.length * lineHeight;
                let textY = labelY - (totalTextHeight / 2) + (lineHeight / 2);

                lines.forEach((line, idx) => {
                    ctx.fillText(line, rightLabelX, textY);
                    textY += lineHeight;
                });
            }

            currentY += barHeight + barGap;
        });

        // Exportar a Fabric
        const dataURL = tempCanvas.toDataURL('image/png');
        const imgElement = new window.Image();
        imgElement.onload = () => {
            const fabricImg = new FabricImage(imgElement, {
                left: 50,
                top: 50,
                scaleX: 0.85,
                scaleY: 0.85
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
                                }} style={{ width: 160, fontWeight: 600 }} placeholder="Etiqueta" />
                                <input type="number" min={0} max={100} value={bar.percent} onChange={e => {
                                    const newBars = [...bars];
                                    newBars[idx].percent = Number(e.target.value);
                                    setBars(newBars);
                                }} style={{ width: 60 }} />
                                <span>%</span>
                                <input type="text" value={bar.rightLabel} onChange={e => {
                                    const newBars = [...bars];
                                    newBars[idx].rightLabel = e.target.value;
                                    setBars(newBars);
                                }} style={{ width: 180 }} placeholder="Etiqueta derecha (usar \n para salto)" />
                                <input type="color" value={bar.color} onChange={e => {
                                    const newBars = [...bars];
                                    newBars[idx].color = e.target.value;
                                    setBars(newBars);
                                }} style={{ width: 50, height: 35 }} />
                            </div>
                        ))}
                    </div>

                    {/* Vista previa */}
                    <div style={{ marginTop: 20, padding: 15, background: '#f5f5f5', borderRadius: 8 }}>
                        <h4 style={{ marginBottom: 10 }}>Vista previa:</h4>
                        <div style={{ background: '#fff', padding: 20, borderRadius: 4, display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: 100, gap: '2px' }}>
                                {bars.map((bar, idx) => (
                                    <div key={idx} style={{
                                        height: `${bar.percent * 2}px`,
                                        background: bar.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: 20
                                    }}>
                                        {bar.percent}%
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginLeft: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: `${bars.reduce((sum, b) => sum + b.percent * 2, 0) + (bars.length - 1) * 2}px` }}>
                                {bars.map((bar, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                        <span style={{ fontWeight: 'bold', color: bar.color, fontSize: 16 }}>
                                            → {bar.label}
                                        </span>
                                        {bar.rightLabel && (
                                            <span style={{ fontSize: 12, color: '#666' }}>
                                                {bar.rightLabel.replace('\n', ' / ')}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
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