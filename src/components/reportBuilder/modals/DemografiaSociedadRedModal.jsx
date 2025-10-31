import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Image as FabricImage } from 'fabric';
import '@/styles/reportBuilder/ChartModals.css';

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
        <div className="chart-modal-overlay" onClick={onClose}>
            <div className="chart-modal-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="chart-modal-title">Demografía de la Sociedad Red</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div>
                    {/* Edición de barras */}
                    <div className="chart-form-section">
                        {bars.map((bar, idx) => (
                            <div key={idx} className="chart-row-item">
                                <input type="text" value={bar.label} onChange={e => {
                                    const newBars = [...bars];
                                    newBars[idx].label = e.target.value;
                                    setBars(newBars);
                                }} className="chart-form-input w-160 font-weight-600" placeholder="Etiqueta" />
                                <input type="number" min={0} max={100} value={bar.percent} onChange={e => {
                                    const newBars = [...bars];
                                    newBars[idx].percent = Number(e.target.value);
                                    setBars(newBars);
                                }} className="chart-form-input w-60" />
                                <span>%</span>
                                <input type="text" value={bar.rightLabel} onChange={e => {
                                    const newBars = [...bars];
                                    newBars[idx].rightLabel = e.target.value;
                                    setBars(newBars);
                                }} className="chart-form-input w-180" placeholder="Etiqueta derecha (usar \n para salto)" />
                                <input type="color" value={bar.color} onChange={e => {
                                    const newBars = [...bars];
                                    newBars[idx].color = e.target.value;
                                    setBars(newBars);
                                }} className="color-input" />
                            </div>
                        ))}
                    </div>

                    {/* Vista previa */}
                    <div className="chart-preview">
                        <h4>Vista previa:</h4>
                        <div className="demographics-preview-wrapper">
                            <div className="demographics-bars-column">
                                {bars.map((bar, idx) => (
                                    <div key={idx} className="demographics-bar-item" style={{
                                        height: `${bar.percent * 2}px`,
                                        background: bar.color
                                    }}>
                                        {bar.percent}%
                                    </div>
                                ))}
                            </div>
                            <div className="demographics-labels-column" style={{ height: `${bars.reduce((sum, b) => sum + b.percent * 2, 0) + (bars.length - 1) * 2}px` }}>
                                {bars.map((bar, idx) => (
                                    <div key={idx} className="demographics-label-row">
                                        <span className="demographics-label-primary" style={{ color: bar.color }}>
                                            → {bar.label}
                                        </span>
                                        {bar.rightLabel && (
                                            <span className="demographics-label-secondary">
                                                {bar.rightLabel.replace('\n', ' / ')}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chart-modal-buttons">
                    <button className="chart-modal-button-cancel" onClick={onClose}>Cancelar</button>
                    <button className="chart-modal-button-insert" onClick={insertChartToCanvas}>Insertar gráfico en Canvas</button>
                </div>
            </div>
        </div>
    );
};

export default DemografiaSociedadRedModal;